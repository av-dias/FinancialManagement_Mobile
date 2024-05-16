import { Text, View, Pressable } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { Entypo } from "@expo/vector-icons";
import commonStyles from "../../utility/commonStyles";

export default function ModalSplit(list, value, email, modalContentFlag, modalVisible, setModalVisible, splitName, slider, styles) {
  return (
    <View style={{ flex: 4, backgroundColor: "transparent", borderRadius: commonStyles.borderRadius, padding: verticalScale(30), gap: 20 }}>
      <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
        <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
          <Entypo name="cross" size={verticalScale(20)} color="black" />
        </Pressable>
      </View>
      <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
        <Text style={{ fontSize: 15 }}>Split with</Text>
        <Text style={{ fontSize: 15 }}>{splitName}</Text>
        <Text style={{ fontSize: 15 }}>Amount: {(value * slider) / 100}</Text>
        <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
      </View>
      <View style={{ flex: 1, padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
        <Text style={{ fontSize: 15 }}>You</Text>
        <Text style={{ fontSize: 15 }}>{email}</Text>
        <Text style={{ fontSize: 15 }}>Amount: {(value * (100 - slider)) / 100}</Text>
        <View style={{ flex: 1, justifyContent: "center", alignContent: "center", backgroundColor: "transparent" }}></View>
      </View>
    </View>
  );
}
