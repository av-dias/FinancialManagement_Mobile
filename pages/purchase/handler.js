import { addToStorage } from "../../functions/secureStorage";
import { categoryIcons } from "../../assets/icons";
import { KEYS } from "../../utility/storageKeys";

//Context
import { AppContext } from "../../store/app-context";
import { useContext } from "react";

const TABLE_ICON_SIZE = 15;

export const handlePurchase = async (
  email,
  newPurchase,
  setNewPurchase,
  splitStatus,
  setSplitStatus,
  splitEmail,
  slider,
  list,
  setList,
  refundActive,
  setRefundActive,
) => {
  if (!newPurchase.type || newPurchase.type == "" || !newPurchase.value || newPurchase.value == "" || !newPurchase.dop || newPurchase.dop == "") {
    alert("Please fill all fields.");
    return;
  }
  if (isNaN(newPurchase.value)) {
    alert("Value is not a number.");
    return;
  }
  if (!newPurchase.name || newPurchase.name == "") newPurchase.name = newPurchase.type;

  try {
    newPurchase.value = refundActive ? "-" + newPurchase.value : newPurchase.value;

    //improve split destination logic
    if (splitStatus) {
      newPurchase["split"] = {};
      newPurchase["split"]["userId"] = splitEmail;
      newPurchase["split"]["weight"] = slider;
    }

    await addToStorage(KEYS.PURCHASE, JSON.stringify([newPurchase]), email);

    // History List
    setList([
      [
        categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === newPurchase.type).icon,
        newPurchase.name,
        newPurchase.value,
        newPurchase.dop,
      ],
      ...list,
    ]);

    setNewPurchase({ value: "", note: "", name: "", description: "", dop: newPurchase.dop });
    setSplitStatus(false);
    setRefundActive(false);
  } catch (err) {
    console.log("Purchase: " + err);
  }
};
