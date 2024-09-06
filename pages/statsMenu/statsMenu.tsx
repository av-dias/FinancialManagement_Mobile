import { View } from "react-native";
import CustomButton from "../../components/customButton/customButton";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { _styles } from "./style";

export default function StatsMenu({ navigation }) {
  const appCtx = useContext(AppContext);
  const styles = _styles;

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ gap: 15, padding: 15 }}>
          <CustomButton
            text="Statistics"
            handlePress={() => {
              navigation.navigate("Statistics");
            }}
          />
          <CustomButton
            text="Budget"
            handlePress={() => {
              navigation.navigate("Budget");
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
