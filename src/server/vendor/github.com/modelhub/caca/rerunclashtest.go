package caca

import (
	sj "github.com/robsix/json"
)

func rerunClashTest(host string, clashTestId string) (ret *sj.Json, err error) {
	req, err := newRequest("PATCH", host+"/api/v1/clash_tests/"+clashTestId, nil, "")
	if err != nil {
		return nil, err
	}

	ret, err = doAdhocJsonRequest(req)
	return
}
