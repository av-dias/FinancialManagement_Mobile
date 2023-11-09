import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { categoryIcons, utilIcons } from "../../assets/icons";
import { horizontalScale, verticalScale, moderateScale } from "../../functions/responsive";
import { _styles } from "./style";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";
import { KEYS } from "../../utility/storageKeys";

export default ListItem = ({ innerData, handleSplit, showAlert, keys, gray = false }) => {
  const styles = _styles;
  return (
    <Pressable
      key={keys + KEYS_SERIALIZER.TOKEN_SEPARATOR + innerData.index}
      style={{ ...styles.button, backgroundColor: gray ? "lightgray" : "white" }}
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
              backgroundColor: "transparent",
              borderRadius: 10,
              borderWidth: 1,
              justifyContent: "center",
            }}
          >
            {innerData.type
              ? categoryIcons(20).find((category) => category.label === innerData.type).icon
              : utilIcons().find((type) => type.label === "Transaction").icon}
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.buttonText}>{innerData.name || innerData.description}</Text>
          </View>
        </View>
        <View style={{ ...styles.row, flex: 1, backgroundColor: "transparent" }}>
          <View style={{ justifyContent: "center", flex: 1, backgroundColor: "transparent", alignItems: "flex-end" }}>
            <Text style={styles.buttonText}>{(innerData.value || innerData.amount) + " €"}</Text>
          </View>
          {keys == KEYS_SERIALIZER.PURCHASE ? (
            <View
              style={{
                flex: 2,
                alignContent: "center",
                alignItems: "center",
                width: verticalScale(40),
                maxWidth: 50,
                height: verticalScale(40),
                maxHeight: 50,
                borderRadius: 20,
                borderWidth: 1,
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            >
              {innerData.split ? (
                <Text style={styles.text}>{innerData.split.weight + "%"}</Text>
              ) : (
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
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 2,
                alignContent: "center",
                alignItems: "center",
                width: verticalScale(40),
                maxWidth: 50,
                height: verticalScale(40),
                maxHeight: 50,
                borderRadius: 20,
                borderWidth: 0,
                justifyContent: "center",
                backgroundColor: "transparent",
              }}
            ></View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
