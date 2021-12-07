import storage from '@react-native-firebase/storage';
import React, {useEffect, useReducer, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';

const checkSoundReducer = (
  state: NodeJS.Timer | null,
  action: {type: 'SetInterval' | 'ClearInterval'; interval?: NodeJS.Timer},
): NodeJS.Timer | null => {
  switch (action.type) {
    case 'SetInterval':
      return action.interval || null;
    case 'ClearInterval':
      if (state) {
        clearInterval(state);
      }
      return null;
    default:
      return state;
  }
};

enum SoundState {
  Initializing = 'Init',
  Ready = 'Ready',
  Paused = 'Pause',
  Playing = 'Playing',
}

const updateSoundState = (
  state: SoundState,
  action: SoundState,
): SoundState => {
  return action;
};

const ActiveAlarm = () => {
  const reference = storage().ref('casts/powcast-test.mp3');

  const [sound, setSound] = useState<Sound | null>(null);
  const [soundState, setSoundState] = useReducer(
    updateSoundState,
    SoundState.Initializing,
  );
  const [, dispatch] = useReducer(checkSoundReducer, null);
  const [soundProgress, setSoundProgress] = useState(0);

  // TODO the callbacks are not reactive
  function toggleSound() {
    if (soundState === SoundState.Initializing) return;

    if (soundState === SoundState.Playing) {
      setSoundState(SoundState.Paused);
      sound?.pause(() => {
        stopProgressCheck();
      });
    } else {
      setSoundState(SoundState.Playing);
      startProgressCheck();

      sound?.play(() => {
        setSoundState(SoundState.Paused);
        stopProgressCheck();
      });
    }
  }

  async function loadSound() {
    const soundUrl = await reference.getDownloadURL();

    var soundFile = new Sound(soundUrl, Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }

      setTimeout(() => {
        setSoundState(SoundState.Ready);
      }, 1000);
    });

    setSound(soundFile);

    // TODO autoplay
  }

  function startProgressCheck() {
    const interval = setInterval(() => checkSoundProgress(), 250);
    dispatch({type: 'SetInterval', interval});
  }
  function stopProgressCheck() {
    dispatch({type: 'ClearInterval'});
  }
  function checkSoundProgress() {
    sound?.getCurrentTime(seconds => {
      const duration = sound?.getDuration();
      setSoundProgress(seconds / duration);
    });
  }

  useEffect(() => {
    loadSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (soundState === SoundState.Ready) {
      toggleSound();
    }
  });

  return (
    <ImageBackground
      source={require('../assets/bkg.jpg')}
      resizeMode="cover"
      style={styles.image}
      blurRadius={4}>
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
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => toggleSound()}>
            <Icon
              name={soundState === SoundState.Playing ? 'pause' : 'play'}
              size={30}
              color="#45516c"
            />
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
