package caca

import (
	. "github.com/robsix/json"
)

type CacaClient interface {
	RegisterSheet(b64UrnAndManifestPath string) (string, error)
	GetSheetRegistration(registrationId string) (*Json, error)
	RegisterClashTest(leftRegId string, rightRegId string) (string, error)
	GetClashTest(clashTestRegId string) (*Json, error)
	RerunClashTest(clashTestRegId string) (*Json, error)
}
