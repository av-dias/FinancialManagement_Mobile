import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { _styles } from "../utility/style";

export default function Header(props) {
  const styles = _styles;

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerText}>{props.email}</Text>
      </View>
      <View>
        <MaterialIcons
          name="logout"
          size={20}
          color="white"
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        />
      </View>
    </View>
  );
}
