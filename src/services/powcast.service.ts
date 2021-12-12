import firestore from '@react-native-firebase/firestore';
import {IPowcastDto} from '../domain/dtos/powcast.dto';

const powcastCollection = firestore().collection('Powcasts');

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
}

export default new PowcastService();
