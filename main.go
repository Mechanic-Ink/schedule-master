package main

import (
	"embed"
	"log"
	"io/ioutil"
	"schedule-master/scheduler"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/getlantern/systray"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed assets/logo.png
var logo embed.FS

func main() {
	scheduler := scheduler.GetInstance()
	// scheduler.FetchEntries()
	go scheduler.Start()
	// Create an instance of the app structure

	go func() {
		systray.Run(onSystrayReady, onSystrayExit)
	}()

	app := NewApp()

	// Create application with options
	error := wails.Run(&options.App{
		Title: "Schedule Master",
		Width: 1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if error != nil {
		println("Error:", error.Error())
	}
}

func loadImage(path string) []byte {
    image, err := ioutil.ReadFile(path)
    if err != nil {
        log.Fatalf("Failed to load image: %v", err)
    }
    return image
}

func onSystrayReady() {
	data, error := logo.ReadFile("assets/logo.png")
	if error != nil {
		log.Fatal("Failed to load logo:", error)
	}

	systray.SetIcon(data)
	systray.SetTitle("Schedule Master")
	systray.SetTitle("Open")

	mShow := systray.AddMenuItem("Show App", "Show the application")
	mQuit := systray.AddMenuItem("Quit", "Quit the application")

	for {
		select {
		case <-mShow.ClickedCh:
			// TODO: Implement showing the app window
		case <-mQuit.ClickedCh:
			// TODO: Implement quit logic
			systray.Quit()
		}
	}
}

func onSystrayExit() {
	// Clean up here
}