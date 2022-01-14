import React, {useEffect} from 'react';
import {Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SoundState, useAlarmPlayer} from '../hooks/alarm-player.hook';

const ActiveAlarm = () => {
  const {soundProgress, soundState, isPlaying, toggleSound, loadSound} = useAlarmPlayer('casts/powcast-test.mp3');

  useEffect(() => {
    loadSound();
  }, []);
  useEffect(() => {
    if (soundState === SoundState.Ready) {
      toggleSound();
    }
  });

  return (
    <ImageBackground source={require('../assets/bkg.jpg')} resizeMode="cover" style={styles.image} blurRadius={4}>
      <View style={styles.playButtonContainer}>
        <Progress.Circle
          progress={soundProgress}
          size={108}
          borderWidth={0}
          thickness={4}
          indeterminate={soundState === SoundState.Initializing}
          color="#276d43"
        />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.playButton} onPress={() => toggleSound()}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#45516c" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const buttonSize = 100;
const ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  image: {
    height: ScreenHeight,
  },
  playButtonContainer: {
    marginTop: '40%',
    alignSelf: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    borderRadius: buttonSize,
    width: buttonSize,
    height: buttonSize,
    backgroundColor: '#eeeeeecc',
    alignItems: 'center',
    justifyContent: 'center',

    text: {
      fontSize: 22,
    },
  },
});

export default ActiveAlarm;
