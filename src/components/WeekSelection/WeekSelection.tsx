import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DayButton from './DayButton';

const WeekSelection = () => {
  const [enabledList, updateEnabledList] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const dayList = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const activeDay = (() => {
    let day = new Date().getDay();
    if (day === 0) {
      day += 7;
    }
    return day - 1;
  })();

  const toggleEnabled = (i: number) => {
    let newEnabledList = [...enabledList];
    newEnabledList[i] = !newEnabledList[i];
    updateEnabledList(newEnabledList);
  };

  return (
    <View style={styles.container}>
      {dayList.map((dayText, i) => (
        <TouchableOpacity key={dayText} onPress={() => toggleEnabled(i)}>
          <DayButton
            text={dayText}
            enabled={enabledList[i]}
            activeDay={activeDay === i}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: '10%',
    marginTop: 4,
  },
});

export default WeekSelection;
