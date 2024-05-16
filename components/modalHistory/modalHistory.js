import { Text, View, Pressable, ScrollView } from "react-native";
import { verticalScale } from "../../functions/responsive";
import { Entypo } from "@expo/vector-icons";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import commonStyles from "./../../utility/commonStyles";

//Custom Constants
import { _styles } from "../../pages/purchase/style";

export default function modalHistory(list, modalVisible, setModalVisible) {
  const styles = _styles;

  const state = {
    tableHead: ["Type", "Name", "Value", "Date"],
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: commonStyles.borderRadius,
        padding: verticalScale(20),
        marginVertical: verticalScale(10),
      }}
    >
      <View style={{ position: "absolute", right: 0, zIndex: 1, backgroundColor: "transparent", padding: 10 }}>
        <Pressable style={{}} onPress={() => setModalVisible(!modalVisible)}>
          <Entypo name="cross" size={verticalScale(20)} color="black" />
        </Pressable>
      </View>
      <View style={styles.tableInfo}>
        <Table style={styles.textCenter} borderStyle={{ borderColor: "transparent" }}>
          <Row data={state.tableHead} style={{ alignContent: "center" }} textStyle={styles.textCenterHead} />
          <ScrollView style={styles.scrollTable}>
            {list.map((rowData, index) => (
              <TableWrapper key={index} style={styles.rowTable}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell textStyle={styles.tableText} key={cellIndex} data={cellData} />
                ))}
              </TableWrapper>
            ))}
          </ScrollView>
        </Table>
      </View>
    </View>
  );
}
