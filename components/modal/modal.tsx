import { View, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { _styles } from "./style";
import commonStyles from "../../utility/commonStyles";
import { dark } from "../../utility/colors";
import Modal from "react-native-modal";
import { ReactNode } from "react";
import { NotificationBox } from "../NotificationBox/NotificationBox";

type ModalCustom = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseCallback?: () => void;
  size?: number;
  hasColor?: boolean;
  color?: any;
  padding?: number;
  paddingBottom?: number;
  children: ReactNode;
};

export default function ModalCustom({
  modalVisible,
  setModalVisible,
  onCloseCallback = () => {},
  size = 3,
  hasColor = true,
  color = "transparent",
  padding = 0,
  paddingBottom = 0,
  children,
}) {
  return (
    <Modal
      animationOut="bounceIn"
      isVisible={modalVisible}
      onBackdropPress={() => {
        setModalVisible(!modalVisible);
        onCloseCallback();
      }}
      style={{ margin: 0 }}
      propagateSwipe
      statusBarTranslucent
      deviceHeight={Dimensions.get("window").height * 2}
    >
      <NotificationBox />
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          padding: padding,
          paddingBottom: paddingBottom,
        }}
      >
        <TouchableOpacity
          style={{ flex: 5 }}
          onPress={() => {
            setModalVisible(!modalVisible);
            onCloseCallback();
          }}
        />
        <View
          style={{
            backgroundColor: hasColor ? dark.backgroundLight : color,
            flex: size,
            width: "100%",
            padding: commonStyles.paddingHorizontal,
            paddingVertical: 20,
            borderRadius: commonStyles.borderRadius,
          }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
