import { saveToStorage, getFromStorage } from "../../functions/secureStorage";
import { categoryIcons } from "../../assets/icons";
import { KEYS } from "../../utility/storageKeys";

const TABLE_ICON_SIZE = 15;

export const handlePurchase = async (email, value, type, name, note, splitStatus, splitEmail, slider, setValue, setNote, list, setList) => {
  let date = this._calendar.getSelectedDate();
  if (type == "" || name == "" || value == "" || date == "" || !date) {
    alert("Please fill all fields.");
    return;
  }

  if (!note) setNote("");
  try {
    let purchases = await getFromStorage(KEYS.PURCHASE, email);
    let newPurchase = { type: type, name: name, value: value, dop: date.toISOString().split("T")[0], note: note };

    //improve split destination logic
    if (splitStatus) {
      newPurchase["split"] = {};
      newPurchase["split"]["userId"] = splitEmail;
      newPurchase["split"]["weight"] = slider;
    }

    if (purchases) {
      purchases = JSON.parse(purchases);
      purchases.push(newPurchase);
    } else {
      purchases = [newPurchase];
    }

    console.log(newPurchase);

    await saveToStorage(KEYS.PURCHASE, JSON.stringify(purchases), email);
    setList([
      [categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === type).icon, name, value, date.toISOString().split("T")[0]],
      ...list,
    ]);
    setValue("");
    setNote("");
  } catch (err) {
    console.log("Purchase: " + err);
  }
};
