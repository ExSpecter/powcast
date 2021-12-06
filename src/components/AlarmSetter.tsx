import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {AlarmService} from '../services/alarm.service';
import WeekSelection from './WeekSelection/WeekSelection';

const AlarmSetter = () => {
  const now = new Date();
  const [hour, onChangeHour] = React.useState<string>(
    now.getHours().toString(),
  );
  const [minute, onChangeMinute] = React.useState<string>(
    now.getMinutes().toString(),
  );

  const validateTimeInput = (updateFn: Function, value: string) => {
    updateFn(value);
  };

  const alarmService = new AlarmService();

  const onPressLearnMore = () => {
    const date = new Date();
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));
    date.setSeconds(date.getSeconds() + 10);

    alarmService.setAlarm(date);
  };

  return (
    <View style={styles.alarmSetterBox}>
      <View style={styles.timeSetterBox}>
        <View style={styles.timeInput}>
          <TextInput
            style={[styles.input, styles.hourInput]}
            onChangeText={text => validateTimeInput(onChangeHour, text)}
            value={hour}
            keyboardType="numeric"
            selectTextOnFocus
            maxLength={2}
          />
          <Text style={styles.timeDots}>:</Text>
          <TextInput
            style={[styles.input, styles.minuteInput]}
            onChangeText={text => validateTimeInput(onChangeMinute, text)}
            value={minute}
            keyboardType="numeric"
            selectTextOnFocus
            maxLength={2}
          />
        </View>

        <Pressable style={styles.setAlarmBtn} onPress={onPressLearnMore}>
          <Text style={styles.setAlarmBtnText}>Set</Text>
        </Pressable>
      </View>

      <View style={styles.weekDayBox}>
        <WeekSelection />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmSetterBox: {
    width: '80%',
    marginVertical: 40,
    marginHorizontal: '10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeSetterBox: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  timeInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 36,
    color: '#45516c',
  },
  timeDots: {
    fontSize: 36,
    color: '#45516c',
  },
  hourInput: {
    textAlign: 'right',
  },
  minuteInput: {},
  setAlarmBtn: {
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#eaeaeb',
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setAlarmBtnText: {
    fontSize: 24,
  },
  weekDayBox: {
    height: 44,
    width: '100%',
    backgroundColor: '#f7f8fb',
    borderTopColor: '#eaeaeb',
    borderTopWidth: 1,
  },
});

export default AlarmSetter;
