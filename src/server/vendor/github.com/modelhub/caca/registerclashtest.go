package caca

import (
	sj "github.com/robsix/json"
)

func registerClashTest(host string, leftRegId string, rightRegId string) (string, error) {
	body, err := sj.New()
	if err != nil {
		return "", err
	}
	body.Set(leftRegId, "clash_test", "left_id")
	body.Set(rightRegId, "clash_test", "right_id")

	reader, err := body.ToReader()
	if err != nil {
		return "", err
	}

	req, err := newRequest("POST", host+"/api/v1/clash_tests", reader, "application/json")
	if err != nil {
		return "", err
	}

	js, err := doAdhocJsonRequest(req)
	if err != nil {
		return "", err
	}

	return js.String("data", "id")
}
