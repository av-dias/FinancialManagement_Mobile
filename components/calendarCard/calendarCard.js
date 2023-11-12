import { Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";
import ModalCustom from "../../components/modal/modal";

export default function CalendarCard({ monthState: [currentMonth, setCurrentMonth], yearState: [currentYear, setCurrentYear] }) {
  const styles = _styles;
  const [datePicker, setDatePicker] = useState(false);

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
          <ModalCustom modalVisible={datePicker} setModalVisible={setDatePicker} size={1}>
            <View style={{ ...styles.rowGap, maxWidth: 500, flex: 1, alignItems: "center", gap: verticalScale(20) }}>
              <View style={{ width: verticalScale(120), height: verticalScale(70) }}>
                <ScrollView vertical={true} style={{ backgroundColor: "white", borderRadius: 10 }}>
                  {months.map((month, index) => {
                    return (
                      <Pressable
                        key={"P" + month}
                        style={{ backgroundColor: "white", paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
                        onPress={() => {
                          setCurrentMonth(index);
                        }}
                      >
                        <Text key={"T" + month} style={{ fontSize: verticalScale(20), textAlign: "center", justifyContent: "center" }}>
                          {month}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={{ width: verticalScale(120), height: verticalScale(70) }}>
                <ScrollView vertical={true} style={{ backgroundColor: "white", borderRadius: 10 }}>
                  {["2022", "2023", "2024", "2025"].map((year) => {
                    return (
                      <Pressable
                        key={"P" + year}
                        style={{ backgroundColor: "white", paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
                        onPress={() => {
                          setCurrentYear(year);
                          setDatePicker(!datePicker);
                        }}
                      >
                        <Text key={"T" + year} style={{ fontSize: verticalScale(20), textAlign: "center", justifyContent: "center" }}>
                          {year}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </ModalCustom>
        )}
      </View>
    </View>
  );
}
