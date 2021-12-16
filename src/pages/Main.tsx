import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  NativeModules,
} from 'react-native';
import AlarmSetter from '../components/AlarmSetter';
import {InitialPropsContext} from '../shared/initial-props.context';
import Icon from 'react-native-vector-icons/Feather';
import Options from '../components/Options';

const SettingsHeight = Dimensions.get('window').height / 2; // TODO based on view height

const Main = ({navigation}: any) => {
  const initProps: any = useContext(InitialPropsContext);
  const settingsTop = useRef(new Animated.Value(1)).current;
  const [settingsVisible, setSettingsVisibility] = useState(false);

  function goToCastList() {
    navigation.navigate('CastList');
  }

  function showSettings() {
    Animated.timing(settingsTop, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
  function hideSettings() {
    Animated.timing(settingsTop, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  const toggleSettings = useCallback(() => {
    if (settingsVisible) {
      hideSettings();
      setSettingsVisibility(false);
    } else {
      showSettings();
      setSettingsVisibility(true);
    }
  }, [settingsVisible]);

  useEffect(() => {
    if (initProps?.alarmID) {
      navigation.navigate('ActiveAlarm');
    }

    NativeModules.Ringtones.listRingtones((list: any) => console.log({list}));
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground source={require('../assets/bkg.jpg')} resizeMode="cover" style={styles.image}>
        <View style={styles.alarmSetter}>
          <AlarmSetter toggleSettings={toggleSettings} />
        </View>
        <View style={styles.optionArea}>
          <Animated.View
            style={[
              styles.optionWrapper,
              {
                transform: [
                  {
                    translateY: settingsTop.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -1 * SettingsHeight],
                    }),
                  },
                ],
              },
            ]}>
            <Options />
          </Animated.View>
        </View>
        <View style={styles.listButtonContainer}>
          <TouchableOpacity onPress={() => goToCastList()}>
            <Icon name="menu" size={30} color="#eeeeee" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  image: {
    height: ScreenHeight,
  },
  alarmSetter: {
    zIndex: 4,
  },
  spacer: {
    flex: 1,
  },
  optionArea: {
    flex: 1,
    overflow: 'hidden',
    marginTop: -50, //-34,
    alignItems: 'center',
    zIndex: 3,
  },
  optionWrapper: {
    backgroundColor: '#f7f8fb',
    height: SettingsHeight,
    width: '80%',
    position: 'absolute',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
  },
  listButtonContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
});

export default Main;
