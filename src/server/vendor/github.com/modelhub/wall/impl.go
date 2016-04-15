package wall

import (
	"github.com/yohcop/openid-go"
	"net/http"
	"net/url"
	"github.com/modelhub/session"
	"github.com/modelhub/core"
	"strings"
	"html/template"
	"github.com/gorilla/csrf"
	"io/ioutil"
	"path/filepath"
)

const (
	apiPathPrefix = "/api/"
	rootPath = "/"
	loginPath = "/openid/login"
	callbackPath = "/openid/callback"
	csrfRequestHeader = "Csrf-Token"
	csrfCookieName = "mh_csrf"
)

func NewWall(coreApi core.CoreApi, restApi *http.ServeMux, getSession session.SessionGetter, openidProviderEndpoint string, currentHost string, csrfAuthKey []byte, csrfCookieMaxAge int, isOverSecureConnection bool, staticFileDir string) (http.Handler, error) {
	nonceStore := openid.NewSimpleNonceStore()
	discoveryCache := openid.NewSimpleDiscoveryCache()
	fileServer := http.FileServer(http.Dir(staticFileDir))
	var t *template.Template
	if indexHtml, err := ioutil.ReadFile(filepath.Join(staticFileDir, "index.html")); err != nil {
		return nil, err
	} else {
		t = template.Must(template.New("index.html").Parse(string(indexHtml)))
	}

	isLoggedIn := func(w http.ResponseWriter, r *http.Request) bool {
		if s, err := getSession(w, r); err != nil || s == nil {
			return false
		} else if userId, err := s.User(); err != nil || userId == "" {
			return false
		}
		return true
	}

	openidLoginHandler := func(w http.ResponseWriter, r *http.Request) {
		if s, _ := getSession(w, r); s != nil {
			s.Expire()
		}
		if redirectUrl, err := openid.RedirectURL(openidProviderEndpoint, currentHost+callbackPath, ""); err == nil {
			values := make(url.Values)

			values.Add("openid.ns.pape", "http://specs.openid.net/extensions/pape/1.0")
			values.Add("openid.pape.max_auth_age", "0")

			values.Add("openid.ns.sreg", "http://openid.net/extensions/sreg/1.1")
			values.Add("openid.sreg.required", "email,fullname,nickname")

			values.Add("openid.ns.ax", "http://openid.net/srv/ax/1.0")
			values.Add("openid.ax.mode", "fetch_request")

			values.Add("openid.ax.required", "img176,userid")
			values.Add("openid.ax.type.img176", "http://axschema.org/autodesk/media/image/176")
			values.Add("openid.ax.type.userid", "http://axschema.org/autodesk/userid")

			http.Redirect(w, r, redirectUrl+"&"+values.Encode(), 303)
		} else {
			http.Error(w, "error in openidLoginHandler", 500)
		}
	}

	openidCallbackHandler := func(w http.ResponseWriter, r *http.Request) {
		if isLoggedIn(w, r) {
			http.Redirect(w, r, rootPath, 303)
		} else {
			fullUrl := currentHost + r.URL.String()
			id, err := openid.Verify(fullUrl, discoveryCache, nonceStore)

			if err == nil {
				parsedURL, _ := url.Parse(fullUrl)
				values, _ := url.ParseQuery(parsedURL.RawQuery)
				autodeskId := values.Get("openid.alias3.value.alias2")
				if autodeskId == "" {
					http.Error(w, "error in openidCallbackHandler, missing user id", 500)
					return
				}
				openId		:= id
				username	:= values.Get("openid.sreg.nickname")
				avatar		:= values.Get("openid.alias3.value.alias1")
				fullName	:= values.Get("openid.sreg.fullname")
				email		:= values.Get("openid.sreg.email")

				if user, err := coreApi.User().Login(autodeskId, openId, username, avatar, fullName, email); err != nil {
					http.Error(w, "error in openidCallbackHandler", 500)
				} else {
					s, _ := getSession(w, r)
					s.SetUser(user)
					http.Redirect(w, r, rootPath, 303)
				}
			} else {
				http.Error(w, "error in openidCallbackHandler", 500)
			}
		}
	}

	outerHandler := func(w http.ResponseWriter, r *http.Request) {
		if isLoggedIn(w, r) {
			if strings.HasPrefix(r.URL.Path, apiPathPrefix) {
				restApi.ServeHTTP(w, r)
			} else if r.URL.Path == rootPath {
				if s, err := getSession(w, r); err != nil || s == nil {
					w.WriteHeader(500)
				} else if userId, err := s.User(); err != nil || userId == "" {
					w.WriteHeader(500)
				} else if user, err := coreApi.User().GetCurrent(userId); err != nil {
					w.WriteHeader(500)
				} else {
					t.Execute(w, map[string]interface{}{
						"currentUser": user,
						"openIdProviderHost": openidProviderEndpoint,
						"csrfToken": csrf.Token(r),
					})
				}
			} else {
				fileServer.ServeHTTP(w, r)
			}
		} else {
			http.Redirect(w, r, loginPath, 303)
		}
	}

	outerRouter := http.NewServeMux()
	csrfProtectedOuterRouter := csrf.Protect(csrfAuthKey, csrf.RequestHeader(csrfRequestHeader), csrf.Secure(isOverSecureConnection), csrf.MaxAge(csrfCookieMaxAge), csrf.Path(rootPath), csrf.CookieName(csrfCookieName))(outerRouter) //remember kids, always use protection ;)
	outerRouter.HandleFunc(loginPath, openidLoginHandler)
	outerRouter.HandleFunc(callbackPath, openidCallbackHandler)
	outerRouter.HandleFunc(rootPath, outerHandler)

	return csrfProtectedOuterRouter, nil
}
