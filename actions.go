package main

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"schedule-master/go/structs"
	"schedule-master/go/lib"
	"os"
	"fmt"
	"strconv"
	"os/exec"
	"path/filepath"
	"encoding/json"
	"golang.org/x/sys/windows/registry"
)

//These functions are directly called by the frontend

//<Buttons>
func (a *App) FetchStartupItems(reset bool) []structs.StartupEntry {
	if reset || len(StartupItems) == 0 {
		StartupItems = make([]structs.StartupEntry, 0)
	} else {
		return StartupItems
	}
	itemIndex = 1;

	//Create Icon folder if it doesn't exist already
	if _, error := os.Stat(iconPath); os.IsNotExist(error) {
		if error := os.MkdirAll(iconPath, 0700); error != nil {
			fmt.Println(error)
		}
	}

	//HKEY_CURRENT_USER
	StartupCurrentUserPaths := []string {
		`SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run`,
	}

	for _, path := range StartupCurrentUserPaths {
		var newItems []structs.StartupEntry
		newItems, itemIndex = fetchRegistryStartupItems("HKEY_CURRENT_USER", path, itemIndex)
		StartupItems = append(StartupItems, newItems...)
	}

	//HKEY_LOCAL_MACHINE
	StartupLocalMachinePaths := []string {
		`SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,	
		// `SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run32`,
	}

	for _, path := range StartupLocalMachinePaths {
		var newItems []structs.StartupEntry
		newItems, itemIndex = fetchRegistryStartupItems("HKEY_LOCAL_MACHINE", path, itemIndex)
		StartupItems = append(StartupItems, newItems...)
	}

	return StartupItems
}

func (a *App) BackupStartupItems() bool {
	items := a.FetchStartupItems(false)
	path := a.backupFolder + "AllItems.reg"

	backupFile, error := os.Create(path)
	if error != nil {
		fmt.Println("Failed to create backup file")
		fmt.Println(error)
		return false
	}
	defer backupFile.Close()

	text := "Windows Registry Editor Version 5.00\n\n"

	_, error = backupFile.WriteString(text)
	if error != nil {
		fmt.Println("failed to write initial text")
		fmt.Println(error)
		return false
	}

	var registryData = make(map[string][]structs.StartupEntry)
	for _, item := range items {
		registryPath :=  item.Type + "\\" + item.Registry

		if _, ok := registryData[registryPath]; !ok {
			registryData[registryPath] = []structs.StartupEntry{}
		}

		registryData[registryPath] = append(registryData[registryPath], item)
	}

	for path, entries := range registryData {
		text = "[" + path + "]\n"

		_, error = backupFile.WriteString(text)
		if error != nil {
			fmt.Println("Failed to write path")
			fmt.Println(error)
			return false
		}

		for _, entry := range entries {
			text = `"` + entry.Name + `"=` + strconv.QuoteToASCII(entry.Command) + "\n"

			_, error = backupFile.WriteString(text)
			if error != nil {
				fmt.Println("Failed to write entry")
				fmt.Println(error)
				return false
			}
		}
	}

	return true
}

func (a *App) OpenBackupFolder() {
	lib.OpenDirectory(a.cacheFolder)
}

func (a *App) ShowExecutableLocation(file string) {
	command := exec.Command(`explorer.exe`, "/select,", file)

	error := command.Start()
	if error != nil {
		fmt.Println("Failed to open file explorer.")
		fmt.Println(error)
	}
}

func (a *App) Exit() {
	runtime.Quit(a.ctx)
}

func (a *App) Show() {
	runtime.WindowShow(a.ctx)
}

func (a *App) Hide() {
	runtime.WindowHide(a.ctx)
}
//</Buttons>

//<Other Actions>
func (a *App) PrepareDataDirectory() {
	appData, error := os.UserCacheDir()

	if error != nil {
		fmt.Println("Failed to get user cache directory")
		return
	}
	a.cacheFolder = appData + string(os.PathSeparator) + "ScheduleMaster"
	os.Mkdir(a.cacheFolder, 0755)

	a.backupFolder = a.cacheFolder + string(os.PathSeparator) + "backups" + string(os.PathSeparator)
	os.Mkdir(a.backupFolder, 0755)

	a.scheduledFolder = a.cacheFolder + string(os.PathSeparator) + "scheduled" + string(os.PathSeparator)
	os.Mkdir(a.scheduledFolder, 0755)
}

func (a *App) FetchScheduledItems(reset bool) []structs.ScheduledStartupEntry {
	if reset || len(ScheduledStartupItems) == 0 {
		ScheduledStartupItems = make([]structs.ScheduledStartupEntry, 0)
	} else {
		return ScheduledStartupItems
	}
	itemIndex = 1;

	walkError := filepath.Walk(a.scheduledFolder, func(path string, fileInformation os.FileInfo, walkError error) error {
		if walkError != nil {
			return walkError
		}

		if fileInformation.IsDir() {
			return nil
		}

		if filepath.Ext(path) == ".json" {
			file, walkError := os.Open(path)
			if walkError != nil {
				return walkError
			}
			defer file.Close()

			var fileEntries structs.ScheduledStartupEntry
			decoder := json.NewDecoder(file)

			walkError = decoder.Decode(&fileEntries)
			if walkError != nil {
				return walkError
			}

			ScheduledStartupItems = append(ScheduledStartupItems, fileEntries)
		}

		return nil
	})

	if walkError != nil {
		fmt.Println("Failed to fetch scheduled entries")
		fmt.Println(walkError)
	}

	return ScheduledStartupItems
}

func (a *App) BackupStartupItem(id int) {
	if id == 0 {
		return
	}

	item := a.FetchStartupItems(false)[id - 1]
	name := getStartupEntryHash(item)
	path := a.backupFolder + name +".reg"

	backupFile, error := os.Create(path)
	if error != nil {
		fmt.Println("Failed to create backup file")
		fmt.Println(error)
		return
	}
	defer backupFile.Close()

	text := "Windows Registry Editor Version 5.00\n\n"
	_, error = backupFile.WriteString(text)
	if error != nil {
		fmt.Println("failed to write initial text")
		fmt.Println(error)
		return
	}

	// var registryData = make(map[string]StartupEntry)
	registryPath := item.Type + "\\" + item.Registry

	text = "[" + registryPath + "]\n"

	_, error = backupFile.WriteString(text)
	if error != nil {
		fmt.Println("Failed to write path")
		fmt.Println(error)
		return
	}

	text = `"` + item.Name + `"=` + strconv.QuoteToASCII(item.Command) + "\n"
	_, error = backupFile.WriteString(text)
	if error != nil {
		fmt.Println("Failed to write entry")
		fmt.Println(error)
		return
	}
}

func (a *App) RemoveRegistryEntry(id int) bool {
	if id == 0 {
		return false
	}

	item := a.FetchStartupItems(false)[id - 1]

	registryType, error := lib.GetRegistryType(item.Type)
	if error != nil {
		fmt.Println(error)
		return false
	}

	key, error := registry.OpenKey(registryType, item.Registry, registry.WRITE)
	if error != nil {
		fmt.Println(error)
		return false
	}
	defer key.Close()
	// log.Println(key)
	// return true

	error = key.DeleteValue(item.Name)
	if error != nil {
		fmt.Println(error)
		return false
	}

	StartupItems = append(StartupItems[:id - 1], StartupItems[id + 1:]...)

	return true
}

func (a *App) ScheduleRegistryEntry(entry structs.StartupEntry, options structs.StartupOptions) bool {
	fileName := a.scheduledFolder + getStartupEntryHash(entry) + ".json"

	data := structs.ScheduledStartupEntry{Entry: entry, Options: options}

	file, error := os.Create(fileName)
	if error != nil {
		fmt.Println("Failed to create json file")
		fmt.Println(fileName)
		fmt.Println(error)
		return false
	}
	defer file.Close()

	jsonData, error := json.MarshalIndent(data, "", "	")
	if error != nil {
		fmt.Println("Failed to convert data to json")
		return false
	}

	_, error = file.Write(jsonData)
	if error != nil {
		fmt.Println("Failed to write data to file")
		return false
	}

	return true
}
//</Other Actions>