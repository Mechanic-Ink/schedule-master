import { useState, useEffect } from "react";
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

import StartupEntry from "app/util/interfaces/IStartupEntry";
import { FetchStartupItems } from "../../../wailsjs/go/main/App";
import { useEntries } from "../../util/contexts/StartupEntry/context";
import Box from "@mui/system/Box";
// import useStyles from "./styles";

// import * as styles from "./styles.scss";
// const styles = require("./styles.scss");

interface ISidebar {
	setActiveStartupItem: (StartupEntry: StartupEntry) => void;
}

// const Sidebar = ({ activeStartupItem }) => {
const Sidebar: React.FC<ISidebar> = ({ setActiveStartupItem }) => {
	const [startupUserItems, setStartupUserItems] = useState<StartupEntry[]>(
		[]
	);
	const [startupMachineItems, setStartupMachineItems] = useState<
		StartupEntry[]
	>([]);

	const [customItems, setCustomItems] = useState([{ Name: "-" }]);
	const { entries, setEntries } = useEntries();

	function fetchStartupItems() {
		FetchStartupItems().then((startupData) => {
			let userItems: StartupEntry[] = [];
			let machineItems: StartupEntry[] = [];

			setEntries(startupData);

			startupData.map((startupItem) => {
				if (startupItem.Type == "HKEY_CURRENT_USER")
					userItems.push(startupItem);
				else if (startupItem.Type == "HKEY_LOCAL_MACHINE")
					machineItems.push(startupItem);
			});

			setStartupUserItems(userItems);
			setStartupMachineItems(machineItems);

			// console.log(userItems);
			// console.log(machineItems);
		});
	}

	// console.log(startupUserItems);
	console.log(startupMachineItems);

	// console.log("styles");
	// console.log(styles);
	// console.log(styles.sidebar);

	const [fetchedStartupItems, setFetchedStartupItems] = useState(false);
	useEffect(() => {
		if (fetchedStartupItems) return;

		fetchStartupItems();
		setFetchedStartupItems(true);
	});

	const [openMachine, setOpenMachine] = useState(false);
	const [openUser, setOpenUser] = useState(false);
	const [openCustom, setOpenCustom] = useState(false);

	function toggleOpen(key: string) {
		switch (key) {
			case "machine":
				setOpenMachine(!openMachine);
				break;
			case "user":
				setOpenUser(!openUser);
				break;
			case "custom":
				setOpenCustom(!openCustom);
				break;
		}
	}
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
					All Users ({startupMachineItems.length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={openMachine}>
				<List>
					{startupMachineItems.map((sidebarItem) => {
						return (
							<ListItemButton
								onClick={() =>
									setActiveStartupItem(sidebarItem)
								}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										sidebarItem.Icon
									}
								/>
								&nbsp;
								{sidebarItem.Name}
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
					Current User ({startupUserItems.length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={openUser}>
				<List>
					{startupUserItems.map((sidebarItem) => {
						return (
							<ListItemButton
								onClick={() =>
									setActiveStartupItem(sidebarItem)
								}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										sidebarItem.Icon
									}
								/>
								&nbsp;
								{sidebarItem.Name}
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>

			<ListItemButton onClick={() => toggleOpen("custom")}>
				<ListItemIcon>
					<SettingsSuggestIcon />
				</ListItemIcon>
				<ListItemText>Scheduled ({customItems.length})</ListItemText>
			</ListItemButton>
			<Collapse in={openCustom}>
				<List>
					{customItems.map((sidebarItem) => {
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
