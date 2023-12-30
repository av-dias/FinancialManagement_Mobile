import { addToStorage } from "../../functions/secureStorage";
import { categoryIcons } from "../../assets/icons";
import { KEYS } from "../../utility/storageKeys";

const TABLE_ICON_SIZE = 15;

export const handlePurchase = async (
  email,
  value,
  type,
  name,
  setName,
  note,
  splitStatus,
  setSplitStatus,
  splitEmail,
  slider,
  setValue,
  setNote,
  list,
  setList
) => {
  let date = this._calendar.getSelectedDate();
  if (type == "" || value == "" || date == "" || !date) {
    alert("Please fill all fields.");
    return;
  }

  if (name == "") name = type;

  try {
    let newPurchase = [{ type: type, name: name, value: value, dop: date.toISOString().split("T")[0], note: note }];

    console.log(splitStatus);
    //improve split destination logic
    if (splitStatus) {
      newPurchase[0]["split"] = {};
      newPurchase[0]["split"]["userId"] = splitEmail;
      newPurchase[0]["split"]["weight"] = slider;
    }

    await addToStorage(KEYS.PURCHASE, JSON.stringify(newPurchase), email);
    setList([
      [categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === type).icon, name, value, date.toISOString().split("T")[0]],
      ...list,
    ]);
    setValue("");
    setNote("");
    setName("");
    setSplitStatus(false);
  } catch (err) {
    console.log("Purchase: " + err);
  }
};
