import { View, TextInput } from "react-native";
import { _styles } from "./style";
import CardWrapper from "../cardWrapper/cardWrapper";

type CustomInputProps = {
  Icon: any;
  placeholder: string;
  value: string;
  editable?: boolean;
  setValue: (value: string) => void;
  noStyle?: boolean;
  capitalize?: "none" | "sentences" | "words" | "characters";
};

export default function CustomInput({ Icon, placeholder, value = "", editable = true, setValue, noStyle = false, capitalize = "none" }: CustomInputProps) {
  const styles = _styles;

  return (
    <CardWrapper noStyle={noStyle}>
      <View style={{ ...styles.row, backgroundColor: "transparent" }}>
        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", alignSelf: "center" }}>{Icon}</View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          ref={(input) => {
            this.textInputName = input;
          }}
          value={value}
          onChangeText={setValue}
          editable={editable}
          autoCapitalize={capitalize}
        />
        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", alignSelf: "center" }}>{}</View>
      </View>
    </CardWrapper>
  );
}
