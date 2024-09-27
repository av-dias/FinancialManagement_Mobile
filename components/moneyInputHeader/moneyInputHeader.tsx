import { Text, View, TextInput } from "react-native";
import { _styles } from "./style";
import { verticalScale } from "../../functions/responsive";

export default function MoneyInputHeader({ value = "", setValue, signal = "+", verticalHeight = 150 }) {
  const styles = _styles;

  return (
    <View style={{ ...styles.rowNoBorder, height: verticalScale(verticalHeight), paddingTop: 20 }}>
      <Text style={styles.symbolBig}>{signal}</Text>
      <TextInput
        ref={(input) => {
          this.textInputValue = input;
        }}
        keyboardType="numeric"
        style={[styles.valueInput, { color: signal != "+" ? "lightblue" : "white" }]}
        placeholderTextColor={signal != "+" ? "lightblue" : "white"}
        placeholder="0"
        onChangeText={setValue}
        value={value}
      />
      <Text style={styles.symbolBig}>€</Text>
    </View>
  );
}
