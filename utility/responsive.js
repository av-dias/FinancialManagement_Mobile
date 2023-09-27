import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => {
  return (width / guidelineBaseWidth) * size;
};
const verticalScale = (size) => {
  /* let vertical = (height / guidelineBaseHeight) * size;
  console.log("Vertical " + vertical); */
  return (height / guidelineBaseHeight) * size;
};
const moderateScale = (size, factor = 2) => {
  return size + (horizontalScale(size) - size) * factor;
};

const largeScale = (size, factor = 10) => {
  return size + (horizontalScale(size) - size) * factor;
};

const inverseScale = (size, factor = 1 / 2) => {
  return size + (horizontalScale(size) - size) * factor;
};

export { horizontalScale, verticalScale, moderateScale, largeScale, inverseScale };
