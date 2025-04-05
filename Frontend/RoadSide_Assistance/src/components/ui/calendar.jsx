import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Calendar({ selectedDate, onChange }) {
    const [date, setDate] = useState(selectedDate || new Date());

    return (
        <DatePicker
            selected={date}
            onChange={(newDate) => {
                setDate(newDate);
                if (onChange) onChange(newDate);
            }}
            className="border p-2 rounded-md w-full"
        />
    );
}
