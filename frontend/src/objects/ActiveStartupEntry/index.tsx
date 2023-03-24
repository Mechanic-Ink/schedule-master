import React, { createContext, useReducer } from 'react';
import IStartupEntry from 'app/util/interfaces/IStartupEntry';

interface IStartupEntryContext {
	activeStartupEntry: IStartupEntry;
	setActiveStartupEntry: React.Dispatch<Partial<IStartupEntry>>;
}

const initialState: IStartupEntry = {
	ID: 0,
	Name: "",
	Command: "",
	Type: "",
	Registry: "",
	File: "",
	Icon: ""
};

const startupEntryReducer = (state: IStartupEntry, action: Partial<IStartupEntry>) => {
	return { ...state, ...action };
}

export const ActiveStartupEntryContext = createContext<IStartupEntryContext>({
	activeStartupEntry: initialState,
	setActiveStartupEntry: () => {},
});

export const ActiveStartupEntryProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
	const [activeStartupEntry, setActiveStartupEntry] = useReducer(startupEntryReducer, initialState);

	return (
		<ActiveStartupEntryContext.Provider value={{ activeStartupEntry, setActiveStartupEntry }}>
			{children}
		</ActiveStartupEntryContext.Provider>
	);
};

// import { useEffect } from 'react';

// // interface IActiveStartupEntry extends IStartupEntry {

// // }

// export let activeStartupEntry: IStartupEntry = {
// 	ID: 0,
// 	Name: "",
// 	Command: "",
// 	Type: "",
// 	Registry: "",
// 	File: "",
// 	Icon: ""
// }

// export function setActiveStartupEntry(entry: IStartupEntry) {
// 	activeStartupEntry = entry;
// }