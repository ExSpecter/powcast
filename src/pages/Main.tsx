import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AlarmSetter from '../components/AlarmSetter';
import {InitialPropsContext} from '../shared/initial-props.context';
import Icon from 'react-native-vector-icons/Feather';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsVisible]);

  useEffect(() => {
    if (initProps?.alarmID) {
      navigation.navigate('ActiveAlarm');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/bkg.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <AlarmSetter
          style={styles.alarmSetter}
          toggleSettings={toggleSettings}
        />
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
            ]}
          />
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
  alarmSetter: {},
  spacer: {
    flex: 1,
  },
  optionArea: {
    flex: 1,
    overflow: 'hidden',
    marginTop: -34,
    alignItems: 'center',
  },
  optionWrapper: {
    backgroundColor: '#f7f8fb',
    height: SettingsHeight,
    width: '80%',
    position: 'absolute',
    borderRadius: 12,
  },
  listButtonContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
});

export default Main;
