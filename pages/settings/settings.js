import navLogo from "../../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome, Entypo, FontAwesome5 } from "@expo/vector-icons";
import ModalCustom from "../../components/modal/modal";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../functions/responsive";
import { LinearGradient } from "expo-linear-gradient";
import commonStyles from "../../utility/commonStyles";
import * as FileSystem from "expo-file-system";

import { getSplitUser, getSplitUsers, getSplitEmail } from "../../functions/split";
import { saveToStorage, getFromStorage, addToStorage } from "../../functions/secureStorage";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import { KEYS } from "../../utility/storageKeys";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";

const MODAL_DEFAULT_SIZE = 6;
const MODAL_LARGE_SIZE = 9;

export default function Settings({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [listVisible, setListVisible] = useState(false);
  const [modalSize, setModalSize] = useState(MODAL_DEFAULT_SIZE);
  const [splitUsers, setSplitUsers] = useState("");

  const handleNewSplitUser = async () => {
    let value = [{ email: newEmail, name: newName }];
    let user = await getUser();
    await addToStorage(KEYS.SPLIT_USERS, JSON.stringify(value), user);
    await getSplitUsers(setSplitUsers, email);

    this.textInputName.clear();
    this.textInputEmail.clear();
    setNewEmail("");
    setNewName("");
  };

  const ModalContent = () => {
    let content;
    let value = 20;

    switch (modalContentFlag) {
      case "split":
        content = (
          <View style={{ flex: 4, backgroundColor: "transparent", borderRadius: commonStyles.borderRadius, padding: verticalScale(30), gap: 20 }}>
            <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable
                style={{}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalSize(MODAL_DEFAULT_SIZE);
                  setListVisible(false);
                }}
              >
                <Entypo name="cross" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
            <View style={{ position: "absolute", left: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable
                testID="split_list"
                style={{}}
                onPress={async () => {
                  setModalSize(modalSize == MODAL_LARGE_SIZE ? MODAL_DEFAULT_SIZE : MODAL_LARGE_SIZE);
                  setListVisible(!listVisible);
                }}
              >
                <FontAwesome5 name="list" size={15} color="black" />
              </Pressable>
            </View>
            {listVisible && (
              <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
                <Text style={{ fontSize: 20 }}>Users Registered</Text>
                {splitUsers ? splitUsers.map((row) => <Text key={"split-user" + getSplitEmail(row)}>{getSplitEmail(row)}</Text>) : null}
              </View>
            )}
            <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
              <Text style={{ fontSize: 20 }}>User to Split Email</Text>
            </View>
            <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
              <TextInput
                ref={(input) => {
                  this.textInputEmail = input;
                }}
                keyboardType="email-address"
                style={{ fontSize: 20 }}
                placeholder="split-user@gmail.com"
                onChangeText={setNewEmail}
              />
            </View>
            <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: commonStyles.borderRadius }}>
              <TextInput
                ref={(input) => {
                  this.textInputName = input;
                }}
                keyboardType="default"
                style={{ fontSize: 20 }}
                placeholder="user-name"
                onChangeText={setNewName}
              />
            </View>
            <View style={{}}>
              <Pressable
                style={styles.button}
                onPress={() => {
                  handleNewSplitUser();
                }}
              >
                <Text style={{ fontSize: 20 }}>Submit</Text>
              </Pressable>
            </View>
          </View>
        );
        break;
      default:
        content = <View style={{ flex: 4, backgroundColor: "white", borderRadius: commonStyles.borderRadius, padding: verticalScale(20) }}></View>;
    }

    return content;
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
      await getSplitUsers(setSplitUsers, email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, [email]);

  const showAlert = () =>
    Alert.alert(
      "Clear All",
      "Are you sure you want to remove all purchases permanently?",
      [
        {
          text: "Yes",
          onPress: async () => {
            let infoPurchase = await saveToStorage(KEYS.PURCHASE, "[]", email);
            let infoArchivedPurchase = await saveToStorage(KEYS.ARCHIVE_PURCHASE, "[]", email);
            //let infoSplit = await saveToStorage(KEYS.SPLIT_USERS, "[]", email);
            let infoTransaction = await saveToStorage(KEYS.TRANSACTION, "[]", email);
            let infoArchivedTransaction = await saveToStorage(KEYS.ARCHIVE_TRANSACTION, "[]", email);
            alert("Cleared");
          },
          style: "yes",
        },
        {
          text: "No",
          onPress: () => {},
          style: "no",
        },
      ],
      {
        cancelable: true,
      }
    );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ModalCustom size={modalSize} modalVisible={modalVisible} setModalVisible={setModalVisible}>
        {ModalContent()}
      </ModalCustom>
      <View style={styles.form}>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let uriRaw = [],
              filename = "fm_" + new Date().getTime() + ".txt",
              mimetype = "text/plain";

            Object.keys(KEYS).map(async (key) => {
              let data = await getFromStorage(KEYS[key], email);
              if (data) {
                uriRaw.push(KEYS[key]);
                uriRaw.push(data);
              }
            });

            try {
              const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

              if (permissions.granted) {
                const base64Data = uriRaw.join("\n");

                console.log(filename);
                console.log(base64Data);

                const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype);

                console.log(fileUri);

                await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.UTF8 });

                console.log("File created successfully:", fileUri);
              } else {
                console.log("Storage permissions not granted");
              }
            } catch (error) {
              console.error("Error creating file:", error);
            }
          }}
        >
          <Text style={styles.buttonText}>Download Storage</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={() => {
            setModalVisible(true);
            setModalContentFlag("split");
          }}
        >
          <Text style={styles.buttonText}>Split</Text>
        </Pressable>
        {/* <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let server = await getFromStorage(KEYS.SERVER);
            let purchases = await getFromStorage(KEYS.PURCHASE, email);
            let transactions = await getFromStorage(KEYS.TRANSACTION, email);
            if (server == "on") {
              let access_token = await getFromStorage(KEYS.ACCESS_TOKEN);
              ip1 = await getFromStorage(KEYS.IP1);
              ip2 = await getFromStorage(KEYS.IP2);
              ip3 = await getFromStorage(KEYS.IP3);
              ip4 = await getFromStorage(KEYS.IP4);
              let userId = await getFromStorage(KEYS.USER_ID);
              await fetch(`http://${ip1}.${ip2}.${ip3}.${ip4}:8080/api/v1/purchase/mobile/user/${userId}/update/purchases`, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + access_token,
                },
                method: "POST",
                body: purchases,
              })
                .then(async (res) => {
                  console.log("Update Status: " + res.status);
                  await addToStorage(KEYS.ARCHIVE_PURCHASE, purchases, email);
                  let info = await saveToStorage(KEYS.PURCHASE, "[]", email);
                  alert("Data uploaded to main server.");
                })
                .catch(function (res) {
                  console.log(res);
                });
              await fetch(`http://${ip1}.${ip2}.${ip3}.${ip4}:8080/api/v1/transactions/mobile/user/${userId}/update/transactions`, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + access_token,
                },
                method: "POST",
                body: transactions,
              })
                .then(async (res) => {
                  console.log("Update Status: " + res.status);
                  await addToStorage(KEYS.ARCHIVE_TRANSACTION, transactions, email);
                  let info = await saveToStorage(KEYS.TRANSACTION, "[]", email);
                  alert("Data uploaded to main server.");
                })
                .catch(function (res) {
                  console.log(res);
                });
            } else {
              alert("Main server not connected.");
              if (false) {
                // For testing purpose only
                await addToStorage(KEYS.ARCHIVE_PURCHASE, purchases, email);
                await saveToStorage(KEYS.PURCHASE, "[]", email);

                await addToStorage(KEYS.ARCHIVE_TRANSACTION, transactions, email);
                await saveToStorage(KEYS.TRANSACTION, "[]", email);
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable> */}
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoPurchase = await getFromStorage(KEYS.PURCHASE, email);
            let infoArchivePurchase = await getFromStorage(KEYS.ARCHIVE_PURCHASE, email);
            alert(infoPurchase + " and " + infoArchivePurchase);
          }}
        >
          <Text style={styles.buttonText}>Logs: Purchase</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoTransaction = await getFromStorage(KEYS.TRANSACTION, email);
            let infoArchiveTransaction = await getFromStorage(KEYS.ARCHIVE_TRANSACTION, email);
            alert(infoTransaction + " and " + infoArchiveTransaction);
          }}
        >
          <Text style={styles.buttonText}>Logs: Transaction</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoSplit = await getFromStorage(KEYS.SPLIT_USERS, email);
            alert(infoSplit);
          }}
        >
          <Text style={styles.buttonText}>Logs: Split Users</Text>
        </Pressable>
        {/* <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            showAlert();
          }}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </Pressable> */}
      </View>
    </LinearGradient>
  );
}
