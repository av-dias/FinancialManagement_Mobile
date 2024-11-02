import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { utilIcons } from "../../../../utility/icons";
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
  handlePress: () => void;
};

export const IncomeItem = ({ incomeData, handleEdit, handlePress }: IncomeItemProps) => {
  const styles = _styles;
  let iconComponent = utilIcons(25).find((category) => category.label === "Income");

  const handleAlert = () => {
    Alert.alert("Delete Income", `Are you sure you want to remove this income permanently?\n\nName: ${incomeData.name}\nAmount: ${incomeData.amount}`, [
      {
        text: `Yes`,
        onPress: () => handlePress(),
      },
      { text: "No", onPress: () => {}, style: "cancel" },
    ]);
  };

  return (
    <Pressable
      key={incomeData.id}
      style={{
        ...styles.button,
        backgroundColor: dark.complementary,
        borderRadius: commonStyles.borderRadius,
      }}
      onPress={handleAlert}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <TypeIcon icon={iconComponent} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.buttonText}>{getLabel(incomeData)}</Text>
            <Text style={styles.amountText}>{`+${getValue(incomeData)}€`}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1 }}>
          <View style={styles.optionsContainer}>
            <Pressable style={styles.editContainer} onPress={handleEdit}>
              {utilIcons(verticalScale(20)).find((type) => type.label === "Edit").icon}
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
