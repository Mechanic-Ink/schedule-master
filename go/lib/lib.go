package lib

import (
	"os/exec"
	"fmt"
	"regexp"
)

func OpenDirectory(path string) {
	command := exec.Command("explorer.exe", path)

	error := command.Start()
	if error != nil {
		fmt.Println("Failed to open the provided path: " + path)
		fmt.Println(error)
	}
}

func ExtractExecutablePath(command string) string {
	if len(command) > 0 && command[0] == '\\' {
		command = command[1:]
	}
	if len(command) > 0 && command[0] == '"' {
		command = command[1:]
	}

	regularExpression := regexp.MustCompile("^.*?\\.exe")

	return regularExpression.FindString(command)
}

func ExtractExecutableIcon(exePath string, savePath string) bool {
	command := exec.Command("powershell", "-Command", fmt.Sprintf(`Add-Type -AssemblyName System.Drawing; [System.Drawing.Icon]::ExtractAssociatedIcon("%s").ToBitmap().Save("%s")`, exePath, savePath))
	_, error := command.Output()
	if error != nil {
		return false
	}

	return true
}

func GetExecutableName(path string) (string, error) {
	regularExpression := regexp.MustCompile(`(?:^"|^)([^\s"]+\.exe)`)
	matches := regularExpression.FindStringSubmatch(path)

	if len(matches) == 0 {
		return "", fmt.Errorf("no executable name found in path")
	}

	return matches[0], nil
}