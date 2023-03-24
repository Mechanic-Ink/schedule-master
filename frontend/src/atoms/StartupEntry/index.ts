import { atomFamily, atom, useSetRecoilState, useRecoilState, selector, useRecoilValue, useRecoilCallback } from 'recoil';
import { useEffect, useState } from 'react';

export interface IStartupEntry {
	Id: number;
	Name: string;
	Command: string;
	Type: string;
	Registry: string;
	File: string;
	Icon: string;
}

export const ActiveStartupEntry = atom<IStartupEntry>({
	key: 'ActiveStartupEntry',
	default: {
		Id: 0,
		Name: '',
		Command: '',
		Type: '',
		Registry: '',
		File: '',
		Icon: '',
	}
});

export const StartupEntries = atomFamily<IStartupEntry, number>({
	key: 'StartupEntries',
	default: {
		Id: 0,
		Name: '',
		Command: '',
		Type: '',
		Registry: '',
		File: '',
		Icon: '',
	}
});

const StartupEntryIds = atom<number[]>({
	key: 'StartupEntryIds',
	default: [],
});

const AllStartupEntries = selector<IStartupEntry[]>({
	key: 'AllStartupEntries',
	get: ({ get }) => {
		const ids = get(StartupEntryIds);
		return ids.map((id) => get(StartupEntries(id)));
	}
});

export default function useStartupEntries() {
	const [startupEntryIds, setStartupEntryIds] = useRecoilState(StartupEntryIds);

	const allEntries = useRecoilValue(AllStartupEntries);

	const getEntry = (id: number): IStartupEntry => {
		return useRecoilValue(StartupEntries(id));
	}

	const addEntry = (entry: IStartupEntry) => {
		const id = entry.Id;
		setStartupEntryIds((ids) => [...ids, id]);
		setEntry(id, entry);
	}

	const setEntry = useRecoilCallback(({ set }) => (id: number, entry: IStartupEntry) => {
		set(StartupEntries(id), entry);
	});

	const removeEntry = (id: number) => {
		setStartupEntryIds((ids) => ids.filter((entryId) => entryId !== id));
	}

	const removeEntries = () => {
		setStartupEntryIds([]);
	}

	return {
		allEntries,
		getEntry,
		addEntry,
		setEntry,
		removeEntry,
		removeEntries,
	}
}