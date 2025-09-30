import { Fontisto, MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryColorsBackground, categoryColorsBorder, categoryColorsBright, dark, utilsColors } from "./colors";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Foundation from '@expo/vector-icons/Foundation';

export const findIcon = (iconName, iconSize = 25, color) => {
  return utilIcons(iconSize, color).find((category) => category.label === iconName).icon
}

export const categoryIcons = (iconSize = 25, color) => {
  iconSize = verticalScale(iconSize);

  return [
    {
      label: "Supermarket",
      color: categoryColorsBackground.Supermarket,
      borderColor: categoryColorsBorder.Supermarket,
      brightColor: categoryColorsBright.Supermarket,
      icon:<Feather name="shopping-cart" style={{ alignSelf: "center" }} size={iconSize - verticalScale(14)} color={color || categoryColorsBackground.Supermarket}/>,
    },
    {
      label: "Travel",
      color: categoryColorsBackground.Travel,
      borderColor: categoryColorsBorder.Travel,
      brightColor: categoryColorsBright.Travel,
      icon: <SimpleLineIcons name="plane" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.Travel}  />
    },
    {
      label: "Rent",
      color: categoryColorsBackground.Rent,
      borderColor: categoryColorsBorder.Rent,
      brightColor: categoryColorsBright.Rent,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(14)} color={color || categoryColorsBackground.Rent} />,
    },
    {
      label: "Work",
      color: categoryColorsBackground.Work,
      borderColor: categoryColorsBorder.Work,
      brightColor: categoryColorsBright.Work,
      icon: <MaterialIcons name="work-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(12)} color={color || categoryColorsBackground.Work}  />
    },
    {
      label: "Coffee-Pub",
      color: categoryColorsBackground.CoffeePub,
      borderColor: categoryColorsBorder.CoffeePub,
      brightColor: categoryColorsBright.CoffeePub,
      icon: <Fontisto name="shopping-store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.CoffeePub}  />,
    },
    {
      label: "Fun",
      color: categoryColorsBackground.Fun,
      borderColor: categoryColorsBorder.Fun,
      brightColor: categoryColorsBright.Fun,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize - verticalScale(10)} color={color || categoryColorsBackground.Fun} />,
    },
    {
      label: "Car",
      color: categoryColorsBackground.Car,
      borderColor: categoryColorsBorder.Car,
      brightColor: categoryColorsBright.Car,
      icon:<Ionicons name="car-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(9)} color={color || categoryColorsBackground.Car} />,
    },
    {
      label: "Transport",
      color: categoryColorsBackground.Transport,
      borderColor: categoryColorsBorder.Transport,
      brightColor: categoryColorsBright.Transport,
      icon:  <MaterialCommunityIcons name="train-car"  style={{ alignSelf: "center" }} size={iconSize - verticalScale(10)} color={color || categoryColorsBackground.Transport} />,
    },
    {
      label: "Lifestyle",
      color: categoryColorsBackground.LifeStyle,
      borderColor: categoryColorsBorder.LifeStyle,
      brightColor: categoryColorsBright.LifeStyle,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(15)} color={color || categoryColorsBackground.LifeStyle} />,
    },
    {
      label: "Restaurant",
      color: categoryColorsBackground.Restaurant,
      borderColor: categoryColorsBorder.Restaurant,
      brightColor: categoryColorsBright.Restaurant,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.Restaurant} />,
    },
    {
      label: "Gadgets",
      color: categoryColorsBackground.Gadgets,
      borderColor: categoryColorsBorder.Gadgets,
      brightColor: categoryColorsBright.Gadgets,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize - verticalScale(12)} color={color || categoryColorsBackground.Gadgets} />,
    },
    {
      label: "Medic",
      color: categoryColorsBackground.Medic,
      borderColor: categoryColorsBorder.Medic,
      brightColor: categoryColorsBright.Medic,
      icon: <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(18)} color={color || categoryColorsBackground.Medic} />,
    },
    {
      label: "Gift",
      color: categoryColorsBackground.Gift,
      borderColor: categoryColorsBorder.Gift,
      brightColor: categoryColorsBright.Gift,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.Gift} />,
    },
    {
      label: "Cloth",
      color: categoryColorsBackground.Cloth,
      borderColor: categoryColorsBorder.Cloth,
      brightColor: categoryColorsBright.Cloth,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.Cloth} />,
    },
    {
      label: "Subscription",
      color: categoryColorsBackground.Subscription,
      borderColor: categoryColorsBorder.Subscription,
      brightColor: categoryColorsBright.Subscription,
      icon: <MaterialCommunityIcons name="calendar-month-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(15)} color={color || categoryColorsBackground.Subscription} />,
    },
    {
      label: "Home",
      color: categoryColorsBackground.Home,
      borderColor: categoryColorsBorder.Home,
      brightColor: categoryColorsBright.Home,
    
      icon: <MaterialCommunityIcons name="home-lightning-bolt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(14)} color={color || categoryColorsBackground.Home} />,
    },
    {
      label: "Uber",
      color: categoryColorsBackground.Uber,
      borderColor: categoryColorsBorder.Uber,
      brightColor: categoryColorsBright.Uber,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(16)} color={color || categoryColorsBackground.Uber} />,
    },
    {
      label: "Other",
      color: categoryColorsBackground.Other,
      borderColor: categoryColorsBorder.Other,
      brightColor: categoryColorsBright.Other,
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(14)} color={color || categoryColorsBackground.Other} />,
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
      icon: <MaterialIcons name="call-made" style={{ alignSelf: "center" }} size={size - verticalScale(8)} color="darkred" />,
      borderColor:"pink",
      color: "darkred",
    },
    {
      label: "Received",
      icon: <MaterialIcons name="call-received" style={{ alignSelf: "center" }} size={size - verticalScale(8)} color={utilsColors.darkgreen} />,
      borderColor: utilsColors.lightgreen,
      color: utilsColors.darkgreen,
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
      icon: <Foundation name="euro" style={{alignSelf: "center"}} size={size} color={utilsColors.green} />,
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
      icon: <MaterialCommunityIcons name="calendar-refresh-outline" size={size - verticalScale(12)} color={_color} />,
      color: _color,
    },
    {
      label: "Delete",
      icon: <AntDesign name="delete" size={30} color={_color} />,
      color: _color,
    },
    {
      label: "Transfer",
      icon: <MaterialCommunityIcons style={{ alignSelf: "center" }} name="transfer" size={24} color={"white"} />,
      color: _color,
    },
  ];
};
