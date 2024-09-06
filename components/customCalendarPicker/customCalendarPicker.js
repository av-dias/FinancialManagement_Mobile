import { _styles } from "./style";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import React from "react";
import CalendarPicker from "react-native-calendar-picker";
import { dark } from "../../utility/colors";

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
        color: "white",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center",
        justifyContent: "center",
      }}
      monthYearHeaderWrapperStyle={{
        color: dark.textPrimary,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS,
        padding: horizontalScale(3),
        borderColor: dark.complementary,
        backgroundColor: dark.complementary,
      }}
      monthTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15), color: dark.textPrimary }}
      yearTitleStyle={{ fontWeight: "bold", fontSize: verticalScale(15), color: dark.textPrimary }}
      textStyle={{ color: dark.textPrimary }}
      customDatesStyles={{ color: dark.textPrimary }}
      selectedDayColor="red"
      startFromMonday={true}
      initialDate={pickerCurrentDate}
    />
  );
}
