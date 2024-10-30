import { categoryIcons } from "../../utility/icons";
import { FontAwesome } from "@expo/vector-icons";
import { _styles } from "./style";
import { STATS_MODE } from "../../utility/keys";

const styles = _styles;

export const isCtxLoaded = (ctx, year, month) => {
  return ctx && Object.keys(ctx).length > 0;
};

export const refinePurchaseStats = (purchasesStats) => {
  let array = [];
  let arrayTables = [];
  Object.keys(purchasesStats).forEach((key) => {
    let _color;

    categoryIcons().find((type) => {
      if (type.label === key) {
        _color = type.color;
      }
    });

    array.push({ x: " ", y: purchasesStats[key], color: _color });
    arrayTables.push([<FontAwesome name="circle" size={24} color={_color} style={styles.colorIcon} />, key, parseFloat(purchasesStats[key]).toFixed(0) + " €"]);
  });
};
