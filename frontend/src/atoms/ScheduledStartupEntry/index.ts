import { atomFamily, atom, useRecoilState, selector, useRecoilValue, useRecoilCallback } from 'recoil';
import dayjs from 'app/util/dayjs.config';

import IScheduledStartupEntry from './interface';

export const ActiveScheduledStartupEntry = atom<IScheduledStartupEntry>({
	key: 'ScheduledStartupEntry',
	default: {
		Entry: {
			Id: 0,
			Name: '',
			Command: '',
			Type: '',
			Registry: '',
			File: '',
			Icon: '',
		},
		Options: {
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
	}
});

export const ScheduledStartupEntries = atomFamily<IScheduledStartupEntry, number>({
	key: 'ScheduledStartupEntries',
	default: {
		Entry: {
			Id: 0,
			Name: '',
			Command: '',
			Type: '',
			Registry: '',
			File: '',
			Icon: '',
		},
		Options: {
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
	}
});

const ScheduledStartupEntryIds = atom<number[]>({
	key: 'ScheduledStartupEntryIds',
	default: [],
});

const AllScheduledStartupEntries = selector<IScheduledStartupEntry[]>({
	key: 'AllScheduledStartupEntries',
	get: ({ get }) => {
		const ids = get(ScheduledStartupEntryIds);
		return ids.map((id) => get(ScheduledStartupEntries(id)));
	}
});

export default function useScheduledStartupEntries() {
	const [scheduledStartupEntryIds, setScheduledStartupEntryIds] = useRecoilState(ScheduledStartupEntryIds);

	const allScheduledEntries = useRecoilValue(AllScheduledStartupEntries);

	const getScheduledEntry = (id: number): IScheduledStartupEntry => {
		return useRecoilValue(ScheduledStartupEntries(id));
	}

	const addScheduledEntry = (entry: IScheduledStartupEntry) => {
		const id = entry.Entry.Id;
		setScheduledStartupEntryIds((ids) => [...ids, id]);
		setScheduledEntry(id, entry);
	}

	const setScheduledEntry = useRecoilCallback(({ set }) => (id: number, entry: IScheduledStartupEntry) => {
		set(ScheduledStartupEntries(id), entry);
	});

	const removeScheduledEntry = (id: number) => {
		setScheduledStartupEntryIds((ids) => ids.filter((entryId) => entryId !== id));
	}

	const removeScheduledEntries = () => {
		setScheduledStartupEntryIds([]);
	}

	return {
		allScheduledEntries,
		getScheduledEntry,
		addScheduledEntry,
		setScheduledEntry,
		removeScheduledEntry,
		removeScheduledEntries,
	}
}