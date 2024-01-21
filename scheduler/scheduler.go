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
	"schedule-master/enums"
	"schedule-master/structs"
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

	//Sleep until the start of next minute

	fmt.Println("about to start looping through ticks")

	for {
		select {
			case <-ticker.C:
				fmt.Println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlooping through entries")
				for index := range scheduler.entries {
					commandName, commandArguments := parseCommand(scheduler.entries[index].Options.Command)

					fmt.Println("evaluating entry")
					fmt.Println(scheduler.entries[index].Entry.Command)
					fmt.Println("Process ID")
					fmt.Println(scheduler.entries[index].ProcessID)

					if scheduler.entries[index].ProcessID > 0 {
						fmt.Println("Process ID is not 0, checking if process is running")
						if isProcessRunning(scheduler.entries[index].ProcessID) {
							continue
						} else {
							executable, error := getExecutableName(scheduler.entries[index].Entry.Command)
							if error != nil {
								fmt.Println("failed to get executable name")
								fmt.Println(error)
								continue
							}
							fmt.Println("getting pids for:" + executable)
							pids, error := getPidsByName(executable)
							if len(pids) < 1 {
								fmt.Println("process not running, setting ID to 0")
								scheduler.entries[index].ProcessID = pids[0]
							}
						}
					}
					
					if scheduler.EvaluateEntry(scheduler.entries[index]) {
						fmt.Println("evaluation success")

						// commandParts := strings.Fields(entry.Options.Command)
						// commandName := commandParts[0]
						// commandArguments := commandParts[1:]

						fmt.Println("command name and args:")
						fmt.Println(commandName)
						fmt.Println(commandArguments)

						// command := exec.Command(commandName, commandArguments...)
						// output, error := command.CombinedOutput()
						// if error != nil {
						// 	fmt.Println("Error executing command:", error)
						// }

						// scheduler.entries[index].ProcessID = command.Process.Pid

						// fmt.Println("command output:")
						// fmt.Println(string(output))

						// fmt.Println("process id:")
						// fmt.Println(scheduler.entries[index].ProcessID)


						//execute program in entry.Command
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

func (scheduler *Scheduler) GetProcessInformation(entry structs.ScheduledStartupEntry) (string, []int) {
	//return executable name + list id PIDs
	return "slice.exe", []int{1, 2, 3}
}

func (scheduler *Scheduler) EvaluateScheduling(entry structs.ScheduledStartupEntry) bool {
	now := time.Now()

	if entry.Options.MonthDayStartup {
		today := now.Day()
		lastDayOfMonth := getLastDayOfMonth(now)

		fmt.Println("Checking if program starts at the last day of the month")
		if entry.Options.MonthDayStartupDaysLast && today == lastDayOfMonth {
			return true
		}

		fmt.Println("Checking if program starts at the second last day of the month")
		if entry.Options.MonthDayStartupDaysSecondLast && today == (lastDayOfMonth - 1) {
			return true
		}

		fmt.Println("Checking if program starts on certain days of the month")
		if isMonthDaySelected(today, entry.Options.MonthDayStartupDays) {
			return true
		}
	}

	if entry.Options.WeekDayStartup {
		weekDay := int(now.Weekday())

		fmt.Println("Checking if program starts on specific weekdays")
		fmt.Println(weekDay)
		fmt.Println(entry.Options.WeekDayStartupDays)
		return isWeekdaySelected(weekDay, entry.Options.WeekDayStartupDays) 
	}

	if entry.Options.CalendarStartup {
		fmt.Println("Checking if program starts on specific dates")
		return isDateSelected(now, entry.Options.CalendarStartupDates)
	}

	return false
}

func (scheduler *Scheduler) EvaluateEntry(entry structs.ScheduledStartupEntry) bool {
	return true

	now := time.Now()

	if !scheduler.EvaluateScheduling(entry) {
		return false
	}
	fmt.Println("EvaluateScheduling Passed")


	if entry.Options.StartupType == int(enums.Scheduled) {
		fmt.Println("Entry is time scheduled")

		//TODO: Time comparison needs to be checked
		switch (compareTime(now, entry.Options.StartupTime)) {
			case -1:
				//Startup time passed, check if late startup enabled
				fmt.Println("we past scheduled time")
				if !entry.Options.LateStartup {
					fmt.Println("Late startup disabled")
					return false
				}
			break;

			case 0:
				fmt.Println("times match")
				//Times match
			break;

			case 1:
				fmt.Println("it's too early")
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

		if compareTime(now, entry.Options.TimedShutdownTime) != 1 {
			return false
		}
	}

	return true
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

func parseCommand(input string) (string, []string) {
	var executable string
	var args []string

	// Regular expression to match the command and arguments
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

func getExecutableName(path string) (string, error) {
	// Regular expression to match the file name at the end of the path
	fmt.Println("checking path")
	fmt.Println(path)
	re := regexp.MustCompile(`(?:^"|^)([^\s"]+\.exe)`)
	matches := re.FindStringSubmatch(path)

	if len(matches) == 0 {
		return "", fmt.Errorf("no executable name found in path")
	}

	// The whole match is the executable name
	return matches[0], nil
}

func getLastDayOfMonth(date time.Time) int {
	firstOfNextMonth := time.Date(date.Year(), date.Month() + 1, 1, 0, 0, 0, 0, date.Location())

	lastDay := firstOfNextMonth.AddDate(0, 0, -1)

	return lastDay.Day()
}

func isMonthDaySelected(day int, selectedDays int) bool {
	if day < 1 || day > 31 {
		return false
	}

	return (selectedDays & (1 << (day - 1))) != 0
}

func isWeekdaySelected(day int, selectedDays int) bool {
	if day < 0 || day > 6 {
		return false
	}

	return (selectedDays & (1 << day)) != 0
}

func isDateSelected(date time.Time, dates []time.Time) bool {
	for _, item := range dates {
		if item.Year() == date.Year() && item.Month() == date.Month() && item.Day() == date.Day() {
			return true
		}
	}
	return false
}

func compareTime(time1 time.Time, time2 time.Time) int {
	hour1, minute1 := time1.Hour(), time1.Minute()
	hour2, minute2 := time2.Hour(), time2.Minute()

	if hour1 < hour2 {
		return -1
	} else if hour1 > hour2 {
		return 1
	}

	if minute1 < minute2 {
		return -1
	} else if minute1 > minute2 {
		return 1
	}

	return 0
}

func timeUntilNextMinute() time.Duration {
	now := time.Now()
	next := now.Truncate(time.Minute).Add(time.Minute)
	return next.Sub(now)
}