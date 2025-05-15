import { Text, View, Pressable, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Button } from "react-native-paper";

import { _styles } from "./style";
import {
  calendarDateRange,
  calendarOffset,
  calendarYearsRange,
  months,
  prevYearsRange,
  years,
} from "../../utility/calendar";
import { verticalScale } from "../../functions/responsive";
import ModalCustom from "../modal/modal";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { DateFormat } from "../../models/basicUtils";

/**
 * DateItem Shows date item on calendar date picker
 * @param value Value to show on item
 * @param handleCallback item press callback
 * @param conditionLogic condition logic to display selected item
 */
const DateItem = ({ value, handleCallback, conditionLogic }) => (
  <Pressable
    key={value}
    onPress={() => handleCallback()}
    style={{
      ..._styles.calendarMonthContainer,
      backgroundColor: conditionLogic ? dark.secundary : "transparent",
    }}
  >
    <Text
      style={{
        color: dark.textPrimary,
        textAlign: "center",
        fontSize: 14,
        fontWeight: conditionLogic ? "bold" : "normal",
      }}
    >
      {value}
    </Text>
  </Pressable>
);

/**
 * DatePickerScrollView for readability
 * @param refDate scrollview reference to scroll to
 * @param newValue new date value
 * @param children children components to load
 */
const DatePickerScrollView = ({ refDate, newValue, children }) => (
  <ScrollView
    style={{ maxHeight: 20 }}
    ref={refDate}
    onContentSizeChange={() =>
      refDate.current.scrollTo({
        x: newValue * 55,
        animated: true,
      })
    }
    horizontal={true}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ gap: 5 }}
    snapToInterval={55}
  >
    {children}
  </ScrollView>
);

export default function CalendarCard({
  monthState: [currentMonth, setCurrentMonth],
  yearState: [currentYear, setCurrentYear],
}) {
  const styles = _styles;
  const refMonth = useRef<ScrollView>();
  const refYear = useRef<ScrollView>();
  const refCarousel = useRef<ICarouselInstance>();
  const deviceTodayYear = new Date().getFullYear();
  const monthOffset = currentMonth ? 12 : 1; // If we are using months we need to offset

  const [datePicker, setDatePicker] = useState(false);
  const [newMonth, setNewMonth] = useState(currentMonth);
  const [newYear, setNewYear] = useState(currentYear);
  const [dateOffset] = useState(
    (prevYearsRange - calendarOffset) * monthOffset
  );
  const [dateRange] = useState<DateFormat[]>(
    currentMonth ? calendarDateRange : calendarYearsRange
  );
  const [defaultIndex] = useState(
    dateOffset + (currentYear - deviceTodayYear) * monthOffset + currentMonth
  );

  const handleMonthClick = (index: number) => {
    if (currentMonth != null) setNewMonth(index);
  };

  const handleYearClick = (year: number) => {
    if (currentYear != null) setNewYear(year);
  };

  /**
   * HandleDate manages the carousel index by
   * calculating the deviation between the new
   * year and new month in relation with current
   */
  const handleDate = () => {
    // If we are using month then we need to check the deviation
    // Otherwise lets keep it zero
    const monthChange = currentMonth ? newMonth - currentMonth : 0;
    // Check year deviation and multiple with offset
    // This is because when we use months a change in
    // One year refers to 12 positions in the range array
    refCarousel.current.scrollTo({
      count: (newYear - currentYear) * monthOffset + monthChange,
    });

    if (currentMonth != null) setCurrentMonth(newMonth);
    if (currentYear != null) setCurrentYear(newYear);
    setDatePicker(false);
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <Carousel
          ref={refCarousel}
          width={verticalScale(100)}
          height={verticalScale(40)}
          data={dateRange}
          scrollAnimationDuration={100}
          defaultIndex={defaultIndex === -1 ? 0 : defaultIndex}
          renderItem={(element) => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              <Pressable onPress={() => setDatePicker(true)}>
                <Text style={styles.text}>{`${
                  currentMonth ? element.item.month : ""
                } ${element.item.year}`}</Text>
              </Pressable>
            </View>
          )}
          onSnapToItem={(index) => {
            if (currentMonth !== null && currentMonth !== undefined) {
              const month = dateRange[index].month;
              const year = dateRange[index].year;
              setCurrentYear(year);
              setCurrentMonth(months.findIndex((v) => v === month));
            } else {
              const year = dateRange[index].year;
              setCurrentYear(year);
            }
          }}
        />
        {datePicker && (
          <ModalCustom
            modalVisible={datePicker}
            setModalVisible={setDatePicker}
            size={6}
            hasColor={false}
          >
            <View
              style={{
                gap: 20,
                padding: 20,
                backgroundColor: dark.complementarySolid,
                borderRadius: commonStyles.borderRadius,
              }}
            >
              {currentYear != null && (
                <DatePickerScrollView refDate={refYear} newValue={newYear}>
                  {years.map((year: number) => (
                    <DateItem
                      key={year}
                      value={year}
                      handleCallback={() => handleYearClick(year)}
                      conditionLogic={year === newYear}
                    />
                  ))}
                </DatePickerScrollView>
              )}
              {currentMonth != null && (
                <DatePickerScrollView refDate={refMonth} newValue={newMonth}>
                  {months.map((month: string, index: number) => (
                    <DateItem
                      key={month}
                      value={month}
                      handleCallback={() => handleMonthClick(index)}
                      conditionLogic={month === months[newMonth]}
                    />
                  ))}
                </DatePickerScrollView>
              )}
              <Button
                style={{
                  backgroundColor: dark.button,
                  borderRadius: commonStyles.borderRadius,
                }}
                onPress={handleDate}
              >
                <Text style={{ color: dark.textPrimary }}>Ok</Text>
              </Button>
            </View>
          </ModalCustom>
        )}
      </View>
    </View>
  );
}
