import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { categoryIcons, utilIcons } from "../../assets/icons";
import { horizontalScale, verticalScale, moderateScale } from "../../functions/responsive";
import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";
import { color } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

export default ListItem = ({ innerData, handleSplit, handleEdit, showAlert, keys, gray = false }) => {
  const styles = _styles;
  let iconComponent;
  if (innerData.type && innerData.dop) iconComponent = categoryIcons(20).find((category) => category.label === innerData.type);
  else {
    if (!innerData.user_origin_id) {
      iconComponent = utilIcons().find((type) => type.label === "Transaction");
      innerData.amount = "-" + innerData.amount;
    } else {
      iconComponent = utilIcons().find((type) => type.label === "Received");
      innerData.amount = "+" + innerData.amount;
    }
  }
  return (
    <Pressable
      key={keys + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
      style={{ ...styles.button, backgroundColor: color.complementary, borderRadius: commonStyles.borderRadius }}
      onPress={showAlert}
    >
      <View style={styles.rowGap}>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <View
            style={{
              width: verticalScale(40),
              maxWidth: 50,
              height: verticalScale(40),
              maxHeight: 50,
              backgroundColor: gray ? "lightgray" : iconComponent.color,
              borderRadius: commonStyles.borderRadius,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            {iconComponent.icon}
          </View>

          <View style={{ justifyContent: "center" }}>
            <Text style={styles.buttonText}>{innerData.name || innerData.description}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <View style={{ justifyContent: "center", flex: 1, backgroundColor: "transparent", alignItems: "flex-end" }}>
            <Text style={styles.buttonText}>{(innerData.value || innerData.amount) + " €"}</Text>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              width: verticalScale(40),
              maxWidth: 70,
              height: verticalScale(40),
              maxHeight: 50,
              borderRadius: commonStyles.borderRadius,
              borderWidth: keys == KEYS_SERIALIZER.ARCHIVE_PURCHASE && innerData.split ? 1 : 0,
              justifyContent: "flex-end",
              backgroundColor: "transparent",
            }}
          >
            {!innerData.split && keys === KEYS_SERIALIZER.PURCHASE ? (
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
                onPress={handleSplit}
              >
                {utilIcons(verticalScale(20)).find((type) => type.label === "Split").icon}
              </Pressable>
            ) : null}
            {innerData.split ? (
              <View
                style={{
                  width: verticalScale(40),
                  maxWidth: 50,
                  height: verticalScale(40),
                  maxHeight: 50,
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  alignContent: "center",
                }}
              >
                <Text style={styles.text}>{innerData.split.weight + "%"}</Text>
              </View>
            ) : null}
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
