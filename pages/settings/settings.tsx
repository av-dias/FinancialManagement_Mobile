import { Text, View, TextInput, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import ModalCustom from "../../components/modal/modal";
import { verticalScale } from "../../functions/responsive";
import { LinearGradient } from "expo-linear-gradient";
import commonStyles from "../../utility/commonStyles";
import * as FileSystem from "expo-file-system";

import { getSplitUsers, getSplitEmail } from "../../functions/split";
import {
  saveToStorage,
  getFromStorage,
  addToStorage,
} from "../../functions/secureStorage";
import { _styles } from "./style";
import { getUser } from "../../functions/basic";
import { KEYS } from "../../utility/storageKeys";
import Header from "../../components/header/header";
import { dark } from "../../utility/colors";
import { ExpensesService } from "../../service/ExpensesService";
import { IncomeService } from "../../service/IncomeService";
import { PortfolioService } from "../../service/PortfolioService";
import { TradeService } from "../../service/TradeService";
import { SubscriptionService } from "../../service/SubscriptionService";

const MODAL_DEFAULT_SIZE = 6;
const MODAL_LARGE_SIZE = 9;

export default function Settings({ navigation }) {
  const styles = _styles;
  const expenseService = new ExpensesService();
  const incomeService = new IncomeService();
  const portfolioService = new PortfolioService();
  const tradeService = new TradeService();
  const subscriptionService = new SubscriptionService();

  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentFlag, setModalContentFlag] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [listVisible, setListVisible] = useState(false);
  const [modalSize, setModalSize] = useState(MODAL_DEFAULT_SIZE);
  const [splitUsers, setSplitUsers] = useState([]);

  const handleNewSplitUser = async () => {
    let value = [{ email: newEmail, name: newName }];
    let user = await getUser();
    await addToStorage(KEYS.SPLIT_USERS, JSON.stringify(value), user);
    await getSplitUsers(setSplitUsers, email);

    if (this.textInputName) this.textInputName.clear();
    if (this.textInputEmail) this.textInputEmail.clear();
    setNewEmail("");
    setNewName("");
  };

  const ModalContent = () => {
    let content;

    switch (modalContentFlag) {
      case "split":
        content = (
          <View
            style={{
              flex: 4,
              backgroundColor: "transparent",
              borderRadius: commonStyles.borderRadius,
              padding: verticalScale(30),
              gap: 20,
            }}
          >
            <View
              style={{
                position: "absolute",
                right: 0,
                zIndex: 1,
                backgroundColor: "transparent",
                padding: 10,
              }}
            >
              <Pressable
                style={{}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setModalSize(MODAL_DEFAULT_SIZE);
                  setListVisible(false);
                }}
              >
                <Entypo name="cross" size={verticalScale(20)} color="white" />
              </Pressable>
            </View>
            <View
              style={{
                position: "absolute",
                left: 0,
                zIndex: 1,
                backgroundColor: "transparent",
                padding: 10,
              }}
            >
              <Pressable
                testID="split_list"
                style={{}}
                onPress={async () => {
                  setModalSize(
                    modalSize == MODAL_LARGE_SIZE
                      ? MODAL_DEFAULT_SIZE
                      : MODAL_LARGE_SIZE
                  );
                  setListVisible(!listVisible);
                }}
              >
                <FontAwesome5 name="list" size={15} color="white" />
              </Pressable>
            </View>
            {listVisible && (
              <View
                style={{
                  marginTop: verticalScale(20),
                  padding: verticalScale(20),
                  backgroundColor: "white",
                  borderRadius: commonStyles.borderRadius,
                }}
              >
                <Text style={{ fontSize: 20 }}>Users Registered</Text>
                {splitUsers
                  ? splitUsers.map((row) => (
                      <Text key={"split-user" + getSplitEmail(row)}>
                        {getSplitEmail(row)}
                      </Text>
                    ))
                  : null}
              </View>
            )}
            <View
              style={{
                marginTop: verticalScale(40),
                padding: verticalScale(20),
                backgroundColor: "white",
                borderRadius: commonStyles.borderRadius,
              }}
            >
              <Text style={{ fontSize: 20 }}>User to Split Email</Text>
            </View>
            <View
              style={{
                padding: verticalScale(10),
                backgroundColor: "white",
                borderRadius: commonStyles.borderRadius,
              }}
            >
              <TextInput
                ref={(input) => {
                  this.textInputEmail = input;
                }}
                keyboardType="email-address"
                placeholderTextColor={"gray"}
                style={{ fontSize: 20, color: "black" }}
                placeholder="split-user@gmail.com"
                onChangeText={setNewEmail}
              />
            </View>
            <View
              style={{
                padding: verticalScale(10),
                backgroundColor: "white",
                borderRadius: commonStyles.borderRadius,
              }}
            >
              <TextInput
                ref={(input) => {
                  if (this.textInputName && input) this.textInputName = input;
                }}
                keyboardType="default"
                placeholderTextColor={"gray"}
                style={{ fontSize: 20, color: "black" }}
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
        content = (
          <View
            style={{
              flex: 4,
              backgroundColor: "white",
              borderRadius: commonStyles.borderRadius,
              padding: verticalScale(20),
            }}
          ></View>
        );
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
            //let infoSplit = await saveToStorage(KEYS.SPLIT_USERS, "[]", email);
            let infoTransaction = await saveToStorage(
              KEYS.TRANSACTION,
              "[]",
              email
            );
            alert("Cleared");
          },
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <ModalCustom
        size={modalSize}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        {ModalContent()}
      </ModalCustom>
      <View style={styles.form}>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let filename = "fm_" + new Date().getTime() + ".txt",
              mimetype = "text/plain";

            /* Object.keys(KEYS).map(async (key) => {
              let data = await getFromStorage(KEYS[key], email);
              if (data) {
                uriRaw.push(KEYS[key]);
                uriRaw.push(data);
              }
            }); */
            const income = await incomeService.getAllIncome(email);
            const portfolio = await portfolioService.getAllPortfolio(email);
            const expenses = await expenseService.getAllExpenses(email);
            const trade = await tradeService.getAllTrade(email);
            const subscriptions = await subscriptionService.getAll(email);
            const uriRaw = [].concat(
              "INCOME",
              income,
              "PORTFOLIO",
              portfolio,
              "EXPENSES",
              expenses,
              "TRADE",
              trade,
              "SUBSCRIPTION",
              subscriptions
            );

            //console.log(uriRaw);

            try {
              const permissions =
                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

              if (permissions.granted) {
                const base64Data = uriRaw
                  .map((item) => JSON.stringify(item))
                  .join("\n");

                console.log(filename);
                console.log(base64Data);

                const fileUri =
                  await FileSystem.StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    filename,
                    mimetype
                  );

                console.log(fileUri);

                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                  encoding: FileSystem.EncodingType.UTF8,
                });

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
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoPurchase = await getFromStorage(KEYS.PURCHASE, email);
            alert(infoPurchase);
          }}
        >
          <Text style={styles.buttonText}>Logs: Purchase</Text>
        </Pressable>
        <Pressable
          style={styles.buttonChoice}
          onPress={async () => {
            let infoTransaction = await getFromStorage(KEYS.TRANSACTION, email);
            alert(infoTransaction);
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
