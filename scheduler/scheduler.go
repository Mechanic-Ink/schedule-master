package scheduler

import (
	"sync"
	"log"
	"os"
	"io/ioutil"
	"schedule-master/structs"
	"path/filepath"
	"encoding/json"
)

type Scheduler struct{
	entries		[]structs.ScheduledStartupEntry
	taskFolder	string
}

var instance *Scheduler
var once sync.Once
func GetInstance() *Scheduler {
	once.Do(func() {
		instance = &Scheduler{}
	})

	return instance
}

func (scheduler *Scheduler) FetchEntries() {
	log.Println("Fetching Entries!")

	appData, error := os.UserCacheDir()
	if error != nil {
		log.Println("Failed to get user task directory")
		return
	}

	scheduler.taskFolder = appData + string(os.PathSeparator) + "ScheduleMaster" + string(os.PathSeparator) + "scheduled"
	log.Println(scheduler.taskFolder)
	files, error := ioutil.ReadDir(scheduler.taskFolder)
	if error != nil {
		log.Println("Failed to read user scheduled items directory")
		log.Println(error.Error())
		return
	}

	for _, file := range files {
		log.Println("File found: " +file.Name())
		if filepath.Ext(file.Name()) != ".json" {
			continue
		}

		data, error := ioutil.ReadFile(filepath.Join(scheduler.taskFolder, file.Name()))
		if error != nil {
			log.Println("Failed to read json file: " + file.Name())
			return
		}

		var entry structs.ScheduledStartupEntry
		if error := json.Unmarshal(data, &entry); error != nil {
			log.Println("Failed to unmarshal json file: " + file.Name())
			return
		}

		scheduler.entries = append(scheduler.entries, entry)
	}

	log.Println(scheduler.entries)
}