import { MaterialIcons, FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import { horizontalScale, verticalScale, moderateScale } from "../functions/responsive";
import { categoryCollors } from "../utility/colors";
export const categoryIcons = (icon_size = 25) => {
  const iconSize = verticalScale(icon_size);

  return [
    {
      label: "Supermarket",
      color: categoryCollors.Dorothy,
      icon: <FontAwesome name="shopping-basket" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Dorothy} />,
    },
    {
      label: "Travel",
      color: categoryCollors.Harry,
      icon: <MaterialIcons name="flight-takeoff" style={{ alignSelf: "center" }} size={iconSize} color={categoryCollors.Harry} />,
    },
    {
      label: "Rent",
      color: categoryCollors.Thomas,
      icon: <AntDesign name="home" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={categoryCollors.Thomas} />,
    },
    {
      label: "Work",
      color: categoryCollors.Anne,
      icon: <MaterialIcons name="food-bank" style={{ alignSelf: "center" }} size={iconSize} color={categoryCollors.Anne} />,
    },
    {
      label: "Coffee-Pub",
      color: categoryCollors.Molly,
      icon: <FontAwesome5 name="store" style={{ alignSelf: "center" }} size={iconSize - verticalScale(8)} color={categoryCollors.Molly} />,
    },
    {
      label: "Fun",
      color: categoryCollors.Owen,
      icon: <MaterialIcons name="nightlife" style={{ alignSelf: "center" }} size={iconSize} color={categoryCollors.Owen} />,
    },
    {
      label: "Car",
      color: categoryCollors.ThomaDesmonds,
      icon: <FontAwesome5 name="car-side" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Desmond} />,
    },
    {
      label: "Transport",
      color: categoryCollors.Verity,
      icon: <Ionicons name="train-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Verity} />,
    },
    {
      label: "Lifestyle",
      color: categoryCollors.Ella,
      icon: <Ionicons name="person-add-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Ella} />,
    },
    {
      label: "Restaurant",
      color: categoryCollors.Oliver,
      icon: <MaterialIcons name="restaurant" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Oliver} />,
    },
    {
      label: "Gadgets",
      color: categoryCollors.Jane,
      icon: <MaterialCommunityIcons name="devices" style={{ alignSelf: "center" }} size={iconSize} color={categoryCollors.Jane} />,
    },
    {
      label: "Medic",
      color: categoryCollors.Betty,
      icon: (
        <FontAwesome5 name="hand-holding-medical" style={{ alignSelf: "center" }} size={iconSize - verticalScale(7)} color={categoryCollors.Betty} />
      ),
    },
    {
      label: "Gift",
      color: categoryCollors.Bobby,
      icon: <AntDesign name="gift" style={{ alignSelf: "center" }} size={iconSize - verticalScale(4)} color={categoryCollors.Bobby} />,
    },
    {
      label: "Cloth",
      color: categoryCollors.Erik,
      icon: <Ionicons name="shirt-outline" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Erik} />,
    },
    {
      label: "Subscription",
      color: categoryCollors.Jonathon,
      icon: (
        <MaterialCommunityIcons
          name="calendar-month-outline"
          style={{ alignSelf: "center" }}
          size={iconSize - verticalScale(5)}
          color={categoryCollors.Jonathon}
        />
      ),
    },
    {
      label: "Home",
      color: categoryCollors.Erik,
      icon: <MaterialCommunityIcons name="sofa" style={{ alignSelf: "center" }} size={iconSize} color={categoryCollors.Erik} />,
    },
    {
      label: "Uber",
      color: categoryCollors.Dave,
      icon: <FontAwesome5 name="taxi" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color={categoryCollors.Dave} />,
    },
    {
      label: "Other",
      color: "black",
      icon: <FontAwesome name="plus-square-o" style={{ alignSelf: "center" }} size={iconSize - verticalScale(5)} color="black" />,
    },
  ];
};

export const utilIcons = (size = 25) => {
  return [
    { label: "Split", icon: <MaterialIcons name="call-split" style={{ alignSelf: "center" }} size={size} color="black" /> },
    { label: "Transaction", icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color={categoryCollors.Mia} /> },

    {
      label: "Default",
      icon: <MaterialIcons name="compare-arrows" style={{ alignSelf: "center" }} size={size} color="black" />,
    },
  ];
};
