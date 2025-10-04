import React from "react";
import { View } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import Carrossel from "../../../components/carrossel/carrossel";
import { EvilIcons } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import { IconButton } from "../../../components/iconButton/IconButton";
import { verticalScale } from "../../../functions/responsive";

export const SecurityFilter = ({
  selectedTicker,
  noFilter,
  setSelectedTicker,
  securityItems,
  onLongPress,
}) => {
  return (
    <View style={{ flexDirection: "row", gap: 5, paddingBottom: 20 }}>
      <CardWrapper
        style={{
          width: verticalScale(60),
          aspectRatio: 1,
          alignItems: "center",
          backgroundColor:
            selectedTicker === noFilter ? dark.secundary : dark.complementary,
        }}
      >
        <IconButton
          addStyle={{ backgroundColor: "transparent", paddingBottom: 5 }}
          icon={<EvilIcons name="search" size={30} color="white" />}
          onPressHandle={() => setSelectedTicker(noFilter)}
        />
      </CardWrapper>
      <View style={{ flex: 1 }}>
        <Carrossel
          items={securityItems}
          type={selectedTicker}
          setType={setSelectedTicker}
          size={verticalScale(60)}
          iconBackground={dark.complementary}
          onLongPress={onLongPress}
        />
      </View>
    </View>
  );
};
