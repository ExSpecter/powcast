import {NativeModules} from 'react-native';
import shortid from 'shortid';

class AlarmService {
  constructor() {}

  public setAlarm(date: Date, id?: string): string {
    const newId = id || shortid.generate();
    NativeModules.AlarmLauncher.setAlarm(newId, date.getTime(), false);
    return newId;
  }

  public stopAlarm(id: string) {
    NativeModules.AlarmLauncher.clearAlarm(id);
  }
}

export default new AlarmService();
