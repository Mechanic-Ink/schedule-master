import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import IConfirmationDialog from "./interface";

export default function ConfirmationDialog({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel
}: IConfirmationDialog) {

	return (
		<Dialog open={isOpen} onClose={onCancel}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>Cancel</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
}