import { Text, View, TextInput, Pressable } from "react-native";
import { _styles } from "./style";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import CalendarStrip from "react-native-calendar-strip";
import React, { useState, useEffect } from "react";
import { color } from "../../utility/colors";
import CardWrapper from "../../components/cardWrapper/cardWrapper";
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
        ref={(component) => (this._calendar = component)}
        selectedDate={pickerCurrentDate}
        calendarAnimation={{ type: "sequence", duration: 15 }}
        daySelectionAnimation={{ type: "border", duration: 100, borderWidth: 1, borderHighlightColor: color.calendarBorder }}
        style={{ height: verticalScale(90), backgroundColor: color.complementary, borderRadius: BORDER_RADIUS, elevation: 2 }}
        calendarHeaderStyle={{
          color: "black",
          marginTop: 5,
          padding: horizontalScale(3),
          fontSize: verticalScale(15),
          borderWidth: 1,
          borderRadius: BORDER_RADIUS,
          borderColor: color.complementary,
          backgroundColor: color.complementary,
          elevation: 2,
        }}
        calendarColor={"transparent"}
        dateNumberStyle={{ color: "black", fontSize: verticalScale(15) }}
        dateNameStyle={{ color: "black", fontSize: verticalScale(10) }}
        highlightDateNumberStyle={{ color: color.secundary, fontSize: verticalScale(20) }}
        highlightDateNameStyle={{ color: color.secundary }}
        disabledDateNameStyle={{ color: "grey" }}
        disabledDateNumberStyle={{ color: "grey" }}
        iconContainer={{ flex: 0.1 }}
        startFromMonday={true}
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
