import React from "react";
import { Pressable, Text, View } from "react-native";
import { utilIcons } from "../../../../assets/icons";
import { _styles } from "./style";
import { dark } from "../../../../utility/colors";
import commonStyles from "../../../../utility/commonStyles";
import { TypeIcon } from "../../../../components/TypeIcon/TypeIcon";
import { IncomeEntity } from "../../../../store/database/Income/IncomeEntity";
import { verticalScale } from "../../../../functions/responsive";

const getLabel = (innerData: IncomeEntity) => {
  let name = innerData.name;
  if (name.length > 15) {
    name = name.substring(0, 15);
  }

  return name;
};

const getValue = (innerData: IncomeEntity) => {
  return Number(innerData.amount).toFixed(0);
};

type IncomeItemProps = {
  incomeData: IncomeEntity;
  handleEdit: () => void;
};

export const IncomeItem = ({ incomeData, handleEdit }: IncomeItemProps) => {
  const styles = _styles;
  let iconComponent = utilIcons(25).find((category) => category.label === "Income");

  return (
    <Pressable
      key={incomeData.id}
      style={{
        ...styles.button,
        backgroundColor: dark.complementary,
        borderRadius: commonStyles.borderRadius,
      }}
      onPress={() => {}}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <TypeIcon
            icon={iconComponent}
            customStyle={{ padding: 10, backgroundColor: "lightgreen" }}
          />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.buttonText}>{getLabel(incomeData)}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <View
            style={{
              justifyContent: "center",
              flex: 1,
              backgroundColor: "transparent",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.amountText}>{getValue(incomeData) + " €"}</Text>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              width: verticalScale(40),
              maxWidth: 130,
              height: verticalScale(40),
              maxHeight: 50,
              borderRadius: commonStyles.borderRadius,
              justifyContent: "flex-end",
              backgroundColor: "transparent",
            }}
          >
            <Pressable
              style={{
                width: verticalScale(40),
                maxWidth: 50,
                height: verticalScale(40),
                maxHeight: 50,
                justifyContent: "center",
                backgroundColor: "transparent",
                alignContent: "center",
              }}
            ></Pressable>
            <Pressable
              style={{
                width: verticalScale(40),
                maxWidth: 50,
                height: verticalScale(40),
                maxHeight: 50,
                justifyContent: "center",
                backgroundColor: "transparent",
                alignContent: "center",
              }}
              onPress={handleEdit}
            >
              {utilIcons(verticalScale(20)).find((type) => type.label === "Edit").icon}
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
