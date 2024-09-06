import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Table, TableWrapper, Cell, Row, Rows, Col } from "react-native-table-component";
import { dark } from "../../utility/colors";
import Header from "../../components/header/header";
import { useContext, useState } from "react";
import { AppContext } from "../../store/app-context";
import { _styles } from "./style";
import { FlatItem } from "../../components/flatItem/flatItem";
import { MainCard } from "./components/mainCard";
import { CustomTitle } from "../../components/customTitle/CustomTitle";
import { IconButton } from "../../components/iconButton/IconButton";
import ModalCustom from "../../components/modal/modal";
import { AddForm } from "./components/addForm";

export default function Networth({ navigation }) {
  const appCtx = useContext(AppContext);
  const styles = _styles;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={appCtx.email} navigation={navigation} />
      <View style={styles.usableScreen}>
        {modalVisible && (
          <ModalCustom modalVisible={modalVisible} setModalVisible={setModalVisible} size={15} hasColor={true}>
            <AddForm />
          </ModalCustom>
        )}
        <View style={styles.mainContainer}>
          <MainCard
            value={"42000"}
            absoluteIncrease={"500€"}
            relativeIncrease={"15%"}
            title={"Grossworth"}
            icon={<FontAwesome5 name="money-check" size={24} color={dark.secundary} />}
          />
          <MainCard
            value={"36000"}
            absoluteIncrease={"200€"}
            relativeIncrease={"5%"}
            title={"Networth"}
            icon={<FontAwesome5 name="money-check-alt" size={24} color="lightblue" />}
          />
        </View>
        <View style={{ flex: 1, gap: 10, padding: 5 }}>
          <View style={styles.dividerContainer}>
            <CustomTitle title="Portefolio" icon={<FontAwesome name="book" size={24} color="white" />} />
            <IconButton
              icon={<Entypo name="add-to-list" size={18} color={"white"} />}
              onPressHandle={() => {
                setModalVisible(true);
              }}
            />
          </View>
          <ScrollView contentContainerStyle={{ gap: 5 }}>
            {[
              { name: "Bond", value: 2000 },
              { name: "TR Cash", value: 11000 },
              { name: "TR Wealth", value: 2000 },
              { name: "AIB", value: 2000 },
              { name: "REV", value: 11000 },
              { name: "Caution", value: 2000 },
              { name: "Crypto", value: 2000 },
              { name: "Aon", value: 11000 },
            ].map((item) => (
              <FlatItem key={item.name} name={item.name} value={item.value} />
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
