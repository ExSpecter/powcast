import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useMMKVObject} from 'react-native-mmkv';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WheelPicker} from 'react-native-wheel-picker-android';
import {IAlarmOptions} from '../domain/alarm-options.interface';
import {AlarmOptionsKey} from '../shared/store.keys';

const Options = () => {
  const [settings, setSettings] = useMMKVObject<IAlarmOptions>(AlarmOptionsKey);
  const [modalVisible, setModalVisible] = useState(false);

  const wheelData = ['Aus', '1', '2', '3', '4', '5', '10', '15', '20', '30'];

  function setSetting(key: keyof IAlarmOptions, value: any) {
    setSettings({
      ...settings,
      [key]: value,
    });
  }

  function renderOption(
    text: string,
    icon: string,
    optionKey: keyof IAlarmOptions,
  ) {
    return (
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            !!settings?.[optionKey] && styles.activeOption,
          ]}
          onPress={() => setSetting(optionKey, !settings?.[optionKey])}>
          <IonIcon
            name={icon}
            size={20}
            style={[!!settings?.[optionKey] && styles.activeText]}
          />
          <Text
            style={[
              styles.optionText,
              !!settings?.[optionKey] && styles.activeText,
            ]}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.optionWrapper}>
      <View style={styles.buttonRow}>
        {renderOption('Autplay Powcast', 'car', 'autoplay')}
        {renderOption(
          'Powcast as Ringtone',
          'notifications',
          'powcastAsRingtone',
        )}
      </View>

      <View>
        <TouchableOpacity
          style={[styles.optionButton, styles.backupRingtoneButton]}>
          <FaIcon name="life-saver" size={20} />
          <Text style={[styles.optionText]}>Backup Ringtone</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={[styles.optionLineButton]}>
          <MatIcon name="music-note" size={20} />
          <Text style={[styles.optionLineText]}>Ringtone</Text>
          <Text style={[styles.optionLineDecision]}>Marimba</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={[styles.optionLineButton]}
          onPress={() => setModalVisible(true)}>
          <MatIcon name="alarm-snooze" size={20} />
          <Text style={[styles.optionLineText]}>Snooze Time</Text>
          <Text style={[styles.optionLineDecision]}>4 min.</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modal}>
            <WheelPicker
              data={wheelData}
              selectedItemTextColor="white"
              indicatorColor="white"
            />
            <TouchableOpacity
              style={[modalStyles.closeButton]}
              onPress={() => setModalVisible(false)}>
              <Text style={modalStyles.closeButtonText}>Dismiss</Text>
            </TouchableOpacity>
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
    backgroundColor: '#3E7035',
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

  optionLineButton: {
    flexDirection: 'row',
  },
  optionLineText: {
    flex: 1,
    marginLeft: 8,
  },
  optionLineDecision: {
    color: '#3E7035',
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
    backgroundColor: '#003525',
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  closeButton: {},
  closeButtonText: {
    color: 'white',
  },
});

export default Options;
