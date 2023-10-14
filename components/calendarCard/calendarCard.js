import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Card } from "@rneui/themed";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../utility/responsive";

export default function CalendarCard({ monthState: [currentMonth, setCurrentMonth], yearState: [currentYear, setCurrentYear] }) {
  const styles = _styles;

  const getCurrentDate = () => {
    return months[currentMonth] + " " + currentYear;
  };

  const previousMonth = () => {
    if (currentMonth > 0) setCurrentMonth(currentMonth - 1);
    else {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth < 11) setCurrentMonth(currentMonth + 1);
    else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <View style={styles.rowGap}>
          <TouchableOpacity
            style={styles.hitBox}
            onPress={() => {
              previousMonth();
            }}
          >
            <AntDesign style={styles.iconCenter} name="left" size={verticalScale(10)} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Feather name="calendar" size={verticalScale(15)} color="black" />
          </View>
          <View style={{ flex: 4, justifyContent: "center" }}>
            <Text style={styles.text}>{getCurrentDate()}</Text>
          </View>
          <TouchableOpacity
            style={styles.hitBox}
            onPress={() => {
              nextMonth();
            }}
          >
            <AntDesign style={styles.iconCenter} name="right" size={verticalScale(10)} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
