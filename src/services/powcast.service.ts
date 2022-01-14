import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {MMKV} from 'react-native-mmkv';
import {IPowcastDto} from '../domain/dtos/powcast.dto';
import {IUnlockedCastList} from '../domain/local-storage/unlocked-cast.interface';
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
    const unlockedCastList = this.getUnlockedCastList();
    console.log(unlockedCastList);

    const lastCast = (await this.get(unlockedCastList.ids[unlockedCastList.ids.length - 1])).data() as IPowcastDto;

    if (!lastCast) {
      return this.getNextPowcastAndUpdateList('3yQWa36H1S9i9xMPwqTR'); // first cast id TODO fetch episode 1
    }

    if (this.canUnlockNextCast(lastCast, unlockedCastList)) {
      const nextCast = await this.getNextPowcastAndUpdateList(lastCast.nextCastId);
      if (nextCast) return nextCast;
    }

    return lastCast;
  }

  private canUnlockNextCast(lastCast: IPowcastDto, unlockedCasts: IUnlockedCastList) {
    return (
      !!lastCast.nextCastId &&
      !(unlockedCasts.lastUnlockDate && moment().isSame(moment(unlockedCasts.lastUnlockDate), 'day'))
    );
  }

  private async getNextPowcastAndUpdateList(castId: string | null): Promise<IPowcastDto | null> {
    if (!castId) return null;
    const newCast = await this.get(castId);
    if (!newCast) return null;

    this.updateUnlockedCastList(newCast);

    return newCast.data() as IPowcastDto;
  }

  private getUnlockedCastList(): IUnlockedCastList {
    const castJson = localStorage.getString(UnlockedCasts);
    if (!castJson) {
      return {
        lastUnlockDate: null,
        ids: [],
      };
    }
    return JSON.parse(castJson);
  }

  private updateUnlockedCastList(newCast: PowcastDocument) {
    const lastCastList = this.getUnlockedCastList();
    lastCastList.ids.push(newCast.id);
    lastCastList.lastUnlockDate = moment().toISOString();
    this.saveUnlockedCastList(lastCastList);
  }

  private saveUnlockedCastList(unlockedCasts: IUnlockedCastList) {
    localStorage.set(UnlockedCasts, JSON.stringify(unlockedCasts));
  }
}

export default new PowcastService();
