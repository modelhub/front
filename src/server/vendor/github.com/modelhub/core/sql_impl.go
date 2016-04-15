package core

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/modelhub/core/documentversion"
	"github.com/modelhub/core/project"
	"github.com/modelhub/core/sheet"
	"github.com/modelhub/core/treenode"
	"github.com/modelhub/core/user"
	"github.com/modelhub/vada"
	"github.com/robsix/golog"
	"time"
	"github.com/modelhub/core/helper"
)

func NewSqlCoreApi(mySqlConnection string, vada vada.VadaClient, statusCheckTimeout time.Duration, batchGetTimeout time.Duration, ossBucketPrefix string, ossBucketPolicy vada.BucketPolicy, log golog.Log) (CoreApi, error) {
	if db, err := sql.Open("mysql", mySqlConnection); err != nil {
		return nil, err
	} else {
		us := user.NewSqlUserStore(db, log)
		ps := project.NewSqlProjectStore(db, vada, ossBucketPrefix, ossBucketPolicy, log)
		tns := treenode.NewSqlTreeNodeStore(db, vada, ossBucketPrefix, log)
		dvs := documentversion.NewSqlDocumentVersionStore(db, statusCheckTimeout, vada, ossBucketPrefix, log)
		ss := sheet.NewSqlSheetStore(db, vada, log)
		h := helper.NewHelper(tns, dvs, ss, batchGetTimeout, log)
		return newCoreApi(us, ps, tns, dvs, ss, h)
	}
}