import { View, Text, TextInput } from "react-native";
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
import ModalCustom from "../../components/modal/modal";
import DualTextInput, {
  textInputType,
} from "../../components/DualTextInput/DualTextInput";
import { NotificationBox } from "../../components/NotificationBox/NotificationBox";
import { ExpenseEnum } from "../../models/types";
import { TypeIcon } from "../../components/TypeIcon/TypeIcon";
import { verticalScale } from "../../functions/responsive";

const EditForm = ({
  subscription,
  inputConfig,
  handleSaveRecurring,
  handleDeleteRecurring,
}) => {
  return (
    <View style={_styles.mainContainer}>
      <View style={_styles.formContainer}>
        <View>
          <Text style={_styles.textTitle}>Edit Recurring Expense</Text>
        </View>
        <View style={_styles.inputContainer}>
          <TextInput
            style={_styles.textInput}
            value={
              subscription.item.entity == ExpenseEnum.Purchase
                ? subscription.item.name
                : subscription.entity
            }
            editable={false}
          />
          <DualTextInput values={inputConfig} direction="column" />
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
        <View style={{ flex: 1 }}>
          <CustomButton handlePress={handleSaveRecurring} />
        </View>
        <View style={{ flex: 1 }}>
          <CustomButton
            text="Delete"
            handlePress={handleDeleteRecurring}
            addStyle={{ backgroundColor: dark.complementarySolid }}
          />
        </View>
      </View>
    </View>
  );
};

const Icon = ({ day, name }) => (
  <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
    <TypeIcon
      icon={{
        icon: (
          <View style={_styles.centered}>
            <Text style={{ color: dark.textPrimary }}>{`D${day}`}</Text>
          </View>
        ),
        borderColor: dark.complementarySolid,
      }}
      customStyle={{
        width: verticalScale(40),
        borderRadius: 20,
      }}
    />
    <Text style={{ color: dark.textPrimary }}>{name}</Text>
  </View>
);

export default function Subscription({ navigation }) {
  const email = useContext(UserContext).email;
  const subscriptionService = new SubscriptionService();
  const styles = _styles;

  const [subscriptions, setSubscriptions] = useState<SubscriptionEntity[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionEntity>();

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

  const setSubscriptionValue = (value) => {
    const expenseEntity = subscription.item;
    expenseEntity.amount = value;

    setSubscription((subscription) => ({
      ...subscription,
      item: expenseEntity,
    }));
  };

  const handleDeleteRecurring = async () => {
    await subscriptionService.deleteById(subscription.id);
    setRefresh((r) => !r);
    setIsModalVisible(false);
  };

  const handleSaveRecurring = async () => {
    await subscriptionService.updateSubscription(email, subscription);
    setRefresh((r) => !r);
    setIsModalVisible(false);
  };

  const inputConfig: textInputType[] = [
    {
      value: subscription?.dayOfMonth.toString(),
      setValue: (_day) => {
        setSubscription((prev) => ({ ...prev, dayOfMonth: Number(_day) }));
      },
      onBlurHandle: () => {
        if (!(subscription.dayOfMonth >= 1 && subscription.dayOfMonth <= 31)) {
          setSubscription((prev) => ({ ...prev, dayOfMonth: 1 }));
        }
      },
      placeholder: "Day of month",
      icon: null,
      label: "Day of Month",
    },
    {
      value: subscription?.item.amount.toString(),
      setValue: (_item) => setSubscriptionValue(Number(_item)),
      onBlurHandle: () => {},
      placeholder: "Amount",
      icon: null,
      label: "Amount",
    },
  ];

  return (
    <LinearGradient colors={dark.gradientColourLight} style={styles.page}>
      <Header email={email} navigation={navigation} />
      <NotificationBox />
      <View style={styles.usableScreen}>
        {isModalVisible && (
          <ModalCustom
            modalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            children={
              <EditForm
                subscription={subscription}
                inputConfig={inputConfig}
                handleSaveRecurring={handleSaveRecurring}
                handleDeleteRecurring={handleDeleteRecurring}
              />
            }
          />
        )}
        <View
          style={{
            flex: 1,
            gap: 15,
            paddingVertical: 20,
            paddingHorizontal: 5,
          }}
        >
          {subscriptions?.map((s) => (
            <FlatItem
              key={s.id}
              name={<Icon day={s?.dayOfMonth} name={getExpenseName(s?.item)} />}
              value={s?.item?.amount}
              paddingVertical={10}
              paddingHorizontal={15}
              onPressCallback={() => {
                setSubscription(s);
                setIsModalVisible((visible) => !visible);
              }}
            />
          ))}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.text}>
            <Text>{`Total: ${subscriptions.reduce(
              (acc, s) => acc + Number(s.item.amount),
              0
            )}`}</Text>
            <Text style={{ fontSize: commonStyles.symbolSize }}>{`€`}</Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
