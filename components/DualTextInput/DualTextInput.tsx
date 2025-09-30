import { View, Text, TextInput } from "react-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import CardWrapper from "../cardWrapper/cardWrapper";
import { styles } from "./style";
import { verticalScale } from "../../functions/responsive";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable } from "react-native";
import { useRef, useState } from "react";
import { loadTimer } from "../../utility/timer";

export type textInputType = {
  value: string;
  setValue: (value: string) => any;
  suggestedName?: string;
  onBlurHandle: () => any;
  placeholder: string;
  icon: any;
  editable?: boolean;
};

type DualTextInputProps = {
  values: textInputType[];
  capitalize?: "none" | "sentences" | "words" | "characters";
  textAlign?: "left" | "center" | "right"; // align text to left, center, or right in text input field. Default is center.
  keyboardType?: "default" | "numeric"; // type of keyboard to show. Default is default.
  direction?: "row" | "column";
  gap?: number;
};

const loadCardSize = (
  direction: "row" | "column",
  isFocused: string,
  key: string
) => {
  if (direction === "row") return isFocused === key ? 3 : 1;
  else {
    return 0;
  }
};

export default function DualTextInput({
  values = [],
  direction = "row",
  capitalize = "words",
  textAlign = "left",
  keyboardType = "default",
  gap = 15,
}: DualTextInputProps) {
  const [isFocused, setIsFocused] = useState<string>(null);
  const timeoutRef = useRef(null);

  // Allows to trigger isFocus reset
  const resetFocusTimer = () =>
    loadTimer(timeoutRef, () => setIsFocused(null), 2000);

  /* Refrator code to have generic onBlur Handle */
  return (
    <View style={{ width: "100%", flexDirection: direction, gap: gap }}>
      {values.map((data) => (
        <CardWrapper
          key={data.placeholder}
          style={{
            flex: loadCardSize(direction, isFocused, data.placeholder),
            borderRadius: commonStyles.borderRadius,
            backgroundColor: dark.glass,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderRadius: commonStyles.borderRadius,
              alignItems: "center",
            }}
          >
            <View style={{ paddingHorizontal: verticalScale(10) }}>
              {data.icon}
            </View>
            <View style={{ flex: 1, paddingRight: verticalScale(10) }}>
              <TextInput
                style={{ ...styles.textInput, textAlign: textAlign }}
                ref={(input) => {
                  this.textInputName = input;
                }}
                value={data.value}
                placeholder={data.placeholder}
                placeholderTextColor={"gray"}
                editable={data.editable}
                keyboardType={keyboardType}
                autoCapitalize={capitalize}
                onChangeText={(v) => {
                  data.setValue(v);
                  setIsFocused(data.placeholder);
                  resetFocusTimer();
                }}
                onBlur={data.onBlurHandle}
                onFocus={() => {
                  setIsFocused(data.placeholder);
                  resetFocusTimer();
                }}
                onPressIn={() => {
                  setIsFocused(data.placeholder);
                  resetFocusTimer();
                }}
              />
            </View>
            {data?.suggestedName && (
              <Pressable
                style={styles.suggestBtn}
                onPress={() => data.setValue(data.suggestedName)}
              >
                <Text style={{ color: dark.white }}>{data.suggestedName}</Text>
              </Pressable>
            )}
            {data?.editable !== false &&
              data?.value &&
              data?.value?.trim() !== "" && (
                <Pressable
                  style={{ paddingRight: verticalScale(10) }}
                  onPress={() => data.setValue("")}
                >
                  <AntDesign
                    name="closecircleo"
                    size={15}
                    color={dark.textPrimary}
                  />
                </Pressable>
              )}
          </View>
        </CardWrapper>
      ))}
    </View>
  );
}
