package session

import (
	"github.com/gorilla/sessions"
	"time"
)

func NewCookieSessionGetter(sessionKeyPairs [][]byte, maxAge int, sessionName string, maxRecentSheetCount int, recentSheetAccessExpiration time.Duration) SessionGetter {
	store := sessions.NewCookieStore(sessionKeyPairs...)
	store.Options.HttpOnly = true
	store.Options.MaxAge = maxAge
	return newSessionGetter(store, sessionName, maxRecentSheetCount, recentSheetAccessExpiration)
}
