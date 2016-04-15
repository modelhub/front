/*
A very simple logging utility
*/
package golog

import (
	"fmt"
	"github.com/twinj/uuid"
	ct "github.com/daviddengcn/go-colortext"
	"time"
)

type level string

const (
	ANY      = level(`ANY`)
	INFO     = level(`INFO`)
	WARNING  = level(`WARNING`)
	ERROR    = level(`ERROR`)
	CRITICAL = level(`CRITICAL`)
)

var(
	logEntriesConsoleChannel = make(chan LogEntry)
	consoleWorkerCreated = false
)

type LogEntry struct {
	LogId   string    `json:"logId"`
	Time    time.Time `json:"time"`
	Level   level     `json:"level"`
	Message string    `json:"message"`
}

type Log interface {
	Info(format string, a ...interface{}) LogEntry
	Warning(format string, a ...interface{}) LogEntry
	Error(format string, a ...interface{}) LogEntry
	Critical(format string, a ...interface{}) LogEntry
	GetById(logId string) (LogEntry, error)
	Get(before time.Time, level level, limit int) ([]LogEntry, error)
}

type Put func(le LogEntry)
type GetById func(logId string) (LogEntry, error)
type Get func(before time.Time, level level, limit int) ([]LogEntry, error)

func NewLog(put Put, getById GetById, get Get, printToStdOut bool, lineSpacing int) Log {
	if !consoleWorkerCreated {
		go func() {
			for le := range logEntriesConsoleChannel {
				var levelPadding string
				switch le.Level {
				case INFO:
					levelPadding = `    `
					ct.Foreground(ct.Cyan, true)
				case WARNING:
					levelPadding = ` `
					ct.Foreground(ct.Yellow, true)
				case ERROR:
					levelPadding = `   `
					ct.Foreground(ct.Red, true)
				case CRITICAL:
					levelPadding = ``
					ct.ChangeColor(ct.Black, true, ct.Red, true)
				}
				fmt.Println(le.Time.Format(`15:04:05.00`), string(le.Level)+levelPadding, le.Message)
				ct.ResetColor()
				for i := 0; i < lineSpacing; i++ {
					fmt.Println(``)
				}
			}
		}()
		consoleWorkerCreated = true
	}
	return &log{
		put:           put,
		getById:       getById,
		get:           get,
		printToStdOut: printToStdOut,
		logEntriesConsoleChannel:    logEntriesConsoleChannel,
	}
}

type log struct {
	put           Put
	getById       GetById
	get           Get
	printToStdOut bool
	logEntriesConsoleChannel    chan LogEntry
}

func (l *log) log(level level, format string, a ...interface{}) LogEntry {
	le := LogEntry{
		LogId:   uuid.NewV1().String(),
		Time:    time.Now().UTC(),
		Level:   level,
		Message: fmt.Sprintf(format, a...),
	}
	if l.printToStdOut {
		l.logEntriesConsoleChannel <- le
	}
	l.put(le)
	return le
}

func (l *log) Info(format string, a ...interface{}) LogEntry {
	return l.log(INFO, format, a...)
}

func (l *log) Warning(format string, a ...interface{}) LogEntry {
	return l.log(WARNING, format, a...)
}

func (l *log) Error(format string, a ...interface{}) LogEntry {
	return l.log(ERROR, format, a...)
}

func (l *log) Critical(format string, a ...interface{}) LogEntry {
	return l.log(CRITICAL, format, a...)
}

func (l *log) GetById(logId string) (LogEntry, error) {
	return l.getById(logId)
}

func (l *log) Get(before time.Time, level level, limit int) ([]LogEntry, error) {
	return l.get(before, level, limit)
}
