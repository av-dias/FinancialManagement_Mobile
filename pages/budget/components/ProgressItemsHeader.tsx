import { View, Text } from "react-native";
import CardWrapper from "../../../components/cardWrapper/cardWrapper";
import { _styles } from "../style";
import { ProgressBarColors } from "../../../utility/colors";
import { utilIcons } from "../../../utility/icons";

export const ProgressItemsHeader = () => {
  const styles = _styles;

  return (
    <CardWrapper style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
      <View style={{ padding: 10, paddingLeft: 20, flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Text style={styles.textTitle}>{"Year"}</Text>
        {utilIcons(20, ProgressBarColors.red).find((icon) => icon.label === "Circle")?.icon}
      </View>
      <View style={{ padding: 10, paddingLeft: 20, flexDirection: "row", gap: 10, justifyContent: "center" }}>
        {utilIcons(20, ProgressBarColors.blue).find((icon) => icon.label === "Circle")?.icon}
        <Text style={styles.textTitle}>{"Month"}</Text>
      </View>
    </CardWrapper>
  );
};