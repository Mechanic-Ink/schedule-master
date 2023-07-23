// import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Button } from "@mui/material";
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import { useRecoilState } from "recoil";

import dayjs from 'app/util/dayjs.config';
import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import IStartupOptions from "app/atoms/StartupOptions/interface";

const MultiDateSelect: React.FC = () => {
	const [options, _] = useRecoilState<IStartupOptions>(StartupOptions);
	const { setOption } = useStartupOptions();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<Button sx={{marginBottom: 2}}variant="contained" onClick={() => setOpen(true)}>Select Dates</Button>
			<MultipleDatesPicker
				open={open}
				selectedDates={options.CalendarStartupDates.map((day) => day.toDate())}
				onCancel={() => {setOption('CalendarStartupDates', [])}}
				onSubmit={(dates:Date[]) => {
					setOption('CalendarStartupDates', dates.map((date) => dayjs(date)))
					setOpen(false);
				}}
				cancelButtonText="Clear"
				submitButtonText="Ok"
			/>
		</>
	);
}

export default MultiDateSelect;