import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {MMKV} from 'react-native-mmkv';
import {IPowcastDto} from '../domain/dtos/powcast.dto';
import {IUnlockedCasts} from '../domain/local-storage/unlocked-cast.interface';
import {UnlockedCasts} from '../shared/store.keys';
import moment from 'moment-mini';

export type PowcastDocument = FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;

const powcastCollection = firestore().collection('Powcasts');
const localStorage = new MMKV();

class PowcastService {
  public getList() {
    return powcastCollection.get();
  }

  public get(id: string) {
    return powcastCollection.doc(id).get();
  }

  public add(item: IPowcastDto) {
    return powcastCollection.add({
      ...item,
      created: firestore.FieldValue.serverTimestamp(),
    });
  }

  public async getPowcastForAlarm() {
    const lastCastList = this.getLastPowcast();
    console.log(lastCastList);

    const lastCast = (
      await this.get(lastCastList.unlockedCastId[lastCastList.unlockedCastId.length - 1])
    ).data() as IPowcastDto;

    if (!lastCast) {
      return this.getNextPowcastAndUpdateList('3yQWa36H1S9i9xMPwqTR'); // first cast id TODO fetch episode 1
    }

    if (lastCastList.lastCastDate && moment().isSame(moment(lastCastList.lastCastDate), 'day')) {
      return lastCast;
    } else {
      const nextCast = await this.getNextPowcastAndUpdateList(lastCast.nextCastId);
      return nextCast || lastCast;
    }
  }

  private async getNextPowcastAndUpdateList(castId: string): Promise<IPowcastDto | null> {
    const newCast = await this.get(castId);
    if (!newCast) return null;

    this.updateLastPowcastList(newCast);

    return newCast.data() as IPowcastDto;
  }

  private getLastPowcast(): IUnlockedCasts {
    const castJson = localStorage.getString(UnlockedCasts);
    if (!castJson) {
      return {
        lastCastDate: null,
        unlockedCastId: [],
      };
    }
    return JSON.parse(castJson);
  }

  private updateLastPowcastList(newCast: PowcastDocument) {
    const lastCastList = this.getLastPowcast();
    lastCastList.unlockedCastId.push(newCast.id);
    lastCastList.lastCastDate = moment().toISOString();
    this.saveLastPowcast(lastCastList);
  }

  private saveLastPowcast(unlockedCasts: IUnlockedCasts) {
    localStorage.set(UnlockedCasts, JSON.stringify(unlockedCasts));
  }
}

export default new PowcastService();
