import { View, ScrollView, Pressable, Text } from "react-native";
import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { dark } from "../../utility/colors";
import { useRef, useState } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";

type FlatCalendarProps = {
  setInputBuyDate: React.Dispatch<React.SetStateAction<any>>;
};

export const FlatCalendar = ({ setInputBuyDate }: FlatCalendarProps) => {
  const refMonth = useRef<ScrollView>();
  const refDate = useRef<ScrollView>();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentDate, setCurrentDate] = useState(new Date().getDate());
  const styles = _styles;

  function getDaysOfMonthAndWeek() {
    const daysInMonth = new Date(2024, currentMonth + 1, 0).getDate();
    // 0 (Sunday) to 6 (Saturday)
    const firstDayOfMonth = new Date(2024, currentMonth, 1).getDay();

    const days = [];
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < daysInMonth; i++) {
      const dayOfWeekIndex = (firstDayOfMonth + i) % 7;
      days.push({
        dayOfWeek: daysOfWeek[dayOfWeekIndex],
        date: i + 1,
      });
    }

    return days;
  }

  useFocusEffect(
    React.useCallback(() => {
      const today = new Date();
      const buyDate = new Date(Date.UTC(today.getFullYear(), currentMonth, currentDate));
      buyDate.setUTCHours(0, 0, 0, 0); // Set UTC hours, minutes, seconds, milliseconds to 0
      setInputBuyDate(buyDate);
    }, [currentDate, currentMonth])
  );

  return (
    <View style={{ gap: 10, marginBottom: -5 }}>
      <ScrollView
        ref={refMonth}
        onContentSizeChange={() => refMonth.current.scrollTo({ x: currentMonth * 55, animated: true })}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
        snapToInterval={55}
      >
        {months.map((month, index) => (
          <Pressable key={month} onPress={() => setCurrentMonth(index)} style={{ ...styles.calendarMonthContainer, backgroundColor: month === months[currentMonth] ? dark.secundary : "transparent" }}>
            <Text style={{ color: dark.textPrimary, textAlign: "center", fontSize: 12, fontWeight: month === months[currentMonth] ? "bold" : "normal" }}>{month}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        ref={refDate}
        onContentSizeChange={() => refDate.current.scrollTo({ x: (currentDate - 1) * 55, animated: true })}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}
        snapToInterval={55}
      >
        {getDaysOfMonthAndWeek()?.map((item) => (
          <Pressable
            key={item.date}
            onPress={() => setCurrentDate(item.date)}
            style={{ ...styles.calendarBox, marginVertical: item.date === currentDate ? 5 : 10, backgroundColor: item.date === currentDate ? dark.secundary : dark.complementary }}
          >
            <Text style={styles.primaryText}>{item.dayOfWeek}</Text>
            <Text style={styles.primaryTextDates}>{item.date}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
