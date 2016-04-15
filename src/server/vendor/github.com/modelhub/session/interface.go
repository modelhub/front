package session

import(
	"net/http"
)

type SessionGetter func(w http.ResponseWriter, r *http.Request) (Session, error)

type Session interface{
	SetUser(id string) error
	User() (string, error)
	SetAccessedSheet(sheet string, baseUrn string) error
	GetSheetBaseUrn(sheet string) (string, error)
	SetCsrfToken(token string) error
	CsrfToken() (string, error)
	Expire() error
}
