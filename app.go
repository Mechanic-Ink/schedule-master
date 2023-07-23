package main

import (
	"crypto/sha256"
	"encoding/json"
	"golang.org/x/sys/windows/registry"
	"os/exec"
	"context"
	"regexp"
	"log"
	"fmt"
	"os"
	"strconv"
	"path/filepath"
	"schedule-master/structs"
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

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.PrepareDataDirectory()
}

var StartupItems []structs.StartupEntry
var ScheduledStartupItems []structs.ScheduledStartupEntry

var itemIndex int16 = 1
var scheduledItemIndex int16 = 1
var iconPath string = "./frontend/src/assets/images/icons/"

func (a *App) PrepareDataDirectory() {
	appData, error := os.UserCacheDir()

	if error != nil {
		log.Println("Failed to get user cache directory")
		return
	}
	a.cacheFolder = appData + string(os.PathSeparator) + "ScheduleMaster"

	os.Mkdir(a.cacheFolder, 0755)

	a.backupFolder = a.cacheFolder + string(os.PathSeparator) + "backups" + string(os.PathSeparator)
	os.Mkdir(a.backupFolder, 0755)

	a.scheduledFolder = a.cacheFolder + string(os.PathSeparator) + "scheduled" + string(os.PathSeparator)
	os.Mkdir(a.scheduledFolder, 0755)
}

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
			log.Println(error)
		}
	}

	//HKEY_CURRENT_USER
	StartupCurrentUserPaths := []string {
		`SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run`,
	}

	for _, path := range StartupCurrentUserPaths {
		StartupItems = append(StartupItems, fetchRegistryStartupItems("HKEY_CURRENT_USER", path)...)
	}

	//HKEY_LOCAL_MACHINE
	StartupLocalMachinePaths := []string {
		`SOFTWARE\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run`,
		// `SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run32`,
	}

	for _, path := range StartupLocalMachinePaths {
		StartupItems = append(StartupItems, fetchRegistryStartupItems("HKEY_LOCAL_MACHINE", path)...)
	}

	return StartupItems
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

			log.Println(fileEntries)

			ScheduledStartupItems = append(ScheduledStartupItems, fileEntries)
		}

		return nil
	})

	if walkError != nil {
		log.Println("Failed to fetch scheduled entries")
		log.Println(walkError)
	}


	log.Println("Startup Items results")
	log.Println(ScheduledStartupItems)

	return ScheduledStartupItems
}

func (a *App) ShowExecutableLocation(file string) {
	command := exec.Command(`explorer.exe`, "/select,", file)
	log.Println(command.String())

	error := command.Start()
	if error != nil {
		log.Println("Failed to open file explorer.")
		log.Println(error)
	}
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
		log.Println("Failed to create backup file")
		log.Println(error)
		return
	}
	defer backupFile.Close()

	text := "Windows Registry Editor Version 5.00\n\n"
	_, error = backupFile.WriteString(text)
	if error != nil {
		log.Println("failed to write initial text")
		log.Println(error)
		return
	}

	// var registryData = make(map[string]StartupEntry)
	registryPath := item.Type + "\\" + item.Registry

	text = "[" + registryPath + "]\n"

	_, error = backupFile.WriteString(text)
	if error != nil {
		log.Println("Failed to write path")
		log.Println(error)
		return
	}

	text = `"` + item.Name + `"=` + strconv.QuoteToASCII(item.Command) + "\n"
	_, error = backupFile.WriteString(text)
	if error != nil {
		log.Println("Failed to write entry")
		log.Println(error)
		return
	}
}

func (a *App) BackupStartupItems() bool {
	items := a.FetchStartupItems(false)

	path := a.backupFolder + "AllItems.reg"

	backupFile, error := os.Create(path)
	if error != nil {
		log.Println("Failed to create backup file")
		log.Println(error)
		return false
	}
	defer backupFile.Close()

	text := "Windows Registry Editor Version 5.00\n\n"

	_, error = backupFile.WriteString(text)
	if error != nil {
		log.Println("failed to write initial text")
		log.Println(error)
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
			log.Println("Failed to write path")
			log.Println(error)
			return false
		}

		for _, entry := range entries {
			text = `"` + entry.Name + `"=` + strconv.QuoteToASCII(entry.Command) + "\n"

			_, error = backupFile.WriteString(text)
			if error != nil {
				log.Println("Failed to write entry")
				log.Println(error)
				return false
			}
		}
	}

	return true
}

func (a *App) RemoveRegistryEntry(id int) bool {
	if id == 0 {
		return false
	}

	item := a.FetchStartupItems(false)[id - 1]

	registryType, error := getRegistryType(item.Type)
	if error != nil {
		panic(error)
		return false
	}

	key, error := registry.OpenKey(registryType, item.Registry, registry.WRITE)
	if error != nil {
		panic(error)
		return false
	}
	defer key.Close()
	// log.Println(key)
	// return true

	error = key.DeleteValue(item.Name)
	if error != nil {
		panic(error)
		return false
	}

	StartupItems = append(StartupItems[:id - 1], StartupItems[id + 1:]...)

	return true
}

func (a *App) ScheduleRegistryEntry(entry structs.StartupEntry, options structs.StartupOptions) bool {

	// log.Println("In Schedule Registry Entry\n")
	// log.Println(entry)
	// log.Println("\n\n\n\n")
	// log.Println(options)

	fileName := a.scheduledFolder + getStartupEntryHash(entry) + ".json"

	data := structs.ScheduledStartupEntry{Entry: entry, Options: options}

	log.Println("data")
	log.Println(data)

	file, error := os.Create(fileName)
	if error != nil {
		log.Println("Failed to create json file")
		log.Println(fileName)
		log.Println(error)
		return false
	}
	defer file.Close()

	jsonData, error := json.MarshalIndent(data, "", "	")
	if error != nil {
		log.Println("Failed to convert data to json")
		return false
	}

	log.Println("jsonData")
	log.Println(jsonData)

	_, error = file.Write(jsonData)
	if error != nil {
		log.Println("Failed to write data to file")
		return false
	}

	return true
}

func fetchRegistryStartupItems(location string, path string) []structs.StartupEntry {
	var outcome []structs.StartupEntry

	baseKeyLocation := getKeyLocation(location)

	keys, error := registry.OpenKey(baseKeyLocation, path, registry.QUERY_VALUE)
	if error != nil {
		if error.Error() == "The system cannot find the file specified." {
			return outcome
		}
		log.Fatal(error)
	}
	defer keys.Close()

	names, error := keys.ReadValueNames(-1)
	if error != nil {
		log.Fatal(error)
	}

	for _, name := range names {
		command, _, error := keys.GetStringValue(name)
		if error != nil {
			log.Fatal(error)
		}

		var duplicate bool = false

		for _, item := range outcome {
			if item.Name == name /*&& item.Command == command*/ {
				duplicate = true
			}
		}

		if duplicate == false {
			fileName := extractExecutablePath(command)

			iconName := strconv.FormatInt(int64(itemIndex), 10) + ".png"

			_ = extractExecutableIcon(fileName, iconPath + iconName)

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
	return outcome
}

//Move these functions to a separate file
func extractExecutablePath(command string) string {
	if len(command) > 0 && command[0] == '\\' {
		command = command[1:]
	}
	if len(command) > 0 && command[0] == '"' {
		command = command[1:]
	}

	regularExpression := regexp.MustCompile("^.*?\\.exe")

	return regularExpression.FindString(command)
}

func extractExecutableIcon(exePath string, savePath string) bool {
	command := exec.Command("powershell", "-Command", fmt.Sprintf(`Add-Type -AssemblyName System.Drawing; [System.Drawing.Icon]::ExtractAssociatedIcon("%s").ToBitmap().Save("%s")`, exePath, savePath))
	_, error := command.Output()
	if error != nil {
		return false
	}

	return true
}

func getKeyLocation(baseLocation string) registry.Key {
	var registryKey registry.Key

	switch baseLocation {
		case "HKEY_CURRENT_USER":
			registryKey = registry.CURRENT_USER

		case "HKEY_LOCAL_MACHINE":
			registryKey = registry.LOCAL_MACHINE
	}

	return registryKey
}

func getStartupEntryHash(entry structs.StartupEntry) string {
	data, error := json.Marshal(entry)
	if error != nil {
		panic(error)
	}

	hash := sha256.Sum256(data)
	return fmt.Sprintf("%x", hash)
}

func getRegistryType(registryType string) (registry.Key, error) {
	switch registryType {
		case "HKEY_CURRENT_USER":
			return registry.CURRENT_USER, nil
		case "HKEY_LOCAL_MACHINE":
			return registry.LOCAL_MACHINE, nil
		default:
			return 0, fmt.Errorf("registry type not found: %s", registryType)
	}
}