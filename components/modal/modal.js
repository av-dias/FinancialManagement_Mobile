import { View, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { _styles } from "./style";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";
import Modal from "react-native-modal";

export default function ModalCustom({ modalVisible, setModalVisible, size = 3, hasColor = true, color = "transparent", padding = 0, paddingBottom = 0, children }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      style={{ margin: 0 }}
      propagateSwipe
      statusBarTranslucent
      deviceHeight={Dimensions.get("window").height * 2}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: padding, paddingBottom: paddingBottom }}>
        <TouchableOpacity style={{ flex: 5 }} onPress={() => setModalVisible(!modalVisible)} />
        <View
          style={{
            backgroundColor: hasColor ? dark.backgroundLight : color,
            flex: size,
            width: "100%",
            padding: commonStyles.paddingHorizontal,
            borderRadius: commonStyles.borderRadius,
          }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}
