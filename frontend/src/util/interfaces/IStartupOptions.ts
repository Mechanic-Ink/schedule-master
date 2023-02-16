import { Dayjs } from "dayjs";

interface IStartupOptions {
	startupType:			number;
	startupTime:			Dayjs;
	timedShutdown:			boolean;
	timedShutdownTime:		Dayjs;
	timedReopen:			boolean;
	timedClose:				boolean;
	clockClosing:			boolean;
	lateStartup:			boolean;
	weekDayStartup:			boolean;
	weekDayStartupDays:		number;
	monthDayStartup:		boolean;
	monthDayStartupDays:	number;
	calendarStartup:		boolean;
	calendarStartupDays:	Dayjs[];
	calendarClosing:		boolean;
}

export default IStartupOptions;