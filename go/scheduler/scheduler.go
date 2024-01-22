package scheduler

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"schedule-master/go/enums"
	"schedule-master/go/structs"
	"schedule-master/go/lib"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Scheduler struct{
	entries		[]structs.ScheduledStartupEntry
	taskFolder	string
}

var instance *Scheduler
var once sync.Once
var startupRun bool

func GetInstance() *Scheduler {
	once.Do(func() {
		instance = &Scheduler{}
	})

	return instance
}

//Main scheduler loop
func (scheduler *Scheduler) Start() {
	startupRun = true
	scheduler.FetchEntries()

	ticker := time.NewTicker(time.Duration(60) * time.Second)
	defer ticker.Stop()

	time.Sleep(lib.TimeUntilNextMinute())
	fmt.Println("Slept until next minute")

	for {
		select {
			case <-ticker.C:
				for index := range scheduler.entries {
					commandName, commandArguments := parseCommand(scheduler.entries[index].Options.Command)

					if scheduler.entries[index].ProcessID > 0 {
						continue
						// if isProcessRunning(scheduler.entries[index].ProcessID) {
						// 	continue
						// } else {
						// 	executable, error := lib.GetExecutableName(scheduler.entries[index].Entry.Command)
						// 	if error != nil {
						// 		fmt.Println("failed to get executable name")
						// 		fmt.Println(error)
						// 		continue
						// 	}
						// 	fmt.Println("getting pids for:" + executable)
						// 	pids, error := getPidsByName(executable)
						// 	if len(pids) < 1 {
						// 		fmt.Println("process not running, setting ID to 0")
						// 		scheduler.entries[index].ProcessID = pids[0]
						// 	}
						// }
					}
					
					if scheduler.EvaluateEntry(scheduler.entries[index]) {
						fmt.Println("evaluation success")

						command := exec.Command(commandName, commandArguments...)
						_, error := command.CombinedOutput()
						if error != nil {
							fmt.Println("Error executing command:", error)
						}

						scheduler.entries[index].ProcessID = command.Process.Pid
					} else {
						fmt.Println("evaluation failure")
					}
				}
			break;
		}

		if startupRun {
			startupRun = false
		}
	}
}

// func (scheduler *Scheduler) GetProcessInformation(entry structs.ScheduledStartupEntry) (string, []int) {
// 	//return executable name + list id PIDs
// 	return "slice.exe", []int{1, 2, 3}
// }

func (scheduler *Scheduler) EvaluateScheduling(entry structs.ScheduledStartupEntry) bool {
	now := time.Now()

	if entry.Options.MonthDayStartup {
		today := now.Day()
		lastDayOfMonth := lib.GetLastDayOfMonth(now)

		if entry.Options.MonthDayStartupDaysLast && today == lastDayOfMonth {
			return true
		}

		if entry.Options.MonthDayStartupDaysSecondLast && today == (lastDayOfMonth - 1) {
			return true
		}

		if lib.IsMonthDaySelected(today, entry.Options.MonthDayStartupDays) {
			return true
		}
	}

	if entry.Options.WeekDayStartup {
		weekDay := int(now.Weekday())

		return lib.IsWeekdaySelected(weekDay, entry.Options.WeekDayStartupDays) 
	}

	if entry.Options.CalendarStartup {
		return lib.IsDateSelected(now, entry.Options.CalendarStartupDates)
	}

	return false
}

func (scheduler *Scheduler) EvaluateEntry(entry structs.ScheduledStartupEntry) bool {
	now := time.Now()
	fmt.Println("evaluating:" + entry.Entry.Command)

	if !scheduler.EvaluateScheduling(entry) {
		return false
	}

	if entry.Options.StartupType == int(enums.Scheduled) {
		switch (lib.CompareTime(now, entry.Options.StartupTime)) {
			case 1:
				//Startup time passed
				if !entry.Options.LateStartup {
					fmt.Println("Late startup disabled")
					return false
				}
			break;

			case 0:
				//Times match
			break;

			case -1:
				//Too early
				return false
			break;
		}
	}

	if entry.Options.StartupType == int(enums.OnStart) {
		if !startupRun  {
			return false
		}
	}

	if entry.Options.TimedShutdown {
		//Add check if shutdown time is lesser than start time, probably means that it should shut down the next day

		if lib.CompareTime(now, entry.Options.TimedShutdownTime) != 1 {
			return false
		}
	}

	return true
}

func (scheduler *Scheduler) FetchEntries() {
	appData, error := os.UserCacheDir()
	if error != nil {
		log.Println("Failed to get user task directory")
		return
	}

	scheduler.taskFolder = appData + string(os.PathSeparator) + "ScheduleMaster" + string(os.PathSeparator) + "scheduled"
	files, error := ioutil.ReadDir(scheduler.taskFolder)
	if error != nil {
		log.Println("Failed to read user scheduled items directory")
		log.Println(error.Error())
		return
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) != ".json" {
			continue
		}

		data, error := ioutil.ReadFile(filepath.Join(scheduler.taskFolder, file.Name()))
		if error != nil {
			return
		}

		var entry structs.ScheduledStartupEntry
		if error := json.Unmarshal(data, &entry); error != nil {
			return
		}

		scheduler.entries = append(scheduler.entries, entry)
	}

	log.Println(scheduler.entries)
}

func parseCommand(input string) (string, []string) {
	var executable string
	var args []string

	re := regexp.MustCompile(`^"?(.+?\.exe)"?\s*(.*)$`)
	matches := re.FindStringSubmatch(input)

	if len(matches) > 0 {
		executable = matches[1]
		args = strings.Fields(matches[2])
	}

	return executable, args
}

func isProcessRunning(pid int) bool {
	process, error := os.FindProcess(pid)

	if error != nil {
		fmt.Printf("Error finding process: %s \n", error)
		return false
	}

	if error := process.Signal(os.Interrupt); error != nil {
		if error == os.ErrProcessDone {
			fmt.Printf("Process with PID %d has finished.\n", pid)
			return false
		}
		fmt.Printf("Process with PID %d is still running.\n", pid)

	}

	return true
}

func getPidsByName(executable string) ([]int, error) {
	command := exec.Command("tasklist", "/fo", "csv", "/nh")
	output, error := command.Output()
	if error != nil {
		return nil, error
	}

	var pids []int
	scanner := bufio.NewScanner(strings.NewReader(string(output)))
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Split(line, ",")

		if len(fields) >= 2 {
			name := strings.Trim(fields[0], "\"")
			pid := strings.Trim(fields[1], "\"")

			if name == executable {
				pidInt, error := strconv.Atoi(pid)
				if error != nil {
					return nil, error
				}

				pids = append(pids, pidInt)
			}
		}
	}

	if error := scanner.Err(); error != nil {
		return nil, error
	}

	return pids, nil
}

