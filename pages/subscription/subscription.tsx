import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { dark } from "../../utility/colors";
import { _styles } from "./style";
import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { SubscriptionService } from "../../service/SubscriptionService";
import { UserContext } from "../../store/user-context";
import { SubscriptionEntity } from "../../store/database/Subscription/SubscriptionEntity";
import { FlatItem } from "../../components/flatItem/flatItem";
import { getExpenseName } from "../../functions/expenses";
import Header from "../../components/header/header";
import CustomButton from "../../components/customButton/customButton";
import commonStyles from "../../utility/commonStyles";

const loadIcon = (day) => (
  <View
    style={{
      backgroundColor: "lightblue",
      borderRadius: 7,
      padding: 3,
      width: 50,
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 11 }}>{`Day ${day}`}</Text>
  </View>
);

export default function Subscription({ navigation }) {
  const email = useContext(UserContext).email;
  const subscriptionService = new SubscriptionService();
  const styles = _styles;

  const [subscriptions, setSubscriptions] = useState<SubscriptionEntity[]>([]);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          const subscriptions = await subscriptionService.getAll(email);
          setSubscriptions(subscriptions);
        } catch (e) {
          console.log("Subscription: " + e);
        }
      }
      if (subscriptionService.isReady()) fetchData();
    }, [email, subscriptionService.isReady, refresh])
  );

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <View style={styles.usableScreen}>
        <View style={{ flex: 1, gap: 5 }}>
          {subscriptions?.map((s) => (
            <FlatItem
              key={s.id}
              name={getExpenseName(s?.item)}
              value={s?.item?.amount}
              paddingVertical={15}
              icon={loadIcon(s?.dayOfMonth)}
              onPressCallback={() => console.log(s.id)}
            />
          ))}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color: dark.textPrimary,
              backgroundColor: dark.complementary,
              borderRadius: 5,
              padding: 8,
              marginBottom: 10,
            }}
          >
            <Text>{`Total: ${subscriptions.reduce(
              (acc, s) => acc + s.item.amount,
              0
            )}`}</Text>
            <Text style={{ fontSize: commonStyles.symbolSize }}>{`€`}</Text>
          </Text>
        </View>
        <CustomButton
          text={"Delete Subscriptions"}
          handlePress={async () => {
            await subscriptionService.deleteAll(email);
            setRefresh((prev) => !prev);
          }}
        />
      </View>
    </LinearGradient>
  );
}
