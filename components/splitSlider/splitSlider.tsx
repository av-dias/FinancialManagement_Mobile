import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import { _styles } from "./style";
import { dark } from "../../utility/colors";
import commonStyles from "../../utility/commonStyles";

import CardWrapper from "../../components/cardWrapper/cardWrapper";
import { verticalScale } from "../../functions/responsive";

export default function SplitSlider({
  value,
  splitStatus,
  setSplitStatus,
  slider,
  setSlider,
  size,
}) {
  const styles = _styles;

  return (
    <View style={{ flex: 1, flexDirection: "row", gap: verticalScale(10) }}>
      <CardWrapper
        style={{
          ...styles.cardWrapperSlider,
          flex: 1,
          backgroundColor: splitStatus
            ? dark.complementary
            : dark.complementaryDisable,
          height: size,
        }}
      >
        <View style={{ paddingHorizontal: 5, flexDirection: "row" }}>
          <View
            style={{
              borderRadius: commonStyles.borderRadius,
              paddingHorizontal: verticalScale(10),
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: verticalScale(8),
                textAlign: "center",
                color: dark.textPrimary,
              }}
            >
              {((value * (100 - slider)) / 100).toFixed(1)}
            </Text>
          </View>
          <Slider
            style={{ flex: 1, backgroundColor: "transparent" }}
            value={slider}
            onSlidingComplete={setSlider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            disabled={splitStatus ? false : true}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <View
            style={{
              borderRadius: commonStyles.borderRadius,
              paddingHorizontal: verticalScale(10),
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: verticalScale(8),
                textAlign: "center",
                color: dark.textPrimary,
              }}
            >
              {((value * slider) / 100).toFixed(1)}
            </Text>
          </View>
          <View>
            <Pressable
              disabled={splitStatus ? false : true}
              onPress={() => {
                setSlider(50);
              }}
              style={{
                padding: 3,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="fraction-one-half"
                size={verticalScale(14)}
                color={dark.textPrimary}
              />
            </Pressable>
          </View>
        </View>
      </CardWrapper>
      <CardWrapper
        style={{
          ...styles.cardWrapperSlider,
          backgroundColor: splitStatus
            ? dark.complementary
            : dark.complementaryDisable,
          height: size,
        }}
      >
        <Pressable
          style={{
            width: verticalScale(60),
            maxWidth: 100,
            alignItems: "center",
          }}
          onPress={async () => {
            setSplitStatus(!splitStatus);
            setSlider(50);
          }}
        >
          <Text style={{ color: dark.textPrimary }}>Split </Text>
          {splitStatus && (
            <Text style={{ color: dark.textPrimary, fontSize: 10 }}>
              {slider + "%"}
            </Text>
          )}
        </Pressable>
      </CardWrapper>
    </View>
  );
}
