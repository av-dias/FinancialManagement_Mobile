import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  ViewStyle,
} from "react-native";
import { _styles } from "./style";

type CustomButtonProps = {
  handlePress: () => void;
  text?: string;
  addStyle?: ViewStyle; // Add any additional styling here, e.g., borderRadius, backgroundColor, etc.
};

export default function CustomButton({
  handlePress,
  text = "Save",
  addStyle = {},
}: CustomButtonProps) {
  const styles = _styles;

  return (
    <View style={styles.submitButton}>
      <Pressable
        style={{ ...styles.button, ...addStyle }}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}
