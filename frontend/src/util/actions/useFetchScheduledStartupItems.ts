import { useRef } from "react";

import IScheduledStartupEntry from "app/atoms/ScheduledStartupEntry/interface";
import { FetchScheduledItems } from "../../../wailsjs/go/main/App";
import useScheduledStartupEntries from "app/atoms/ScheduledStartupEntry";


export default function useFetchScheduledStartupItems(reset = false) {
	const { addScheduledEntry, removeScheduledEntries } = useScheduledStartupEntries();
	const fetchCalled = useRef<boolean>(false);

	const fetchScheduledStartupItems = () => {
		if (fetchCalled.current) return;
		fetchCalled.current = true;

		removeScheduledEntries();

		FetchScheduledItems(reset).then((scheduledEntries: IScheduledStartupEntry[]) => {
			console.log('Called Fetch Startup Items');

			for (let entry of scheduledEntries) addScheduledEntry(entry);

			fetchCalled.current = false;
		});
	};

	return { fetchScheduledStartupItems };
}