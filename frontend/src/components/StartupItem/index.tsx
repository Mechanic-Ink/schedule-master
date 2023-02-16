import { Card, CardContent, Checkbox, FormControl, FormControlLabel, Link, Typography } from "@mui/material";

import { ShowExecutableLocation } from "../../../wailsjs/go/main/App";

import EditIcon from "@mui/icons-material/Edit";
import IStartupItem from "./interface";

const StartupItem: React.FC<IStartupItem> = ({item, backupRegistry, setBackupRegistry}) => {

	return (
		<Card sx={{ overflowWrap: "break-word" }}>
			<CardContent>
				<Typography>
					<strong>Name</strong>: {item.Name}
					<br />
					<strong>Command</strong>:
					{item.Command}&nbsp;
					<span title="Edit Command">
						<EditIcon
							sx={{
								width: "0.6m",
								height: "0.6em",
								cursor: "pointer",
							}}
						/>
					</span>
					<br />
					<strong>Registry</strong>:
					{item.Type}\
					{item.Registry}
					<br />
					<strong>File</strong>:
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
	);
};

export default StartupItem;