import dayjs from 'app/util/dayjs.config';
import { atom, useSetRecoilState } from 'recoil';

import IStartupOptions from "./interface";

const StartupOptions = atom<IStartupOptions>({
	key: 'ActiveStartupEntryOptions',
	default: {
		BackupRegistry: true,
		CalendarShutdown: false,
		CalendarStartup: false,
		CalendarStartupDates: [],
		Command: '',
		KeepRegistry: false,
		LateStartup: false,
		MonthDayStartup: false,
		MonthDayStartupDays: 0,
		MonthDayStartupDaysLast: false,
		MonthDayStartupDaysSecondLast: false,
		StartupTime: dayjs("2023-01-01T12:00"),
		StartupType: 0,
		TimedClose: false,
		TimedReopen: false,
		TimedShutdown: false,
		TimedShutdownTime: dayjs("2023-01-01T12:00"),
		WeekDayStartup: false,
		WeekDayStartupDays: 0,
	}
});

export default StartupOptions;

export function useStartupOptions() {
	const setOptions = useSetRecoilState(StartupOptions);

	const setOption = (key: keyof IStartupOptions, value: any) => {
		setOptions((previousOptions) => ({
			...previousOptions,
			[key]: value
		}));
	};

	return { setOption, setOptions };
}




// export const [options, setOptions] = useReducer(
// 	(previous: StartupOptions, next:Partial<StartupOptions>) => {
// 		return { ...previous, ...next } as StartupOptions;
// 	},
// 	{
// 		startupType: 0,
// 		startupTime: dayjs("2023-01-01T12:00"),
// 		timedShutdown: false,
// 		timedShutdownTime: dayjs("2023-01-01T12:00"),
// 		timedReopen: false,
// 		timedClose: false,
// 		lateStartup: false,
// 		weekDayStartup: false,
// 		weekDayStartupDays: 0,
// 		monthDayStartup: false,
// 		monthDayStartupDays: 0,
// 		calendarStartup: false,
// 		calendarStartupDays: [dayjs("")],
// 		calendarClosing: false,
// 	},
// );