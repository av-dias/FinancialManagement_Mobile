import { View, Text } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import { ReactNode } from "react";

type MainCardPropsType = {
  title: string;
  icon: ReactNode;
  value: string;
  absoluteIncrease: string;
  relativeIncrease: string;
};

export const MainCard = (content: MainCardPropsType) => (
  <CardWrapper style={{ flexDirection: "row", padding: 25, width: "100%", height: 150, justifyContent: "start" }}>
    <View style={{ flex: 2, justifyContent: "center", backgroundColor: "transparent", padding: 10 }}>
      <Text style={{ fontSize: 50, fontWeight: "bold", color: dark.textSecundary }}>{content.value}</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {content.icon}
        <Text style={{ fontSize: 20, color: dark.textPrimary }}>{content.title}</Text>
      </View>
    </View>
    <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "transparent", alignItems: "flex-end", padding: 10 }}>
      <Text style={{ fontSize: 20, color: dark.textPrimary }}>{content.absoluteIncrease}</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ justifyContent: "center" }}>
          <Entypo name="arrow-long-up" size={20} color="green" />
        </View>
        <Text style={{ fontSize: 20, color: dark.textPrimary }}>{content.relativeIncrease}</Text>
      </View>
    </View>
  </CardWrapper>
);
