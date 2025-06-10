import React from "react";
import { View, Pressable } from "react-native";
import { CustomTitle } from "../../../components/customTitle/CustomTitle";
import { styles } from "../styles";

export const TradeHeaderOptions = ({ setModalVisible, setModalType }) => {
  return (
    <View style={styles.headerOptions}>
      <Pressable
        onPress={() => {
          setModalVisible(true);
          setModalType("Security");
        }}
        style={styles.optionBtnStyle}
      >
        <CustomTitle textStyle={{ padding: 5 }} title="Security" />
      </Pressable>
      <Pressable
        onPress={() => {
          setModalVisible(true);
          setModalType("Trade");
        }}
        style={styles.optionBtnStyle}
      >
        <CustomTitle textStyle={{ padding: 5 }} title="Trade" />
      </Pressable>
    </View>
  );
};
