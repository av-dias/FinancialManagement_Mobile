import { BlurView } from "@react-native-community/blur";
import { ReactNode } from "react";
import { View, Text, ViewStyle } from "react-native";

type BlurTextProps = {
  text: string | ReactNode;
  privacyShield: boolean;
  style: ViewStyle;
  blurStyle?: ViewStyle;
};

export const BlurText = ({
  text,
  privacyShield,
  style,
  blurStyle,
}: BlurTextProps) => {
  return (
    <View style={style}>
      <Text>{text}</Text>
      <BlurView
        enabled={privacyShield}
        style={[
          {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 100,
          },
          blurStyle,
        ]}
        overlayColor="#00000000"
        blurAmount={10}
        blurRadius={10}
        reducedTransparencyFallbackColor="white"
      ></BlurView>
    </View>
  );
};
