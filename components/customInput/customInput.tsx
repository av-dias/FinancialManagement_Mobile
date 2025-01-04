import { View, TextInput, Text } from "react-native";
import { _styles } from "./style";
import CardWrapper from "../cardWrapper/cardWrapper";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

type CustomInputProps = {
  Icon: any;
  placeholder: string;
  value: string;
  editable?: boolean;
  setValue: (value: any) => void;
  noStyle?: boolean;
  capitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  textAlign?: "left" | "center" | "right"; // align text to left, center, or right in text input field. Default is center.
  keyboardType?: "default" | "numeric"; // type of keyboard to show. Default is default.
};

export default function CustomInput({
  Icon,
  placeholder,
  value = "",
  editable = true,
  setValue,
  noStyle = false,
  capitalize = "words",
  secureTextEntry = false,
  textAlign = "center",
  keyboardType = "default",
}: CustomInputProps) {
  const styles = _styles;

  return (
    <CardWrapper noStyle={true}>
      <View style={{ position: "absolute", top: -5, left: 10, zIndex: 1, backgroundColor: dark.complementarySolid, borderRadius: commonStyles.borderRadius }}>{Icon}</View>
      <View style={{ ...styles.row, backgroundColor: "transparent", borderColor: dark.complementarySolid, borderWidth: 1 }}>
        <TextInput
          style={{ ...styles.textInput, textAlign: textAlign }}
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          ref={(input) => {
            this.textInputName = input;
          }}
          value={value?.trimEnd() || value}
          onChangeText={setValue}
          editable={editable}
          autoCapitalize={capitalize}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
    </CardWrapper>
  );
}
