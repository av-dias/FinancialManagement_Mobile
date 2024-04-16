import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";

import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Purchase from "./pages/purchase/purchase";
import List from "./pages/list/list";
import Settings from "./pages/settings/settings";
import Transaction from "./pages/transaction/transaction";
import Stats from "./pages/stats/stats";
import Budget from "./pages/budget/budget";

import AppContextProvider from "./store/app-context";
import UserContextProvider from "./store/user-context";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <UserContextProvider>
      <AppContextProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              height: 50,
              paddingHorizontal: 5,
              paddingTop: 5,
              backgroundColor: "black",
              position: "absolute",
              borderTopWidth: 0,
              navigationBarColor: "gold",
            },
            navigationBarColor: "gold",
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={Home}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={24} color="white" /> }}
          />
          <Tab.Screen
            name="Stats"
            component={Stats}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={24} color="white" /> }}
          />
          <Tab.Screen
            name="Budget"
            component={Budget}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <AntDesign name="piechart" size={20} color="white" /> }}
          />
          <Tab.Screen
            name="Purchase"
            component={Purchase}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={24} color="white" /> }}
          />
          <Tab.Screen
            name="Transaction"
            component={Transaction}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="compare-arrows" size={25} color="white" /> }}
          />
          <Tab.Screen
            name="List"
            component={List}
            options={{ headerShown: false, tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={20} color="white" /> }}
          />
          <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarButton: (props) => null }} />
        </Tab.Navigator>
      </AppContextProvider>
    </UserContextProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="black" hidden={false} />
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false /* , orientation: "all" */ }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false /* , orientation: "all" */ }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4e4fc",
    alignItems: "center",
    justifyContent: "center",
  },
});
