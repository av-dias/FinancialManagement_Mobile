import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { _styles } from "./style";

export default function CustomButton({ handlePress, text = "Submit" }) {
  const styles = _styles;

  return (
    <View style={styles.submitButton}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    </View>
  );
}
