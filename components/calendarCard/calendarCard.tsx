import { Text, View, Pressable, ScrollView } from "react-native";
import React, { useRef, useState } from "react";

import { _styles } from "./style";
import { months, years } from "../../utility/calendar";
import { verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";
import ModalCustom from "../modal/modal";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { Button } from "react-native-paper";

export default function CalendarCard({ monthState: [currentMonth, setCurrentMonth], yearState: [currentYear, setCurrentYear] }) {
  const styles = _styles;
  const refMonth = useRef<ScrollView>();
  const refYear = useRef<ScrollView>();

  const [datePicker, setDatePicker] = useState(false);
  const [newMonth, setNewMonth] = useState(currentMonth);
  const [newYear, setNewYear] = useState(currentYear);

  const dateItem = () => {
    let month = "";
    let year = "";

    if (currentMonth != null) month = months[currentMonth];
    if (currentYear != null) year = currentYear;

    return (month + " " + year).trimEnd().trimStart();
  };

  const handleMonthClick = (index: number) => {
    if (currentMonth != null) setNewMonth(index);
  };

  const handleYearClick = (year: number) => {
    if (currentYear != null) setNewYear(year);
  };

  const handleDate = () => {
    if (currentMonth != null) setCurrentMonth(newMonth);
    if (currentYear != null) setCurrentYear(newYear);
    setDatePicker(false);
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <View style={styles.rowGap}>
          {currentMonth != null ? (
            <Carousel
              width={verticalScale(100)}
              height={verticalScale(40)}
              data={months}
              scrollAnimationDuration={100}
              onSnapToItem={(index) => {
                if (newMonth === 0 && index == 11) {
                  setCurrentYear(newYear - 1);
                } else if (newMonth === 11 && index == 0) {
                  setCurrentYear(newYear + 1);
                }
                setCurrentMonth(index);
              }}
              defaultIndex={newMonth}
              renderItem={({}) => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Pressable onPress={() => setDatePicker(true)}>
                    <Text style={styles.text}>{dateItem()}</Text>
                  </Pressable>
                </View>
              )}
            />
          ) : (
            <Carousel
              width={verticalScale(100)}
              height={verticalScale(40)}
              data={years}
              scrollAnimationDuration={100}
              onSnapToItem={(index) => {
                setCurrentYear(years[index]);
              }}
              snapEnabled={true}
              defaultIndex={years.indexOf(newYear)}
              renderItem={({}) => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Pressable onPress={() => setDatePicker(true)}>
                    <Text style={styles.text}>{dateItem()}</Text>
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
        {datePicker && (
          <ModalCustom modalVisible={datePicker} setModalVisible={setDatePicker} size={6} hasColor={false}>
            <View
              style={{
                gap: 20,
                padding: 20,
                backgroundColor: dark.complementarySolid,
                borderRadius: commonStyles.borderRadius,
              }}
            >
              {currentYear != null && (
                <ScrollView
                  style={{ maxHeight: 20 }}
                  ref={refYear}
                  onContentSizeChange={() => refYear.current.scrollTo({ x: newYear * 55, animated: true })}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 5 }}
                  snapToInterval={55}
                >
                  {years.map((year) => (
                    <Pressable
                      key={year}
                      onPress={() => {
                        handleYearClick(year);
                      }}
                      style={{ ...styles.calendarMonthContainer, backgroundColor: year === newYear ? dark.secundary : "transparent" }}
                    >
                      <Text style={{ color: dark.textPrimary, textAlign: "center", fontSize: 14, fontWeight: year === year ? "bold" : "normal" }}>{year}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
              {currentMonth != null && (
                <ScrollView
                  style={{ maxHeight: 20 }}
                  ref={refMonth}
                  onContentSizeChange={() => refMonth.current.scrollTo({ x: newMonth * 55, animated: true })}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 5 }}
                  snapToInterval={55}
                >
                  {months.map((month, index) => (
                    <Pressable
                      key={month}
                      onPress={() => {
                        handleMonthClick(index);
                      }}
                      style={{ ...styles.calendarMonthContainer, backgroundColor: month === months[newMonth] ? dark.secundary : "transparent" }}
                    >
                      <Text style={{ color: dark.textPrimary, textAlign: "center", fontSize: 14, fontWeight: month === months[month] ? "bold" : "normal" }}>{month}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
              <Button style={{ backgroundColor: dark.button, borderRadius: commonStyles.borderRadius }} onPress={handleDate}>
                <Text style={{ color: dark.textPrimary }}>Ok</Text>
              </Button>
            </View>
          </ModalCustom>
        )}
      </View>
    </View>
  );
}
