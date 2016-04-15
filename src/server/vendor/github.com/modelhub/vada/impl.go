package vada

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/robsix/golog"
	. "github.com/robsix/json"
	"io"
	"net/http"
	"sync"
	"time"
)

const (
	accessTokenExpirationBuffer = time.Duration(-5) * time.Minute
)

func NewVadaClient(vadaHost string, clientKey string, clientSecret string, log golog.Log) VadaClient {
	return &vadaClient{
		host:         vadaHost,
		clientKey:    clientKey,
		clientSecret: clientSecret,
		log:          log,
	}
}

type vadaClient struct {
	host               string
	clientKey          string
	clientSecret       string
	accessToken        string
	accessTokenExpires time.Time
	log                golog.Log
	mtx                sync.Mutex
}

func (v *vadaClient) getAccessToken() (string, error) {
	if time.Now().After(v.accessTokenExpires.Add(accessTokenExpirationBuffer)) {
		defer v.mtx.Unlock()
		v.mtx.Lock()
		if time.Now().After(v.accessTokenExpires.Add(accessTokenExpirationBuffer)) {
			v.log.Info("VadaClient.getAccessToken requesting new token")
			accessToken, err := getAccessToken(v.host, v.clientKey, v.clientSecret)
			if err != nil {
				v.log.Critical("VadaClient.getAccessToken error: %v", err)
				return "", err
			}
			v.accessToken = accessToken.Token
			expiresDuration := time.Duration(accessToken.Expires) * time.Second
			v.accessTokenExpires = time.Now().Add(expiresDuration)
			v.log.Info("VadaClient.getAccessToken retrieved new access token: %q expires in: %v", v.accessToken, expiresDuration)
		}
	}
	return v.accessToken, nil
}

func (v *vadaClient) CreateBucket(bucketKey string, policyKey BucketPolicy) (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := createBucket(v.host, bucketKey, policyKey, token)
	if err != nil {
		v.log.Error("Vada.CreateBucket Error: bucketKey: %q bucketPolicy: %q error: %v", bucketKey, policyKey, err)
	} else {
		v.log.Info("Vada.CreateBucket Success: bucketKey: %q bucketPolicy: %q", bucketKey, policyKey)
	}
	return res, err
}

func (v *vadaClient) DeleteBucket(bucketKey string) error {
	token, err := v.getAccessToken()
	if err != nil {
		return err
	}

	err = deleteBucket(v.host, bucketKey, token)
	if err != nil {
		v.log.Error("Vada.DeleteBucket Error: bucketKey: %q error %v", bucketKey, err)
	} else {
		v.log.Info("Vada.DeleteBucket Success: bucketKey: %q", bucketKey)
	}
	return err
}

func (v *vadaClient) GetBucketDetails(bucketKey string) (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := getBucketDetails(v.host, bucketKey, token)
	if err != nil {
		v.log.Error("Vada.GetBucketDetails Error: bucketKey: %q error: %v", bucketKey, err)
	} else {
		v.log.Info("Vada.GetBucketDetails Success: bucketKey: %q", bucketKey)
	}
	return res, err
}

func (v *vadaClient) GetSupportedFormats() (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := getSupportedFormats(v.host, token)
	if err != nil {
		v.log.Error("Vada.GetSupportedFormats Error: %v", err)
	} else {
		v.log.Info("Vada.GetSupportedFormats Success")
	}
	return res, err
}

func (v *vadaClient) UploadFile(objectKey string, bucketKey string, file io.ReadCloser) (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := uploadFile(v.host, objectKey, bucketKey, file, token)
	if err != nil {
		v.log.Error("Vada.UploadFile Error: objectKey: %q bucketKey: %q error: %v", objectKey, bucketKey, err)
	} else {
		v.log.Info("Vada.UploadFile Success: objectKey: %q bucketKey: %q", objectKey, bucketKey)
	}
	return res, err
}

func (v *vadaClient) DeleteFile(objectKey string, bucketKey string) error {
	token, err := v.getAccessToken()
	if err != nil {
		return err
	}

	err = deleteFile(v.host, objectKey, bucketKey, token)
	if err != nil {
		v.log.Error("Vada.DeleteFile Error: objectKey: $q bucketKey: %q error: %v", objectKey, bucketKey, err)
	} else {
		v.log.Info("Vada.DeleteFile Success: objectKey: %q bucketKey: %q", objectKey, bucketKey)
	}
	return err
}

func (v *vadaClient) RegisterFile(b64Urn string) (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := registerFile(v.host, b64Urn, token)
	if err != nil {
		v.log.Error("Vada.RegisterFile Error: b64Urn: %q error: %v", b64Urn, err)
	} else {
		v.log.Info("Vada.RegisterFile Success: b64Urn: %q", b64Urn)
	}
	return res, err
}

func (v *vadaClient) GetDocumentInfo(b64Urn string, guid string) (*Json, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := getDocumentInfo(v.host, b64Urn, guid, token)
	if err != nil {
		v.log.Error("Vada.GetDocumentInfo Error: b64Urn: %q guid: %q error: %v", b64Urn, guid, err)
	} else {
		v.log.Info("Vada.GetDocumentInfo Success: b64Urn: %q guid: %q", b64Urn, guid)
	}
	return res, err
}

func (v *vadaClient) GetSheetItem(b64UrnAndItemPath string) (*http.Response, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := getSheetItem(v.host, b64UrnAndItemPath, token)
	if err != nil {
		v.log.Error("Vada.GetSheetItem Error: b64UrnAndItemPath: %q error: %v", b64UrnAndItemPath, err)
	} else {
		v.log.Info("Vada.GetSheetItem Success: b64UrnAndItemPath: %q", b64UrnAndItemPath)
	}
	return res, err
}

func (v *vadaClient) GetFile(objectKey string, bucketKey string) (*http.Response, error) {
	token, err := v.getAccessToken()
	if err != nil {
		return nil, err
	}

	res, err := getSeedFile(v.host, objectKey, bucketKey, token)
	if err != nil {
		v.log.Error("Vada.GetFile Error: objectKey: %q bucketKey: %q error: %v", objectKey, bucketKey, err)
	} else {
		v.log.Info("Vada.GetFile Success: objectKey: %q bucketKey: %q", objectKey, bucketKey)
	}
	return res, err
}

/**
 * helpers
 */

func checkResponse(resp *http.Response, err error) error {
	if err != nil {
		return err
	}
	if resp.StatusCode >= 400 {
		body, _ := FromReadCloser(resp.Body)
		bodyStr, _ := body.ToString()
		return errors.New(fmt.Sprintf("statusCode: %d, status: %v, body: %v", resp.StatusCode, resp.Status, bodyStr))
	}
	return nil
}

func newRequest(method string, urlStr string, body io.Reader, accessToken string, contentType string) (*http.Request, error) {
	req, err := http.NewRequest(method, urlStr, body)
	if err != nil {
		return nil, err
	}
	if accessToken != "" {
		req.Header.Set("Authorization", "Bearer "+accessToken)
	}
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}
	return req, nil
}

func doStructuredJsonRequest(req *http.Request, dst interface{}) error {
	resp, err := getStandardHttpClient().Do(req)
	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}
	if err = checkResponse(resp, err); err != nil {
		return err
	}

	decoder := json.NewDecoder(resp.Body)
	if err = decoder.Decode(dst); err != nil {
		return err
	}

	return nil
}

func doAdhocJsonRequest(req *http.Request) (ret *Json, err error) {
	resp, err := getStandardHttpClient().Do(req)
	if resp != nil {
		if resp.Body != nil {
			defer resp.Body.Close()
		}
		err = checkResponse(resp, err)
		if err == nil {
			ret, err = FromReadCloser(resp.Body)
		}
	}
	return
}
