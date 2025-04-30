import { Text, View, TextInput } from "react-native";
import { _styles } from "./style";
import { verticalScale } from "../../functions/responsive";

type MoneyInputHeaderProps = {
  value: string;
  setValue: (value) => void;
  onBlurHandle: () => any;
  signal?: string;
  verticalHeight?: number;
};

export default function MoneyInputHeader({ value = "", setValue, onBlurHandle, signal = "+", verticalHeight = 200 }: MoneyInputHeaderProps) {
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
        onBlur={onBlurHandle}
        value={value}
      />
      <Text style={styles.symbolBig}>€</Text>
    </View>
  );
}
