package vada

import (
	"net/http"
	"net"
	"time"
)

func getDownloadHttpClient() *http.Client{
	return &http.Client{
		Transport:	&http.Transport{
			Proxy: http.ProxyFromEnvironment,
			Dial: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
			}).Dial,
			TLSHandshakeTimeout: 10 * time.Second,
			DisableCompression: true,
		}}
}

func getStandardHttpClient() *http.Client{
	return &http.Client{
		Transport:	&http.Transport{
			Proxy: http.ProxyFromEnvironment,
			Dial: (&net.Dialer{
				Timeout:   30 * time.Second,
				KeepAlive: 30 * time.Second,
			}).Dial,
			TLSHandshakeTimeout: 10 * time.Second,
			DisableCompression: false,
		}}
}
