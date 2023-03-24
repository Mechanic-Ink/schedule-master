package main

import (
	"golang.org/x/sys/windows/registry"
	"os/exec"
	"context"
	"regexp"
	"log"
	"fmt"
	"os"
	"strconv"
)

type App struct {
	ctx context.Context
	cacheFolder string
}

func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.PrepareCacheDirectory()
}

type StartupEntry struct {
	Id int16
	Name string
	Command string
	Type string
	Registry string
	File string
	Icon string
}

var StartupItems []StartupEntry

var itemIndex int16 = 1;
var iconPath string = "./frontend/src/assets/images/icons/"

func (a *App) PrepareCacheDirectory() {
	appData, error := os.UserCacheDir()

	if error != nil {
		log.Println("Failed to get user cache directory")
		return
	}
	a.cacheFolder = appData + "\\ScheduleMaster"

	os.Mkdir(a.cacheFolder, 0755)
}


func (a *App) FetchStartupItems() []StartupEntry {
	StartupItems = make([]StartupEntry, 0)
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

func (a *App) ShowExecutableLocation(file string) {
	command := exec.Command(`explorer.exe`, "/select,", file)
	log.Println(command.String())

	error := command.Start()
	if error != nil {
		log.Println("Failed to open file explorer.")
		log.Println(error)
	}
}

func (a *App) BackupStartupItems() bool {
	items := a.FetchStartupItems()

	backupFile, error := os.Create("registryBackup.reg")
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

	var registryData = make(map[string][]StartupEntry)
	for _, item := range items {
		registryPath :=  item.Type + "\\" + item.Registry

		if _, ok := registryData[registryPath]; !ok {
			registryData[registryPath] = []StartupEntry{}
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

	// for _, item := range items {
	// 	baseKeyLocation := getKeyLocation(item.Type)

	// 	key, error := registry.OpenKey(baseKeyLocation, item.Registry, registry.QUERY_VALUE)
	// 	if error != nil {
	// 		log.Println("Failed to open registry key")
	// 		log.Println(error)
	// 		return false
	// 	}
	// 	defer key.Close()

	// 	// error = key.SaveKey(backupFile)
	// 	// if error != nil {
	// 	// 	log.Fatal(error)
	// 	// }
	// 	command := exec.Command("reg", "export", item.Type + "\\" + item.Registry + "\\" + item.Name)
	// 	log.Println(item.Type + "\\" + item.Registry + "\\" + item.Name)
	// 	error = command.Run()
	// 	if error != nil {
	// 		log.Println("Failed to export key")
	// 		log.Println(error)
	// 		return false
	// 	}
	// }

	return true
}

func fetchRegistryStartupItems(location string, path string) []StartupEntry {
	var outcome []StartupEntry

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

		// log.Printf("%s: %s\n", name, command)
		// log.Println("CURRENT: ", name)

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

			outcome = append(outcome, StartupEntry {
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

//Move these functions to a separate file, import as package
//Loop through the startup records found and remove duplicates
//As well as find the application icon from the executable, and
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
