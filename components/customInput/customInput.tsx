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
  secureTextEntry?: boolean;
  textAlign?: "left" | "center" | "right"; // align text to left, center, or right in text input field. Default is center.
};

export default function CustomInput({
  Icon,
  placeholder,
  value = "",
  editable = true,
  setValue,
  noStyle = false,
  capitalize = "none",
  secureTextEntry = false,
  textAlign = "center",
}: CustomInputProps) {
  const styles = _styles;

  return (
    <CardWrapper noStyle={noStyle}>
      <View style={{ ...styles.row, backgroundColor: "transparent" }}>
        <View style={{ flex: 2, backgroundColor: "transparent", justifyContent: "center", alignSelf: "center" }}>{Icon}</View>
        <TextInput
          style={{ ...styles.textInput, textAlign: textAlign }}
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          ref={(input) => {
            this.textInputName = input;
          }}
          value={value}
          onChangeText={setValue}
          editable={editable}
          autoCapitalize={capitalize}
          secureTextEntry={secureTextEntry}
        />
        <View style={{ flex: 2, backgroundColor: "transparent", justifyContent: "center", alignSelf: "center" }}>{}</View>
      </View>
    </CardWrapper>
  );
}
