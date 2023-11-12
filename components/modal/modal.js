import { View, TouchableOpacity, Dimensions } from "react-native";

import { _styles } from "./style";
import commonStyles from "../../utility/commonStyles";
import { color } from "../../utility/colors";
import Modal from "react-native-modal";

export default function ModalCustom({ modalVisible, setModalVisible, size = 3, hasColor = true, children }) {
  const styles = _styles;
  return (
    <Modal
      animationType="slide"
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
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
        <TouchableOpacity style={{ flex: 5 }} onPress={() => setModalVisible(!modalVisible)} />
        <View
          style={{
            backgroundColor: hasColor ? color.backgroundLight : "transparent",
            flex: size,
            width: "100%",
            padding: commonStyles.paddingHorizontal,
            borderRadius: 20,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
