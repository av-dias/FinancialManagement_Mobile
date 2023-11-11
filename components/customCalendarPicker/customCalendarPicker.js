import { _styles } from "./style";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import React from "react";
import CalendarPicker from "react-native-calendar-picker";

const BORDER_RADIUS = 10;

export default function CustomCalendarPicker({ pickerCurrentDate, changeDateCalendar }) {
  return (
    <CalendarPicker
      width={horizontalScale(345)}
      onDateChange={(date) => {
        changeDateCalendar(date);
      }}
      todayBackgroundColor="transparent"
      todayTextStyle={{
        color: "gray",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center",
        justifyContent: "center",
      }}
      monthYearHeaderWrapperStyle={{
        color: "black",
        borderWidth: 1,
        borderRadius: BORDER_RADIUS,
        padding: horizontalScale(3),
        borderColor: "white",
        backgroundColor: "white",
      }}
      monthTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15) }}
      yearTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15) }}
      selectedDayColor="red"
      startFromMonday={true}
      initialDate={pickerCurrentDate}
    />
  );
}
