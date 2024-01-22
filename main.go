package main

import (
	"embed"
	"log"
	"schedule-master/go/scheduler"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/getlantern/systray"
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed assets/logo.png
var logo embed.FS

var app *App

func main() {
	scheduler := scheduler.GetInstance()
	go scheduler.Start()

	app = NewApp()

	go func() {
		systray.Run(onSystrayReady, onSystrayExit)
	}()

	onBeforeClose := func(ctx context.Context) bool {
		runtime.WindowHide(ctx)
		return true
	}

	error := wails.Run(&options.App{
		Title: "Schedule Master",
		Width: 1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: app.Startup,
		Bind: []interface{}{
			app,
		},
		OnBeforeClose: onBeforeClose,
	})

	if error != nil {
		println("Error:", error.Error())
	}
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
				app.Show()
				break;
			case <-mQuit.ClickedCh:
				// TODO: Implement quit logic
				app.Exit()
				systray.Quit()
				break;
		}
	}
}

func onSystrayExit() {
	// Clean up here
}