import { useRef } from "react";

import IStartupEntry from "app/atoms/StartupEntry/interface";
import { FetchStartupItems } from "../../../wailsjs/go/main/App";
import useStartupEntries from "app/atoms/StartupEntry";


export default function useFetchStartupItems(reset = false) {
	const { addEntry, removeEntries } = useStartupEntries();
	const fetchCalled = useRef<boolean>(false);

	const fetchStartupItems = () => {
		if (fetchCalled.current) return;
		fetchCalled.current = true;

		removeEntries();

		FetchStartupItems(reset).then((startupEntries: IStartupEntry[]) => {
			console.log('Called Fetch Startup Items');

			for (let entry of startupEntries) addEntry(entry);

			fetchCalled.current = false;
		});
	};

	return { fetchStartupItems };
}