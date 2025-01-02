import { Text, View } from "react-native";
import React from "react";

import { _styles } from "./style";
import { verticalScale } from "../../functions/responsive";
import Carousel from "react-native-reanimated-carousel";

type TypeCardProps = {
  setItem: React.Dispatch<React.SetStateAction<any>>;
  itemList: any[];
  defaultValue?: number;
};

export default function TypeCard({ setItem, itemList, defaultValue = null }: TypeCardProps) {
  const styles = _styles;

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarBox}>
        <View style={styles.rowGap}>
          <Carousel
            width={verticalScale(100)}
            height={verticalScale(40)}
            data={itemList}
            scrollAnimationDuration={100}
            onSnapToItem={(index) => {
              setItem(itemList[index]);
            }}
            defaultIndex={defaultValue ? itemList.findIndex((i) => i == defaultValue) : 0}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Text style={styles.text}>{itemList[index]}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
