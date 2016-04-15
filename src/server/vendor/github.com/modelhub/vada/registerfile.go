package vada

import (
	sj "github.com/robsix/json"
)

func registerFile(host string, b64Urn string, accessToken string) (ret *sj.Json, err error) {
	data, err := sj.FromString(`{"urn":"` + b64Urn + `"}`)
	if err != nil {
		return nil, err
	}

	reader, err := data.ToReader()
	if err != nil {
		return nil, err
	}

	req, err := newRequest("POST", host+"/viewingservice/v1/register", reader, accessToken, "application/json")
	if err != nil {
		return nil, err
	}

	ret, err = doAdhocJsonRequest(req)
	return
}
