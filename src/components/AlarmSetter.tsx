import React, {useEffect, useState} from 'react';
import {StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MMKV, useMMKVObject} from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/Feather';
import {IAlarm} from '../domain/alarm.interface';
import AlarmService from '../services/alarm.service';
import {ActiveAlarmIdKey, AlarmKey} from '../shared/store.keys';
import WeekSelection from './WeekSelection/WeekSelection';

const storage = new MMKV();

const AlarmSetter = ({toggleSettings}: any) => {
  const [alarm, setAlarm] = useMMKVObject<IAlarm>(AlarmKey);
  const [alarmId, setAlarmId] = useMMKVObject<string | null>(ActiveAlarmIdKey);
  const [isEnabled, setIsEnabled] = useState(false);

  function validateTimeInput(updateFn: Function, value: string) {
    updateFn(parseInt(value, 10));
  }
  function setHour(value: number) {
    setAlarm({...alarm, hour: value});
  }
  function setMinute(value: number) {
    setAlarm({...alarm, minute: value});
  }

  function toggleAlarm() {
    // TODO is klar
    if (!alarmId) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + 5);
      const newAlarmId = AlarmService.setAlarm(date);
      setAlarmId(newAlarmId);
    } else {
      AlarmService.stopAlarm(alarmId);
      setAlarmId(null);
    }
  }

  function switchAlarm() {
    toggleAlarm();
    setIsEnabled(!isEnabled);
  }

  function showSettings() {
    toggleSettings();
  }

  useEffect(() => {
    // initialize alarm
    if (!alarm) {
      const now = new Date();
      setAlarm({hour: now.getHours(), minute: now.getMinutes(), active: true});
    }

    console.log('Store Keys: ' + storage.getAllKeys());
    console.log('Active AlarmId: ' + alarmId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.alarmSetterBox}>
      <View style={styles.timeSetterBox}>
        <TouchableOpacity style={styles.settingsBtn} onPress={showSettings}>
          <Icon name="settings" size={24} color="#767577" />
        </TouchableOpacity>

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

        <Switch
          trackColor={{false: '#767577', true: '#0c2b28'}}
          thumbColor={isEnabled ? '#6da34f' : '#f4f3f4'}
          onValueChange={switchAlarm}
          value={isEnabled}
          style={styles.alarmSwitch}
        />
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
    flex: 4,
    justifyContent: 'center',
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
  settingsBtn: {
    flex: 1,
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
  alarmSwitch: {
    // transform: [{rotateZ: '-90deg'}],
    flex: 1,
  },
});

export default AlarmSetter;
