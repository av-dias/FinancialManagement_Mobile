import navLogo from "../../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons, FontAwesome, Entypo, FontAwesome5 } from "@expo/vector-icons";
import ModalCustom from "../../components/modal/modal";
import { horizontalScale, verticalScale, moderateScale, heightTreshold } from "../../utility/responsive";

import { saveToStorage, getFromStorage, addToStorage } from "../../utility/secureStorage";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";

import Header from "../../components/header/header";

export default function Settings({ navigation }) {
  const styles = _styles;
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [listVisible, setListVisible] = useState(false);
  const [modalSize, setModalSize] = useState(3);
  const [splitUsers, setSplitUsers] = useState("");

  const getUser = async () => {
    try {
      const email = await getFromStorage("email");
      return email;
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  const getSplitUsers = async () => {
    try {
      const users = JSON.parse(await getFromStorage("split-list", await getUser()));
      console.log(users);
      setSplitUsers(users);
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  const handleNewSplitUser = async () => {
    let value = { email: newEmail };
    let user = await getUser();
    console.log(user);
    await addToStorage("split-list", JSON.stringify(value), user);
  };

  const ModalContent = () => {
    let content;
    let value = 20;

    switch (modalContentFlag) {
      case "split":
        content = (
          <View style={{ flex: 4, backgroundColor: "transparent", borderRadius: 20, padding: verticalScale(30), gap: 20 }}>
            <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable
                style={{}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalSize(3);
                  setListVisible(false);
                }}
              >
                <Entypo name="cross" size={verticalScale(20)} color="black" />
              </Pressable>
            </View>
            <View style={{ position: "absolute", left: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
              <Pressable
                style={{}}
                onPress={async () => {
                  setModalSize(modalSize == 7 ? 3 : 7);
                  setListVisible(!listVisible);
                  if (modalSize == 3) getSplitUsers();
                }}
              >
                <FontAwesome5 name="list" size={15} color="black" />
              </Pressable>
            </View>
            {listVisible && (
              <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: 10 }}>
                <Text style={{ fontSize: 20 }}>Users Registered</Text>
                {splitUsers ? splitUsers.map((row) => <Text key={"split-user" + row.email}>{row.email}</Text>) : null}
              </View>
            )}
            <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: 10 }}>
              <Text style={{ fontSize: 20 }}>User to Split Email</Text>
            </View>
            <View style={{ padding: verticalScale(20), backgroundColor: "white", borderRadius: 10 }}>
              <TextInput
                ref={(input) => {
                  this.textInputValue = input;
                }}
                keyboardType="email-address"
                style={{ fontSize: 20 }}
                placeholder="split-user@gmail.com"
                onChangeText={setNewEmail}
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
        content = <View style={{ flex: 4, backgroundColor: "white", borderRadius: 20, padding: verticalScale(20) }}></View>;
    }

    return content;
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  const showAlert = () =>
    Alert.alert(
      "Clear All",
      "Are you sure you want to remove all purchases permanently?",
      [
        {
          text: "Yes",
          onPress: async () => {
            let infoPurchase = await saveToStorage("purchases", "[]", email);
            let infoArchive = await saveToStorage("archived_purchases", "[]", email);

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
    <View style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ModalCustom size={modalSize} modalVisible={modalVisible} setModalVisible={setModalVisible}>
        {ModalContent()}
      </ModalCustom>
      <View style={styles.form}>
        <Pressable style={styles.buttonChoice} onPress={() => alert("Transaction not available yet")}>
          <Text style={styles.buttonText}>Transaction</Text>
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
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let server = await getFromStorage("server");
            if (server == "on") {
              let access_token = await getFromStorage("access_token");
              let purchases = await getFromStorage("purchases", email);
              ip1 = await getFromStorage("ip1");
              ip2 = await getFromStorage("ip2");
              ip3 = await getFromStorage("ip3");
              ip4 = await getFromStorage("ip4");
              let userId = await getFromStorage("userId");
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
                  await addToStorage("archived_purchases", purchases, email);
                  let info = await saveToStorage("purchases", "[]", email);
                  alert("Data uploaded to main server.");
                })
                .catch(function (res) {
                  console.log(res);
                });
            } else {
              alert("Main server not connected.");
              if (false) {
                // For testing purpose only
                let purchases = await getFromStorage("purchases", email);
                await addToStorage("archived_purchases", purchases, email);
                await saveToStorage("purchases", "[]", email);
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoPurchase = await getFromStorage("purchases", email);
            let infoArchive = await getFromStorage("archived_purchases", email);
            alert(infoPurchase + " and " + infoArchive);
          }}
        >
          <Text style={styles.buttonText}>Logs</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            showAlert();
          }}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </Pressable>
      </View>
    </View>
  );
}
