import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Tertiary} from '../../styles/colors';

const DayButton = (props: any) => {
  const [isEnabled, setIsEnabled] = useState(props.enabled);
  useEffect(() => {
    setIsEnabled(props.enabled);
  }, [props.enabled]);

  return (
    <View style={styles.container}>
      <View
        key={props}
        style={[
          styles.dayCircle,
          {
            backgroundColor: props.activeDay
              ? daySelectionStyle.dayCircleActiveColor
              : daySelectionStyle.dayCirclePassiveColor,
          },
        ]}
      />
      <View
        style={[
          styles.dayContainer,
          {
            backgroundColor: isEnabled ? daySelectionStyle.activeColor : daySelectionStyle.passiveColor,
          },
        ]}>
        <Text style={styles.dayText}>{props.text}</Text>
      </View>
    </View>
  );
};

export const daySelectionStyle = {
  activeColor: '#d3d3d3',
  passiveColor: '#0000',

  repeatButtonSize: 26,
  fontSize: 12,

  dayCircleSize: 6,
  dayCircleActiveColor: Tertiary,
  dayCirclePassiveColor: '#0000',
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    height: daySelectionStyle.repeatButtonSize,
    width: daySelectionStyle.repeatButtonSize,
    borderRadius: daySelectionStyle.repeatButtonSize / 4,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: -10,
  },
  dayCircle: {
    height: daySelectionStyle.dayCircleSize,
    width: daySelectionStyle.dayCircleSize,
    borderRadius: daySelectionStyle.dayCircleSize / 2,
    marginBottom: 2,
  },
  dayText: {
    top: -1,
    fontSize: daySelectionStyle.fontSize,
  },
});

export default DayButton;
