package main

import (
	"github.com/modelhub/conf"
	"net/http"
	"strings"
)

func main() {
	conf := conf.GetAppConf()
	http.Handle(`/`, conf.Wall)
	if strings.HasSuffix(conf.FullUrlBase, `https://`) {
		conf.Log.Info(`Secure Server Listening on Port ` + conf.PortString)
		http.ListenAndServeTLS(conf.PortString, conf.CertFile, conf.KeyFile, nil)
	} else {
		conf.Log.Critical(`Non Secure Server Listening on Port ` + conf.PortString)
		http.ListenAndServe(conf.PortString, nil)
	}
}
