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

const loadIcon = (day) => (
  <View style={{ backgroundColor: "lightblue", borderRadius: 20, padding: 3 }}>
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
          console.log(subscriptions);
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
            <FlatItem key={s.id} name={getExpenseName(s?.item)} value={s?.item?.amount} padding={15} icon={loadIcon(s?.dayOfMonth)} onPressCallback={() => console.log(s.id)} />
          ))}
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
