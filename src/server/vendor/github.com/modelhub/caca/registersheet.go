package caca

import (
	sj "github.com/robsix/json"
)

func regsiterSheet(host string, base64UrnAndMaifestPath string) (string, error) {
	body, err := sj.New()
	if err != nil {
		return "", err
	}
	body.Set(base64UrnAndMaifestPath, "model", "urn")

	reader, err := body.ToReader()
	if err != nil {
		return "", err
	}

	req, err := newRequest("POST", host+"/api/v1/models", reader, "application/json")
	if err != nil {
		return "", err
	}

	js, err := doAdhocJsonRequest(req)
	if err != nil {
		return "", err
	}

	return js.String("data", "id")
}
