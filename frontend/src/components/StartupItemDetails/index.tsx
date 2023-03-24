import { Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Link, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

import { ShowExecutableLocation } from "../../../wailsjs/go/main/App";

import IStartupItem from "./interface";

const StartupItemDetails: React.FC<IStartupItem> = ({item, backupRegistry, setBackupRegistry}) => {

	const [editCommandOpen, setEditCommandOpen] = useState(false);

	const editItemCommand = () => {
		const newEditCommand = (document.getElementById('editCommandField') as HTMLInputElement).value;
		
		// console.log("IN ANOTHER ELEMENT");
		// console.log(startupEntry);

		setEditCommandOpen(false);
	}

	return (
		<>
			<Dialog open={editCommandOpen} onClose={() => setEditCommandOpen(false)} fullWidth maxWidth="sm" >
				<DialogTitle>Edit Command</DialogTitle>
				<DialogContent>
					<TextField id="editCommandField" label="Command to execute" variant="standard" defaultValue={item.Command || ''} fullWidth/>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={() => setEditCommandOpen(false)}>Cancel</Button>
					<Button onClick={editItemCommand}>Save</Button>
				</DialogActions>
			</Dialog>
			<Card sx={{ overflowWrap: "break-word", m:0.5}}>
				<CardContent>
					<Typography>
						<strong>Name</strong>:&nbsp;{item.Name}
						<br />
						<strong>Command</strong>:&nbsp;
						{item.Command}&nbsp;
						<span title="Edit Command" onClick={() => setEditCommandOpen(true)}>
							<EditIcon
								sx={{
									width: "0.6m",
									height: "0.6em",
									cursor: "pointer",
								}}
							/>
						</span>
						<br />
						<strong>Registry</strong>:&nbsp;
						{item.Type}\
						{item.Registry}
						<br />
						<strong>File</strong>:&nbsp;
						<Link
							href="#"
							onClick={() =>
								ShowExecutableLocation(
									item.File
								)
							}
							color="inherit"
							title="Open File Location"
						>
							{item.File}
						</Link>
					</Typography>
					<FormControl>
						<FormControlLabel
							control={
								<Checkbox checked={backupRegistry} onChange={(e) => setBackupRegistry(!backupRegistry)}/>
							}
							label="Backup Registry"
						/>
					</FormControl>
				</CardContent>
			</Card>
		</>
	);
};

export default StartupItemDetails;