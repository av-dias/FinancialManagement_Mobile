import React from "react";
import { Pressable, Text, View } from "react-native";
import { categoryIcons, utilIcons } from "../../../../utility/icons";
import { verticalScale } from "../../../../functions/responsive";
import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../../../utility/keys";
import { dark } from "../../../../utility/colors";
import commonStyles from "../../../../utility/commonStyles";
import { TypeIcon } from "../../../../components/TypeIcon/TypeIcon";

const getLabel = (innerData) => {
  let name = innerData.name || innerData.description;
  if (name.length > 15) {
    name = name.substring(0, 15);
  }

  return name;
};

const getValue = (innerData) => {
  let value = innerData.value || innerData.amount;

  return Number(value).toFixed(0);
};

export const ListItem = ({ innerData, handleSplit, handleEdit, showAlert, keys, gray = false, handleSettleSplit }) => {
  const styles = _styles;
  let iconComponent;

  if (innerData.type && innerData.dop) iconComponent = categoryIcons(30).find((category) => category.label === innerData.type);
  else {
    if (!innerData.user_origin_id) {
      iconComponent = utilIcons().find((type) => type.label === "Transaction");
      innerData.amount = innerData.amount;
    } else {
      iconComponent = utilIcons().find((type) => type.label === "Received");
      innerData.amount = innerData.amount;
    }
  }

  return (
    <Pressable
      key={keys + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
      style={{
        ...styles.button,
        backgroundColor: dark.complementary,
        borderRadius: commonStyles.borderRadius,
      }}
      onPress={showAlert}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <TypeIcon icon={iconComponent} />
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.buttonText}>{getLabel(innerData)}</Text>
            <Text style={styles.moneyText}>{`-${getValue(innerData)}€`}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <View style={styles.optionsContainer}>
            {!innerData.split && keys === KEYS_SERIALIZER.PURCHASE ? (
              <Pressable style={styles.splitContainer} onPress={handleSplit}>
                {utilIcons(verticalScale(20)).find((type) => type.label === "Split").icon}
              </Pressable>
            ) : null}
            {innerData.split ? (
              <View style={styles.splitContainer}>
                <Text style={styles.text}>{innerData.split.weight + "%"}</Text>
              </View>
            ) : null}
            {innerData.split ? (
              <Pressable style={styles.settleConainer} onPress={handleSettleSplit}>
                {utilIcons(verticalScale(15)).find((type) => type.label === "Settle").icon}
              </Pressable>
            ) : null}
            <Pressable style={styles.editContainer} onPress={handleEdit}>
              {utilIcons(verticalScale(20)).find((type) => type.label === "Edit").icon}
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
