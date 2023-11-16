import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryCollors } from "../utility/colors";
export const categoryIcons = (icon_size = 25) => {
  const iconSize = verticalScale(icon_size);

  return [
    {
      label: "Supermarket",
      color: categoryCollors.Coral,
      icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Travel",
      color: categoryCollors.Gold,
      icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color="black" />,
    },
    {
      label: "Rent",
      color: categoryCollors.ForestGreen,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color="black" />,
    },
    {
      label: "Work",
      color: categoryCollors.DarkOrange,
      icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize + verticalScale(5)} color="black" />,
    },
    {
      label: "Coffee-Pub",
      color: categoryCollors.MediumVioletRed,
      icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(8)} color="black" />,
    },
    {
      label: "Fun",
      color: categoryCollors.DeepSkyBlue,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color="black" />,
    },
    {
      label: "Car",
      color: categoryCollors.Firebrick,
      icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Transport",
      color: categoryCollors.DarkViolet,
      icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Lifestyle",
      color: categoryCollors.Crimson,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Restaurant",
      color: categoryCollors.Indigo,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Gadgets",
      color: categoryCollors.MidnightBlue,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color="black" />,
    },
    {
      label: "Medic",
      color: categoryCollors.DarkSlateGray,
      icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(7)} color="black" />,
    },
    {
      label: "Gift",
      color: categoryCollors.DarkOrchid,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color="black" />,
    },
    {
      label: "Cloth",
      color: categoryCollors.SeaGreen,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Subscription",
      color: categoryCollors.SaddleBrown,
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Home",
      color: categoryCollors.Peru,
      icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color="black" />,
    },
    {
      label: "Uber",
      color: categoryCollors.SlateBlue,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
    {
      label: "Other",
      color: categoryCollors.DarkGreen,
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
  ];
};

export const utilIcons = (size = 25) => {
  return [
    { label: "Split", icon: <MaterialIcons name="call-split" style={{ alignSelf: "center" }} size={size} color="black" /> },
    { label: "Transaction", icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="black" /> },

    {
      label: "Default",
      icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="black" />,
    },
  ];
};
