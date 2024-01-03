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
                <Text style={{ textAlign: "center", fontSize: verticalScale(15) }}>{itemList[index]}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
