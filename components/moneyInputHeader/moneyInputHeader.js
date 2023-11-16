import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity, ScrollView, Alert } from "react-native";
import { _styles } from "./style";

export default function MoneyInputHeader({ value = "", setValue }) {
  const styles = _styles;

  return (
    <View style={{ ...styles.rowNoBorder, height: 150, backgroundColor: "transparent" }}>
      <Text style={styles.symbolBig}>+</Text>
      <TextInput
        ref={(input) => {
          this.textInputValue = input;
        }}
        keyboardType="numeric"
        style={styles.valueInput}
        placeholderTextColor="white"
        placeholder="0"
        onChangeText={setValue}
        value={value}
      />
      <Text style={styles.symbolBig}>€</Text>
    </View>
  );
}
