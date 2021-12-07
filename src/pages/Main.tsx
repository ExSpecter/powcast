import React, {useContext, useEffect} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AlarmSetter from '../components/AlarmSetter';
import {InitialPropsContext} from '../shared/initial-props.context';

const Main = ({navigation}: {navigation: any}) => {
  const initProps: any = useContext(InitialPropsContext);

  useEffect(() => {
    navigation.navigate('ActiveAlarm');
    if (initProps?.alarmID) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/bkg.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <AlarmSetter />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  image: {
    height: ScreenHeight,
  },
});

export default Main;
