import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../utility/responsive";

export const categoryIcons = (icon_size = 25) => {
  const iconSize = verticalScale(icon_size);

  return [
    { label: "Supermarket", icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Travel", icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Rent", icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Work", icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Coffee-Pub", icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Fun", icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Car", icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Transport", icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Lifestyle", icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Restaurant", icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Gadgets", icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Medic", icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Gift", icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Cloth", icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    {
      label: "Subscription",
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize} color="black" />,
    },
    { label: "Home", icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Uber", icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
    { label: "Other", icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize} color="black" /> },
  ];
};
