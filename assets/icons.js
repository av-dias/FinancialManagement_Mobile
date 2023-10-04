import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../utility/responsive";

const iconSize = verticalScale(30);

export const categoryIcons = [
  { label: "Supermarket", icon: <FontAwesome name="shopping-basket" size={iconSize} color="black" /> },
  { label: "Travel", icon: <MaterialIcons name="flight-takeoff" size={iconSize} color="black" /> },
  { label: "Rent", icon: <AntDesign name="home" size={iconSize} color="black" /> },
  { label: "Work", icon: <MaterialIcons name="food-bank" size={iconSize} color="black" /> },
  { label: "Fun", icon: <MaterialIcons name="nightlife" size={iconSize} color="black" /> },
  { label: "Car", icon: <FontAwesome5 name="car-side" size={iconSize} color="black" /> },
  { label: "Restaurant", icon: <MaterialIcons name="restaurant" size={iconSize} color="black" /> },
  { label: "Gadgets", icon: <MaterialCommunityIcons name="devices" size={iconSize} color="black" /> },
  { label: "Medic", icon: <FontAwesome5 name="hand-holding-medical" size={iconSize} color="black" /> },
  { label: "Gift", icon: <AntDesign name="gift" size={iconSize} color="black" /> },
  { label: "Cloth", icon: <Ionicons name="shirt-outline" size={iconSize} color="black" /> },
  { label: "Subscription", icon: <MaterialCommunityIcons name="calendar-month-outline" size={iconSize} color="black" /> },
  { label: "Home", icon: <MaterialCommunityIcons name="sofa" size={iconSize} color="black" /> },
  { label: "Uber", icon: <FontAwesome5 name="taxi" size={iconSize} color="black" /> },
  { label: "Other", icon: <FontAwesome name="plus-square-o" size={iconSize} color="black" /> },
];
