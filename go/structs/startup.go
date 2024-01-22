package structs

import (
	"time"
)

type StartupEntry struct {
	Id			int16	`json:"Id"`
	Name		string	`json:"Name"`
	Command		string	`json:"Command"`
	Type		string	`json:"Type"`
	Registry	string	`json:"Registry"`
	File		string	`json:"File"`
	Icon		string	`json:"Icon"`
}

type StartupOptions struct {
	BackupRegistry					bool			//`json:"BackupRegistry"` //////////////
	CalendarShutdown				bool			//`json:"CalendarShutdown"` 
	CalendarStartup					bool			//`json:"CalendarStartup"` ///////////////
	CalendarStartupDates			[]time.Time		//`json:"CalendarStartupDates"` ////////////
	Command							string			//`json:"Command"` /////////////
	KeepRegistry					bool			//`json:"KeepRegistry"` //////////////
	LateStartup						bool			//`json:"LateStartup"` //////////////////
	MonthDayStartup					bool			//`json:"MonthDayStartup"` ///////////////
	MonthDayStartupDays				int				//`json:"MonthDayStartupDays"` ///////////
	MonthDayStartupDaysLast			bool			//`json:"MonthDayStartupDaysLast"` //////////
	MonthDayStartupDaysSecondLast	bool			//`json:"MonthDayStartupDaysSecondLast"` /////////
	StartupTime						time.Time		//`json:"StartupTime"` ///////////////////
	StartupType						int				//`json:"StartupType"` ///////////////////
	TimedReopen						bool			//`json:"TimedReopen"`
	TimedShutdown					bool			//`json:"TimedShutdown"` /////////////
	TimedShutdownTime				time.Time		//`json:"TimedShutdownTime"` /////////
	WeekDayStartup					bool			//`json:"WeekDayStartup"` ///////////
	WeekDayStartupDays				int				//`json:"WeekDayStartupDays"` /////////
}

type ScheduledStartupEntry struct {
	// Id			int16				//`json:"Id"`
	Entry		StartupEntry		//`json:"Entry"`
	Options		StartupOptions		//`json:"Options"`
	ProcessID	int
}