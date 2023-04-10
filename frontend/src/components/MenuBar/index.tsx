import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { BackupStartupItems } from "../../../wailsjs/go/main/App";
import useFetchStartupItems from "app/util/actions/useFetchStartupItems";

export default function MenuBar() {
	const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
		null
	);
	const [openFile, setOpenFile] = useState<boolean>(false);
	const { fetchStartupItems } = useFetchStartupItems(true);

	function toggleOpen(
		key: string,
		event: React.MouseEvent<HTMLButtonElement> | null
	) {
		switch (key) {
			case "file":
				if (event !== null) setAnchorElement(event.currentTarget);
				setOpenFile(!openFile);
				break;
		}
	}

	function reloadStartupItems() {
		fetchStartupItems();
		toggleOpen("file", null);
	}

	return (
		<>
			<Button onClick={(event) => toggleOpen("file", event)}>File</Button>
			<Menu
				open={openFile}
				anchorEl={anchorElement}
				onClose={() => toggleOpen("file", null)}
			>
				<MenuItem onClick={() => reloadStartupItems()}>
					Reload Startup Items
				</MenuItem>
				<MenuItem onClick={() => BackupStartupItems()}>
					Backup Startup Items
				</MenuItem>
				<MenuItem>Exit</MenuItem>
			</Menu>
		</>
	);
}
