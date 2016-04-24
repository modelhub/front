package caca

import (
	sj "github.com/robsix/json"
)

func getSheetRegistration(host string, regId string) (ret *sj.Json, err error) {
	req, err := newRequest("GET", host+"/api/v1/models/"+regId, nil, "")
	if err != nil {
		return nil, err
	}

	ret, err = doAdhocJsonRequest(req)
	return
}
