import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import "reflect-metadata";

import Login from "./pages/login/login";
import Home from "./pages/home/home";
import List from "./pages/list/list";
import Settings from "./pages/settings/settings";
import Budget from "./pages/budget/budget";
import Add from "./pages/add/add";

import AppContextProvider from "./store/app-context";
import UserContextProvider from "./store/user-context";

//Styles
import { styles } from "./style";

// Removing annoying warning from VictoryChart
import { LogBox } from "react-native";
import Networth from "./pages/networth/networth";
import { DatabaseConnectionProvider } from "./store/database-context";
import Trade from "./pages/trade/trade";

const IGNORED_LOGS = ["Warning: Failed prop type: Invalid prop `domain` supplied to `VictoryLine`."];
LogBox.ignoreLogs(IGNORED_LOGS);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const iconSize = 24;

const MainIcon = () => (
  <View style={styles.mainContainer}>
    <Ionicons name="add-circle-outline" size={50} color="grey" />
  </View>
);

function HomeTabs() {
  return (
    <UserContextProvider>
      <DatabaseConnectionProvider>
        <AppContextProvider>
          <Tab.Navigator screenOptions={() => ({ tabBarShowLabel: false, headerShown: false, tabBarStyle: styles.tab, navigationBarColor: "gold" })}>
            <Tab.Screen name="Dashboard" component={Home} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={iconSize} color="white" /> }} />
            <Tab.Screen name="Stats" component={Budget} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={iconSize} color="white" /> }} />
            <Tab.Screen name="Purchase" component={Add} options={{ tabBarIcon: ({ color, size }) => <MainIcon /> }} />
            <Tab.Screen name="Networth" component={Networth} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <AntDesign name="piechart" size={iconSize} color="white" /> }} />
            <Tab.Screen name="List" component={List} options={{ headerShown: false, tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={iconSize} color="white" /> }} />
            <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarButton: (props) => null }} />
            <Tab.Screen name="Trade" component={Trade} options={{ headerShown: false, tabBarButton: (props) => null }} />
          </Tab.Navigator>
        </AppContextProvider>
      </DatabaseConnectionProvider>
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
