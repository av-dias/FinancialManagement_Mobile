import { View, Text } from "react-native";
import ModalCustom from "../modal/modal";
import CustomButton from "../customButton/customButton";
import { Background } from "victory-native";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";
import { verticalScale } from "../../functions/responsive";
import { AlertData } from "../../constants/listConstants/deleteDialog";

type ModalDialogProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  size?: number;
  data: AlertData;
};

export const ModalDialog = ({
  visible,
  setVisible,
  size = 10,
  data,
}: ModalDialogProps) => {
  const bgColor = dark.complementarySolid;

  return (
    <ModalCustom
      modalVisible={visible}
      setModalVisible={setVisible}
      size={size}
      hasColor={false}
      color={bgColor}
      padding={50}
      paddingBottom={70}
    >
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(10),
          paddingHorizontal: verticalScale(20),
          borderRadius: commonStyles.borderRadius,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {data.title}
          </Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text
            style={{ color: "lightgray", textAlign: "center", fontSize: 18 }}
          >
            {data.content}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <CustomButton
            handlePress={async () => {
              await data.confirmCallback();
              setVisible(false);
            }}
            text={data.confirmText}
            addStyle={{
              width: 80,
              backgroundColor: bgColor,
              borderWidth: 2,
              borderColor: "lightblue",
            }}
          ></CustomButton>
          <CustomButton
            handlePress={() => setVisible(false)}
            text={data.cancelText}
            addStyle={{ width: 80 }}
          ></CustomButton>
        </View>
      </View>
    </ModalCustom>
  );
};
