import { Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";

import { _styles } from "./style";
import { months } from "../../utility/calendar";
import { horizontalScale, verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";
import ModalCustom from "../modal/modal";
import { color } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export default function TypeCard({ setItem, itemList }) {
  const styles = _styles;
  const [datePicker, setDatePicker] = useState(false);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <View style={styles.rowGap}>
          <Carousel
            width={verticalScale(100)}
            height={verticalScale(40)}
            data={itemList}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => {
              setItem(itemList[index]);
            }}
            defaultIndex={0}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Pressable onPress={() => setDatePicker(true)}>
                  <Text style={{ textAlign: "center", fontSize: verticalScale(15) }}>{itemList[index]}</Text>
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
                backgroundColor: color.complementary,
                borderRadius: commonStyles.borderRadius,
              }}
            >
              <View style={{ width: verticalScale(120), height: verticalScale(70) }}>
                <ScrollView vertical={true}>
                  {months.map((month, index) => {
                    return (
                      <Pressable
                        key={"P" + month}
                        style={{ backgroundColor: color.complementary, paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
                        onPress={() => {
                          setItem(index);
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
                        style={{ backgroundColor: color.complementary, paddingVertical: verticalScale(5), marginVertical: verticalScale(5) }}
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
