import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryColorsBackground, dark } from "../utility/colors";
export const categoryIcons = (icon_size = 25, color = "black") => {
  const iconSize = verticalScale(icon_size);

  return [
    {
      label: "Supermarket",
      color: categoryColorsBackground.Supermarket,
      icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Travel",
      color: categoryColorsBackground.Travel,
      icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Rent",
      color: categoryColorsBackground.Rent,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color} />,
    },
    {
      label: "Work",
      color: categoryColorsBackground.Work,
      icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize + verticalScale(5)} color={color} />,
    },
    {
      label: "Coffee-Pub",
      color: categoryColorsBackground.CoffeePub,
      icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(8)} color={color} />,
    },
    {
      label: "Fun",
      color: categoryColorsBackground.Fun,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Car",
      color: categoryColorsBackground.Car,
      icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Transport",
      color: categoryColorsBackground.Transport,
      icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Lifestyle",
      color: categoryColorsBackground.LifeStyle,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Restaurant",
      color: categoryColorsBackground.Restaurant,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Gadgets",
      color: categoryColorsBackground.Gadgets,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Medic",
      color: categoryColorsBackground.Medic,
      icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(7)} color={color} />,
    },
    {
      label: "Gift",
      color: categoryColorsBackground.Gift,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color} />,
    },
    {
      label: "Cloth",
      color: categoryColorsBackground.Cloth,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Subscription",
      color: categoryColorsBackground.Subscription,
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Home",
      color: categoryColorsBackground.Home,
      icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Uber",
      color: categoryColorsBackground.Uber,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Other",
      color: categoryColorsBackground.Other,
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
  ];
};

export const utilIcons = (size = 25) => {
  return [
    { label: "Split", icon: <MaterialIcons name="call-split" style={{ alignSelf: "center" }} size={size} color="white" />, color: "white" },
    { label: "Transaction", icon: <AntDesign name="arrowleft" style={{ alignSelf: "center" }} size={size} color="darkred" />, color: "white" },
    { label: "Received", icon: <AntDesign name="arrowright" style={{ alignSelf: "center" }} size={size} color="darkgreen" />, color: "white" },
    {
      label: "Edit",
      icon: <Feather name="edit" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
    {
      label: "Settle",
      icon: <FontAwesome5 name="arrow-right" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
    {
      label: "Settled",
      icon: <FontAwesome5 name="check" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
    {
      label: "Default",
      icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
  ];
};
