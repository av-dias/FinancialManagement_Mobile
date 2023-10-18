import { View, TouchableOpacity, Modal } from "react-native";

import { _styles } from "./style";
import commonStyles from "../../utility/commonStyles";
import { color } from "../../utility/colors";

export default function ModalCustom({ modalVisible, setModalVisible, children }) {
  const styles = _styles;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
        <TouchableOpacity style={{ flex: 5 }} onPress={() => setModalVisible(!modalVisible)} />
        <View
          style={{
            backgroundColor: color.backgroundLight,
            flex: 3,
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
