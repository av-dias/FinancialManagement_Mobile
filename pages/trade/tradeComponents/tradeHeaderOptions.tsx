import React from "react";
import { View, Pressable, Text } from "react-native";
import { CustomTitle } from "../../../components/customTitle/CustomTitle";
import { styles } from "../styles";
import { dark } from "../../../utility/colors";
import { IconButton } from "../../../components/iconButton/IconButton";

export const TradeHeaderOptions = ({
  setModalVisible,
  setModalType,
  navigation,
}) => {
  const onInvestPressCallback = () => {
    navigation.navigate("Invest");
  };

  return (
    <View style={styles.headerOptions}>
      <IconButton
        addStyle={{
          width: 40,
          backgroundColor: dark.blueAccent,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
        }}
        icon={<Text style={{ color: dark.textPrimary }}>{"<"}</Text>}
        onPressHandle={onInvestPressCallback}
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
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
    </View>
  );
};
