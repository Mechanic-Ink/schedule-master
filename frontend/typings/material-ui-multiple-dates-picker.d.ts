declare module '@ambiot/material-ui-multiple-dates-picker' {
	import { ReactElement } from 'react';
	import { TextFieldProps } from '@mui/material';

	export interface MultipleDatesPickerProps {
		selectedDates?: Date[];
		disabledDates?: Date[];
		open: boolean;
		onCancel?: () => void;
		onSubmit?: (dates: Date[]) => void;
		cancelButtonText?: string;
		submitButtonText?: string;
	}

	const MultipleDatesPicker: (props: MultipleDatesPickerProps) => ReactElement;
	export default MultipleDatesPicker;
}