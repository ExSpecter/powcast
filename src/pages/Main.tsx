import React, {useContext, useEffect} from 'react';
import {
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

const Main = ({navigation}: any) => {
  const initProps: any = useContext(InitialPropsContext);

  useEffect(() => {
    if (initProps?.alarmID) {
      navigation.navigate('ActiveAlarm');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToCastList() {
    navigation.navigate('CastList');
  }

  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/bkg.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <AlarmSetter />
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
  spacer: {
    flex: 1,
  },
  listButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
});

export default Main;
