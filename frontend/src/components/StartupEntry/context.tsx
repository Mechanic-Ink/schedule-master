import { createContext, useContext, useState } from "react";

const StartupEntryContext = createContext<{
	entries: { [key: string]: any };
	setEntries: (newEntries: { [key: string]: any }) => void;
}>({
	entries: {},
	setEntries: () => {},
});

function EntriesProvider({ children }: { children: React.ReactNode }) {
	const [entries, setEntries] = useState({});

	return (
		<StartupEntryContext.Provider value={{ entries, setEntries }}>
			{children}
		</StartupEntryContext.Provider>
	);
}

function useEntries() {
	const { entries, setEntries } = useContext(StartupEntryContext);
	return { entries, setEntries };
}

export { EntriesProvider, useEntries };
