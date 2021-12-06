import {NativeModules} from 'react-native';
import shortid from 'shortid';

export class AlarmService {
  constructor() {}

  public setAlarm(date: Date, id?: string) {
    NativeModules.AlarmLauncher.setAlarm(
      id || shortid.generate(),
      date.getTime(),
      false,
    );
  }

  public stopAlarm(id: string) {
    NativeModules.AlarmLauncher.clearAlarm(id);
  }
}
