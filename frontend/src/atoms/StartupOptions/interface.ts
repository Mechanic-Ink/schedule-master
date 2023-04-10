import dayjs from 'app/util/dayjs.config';

interface IStartupOptions {
	backupRegistry:					boolean;
	calendarShutdown:				boolean;
	calendarStartup:				boolean;
	calendarStartupDates:			dayjs.Dayjs[];
	command:						string;
	lateStartup:					boolean;
	monthDayStartup:				boolean;
	monthDayStartupDays:			number;
	monthDayStartupDaysLast:		boolean;
	monthDayStartupDaysSecondLast:	boolean;
	startupTime:					dayjs.Dayjs;
	startupType:					number;
	timedClose:						boolean;
	timedReopen:					boolean;
	timedShutdown:					boolean;
	timedShutdownTime:				dayjs.Dayjs;
	weekDayStartup:					boolean;
	weekDayStartupDays:				number;
}

export default IStartupOptions;