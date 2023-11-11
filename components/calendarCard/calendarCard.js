import { Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";
import CustomCalendarPicker from "../customCalendarPicker/customCalendarPicker";
import CardWrapper from "../../components/cardWrapper/cardWrapper";

export default function CalendarCard({ monthState: [currentMonth, setCurrentMonth], yearState: [currentYear, setCurrentYear] }) {
  const styles = _styles;
  const [datePicker, setDatePicker] = useState(false);

  const getCurrentDate = () => {
    return months[currentMonth] + " " + currentYear;
  };

  const changeDateCalendar = (date) => {
    let newDate = new Date(date);
    setDatePicker(!datePicker);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const getPickerCurrentDate = () => {
    return new Date();
  };

  const dateItem = (index) => {
    return months[index] + " " + currentYear;
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <View style={styles.rowGap}>
          <Carousel
            width={verticalScale(100)}
            height={verticalScale(40)}
            data={months}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => {
              setCurrentMonth(index);
            }}
            defaultIndex={currentMonth}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Pressable onPress={() => setDatePicker(true)}>
                  <Text style={{ textAlign: "center", fontSize: verticalScale(15) }}>{dateItem(index)}</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
        {datePicker && (
          <CardWrapper
            style={{
              position: "absolute",
              alignSelf: "center",
              zIndex: 1,
            }}
          >
            <CustomCalendarPicker pickerCurrentDate={getPickerCurrentDate()} changeDateCalendar={changeDateCalendar} />
            <View style={{ marginTop: -verticalScale(26) }}>
              <Pressable
                style={{ alignSelf: "flex-end", backgroundColor: "transparent", marginTop: -verticalScale(5) }}
                onPress={() => {
                  changeDateCalendar(getPickerCurrentDate());
                }}
              >
                <AntDesign style={{ padding: verticalScale(5) }} name="closecircle" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
          </CardWrapper>
        )}
      </View>
    </View>
  );
}
