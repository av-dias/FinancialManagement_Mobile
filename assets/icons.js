import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryCollors } from "../utility/colors";
export const categoryIcons = (icon_size = 25, color = "black") => {
  const iconSize = verticalScale(icon_size);

  return [
    {
      label: "Supermarket",
      color: categoryCollors.Coral,
      icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Travel",
      color: categoryCollors.Gold,
      icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Rent",
      color: categoryCollors.ForestGreen,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color} />,
    },
    {
      label: "Work",
      color: categoryCollors.DarkOrange,
      icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize + verticalScale(5)} color={color} />,
    },
    {
      label: "Coffee-Pub",
      color: categoryCollors.MediumVioletRed,
      icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(8)} color={color} />,
    },
    {
      label: "Fun",
      color: categoryCollors.DeepSkyBlue,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Car",
      color: categoryCollors.Firebrick,
      icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Transport",
      color: categoryCollors.DarkViolet,
      icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Lifestyle",
      color: categoryCollors.Crimson,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Restaurant",
      color: categoryCollors.Indigo,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Gadgets",
      color: categoryCollors.MidnightBlue,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Medic",
      color: categoryCollors.DarkSlateGray,
      icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(7)} color={color} />,
    },
    {
      label: "Gift",
      color: categoryCollors.DarkOrchid,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color} />,
    },
    {
      label: "Cloth",
      color: categoryCollors.SeaGreen,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Subscription",
      color: categoryCollors.SaddleBrown,
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Home",
      color: categoryCollors.Peru,
      icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color={color} />,
    },
    {
      label: "Uber",
      color: categoryCollors.SlateBlue,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
    {
      label: "Other",
      color: categoryCollors.DarkGreen,
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color} />,
    },
  ];
};

export const utilIcons = (size = 25) => {
  return [
    { label: "Split", icon: <MaterialIcons name="call-split" style={{ alignSelf: "center" }} size={size} color="black" />, color: "white" },
    { label: "Transaction", icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="black" />, color: "white" },

    {
      label: "Default",
      icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="black" />,
      color: "white",
    },
  ];
};
