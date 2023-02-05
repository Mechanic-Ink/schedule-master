import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { BackupStartupItems } from "../../../wailsjs/go/main/App";

export default function MenuBar() {
	const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
		null
	);

	const [openFile, setOpenFile] = useState<boolean>(false);

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

	return (
		<>
			<Button onClick={(event) => toggleOpen("file", event)}>File</Button>
			<Menu
				open={openFile}
				anchorEl={anchorElement}
				onClose={() => toggleOpen("file", null)}
			>
				<MenuItem>Reload Startup Items</MenuItem>
				<MenuItem onClick={BackupStartupItems}>
					Backup Startup Items
				</MenuItem>
				<MenuItem>Exit</MenuItem>
			</Menu>
		</>
	);
}
