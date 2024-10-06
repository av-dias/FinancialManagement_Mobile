import { Text, View, TextInput, Pressable } from "react-native";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import CalendarStrip from "react-native-calendar-strip";
import React, { useState, useEffect } from "react";
import { dark } from "../../utility/colors";
import CardWrapper from "../cardWrapper/cardWrapper";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import CustomCalendarPicker from "../customCalendarPicker/customCalendarPicker";

const BORDER_RADIUS = 10;

export default function CustomCalendarStrip({ pickerCurrentDate, setPickerCurrentDate }) {
  const styles = _styles;
  const [datePicker, setDatePicker] = useState(true);

  const calendarPicker = () => {
    setDatePicker(!datePicker);
  };

  const changeDateCalendar = (date) => {
    calendarPicker();
    setPickerCurrentDate(new Date(date));
  };

  return (
    <>
      {datePicker ? null : (
        <CardWrapper
          style={{
            position: "absolute",
            alignSelf: "center",
            zIndex: 1,
            backgroundColor: dark.complementarySolid,
          }}
        >
          <CustomCalendarPicker pickerCurrentDate={pickerCurrentDate} changeDateCalendar={changeDateCalendar} />
          <View style={{ marginTop: -verticalScale(26) }}>
            <Pressable
              style={{ alignSelf: "flex-end", backgroundColor: "transparent", marginTop: -verticalScale(5) }}
              onPress={() => {
                changeDateCalendar(pickerCurrentDate);
              }}
            >
              <AntDesign style={{ padding: verticalScale(5) }} name="closecircle" size={verticalScale(20)} color="black" />
            </Pressable>
          </View>
        </CardWrapper>
      )}
      <CalendarStrip
        selectedDate={pickerCurrentDate}
        calendarAnimation={{ type: "sequence", duration: 15 }}
        daySelectionAnimation={{ type: "border", duration: 100, borderWidth: 1, borderHighlightColor: dark.calendarBorder }}
        style={{ height: verticalScale(90), backgroundColor: dark.complementary, borderRadius: BORDER_RADIUS, elevation: 2 }}
        calendarHeaderStyle={{
          color: dark.textPrimary,
          marginTop: 5,
          padding: horizontalScale(3),
          fontSize: verticalScale(15),
          borderWidth: 1,
          borderRadius: BORDER_RADIUS,
          borderColor: dark.complementary,
          backgroundColor: dark.complementary,
          elevation: 2,
        }}
        calendarColor={"transparent"}
        dateNumberStyle={{ color: dark.textPrimary, fontSize: verticalScale(15) }}
        dateNameStyle={{ color: dark.textPrimary, fontSize: verticalScale(10) }}
        highlightDateNumberStyle={{ color: dark.secundary, fontSize: verticalScale(20) }}
        highlightDateNameStyle={{ color: dark.secundary }}
        disabledDateNameStyle={{ color: "grey" }}
        disabledDateNumberStyle={{ color: "grey" }}
        iconContainer={{ flex: 0.1 }}
        scrollable={true}
        scrollerPaging={true}
        onDateSelected={setPickerCurrentDate}
        onHeaderSelected={() => {
          calendarPicker();
        }}
      />
    </>
  );
}
