package session

import (
	"github.com/gorilla/sessions"
	"encoding/gob"
	"time"
	"net/http"
	"errors"
)

const(
	user = "u"
	recentlyAccessedSheets = "r"
	csrfToken = "c"
)

var(
	typesGobRegistered = false
)

func newSessionGetter(store sessions.Store, sessionName string, maxRecentSheetCount int, recentSheetAccessExpiration time.Duration) SessionGetter {
	if !typesGobRegistered {
		gob.Register(map[string]*recentSheetAccess{})
		gob.Register(recentSheetAccess{})
		gob.Register(time.Now())
		typesGobRegistered = true
	}
	return func(w http.ResponseWriter, r *http.Request) (Session, error) {
		s, err := store.Get(r, sessionName)
		return &session{
			w: w,
			r: r,
			s: s,
			maxRecentSheetCount: maxRecentSheetCount,
			recentSheetAccessExpiration: recentSheetAccessExpiration,
		}, err
	}
}

type recentSheetAccess struct{
	BaseUrn string
	Time time.Time
}

type session struct{
	w http.ResponseWriter
	r *http.Request
	s *sessions.Session
	maxRecentSheetCount int
	recentSheetAccessExpiration time.Duration
}

func (s *session) SetUser(id string) error {
	s.s.Values[user] = id
	return s.s.Save(s.r, s.w)
}

func (s *session) User() (string, error) {
	if id, exists := s.s.Values[user]; !exists {
		return "", errors.New("No user property in session")
	} else if idStr, ok := id.(string); !ok {
		return "", errors.New("User property was of unexpected type")
	} else {
		return idStr, nil
	}
}

func (s *session) SetAccessedSheet(sheet string, baseUrn string) error {
	if i, exists := s.s.Values[recentlyAccessedSheets]; !exists {
		s.s.Values[recentlyAccessedSheets] = map[string]*recentSheetAccess{
			sheet: &recentSheetAccess{
				BaseUrn: baseUrn,
				Time: time.Now().UTC(),
			},
		}
		return s.s.Save(s.r, s.w)
	} else if ras, ok := i.(map[string]*recentSheetAccess); !ok {
		return errors.New("recentlyAccessedSheets property was of unexpected type")
	} else {
		if len(ras) >= s.maxRecentSheetCount {
			oldestSheetId := ""
			oldestAccess := time.Now().UTC()
			for sheetId, rsa := range ras {
				if rsa.Time.Before(oldestAccess) {
					oldestAccess = rsa.Time
					oldestSheetId = sheetId
				}
			}
			delete(ras, oldestSheetId)
		}
		ras[sheet] = &recentSheetAccess{
			BaseUrn: baseUrn,
			Time: time.Now().UTC(),
		}
		return s.s.Save(s.r, s.w)
	}
}

func (s *session) GetSheetBaseUrn(sheet string) (string, error) {
	if i, exists := s.s.Values[recentlyAccessedSheets]; !exists {
		return "", errors.New("sheet not recently accessed")
	} else if ras, ok := i.(map[string]*recentSheetAccess); !ok {
		return "", errors.New("recentlyAccessedSheets property was of unexpected type")
	} else if rsa, exists := ras[sheet]; !exists || rsa == nil || rsa.Time.Add(s.recentSheetAccessExpiration).Before(time.Now().UTC()) {
		return "", errors.New("sheet not recently accessed")
	} else {
		return rsa.BaseUrn, nil
	}
}

func (s *session) SetCsrfToken(token string) error {
	s.s.Values[csrfToken] = token
	return s.s.Save(s.r, s.w)
}

func (s *session) CsrfToken() (string, error) {
	if token, exists := s.s.Values[csrfToken]; !exists {
		return "", errors.New("No csrfToken property in session")
	} else if tokenStr, ok := token.(string); !ok {
		return "", errors.New("CsrfToken property of unexpected type")
	} else {
		return tokenStr, nil
	}
}

func (s *session) Expire() error {
	s.s.Values = map[interface{}]interface{}{}
	return s.s.Save(s.r, s.w)
}
