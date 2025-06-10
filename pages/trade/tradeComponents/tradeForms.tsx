import { View, Pressable, Text } from "react-native";
import Carrossel from "../../../components/carrossel/carrossel";
import CustomInput from "../../../components/customInput/customInput";
import { CustomTitle } from "../../../components/customTitle/CustomTitle";
import { FlatCalendar } from "../../../components/flatCalender/FlatCalender";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import { verticalScale } from "../../../functions/responsive";
import { styles } from "../styles";
import { dark } from "../../../utility/colors";
import { months } from "../../../utility/calendar";

export const SecurityForm = ({
  inputName,
  setInputName,
  inputTicker,
  setInputTicker,
  addSecurityCallback,
}) => {
  return (
    <View style={{ flex: 1, gap: 20 }}>
      <CustomTitle
        title={"Add Security"}
        textStyle={styles.titleStyle}
        containerStyle={{
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(15),
        }}
      />
      <CustomInput
        Icon={undefined}
        placeholder={"Name"}
        value={inputName}
        setValue={setInputName}
      />
      <CustomInput
        Icon={undefined}
        placeholder={"Ticker"}
        value={inputTicker}
        setValue={setInputTicker}
        capitalize="characters"
      />
      <View style={{ flex: 1, justifyContent: "flex-end", bottom: 20 }}>
        <Pressable
          onPress={addSecurityCallback}
          style={({ pressed }) =>
            pressed ? styles.tradeButtonPressed : styles.tradeButton
          }
        >
          <Text style={styles.submitTextStyle}>Security</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const InvestmentForm = ({
  securityItems,
  addInvestmentCallback,
  inputBuyPrice,
  setInputBuyPrice,
  inputInvestmentTicker,
  setInputInvestmentTicker,
  setInputBuyDate,
  inputShareValue,
  setInputShareValue,
}) => {
  return (
    <View style={{ flex: 2, gap: 20 }}>
      <MoneyInputHeader
        verticalHeight={180}
        value={inputBuyPrice.toString()}
        setValue={setInputBuyPrice}
        onBlurHandle={() => setInputBuyPrice((prev) => Number(prev))}
      />
      <FlatCalendar date={new Date()} setInputBuyDate={setInputBuyDate} />
      <CustomInput
        keyboardType="numeric"
        Icon={undefined}
        placeholder={"Shares"}
        value={inputShareValue}
        setValue={setInputShareValue}
      />
      <Carrossel
        items={securityItems}
        type={inputInvestmentTicker}
        setType={setInputInvestmentTicker}
        size={60}
        iconBackground={dark.complementary}
      />
      <View style={{ flex: 1, justifyContent: "flex-end", bottom: 20 }}>
        <Pressable
          onPress={addInvestmentCallback}
          style={({ pressed }) =>
            pressed ? styles.tradeButtonPressed : styles.tradeButton
          }
        >
          <Text style={styles.submitTextStyle}>Trade</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const DateTitleFormat = ({ dates }) => {
  let date = new Date(dates);

  return (
    <View key={dates} style={styles.dateContainer}>
      <Text style={{ color: dark.textPrimary }}>{date.getDate()}</Text>
      <Text style={{ color: dark.textPrimary }}>{months[date.getMonth()]}</Text>
      <Text style={{ color: dark.textPrimary }}>{date.getFullYear()}</Text>
    </View>
  );
};
