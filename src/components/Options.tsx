import React, {useEffect, useRef, useState} from 'react';
import {Animated, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMMKVObject} from 'react-native-mmkv';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WheelPicker} from 'react-native-wheel-picker-android';
import {IAlarmOptions} from '../domain/local-storage/alarm-options.interface';
import {AlarmOptionsKey} from '../shared/store.keys';
import {Primary, Secondary, Tertiary} from '../styles/colors';

const Options = () => {
  const [settings, setSettings] = useMMKVObject<IAlarmOptions>(AlarmOptionsKey);

  const [modalVisible, setModalVisible] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(settings?.snoozeTime);

  const backupView = useRef(new Animated.Value(0)).current;
  const [showBackupButton, setShowBackupButton] = useState(false);

  const wheelData = ['Aus', '1', '2', '3', '4', '5', '10', '15', '20', '30'];

  function setSetting(key: keyof IAlarmOptions, value: any) {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  useEffect(
    () =>
      Animated.timing(backupView, {
        toValue: settings?.powcastAsRingtone ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start(),
    [settings],
  );

  useEffect(() => {
    backupView.addListener(({value}) => setShowBackupButton(value !== 0));
  }, []);

  function renderOption(text: string, icon: string, optionKey: keyof IAlarmOptions, disabled?: boolean) {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.optionButton, !!settings?.[optionKey] && styles.activeOption, disabled && styles.disabled]}
          onPress={() => setSetting(optionKey, !settings?.[optionKey])}
          disabled={disabled}>
          <IonIcon name={icon} size={20} style={[!!settings?.[optionKey] && styles.activeText]} />
          <Text style={[styles.optionText, !!settings?.[optionKey] && styles.activeText]}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.optionWrapper}>
      <View style={styles.buttonRow}>
        {renderOption('Autplay Powcast', 'car', 'autoplay', !!settings?.powcastAsRingtone)}
        {renderOption('Powcast as Ringtone', 'notifications', 'powcastAsRingtone')}
      </View>

      {showBackupButton && (
        <Animated.View
          style={{
            left: backupView.interpolate({inputRange: [0, 1], outputRange: [-200, 0]}),
            opacity: backupView.interpolate({inputRange: [0, 1], outputRange: [0.2, 1]}),
          }}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              styles.backupRingtoneButton,
              !!settings?.backupRingtone && styles.activeOption,
            ]}
            onPress={() => setSetting('backupRingtone', !settings?.backupRingtone)}>
            <FaIcon name="life-saver" size={20} style={[!!settings?.backupRingtone && styles.activeText]} />
            <Text style={[styles.optionText, !!settings?.backupRingtone && styles.activeText]}>Backup Ringtone</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View>
        <View style={styles.optionLineWrapper}>
          <TouchableOpacity style={[styles.optionLineButton]}>
            <MatIcon name="music-note" size={20} />
            <Text style={[styles.optionLineText]}>Ringtone</Text>
            <Text style={[styles.optionLineDecision]}>Marimba</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionLineWrapper}>
          <TouchableOpacity style={[styles.optionLineButton]} onPress={() => setModalVisible(true)}>
            <MatIcon name="alarm-snooze" size={20} />
            <Text style={[styles.optionLineText]}>Snooze Time</Text>
            <Text style={[styles.optionLineDecision]}>
              {settings?.snoozeTime ? `${settings?.snoozeTime} min.` : 'Aus'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modal}>
            <WheelPicker
              data={wheelData}
              selectedItemTextColor="white"
              indicatorColor="white"
              onItemSelected={index => setSnoozeTime(index > 0 ? parseInt(wheelData[index], 10) : 0)}
            />

            <View style={modalStyles.buttonWrapper}>
              <TouchableOpacity style={[modalStyles.modalButton]} onPress={() => setModalVisible(false)}>
                <Text style={modalStyles.closeButtonText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.modalButton]}
                onPress={() => {
                  setSetting('snoozeTime', snoozeTime);
                  setModalVisible(false);
                }}>
                <Text style={modalStyles.setButtonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  optionWrapper: {
    justifyContent: 'space-evenly',
    height: '100%',
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  optionButton: {
    padding: 8,
    height: 80,
    justifyContent: 'space-between',
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
  },
  optionText: {
    textAlign: 'right',
  },
  activeOption: {
    backgroundColor: Tertiary,
  },
  activeText: {
    color: 'white',
  },
  backupRingtoneButton: {
    paddingVertical: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    height: 'auto',
  },
  disabled: {
    opacity: 0.6,
  },

  optionLineWrapper: {
    marginVertical: 18,
  },
  optionLineButton: {
    flexDirection: 'row',
  },
  optionLineText: {
    flex: 1,
    marginLeft: 8,
  },
  optionLineDecision: {
    color: Secondary,
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffbb',
  },
  modal: {
    backgroundColor: Secondary,
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {},
  closeButtonText: {
    color: 'white',
  },
  setButtonText: {
    color: Primary,
  },
});

export default Options;
