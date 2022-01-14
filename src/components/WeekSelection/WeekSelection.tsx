import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useMMKVObject} from 'react-native-mmkv';
import {IAlarmDays} from '../../domain/local-storage/alarm.interface';
import {AlarmDaysKey} from '../../shared/store.keys';
import DayButton from './DayButton';

const WeekSelection = () => {
  const [enabledList, updateEnabledList] = useMMKVObject<IAlarmDays>(AlarmDaysKey);
  const dayList = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const activeDay = (() => {
    let day = new Date().getDay();
    if (day === 0) {
      day += 7;
    }
    return day - 1;
  })();

  function toggleEnabled(i: number) {
    let newEnabledList = [...(enabledList?.daySelection || [])];
    newEnabledList[i] = !newEnabledList[i];
    updateEnabledList({daySelection: newEnabledList});
  }

  return (
    <View style={styles.container}>
      {dayList.map((dayText, i) => (
        <TouchableOpacity key={dayText} onPress={() => toggleEnabled(i)}>
          <DayButton text={dayText} enabled={enabledList?.daySelection[i]} activeDay={activeDay === i} />
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
