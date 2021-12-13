import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {IPowcastDto} from '../domain/dtos/powcast.dto';
import {useAlarmPlayer} from '../hooks/alarm-player.hook';
import PowcastService from '../services/powcast.service';

const CastList = ({navigation}: any) => {
  const [powtcastList, setList] = useState<IPowcastDto[]>([]);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const {toggleSound, loadSound, isPlaying} = useAlarmPlayer(
    'casts/powcast-test.mp3',
  );

  function back() {
    navigation.goBack();
  }

  function playSound(index: number) {
    setPlayingIndex(index);
    toggleSound();
  }

  // function addPowcast() {
  //   PowcastService.add({
  //     filename: 'powcast-test.mp3',
  //     name: 'Dschungel Jungs',
  //     description:
  //       'Einer gefährlichen Bootstour folgt eine Wundergeschichte der Menschheit',
  //     source: 'Im Grunde gut',
  //     playtime: 56,
  //   });
  // }

  async function getPowcastList() {
    const powcasts = await PowcastService.getList();
    const list = powcasts.docs.map(doc => doc.data());
    // console.log(powcasts.docs.length, list);
    console.log(new Date(list[0].created.seconds * 1000));
    setList(list as IPowcastDto[]);
  }

  useEffect(() => {
    getPowcastList();
    loadSound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderItem({item, index}: any): any {
    return (
      <View
        style={[styles.listItem, index === playingIndex && styles.activeItem]}>
        <Icon
          name="headphones"
          size={28}
          color={index === playingIndex ? 'white' : undefined}
        />
        <View style={styles.itemTextContainer}>
          <Text
            style={[
              styles.listItemText,
              index === playingIndex && styles.activeText,
            ]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.listItemSubtext,
              index === playingIndex && styles.activeText,
            ]}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => playSound(index)}>
          <Icon
            name={
              isPlaying && index === playingIndex
                ? 'pause-circle'
                : 'play-circle'
            }
            size={28}
            color={index === playingIndex ? 'white' : undefined}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <TouchableOpacity style={styles.header} onPress={back}>
        <Icon name="arrow-left" size={28} />
      </TouchableOpacity>
      <Text style={styles.title}>Cast List</Text>
      <FlatList
        data={powtcastList}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f1f2f5',
  },
  header: {
    padding: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    marginTop: 48,
    marginBottom: 28,
    textAlign: 'center',
  },
  listItem: {
    marginTop: 12,
    marginHorizontal: 10,
    paddingVertical: 18,
    paddingHorizontal: 22,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 20,
    // color: 'white', // this for playing
  },
  listItemSubtext: {
    fontSize: 14,
  },
  activeText: {
    color: 'white',
  },
  activeItem: {
    backgroundColor: '#5f8d3e', // this for playing
  },
  itemTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  downloadBtn: {},
});

export default CastList;
