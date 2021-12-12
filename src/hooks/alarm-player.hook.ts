import Sound from 'react-native-sound';
import storage from '@react-native-firebase/storage';
import {useEffect, useReducer, useState} from 'react';

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

export enum SoundState {
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

export function useAlarmPlayer(name: string, autoload = false) {
  const reference = storage().ref(name);

  const [sound, setSound] = useState<Sound | null>(null);
  const [soundState, setSoundState] = useReducer(
    updateSoundState,
    SoundState.Initializing,
  );
  const [isPlaying, setIsPlaying] = useState(false);
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
        // TODO set progress to 1
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
    setIsPlaying(soundState === SoundState.Playing);
  }, [soundState]);

  if (autoload) {
    loadSound();
  }

  return {
    soundProgress,
    soundState,
    isPlaying,
    toggleSound,
    loadSound,
  };
}
