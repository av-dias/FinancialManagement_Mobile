import { Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";
import ModalCustom from "../../components/modal/modal";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

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
            scrollAnimationDuration={100}
            onSnapToItem={(index) => {
              if (currentMonth === 0 && index == 11) {
                setCurrentYear(currentYear - 1);
              } else if (currentMonth === 11 && index == 0) {
                setCurrentYear(currentYear + 1);
              }
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
                  <Text style={styles.text}>{dateItem(index)}</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
        {datePicker && (
          <ModalCustom modalVisible={datePicker} setModalVisible={setDatePicker} size={6} hasColor={false}>
            <View
              style={{
                ...styles.rowGap,
                maxWidth: verticalScale(300),
                maxHeight: verticalScale(100),
                flex: 1,
                alignItems: "center",
                gap: verticalScale(20),
                backgroundColor: dark.complementary,
                borderRadius: commonStyles.borderRadius,
              }}
            >
              <View style={{ width: verticalScale(120), height: verticalScale(70) }}>
                <ScrollView vertical={true}>
                  {months.map((month, index) => {
                    return (
                      <Pressable
                        key={"P" + month}
                        style={{ backgroundColor: dark.complementary, paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
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
                <ScrollView vertical={true}>
                  {["2022", "2023", "2024", "2025"].map((year) => {
                    return (
                      <Pressable
                        key={"P" + year}
                        style={{ backgroundColor: dark.complementary, paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
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
            <Pressable
              style={{ flex: 1, backgroundColor: "transparent" }}
              key={"CloseButton"}
              onPress={() => {
                setDatePicker(!datePicker);
              }}
            ></Pressable>
          </ModalCustom>
        )}
      </View>
    </View>
  );
}
