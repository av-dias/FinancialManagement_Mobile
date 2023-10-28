import { Text, View, TextInput } from "react-native";
import { _styles } from "./style";
import { MaterialIcons } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../utility/responsive";
import CardWrapper from "../cardWrapper/cardWrapper";

export default function CustomInput({ Icon, placeholder, value = "", editable = true, setValue }) {
  const styles = _styles;

  return (
    <CardWrapper>
      <View style={{ ...styles.row, backgroundColor: "transparent" }}>
        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", alignSelf: "center" }}>{Icon}</View>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          ref={(input) => {
            this.textInputName = input;
          }}
          value={value}
          onChangeText={setValue}
          editable={editable}
        />
      </View>
    </CardWrapper>
  );
}
