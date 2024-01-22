package main

import (
	"crypto/sha256"
	"encoding/json"
	"context"
	"fmt"
	"schedule-master/go/lib"
	"schedule-master/go/structs"
	"golang.org/x/sys/windows/registry"
	"strconv"
)

type App struct {
	ctx					context.Context
	cacheFolder			string
	backupFolder		string
	scheduledFolder		string
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.PrepareDataDirectory()
}

var StartupItems []structs.StartupEntry
var ScheduledStartupItems []structs.ScheduledStartupEntry

var itemIndex int16 = 1
var scheduledItemIndex int16 = 1
var iconPath string = "./frontend/src/assets/images/icons/"

func fetchRegistryStartupItems(location string, path string, itemIndex int16) ([]structs.StartupEntry, int16) {
	var outcome []structs.StartupEntry

	baseKeyLocation := lib.GetRegistryKeyLocation(location)

	keys, error := registry.OpenKey(baseKeyLocation, path, registry.QUERY_VALUE)
	if error != nil {
		if error.Error() == "The system cannot find the file specified." {
			return outcome, itemIndex
		}
		fmt.Println(error)
	}
	defer keys.Close()

	names, error := keys.ReadValueNames(-1)
	if error != nil {
		fmt.Println(error)
	}

	for _, name := range names {
		command, _, error := keys.GetStringValue(name)
		if error != nil {
			fmt.Println(error)
		}

		var duplicate bool = false

		for _, item := range outcome {
			if item.Name == name /*&& item.Command == command*/ {
				duplicate = true
			}
		}

		if duplicate == false {
			fileName := lib.ExtractExecutablePath(command)

			iconName := strconv.FormatInt(int64(itemIndex), 10) + ".png"

			_ = lib.ExtractExecutableIcon(fileName, iconPath + iconName)

			outcome = append(outcome, structs.StartupEntry {
				Id: itemIndex,
				Name: name,
				Command: command,
				Type: location,
				Registry: path,
				File: fileName,
				Icon: iconName,
			})
			itemIndex++
		}
	}
	return outcome, itemIndex
}


func getStartupEntryHash(entry structs.StartupEntry) string {
	data, error := json.Marshal(entry)
	if error != nil {
		panic(error)
	}

	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}