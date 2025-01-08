import { Fontisto, MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryColorsBackground, categoryColorsBorder, categoryColorsBright, dark } from "./colors";
export const categoryIcons = (icon_size = 25, color) => {
  const iconSize = verticalScale(icon_size);

  return [
    {
      label: "Supermarket",
      color: categoryColorsBackground.Supermarket,
      borderColor: categoryColorsBorder.Supermarket,
      brightColor: categoryColorsBright.Supermarket,
      icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Supermarket} />,
    },
    {
      label: "Travel",
      color: categoryColorsBackground.Travel,
      borderColor: categoryColorsBorder.Travel,
      brightColor: categoryColorsBright.Travel,
      icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color={color || categoryColorsBackground.Travel} />,
    },
    {
      label: "Rent",
      color: categoryColorsBackground.Rent,
      borderColor: categoryColorsBorder.Rent,
      brightColor: categoryColorsBright.Rent,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color || categoryColorsBackground.Rent} />,
    },
    {
      label: "Work",
      color: categoryColorsBackground.Work,
      borderColor: categoryColorsBorder.Work,
      brightColor: categoryColorsBright.Work,
      icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize + verticalScale(5)} color={color || categoryColorsBackground.Work} />,
    },
    {
      label: "Coffee-Pub",
      color: categoryColorsBackground.CoffeePub,
      borderColor: categoryColorsBorder.CoffeePub,
      brightColor: categoryColorsBright.CoffeePub,
      icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(8)} color={color || categoryColorsBackground.CoffeePub} />,
    },
    {
      label: "Fun",
      color: categoryColorsBackground.Fun,
      borderColor: categoryColorsBorder.Fun,
      brightColor: categoryColorsBright.Fun,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color={color || categoryColorsBackground.Fun} />,
    },
    {
      label: "Car",
      color: categoryColorsBackground.Car,
      borderColor: categoryColorsBorder.Car,
      brightColor: categoryColorsBright.Car,
      icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Car} />,
    },
    {
      label: "Transport",
      color: categoryColorsBackground.Transport,
      borderColor: categoryColorsBorder.Transport,
      brightColor: categoryColorsBright.Transport,
      icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Transport} />,
    },
    {
      label: "Lifestyle",
      color: categoryColorsBackground.LifeStyle,
      borderColor: categoryColorsBorder.LifeStyle,
      brightColor: categoryColorsBright.LifeStyle,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.LifeStyle} />,
    },
    {
      label: "Restaurant",
      color: categoryColorsBackground.Restaurant,
      borderColor: categoryColorsBorder.Restaurant,
      brightColor: categoryColorsBright.Restaurant,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Restaurant} />,
    },
    {
      label: "Gadgets",
      color: categoryColorsBackground.Gadgets,
      borderColor: categoryColorsBorder.Gadgets,
      brightColor: categoryColorsBright.Gadgets,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color={color || categoryColorsBackground.Gadgets} />,
    },
    {
      label: "Medic",
      color: categoryColorsBackground.Medic,
      borderColor: categoryColorsBorder.Medic,
      brightColor: categoryColorsBright.Medic,
      icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(7)} color={color || categoryColorsBackground.Medic} />,
    },
    {
      label: "Gift",
      color: categoryColorsBackground.Gift,
      borderColor: categoryColorsBorder.Gift,
      brightColor: categoryColorsBright.Gift,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={color || categoryColorsBackground.Gift} />,
    },
    {
      label: "Cloth",
      color: categoryColorsBackground.Cloth,
      borderColor: categoryColorsBorder.Cloth,
      brightColor: categoryColorsBright.Cloth,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Cloth} />,
    },
    {
      label: "Subscription",
      color: categoryColorsBackground.Subscription,
      borderColor: categoryColorsBorder.Subscription,
      brightColor: categoryColorsBright.Subscription,
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Subscription} />,
    },
    {
      label: "Home",
      color: categoryColorsBackground.Home,
      borderColor: categoryColorsBorder.Home,
      brightColor: categoryColorsBright.Home,
      icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color={color || categoryColorsBackground.Home} />,
    },
    {
      label: "Uber",
      color: categoryColorsBackground.Uber,
      borderColor: categoryColorsBorder.Uber,
      brightColor: categoryColorsBright.Uber,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Uber} />,
    },
    {
      label: "Other",
      color: categoryColorsBackground.Other,
      borderColor: categoryColorsBorder.Other,
      brightColor: categoryColorsBright.Other,
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={color || categoryColorsBackground.Other} />,
    },
  ];
};

export const utilIcons = (size = 25, _color) => {
  return [
    {
      label: "Split",
      icon: <MaterialIcons name="call-split" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
    {
      label: "Transaction",
      icon: <AntDesign name="arrowleft" style={{ alignSelf: "center" }} size={size} color="darkred" />,
      color: "white",
    },
    {
      label: "Received",
      icon: <AntDesign name="arrowright" style={{ alignSelf: "center" }} size={size} color="darkgreen" />,
      color: "white",
    },
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
      label: "Income",
      icon: <Fontisto name="euro" style={{ left: "20%" }} size={size} color="green" />,
      color: "green",
      borderColor: dark.incomeBackgroundColor,
    },
    {
      label: "Default",
      icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="white" />,
      color: "white",
    },
    {
      label: "Circle",
      icon: <FontAwesome name="circle" style={{ alignSelf: "center" }} size={size} color={_color} />,
      color: _color,
    },
    {
      label: "Recurring",
      icon: <MaterialCommunityIcons name="calendar-refresh-outline" size={35} color={_color} />,
      color: _color,
    },
  ];
};
