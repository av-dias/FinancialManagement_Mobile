import { Pressable, Text } from "react-native";
import React from "react";

import { _styles } from "./style";
import CardWrapper from "../cardWrapper/cardWrapper";
import { dark } from "../../utility/colors";

type ButtonSwitchPropsType = {
  options: string[];
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

export default function ButtonSwitch({
  options,
  selectedOption,
  setSelectedOption,
}: ButtonSwitchPropsType) {
  const styles = _styles;

  const onPressHandle = (optionText: string) => {
    setSelectedOption(optionText);
  };

  return (
    <CardWrapper style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={`Pressable${option}`}
          onPress={() => {
            onPressHandle(option);
          }}
          style={{
            ...styles.button,
            backgroundColor:
              selectedOption == option ? dark.secundary : dark.glass,
          }}
        >
          <Text key={`Text${option}`} style={styles.text}>
            {option}
          </Text>
        </Pressable>
      ))}
    </CardWrapper>
  );
}
