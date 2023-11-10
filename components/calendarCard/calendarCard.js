import { Text, View, Pressable, Dimensions } from "react-native";
import React, { useState } from "react";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";

export default function CalendarCard({ monthState: [currentMonth, setCurrentMonth], yearState: [currentYear, setCurrentYear] }) {
  const styles = _styles;

  const getCurrentDate = () => {
    return months[currentMonth] + " " + currentYear;
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
                <Pressable onPress={() => console.log("hi")}>
                  <Text style={{ textAlign: "center", fontSize: verticalScale(15) }}>{months[index] + " " + currentYear}</Text>
                </Pressable>
              </View>
            )}
          ></Carousel>
        </View>
      </View>
    </View>
  );
}
