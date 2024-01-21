import dayjs from 'app/util/dayjs.config';

interface IStartupOptions {
	BackupRegistry:					boolean;
	CalendarShutdown:				boolean;
	CalendarStartup:				boolean;
	CalendarStartupDates:			dayjs.Dayjs[];
	Command:						string;
	KeepRegistry:					boolean;
	LateStartup:					boolean;
	MonthDayStartup:				boolean;
	MonthDayStartupDays:			number;
	MonthDayStartupDaysLast:		boolean;
	MonthDayStartupDaysSecondLast:	boolean;
	StartupTime:					dayjs.Dayjs;
	StartupType:					number;
	// TimedClose:						boolean;
	TimedReopen:					boolean;
	TimedShutdown:					boolean;
	TimedShutdownTime:				dayjs.Dayjs;
	WeekDayStartup:					boolean;
	WeekDayStartupDays:				number;
}

export default IStartupOptions;