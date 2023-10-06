import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Card } from "@rneui/themed";

import { _styles } from "./style";
import { months } from "../../utility/calendar";

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
      <TouchableOpacity
        style={styles.hitBox}
        onPress={() => {
          previousMonth();
        }}
      >
        <AntDesign style={styles.iconCenter} name="left" size={15} color="black" />
      </TouchableOpacity>
      <Card containerStyle={styles.calendarBox}>
        <View style={styles.rowGap}>
          <View style={{ flex: 1 }}>
            <Feather name="calendar" size={24} color="black" />
          </View>
          <View style={{ flex: 4 }}>
            <Text style={styles.text}>{getCurrentDate()}</Text>
          </View>
        </View>
      </Card>
      <TouchableOpacity
        style={styles.hitBox}
        onPress={() => {
          nextMonth();
        }}
      >
        <AntDesign style={styles.iconCenter} name="right" size={15} color="black" />
      </TouchableOpacity>
    </View>
  );
}
