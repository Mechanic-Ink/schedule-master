import { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import {
	Collapse,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PersonIcon from "@mui/icons-material/Person";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Box from "@mui/system/Box";

// import StartupEntry from "app/util/interfaces/IStartupEntry";
import { FetchStartupItems } from "../../../wailsjs/go/main/App";
// import { useEntries } from "../../util/contexts/StartupEntry/context";
import ISidebar from "./interface";
// import useStyles from "./styles";

// import * as styles from "./styles.scss";
// const styles = require("./styles.scss");
import useStartupEntries, { IStartupEntry, ActiveStartupEntry } from "app/atoms/StartupEntry";
import { useRecoilState } from "recoil";


const Sidebar: React.FC<ISidebar> = ({ setActiveStartupItem }) => {
	const [loaded, setLoaded] = useState<boolean>(false);
	const [itemsFetched, setItemsFetched] = useState<boolean>(false);
	const {
		allEntries,
		// getEntry,
		addEntry, 
		// setEntry,
		// removeEntry, 
		// removeEntries 
	} = useStartupEntries();

	const [isOpenMachine, setIsOpenMachine] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState(false);
	const [isOpenCustom, setIsOpenCustom] = useState(false);

	const [startupMachineEntries, setStartupMachineEntries] = useState<IStartupEntry[]>([]);
	const [startupUserEntries, setStartupUserEntries] = useState<IStartupEntry[]>([]);
	const [startupCustomEntries, setStartupCustomEntries] = useState<IStartupEntry[]>([]);

	const [activeStartupEntry, setActiveStartupEntry] = useRecoilState(ActiveStartupEntry);


	const fetchCalled = useRef<boolean>(false);
	// const startupCustomEntries: IStartupEntry[] = [];

	function fetchStartupItems() {
		if(fetchCalled.current)return;
		fetchCalled.current = true;
		FetchStartupItems().then((startupEntries: IStartupEntry[]) => {
			console.log("Called Fetch Startup Items");
			setStartupMachineEntries([]);
			setStartupUserEntries([]);

			for(let entry of startupEntries) {

				switch(entry.Type) {
					case "HKEY_CURRENT_USER":
						setStartupUserEntries(startupUserEntries => [...startupUserEntries, entry]);
						break;
					case "HKEY_LOCAL_MACHINE":
						setStartupMachineEntries(startupMachineEntries => [...startupMachineEntries, entry]);
						break;
				}

				addEntry(entry);
			}
			setItemsFetched(true);
			fetchCalled.current = false;
		});
	}

	function toggleOpen(key: string) {
		switch (key) {
			case "machine":
				setIsOpenMachine(!isOpenMachine);
				break;
			case "user":
				setIsOpenUser(!isOpenUser);
				break;
			case "custom":
				setIsOpenCustom(!isOpenCustom);
				break;
		}
	}

	useEffect(() => {
		fetchStartupItems();
	}, []);

	useEffect(() => {
		if(itemsFetched) {
			console.log("Reading Entries", allEntries);
			console.log("Machine Entries", startupMachineEntries);
			console.log("User Entries", startupUserEntries);
		}
	}, [itemsFetched]);

	return (
		<List
			subheader={<ListSubheader>Startup Items</ListSubheader>}
			sx={{
				overflowX: "hidden",
				overflowY: "scroll",
				height: "90vh",
			}}
		>
			<ListItemButton onClick={() => toggleOpen("machine")}>
				<ListItemIcon>
					<DesktopWindowsIcon />
				</ListItemIcon>
				<ListItemText>
					All Users ({startupMachineEntries.length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenMachine}>
				<List>
					{startupMachineEntries.map((startupEntry) => {
						return (
							<ListItemButton
								key={startupEntry.Id}
								onClick={() => {setActiveStartupEntry(startupEntry);}}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										startupEntry.Icon
									}
								/>
								&nbsp;
								{startupEntry.Name}
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>
			<ListItemButton onClick={() => toggleOpen("user")}>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText>
					Current User ({startupUserEntries.length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenUser}>
				<List>
					{startupUserEntries.map((startupEntry) => {
						return (
							<ListItemButton
								key={startupEntry.Id}
								onClick={() => {setActiveStartupEntry(startupEntry);}}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										startupEntry.Icon
									}
								/>
								&nbsp;
								{startupEntry.Name}
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>
			<ListItemButton onClick={() => toggleOpen("custom")}>
				<ListItemIcon>
					<SettingsSuggestIcon />
				</ListItemIcon>
				<ListItemText>Scheduled ({startupCustomEntries.length})</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenCustom}>
				<List>
					{startupCustomEntries.map((sidebarItem) => {
						return (
							<ListItemButton>{sidebarItem.Name}</ListItemButton>
						);
					})}
				</List>
			</Collapse>
		</List>
	);
};

export default Sidebar;

/*

	// const [startupUserItems, setStartupUserItems] = useState<IStartupEntry[]>(
	// 	[]
	// );
	// const [startupMachineItems, setStartupMachineItems] = useState<
	// 	IStartupEntry[]
	// >([]);

	// const [customItems, setCustomItems] = useState([{ Name: "-" }]);
	// const { entries, setEntries } = useEntries();

	// const [startupEntries, setStartupEntries] = useRecoilState<IStartupEntry[]>(StartupEntries(0));
	// const [startupEntries, setStartupEntries] = useRecoilState(StartupEntries(1)); 

			// Promise.all(startupPromises).then(async () => {
			// 	const allEntries = await readEntries();

			// 	console.log("all entries???");
			// 	// console.log(allEntries);
			// 	Promise.all(allEntries).then(() => {
			// 		console.log(allEntries);
			// 		console.log("were u at");
			// 	})
			// });

			// let userItems: IStartupEntry[] = [];
			// let machineItems: IStartupEntry[] = [];


			// let startupEntries: IStartupEntry[] = [];
			// startupData.map((startupItem) => startupEntries.push(startupItem));

			// console.log(startupEntries);

			// setEntries(startupData);

			// startupData.map((startupItem) => {
			// 	if (startupItem.Type == "HKEY_CURRENT_USER")
			// 		userItems.push(startupItem);
			// 	else if (startupItem.Type == "HKEY_LOCAL_MACHINE")
			// 		machineItems.push(startupItem);
			// });

			// setStartupUserItems(userItems);
			// setStartupMachineItems(machineItems);

			// console.log(userItems);
			// console.log(machineItems);

	const [fetchedStartupItems, setFetchedStartupItems] = useState(false);
	useEffect(() => {
		if (fetchedStartupItems) return;

		fetchStartupItems();
		setFetchedStartupItems(true);
	});
*/