import { Text, View, Pressable, Dimensions } from "react-native";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Entypo } from "@expo/vector-icons";
import { Slider } from "@rneui/themed";

import { _styles } from "./style";
import { color } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";

export default function SplitSlider({
  value,
  setModalVisible,
  setModalContentFlag,
  splitStatus,
  setSplitStatus,
  slider,
  setSlider,
  size,
  userInfo = true,
}) {
  const styles = _styles;

  return (
    <CardWrapper style={{ ...styles.cardWrapperSlider, backgroundColor: splitStatus ? color.complementary : "#333333", height: size }}>
      <View style={{ ...styles.row, justifyContent: "space-evenly", zIndex: -1, backgroundColor: "transparent" }}>
        {userInfo && (
          <Pressable
            disabled={splitStatus ? false : true}
            onPress={() => {
              setModalVisible(true);
              setModalContentFlag("split_info");
            }}
            style={{
              position: "absolute",
              right: verticalScale(10),
              width: verticalScale(35),
              padding: 5,
              backgroundColor: "transparent",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <AntDesign name="plus" size={verticalScale(20)} color="black" />
          </Pressable>
        )}
        <Pressable
          style={{
            ...styles.button,
            backgroundColor: splitStatus ? color.secundary : "gray",

            width: "25%",
            maxWidth: 100,
            alignSelf: "center",
            paddingVertical: verticalScale(8),
          }}
          onPress={async () => {
            setSplitStatus(!splitStatus);
            setSlider(50);
          }}
        >
          <Text>Split {splitStatus ? slider + "%" : ""}</Text>
        </Pressable>
        <Pressable
          disabled={splitStatus ? false : true}
          onPress={() => {
            setSlider(50);
          }}
          style={{
            position: "absolute",
            left: verticalScale(10),
            width: verticalScale(35),
            padding: 6,
            backgroundColor: "transparent",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <MaterialCommunityIcons name="fraction-one-half" size={verticalScale(15)} color="black" />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 10, flexDirection: "row", backgroundColor: "transparent", justifyContent: "center" }}>
        <View
          style={{
            alignSelf: "center",
            borderRadius: commonStyles.borderRadius,
            paddingHorizontal: verticalScale(15),
            paddingVertical: verticalScale(10),
            width: verticalScale(70),
          }}
        >
          <Text style={{ fontSize: verticalScale(8), textAlign: "center" }}>{(value * (100 - slider)) / 100}</Text>
        </View>
        <Slider
          value={slider}
          onValueChange={setSlider}
          maximumValue={100}
          minimumValue={0}
          step={1}
          disabled={splitStatus ? false : true}
          allowTouchTrack={!splitStatus ? false : true}
          trackStyle={{ height: 5, backgroundColor: "transparent" }}
          thumbStyle={{ height: verticalScale(32), width: verticalScale(32), backgroundColor: "transparent" }}
          thumbProps={{
            children: <AntDesign name="pausecircle" size={verticalScale(30)} color="black" />,
          }}
          style={{ flex: 1, backgroundColor: "transparent", height: "100%" }}
        />
        <View
          style={{
            alignSelf: "center",
            borderRadius: 50,
            paddingHorizontal: verticalScale(15),
            paddingVertical: verticalScale(10),
            width: verticalScale(70),
          }}
        >
          <Text style={{ fontSize: verticalScale(8), textAlign: "center" }}>{(value * slider) / 100}</Text>
        </View>
      </View>
    </CardWrapper>
  );
}
