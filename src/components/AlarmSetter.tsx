import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {MMKV, useMMKVObject} from 'react-native-mmkv';
import {IAlarm} from '../domain/alarm.interface';
import AlarmService from '../services/alarm.service';
import {AlarmKey} from '../shared/store.keys';
import WeekSelection from './WeekSelection/WeekSelection';
import Icon from 'react-native-vector-icons/Feather';

const storage = new MMKV();

const AlarmSetter = () => {
  const [alarm, setAlarm] = useMMKVObject<IAlarm>(AlarmKey);

  function validateTimeInput(updateFn: Function, value: string) {
    updateFn(parseInt(value, 10));
  }
  function setHour(value: number) {
    setAlarm({...alarm, hour: value});
  }
  function setMinute(value: number) {
    setAlarm({...alarm, minute: value});
  }

  function activateAlarm() {
    // TODO is klar
    const date = new Date();
    date.setSeconds(date.getSeconds() + 5);
    AlarmService.setAlarm(date);
  }

  useEffect(() => {
    if (!alarm) {
      const now = new Date();
      setAlarm({hour: now.getHours(), minute: now.getMinutes(), active: true});
    }

    console.log(storage.getAllKeys());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.alarmSetterBox}>
      <View style={styles.timeSetterBox}>
        <View style={styles.timeInput}>
          <TextInput
            style={[styles.input, styles.hourInput]}
            onChangeText={text => validateTimeInput(setHour, text)}
            value={alarm?.hour?.toString()}
            keyboardType="numeric"
            selectTextOnFocus
            maxLength={2}
          />
          <Text style={styles.timeDots}>:</Text>
          <TextInput
            style={[styles.input, styles.minuteInput]}
            onChangeText={text => validateTimeInput(setMinute, text)}
            value={alarm?.minute?.toString()}
            keyboardType="numeric"
            selectTextOnFocus
            maxLength={2}
          />
        </View>

        <Pressable style={styles.setAlarmBtn} onPress={activateAlarm}>
          <Icon name="check" size={24} color="#45516c" />
          {/* <Text style={styles.setAlarmBtnText}>Set</Text> */}
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
