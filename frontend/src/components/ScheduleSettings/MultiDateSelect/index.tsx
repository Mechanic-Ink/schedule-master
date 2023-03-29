// import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { CalendarToday, Clear } from "@mui/icons-material";
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import { useRecoilState } from "recoil";

import dayjs from 'app/util/dayjs.config';
import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import { DatePickerProps, StaticDatePicker } from "@mui/x-date-pickers";

// type MultiDateSelectProps = Omit<DatePickerProps<dayjs.Dayjs, dayjs.Dayjs>, 'renderInput' | 'value' | 'onChange'> & {
// 	// value: dayjs.Dayjs[];
// };

const MultiDateSelect: React.FC = () => {
	const [options, _] = useRecoilState<IStartupOptions>(StartupOptions);
	const { setOption } = useStartupOptions();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<Button sx={{marginBottom: 2}}variant="contained" onClick={() => setOpen(true)}>Select Dates</Button>
			<MultipleDatesPicker
				open={open}
				// onClose={() => setOpen(false)}
				// onChange={(dates) => setOption('calendarStartupDates', dates.map((date) => dayjs(date)))}
				selectedDates={options.calendarStartupDates.map((day) => day.toDate())}
				onCancel={() => {setOption('calendarStartupDates', [])}}
				onSubmit={(dates:Date[]) => {
					setOption('calendarStartupDates', dates.map((date) => dayjs(date)))
					setOpen(false);
				}}
				cancelButtonText="Clear"
				submitButtonText="Ok"
			/>
		</>
	);
}

export default MultiDateSelect;