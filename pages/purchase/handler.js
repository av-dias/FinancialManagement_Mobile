import { addToStorage } from "../../functions/secureStorage";
import { categoryIcons } from "../../utility/icons";
import { KEYS } from "../../utility/storageKeys";
import { KEYS as KEYS_SERIALIZER } from "../../utility/keys";

//Context
import { addExpenses } from "../../functions/expenses";
import ModalHistory from "../../components/modalHistory/modalHistory";
import ModalSplit from "../../components/modalSplit/modalSplit";

const TABLE_ICON_SIZE = 15;

export const modalContent = (list, value, email, modalContentFlag, modalVisible, setModalVisible, splitName, slider) => {
  if (modalContentFlag == "split_info") {
    return ModalSplit(value, email, modalVisible, setModalVisible, splitName, slider);
  } else {
    return ModalHistory(list, modalVisible, setModalVisible);
  }
};

export const handlePurchase = async (email, newPurchase, setNewPurchase, splitStatus, setSplitStatus, splitEmail, slider, setList, refundActive, setRefundActive, setExpenses) => {
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
    addExpenses(newPurchase, KEYS_SERIALIZER.PURCHASE, setExpenses);

    // History List
    setList((list) => [[categoryIcons(TABLE_ICON_SIZE).find((category) => category.label === newPurchase.type).icon, newPurchase.name, newPurchase.value, newPurchase.dop], ...list]);

    setNewPurchase({ value: "", note: "", name: "", description: "", dop: newPurchase.dop });
    setSplitStatus(false);
    setRefundActive(false);
  } catch (err) {
    console.log("Purchase: " + err);
  }
};
