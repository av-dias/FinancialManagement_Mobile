import navLogo from "../images/logo.png";
import { StyleSheet, Text, View, TextInput, Image, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import CalendarStrip from "react-native-calendar-strip";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";

import { saveToStorage, getFromStorage } from "../utility/secureStorage";
import { _styles } from "../utility/style";

export default function Purchase() {
  const styles = _styles;
  const [onLoadData, setOnLoadData] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [email, setEmail] = useState("");

  const getUser = async () => {
    try {
      const email = await getFromStorage("email");
      return email;
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setEmail(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  const handlePurchase = async () => {
    let date = this._calendar.getSelectedDate();

    console.log(type, name, value, date);
    if (type == "" || name == "" || value == "" || date == "" || !date) {
      alert("Please fill all fields.");
      return;
    }
    try {
      let purchases = await getFromStorage("purchases", email);
      let newPurchase = { type: type, name: name, value: value, dop: date.toISOString().split("T")[0] };

      if (purchases) {
        purchases = JSON.parse(purchases);
        purchases.push(newPurchase);
      } else {
        purchases = [newPurchase];
      }

      await saveToStorage("purchases", JSON.stringify(purchases), email);
      setList([[type, name, value, date.toISOString().split("T")[0]], ...list].slice(0, 3));
      this.textInputValue.clear();
      setValue("");

      console.log("Purchase: " + purchases);
    } catch (err) {
      console.log("Purchase: " + err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let email = await getUser();
      setOnLoadData(email);
    }
    // write your code here, it's like componentWillMount
    fetchData();
  }, []);

  const state = {
    tableHead: ["Type", "Name", "Value", "Date"],
  };

  return (
    <View style={styles.page}>
      <View style={styles.title}>
        <Text style={styles.headerText}>Purchase</Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.textInputLogin} placeholder="Type" onChangeText={setType} />
        <TextInput style={styles.textInputLogin} placeholder="Name" onChangeText={setName} />
        <TextInput
          ref={(input) => {
            this.textInputValue = input;
          }}
          keyboardType="numeric"
          style={styles.textInputLogin}
          placeholder="Value"
          onChangeText={setValue}
        />
        <CalendarStrip
          ref={(component) => (this._calendar = component)}
          calendarAnimation={{ type: "sequence", duration: 15 }}
          daySelectionAnimation={{ type: "border", duration: 200, borderWidth: 1, borderHighlightColor: "white" }}
          style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
          calendarHeaderStyle={{ color: "black" }}
          calendarColor={"white"}
          dateNumberStyle={{ color: "black" }}
          dateNameStyle={{ color: "black" }}
          highlightDateNumberStyle={{ color: "#2296F3" }}
          highlightDateNameStyle={{ color: "#2296F3" }}
          disabledDateNameStyle={{ color: "grey" }}
          disabledDateNumberStyle={{ color: "grey" }}
          iconContainer={{ flex: 0.1 }}
        />
      </View>
      <View style={styles.tableInfo}>
        <Table borderStyle={{ borderColor: "transparent" }}>
          <Row data={state.tableHead} style={styles.head} />
          {list.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell key={cellIndex} data={cellData} />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
      <Pressable style={styles.button} onPress={handlePurchase}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}
