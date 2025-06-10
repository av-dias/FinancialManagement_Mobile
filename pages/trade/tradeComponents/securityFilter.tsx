import React from "react";
import { View } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import Carrossel from "../../../components/carrossel/carrossel";
import { EvilIcons } from "@expo/vector-icons";
import { dark } from "../../../utility/colors";
import { IconButton } from "../../../components/iconButton/IconButton";

export const SecurityFilter = ({
  selectedTicker,
  noFilter,
  setSelectedTicker,
  securityItems,
}) => {
  return (
    <View style={{ flexDirection: "row", gap: 5, paddingBottom: 20 }}>
      <CardWrapper
        style={{
          width: 60,
          height: 60,
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
          size={60}
          iconBackground={dark.complementary}
        />
      </View>
    </View>
  );
};
