import { View, Pressable, Text } from "react-native";
import Carrossel, {
  CarrosselItemsType,
} from "../../../components/carrossel/carrossel";
import CustomInput from "../../../components/customInput/customInput";
import { CustomTitle } from "../../../components/customTitle/CustomTitle";
import { FlatCalendar } from "../../../components/flatCalender/FlatCalender";
import MoneyInputHeader from "../../../components/moneyInputHeader/moneyInputHeader";
import { verticalScale } from "../../../functions/responsive";
import { styles } from "../styles";
import { dark } from "../../../utility/colors";
import { months } from "../../../utility/calendar";
import {
  InvestmentEntity,
  SecurityEntity,
} from "../../../store/database/SecurityInvestment/SecurityInvestmentEntity";

type SecurityFormProps = {
  security: SecurityEntity;
  setSecurity: React.Dispatch<React.SetStateAction<SecurityEntity>>;
  addSecurityCallback;
};

export const SecurityForm = ({
  security,
  setSecurity,
  addSecurityCallback,
}: SecurityFormProps) => {
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
        placeholder={""}
        value={security.name}
        setValue={(name) => setSecurity((prev) => ({ ...prev, name: name }))}
        label="Name"
      />
      <CustomInput
        Icon={undefined}
        placeholder={""}
        value={security.ticker}
        setValue={(ticker) =>
          setSecurity((prev) => ({ ...prev, ticker: ticker }))
        }
        capitalize="characters"
        label="Ticker"
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

type InvestmentFormProps = {
  investment: InvestmentEntity;
  setInvestment: React.Dispatch<React.SetStateAction<InvestmentEntity>>;
  securityItems: CarrosselItemsType[];
  addInvestmentCallback;
};

export const InvestmentForm = ({
  investment,
  setInvestment,
  securityItems,
  addInvestmentCallback,
}: InvestmentFormProps) => {
  return (
    <View style={{ flex: 2, gap: 20 }}>
      <MoneyInputHeader
        verticalHeight={180}
        value={investment.buyPrice.toString()}
        setValue={(buyPrice) =>
          setInvestment((prev) => ({ ...prev, buyPrice: buyPrice }))
        }
        onBlurHandle={() =>
          setInvestment((prev) => ({
            ...prev,
            buyPrice: Number(prev.buyPrice),
          }))
        }
      />
      <FlatCalendar
        date={investment?.buyDate ? new Date(investment?.buyDate) : new Date()}
        setInputBuyDate={(date) =>
          setInvestment((prev) => ({ ...prev, buyDate: date }))
        }
      />
      <CustomInput
        keyboardType="numeric"
        Icon={undefined}
        placeholder={"Shares"}
        value={investment.shares.toString()}
        setValue={(shares) =>
          setInvestment((prev) => ({ ...prev, shares: shares }))
        }
        label="Shares"
      />
      <Carrossel
        items={securityItems}
        type={investment?.security?.ticker}
        setType={(ticker) =>
          setInvestment((prev) => ({
            ...prev,
            security: { ticker: ticker },
          }))
        }
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
