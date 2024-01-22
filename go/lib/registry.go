package lib

import (
	"golang.org/x/sys/windows/registry"
	"fmt"
)

func GetRegistryType(registryType string) (registry.Key, error) {
	switch registryType {
		case "HKEY_CURRENT_USER":
			return registry.CURRENT_USER, nil
		case "HKEY_LOCAL_MACHINE":
			return registry.LOCAL_MACHINE, nil
		default:
			return 0, fmt.Errorf("registry type not found: %s", registryType)
	}
}

func GetRegistryKeyLocation(baseLocation string) registry.Key {
	var registryKey registry.Key

	switch baseLocation {
		case "HKEY_CURRENT_USER":
			registryKey = registry.CURRENT_USER

		case "HKEY_LOCAL_MACHINE":
			registryKey = registry.LOCAL_MACHINE
	}

	return registryKey
}