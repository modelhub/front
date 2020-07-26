package vada

import (
	sj "github.com/robsix/json"
)

func registerFile(host string, b64Urn string, accessToken string) (ret *sj.Json, err error) {
	data, err := sj.FromString(`{
		"input": {
			"urn": "` + b64Urn + `"
		},
		"output": {
			"destination": {
				"region": "us"
			},
			"formats": [
				{
					"type": "svf",
					"views": [
						"2d",
						"3d"
					],
				   "advanced": {
					 "generateMasterViews": true
				   }
				}
			]
		}
	}`)
	if err != nil {
		return nil, err
	}

	reader, err := data.ToReader()
	if err != nil {
		return nil, err
	}

	req, err := newRequest("POST", host+"/modelderivative/v2/designdata/job", reader, accessToken, "application/json")
	if err != nil {
		return nil, err
	}
	req.Header.Add("x-ads-force", "true")

	ret, err = doAdhocJsonRequest(req)
	return
}
