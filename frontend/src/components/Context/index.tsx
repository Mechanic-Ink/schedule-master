import { createContext, useContext, useState } from "react";

const EntriesContext = createContext<{
	entries: { [key: string]: any };
	setEntries: (newEntries: { [key: string]: any }) => void;
}>({
	entries: {},
	setEntries: () => {},
});

function EntriesProvider({ children }: { children: React.ReactNode }) {
	const [entries, setEntries] = useState({});

	return (
		<EntriesContext.Provider value={{ entries, setEntries }}>
			{children}
		</EntriesContext.Provider>
	);
}

function useEntries() {
	const { entries, setEntries } = useContext(EntriesContext);
	return { entries, setEntries };
}

export { EntriesProvider, useEntries };
