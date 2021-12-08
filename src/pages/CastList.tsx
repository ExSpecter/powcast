import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const CastList = ({navigation}: any) => {
  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ];

  function back() {
    navigation.goBack();
  }

  function renderItem({item}: any): any {
    return (
      <View style={styles.listItem}>
        <Icon name="headphones" size={28} color="#ffffff" />
        <Text style={styles.listItem.text}>{item.title}</Text>
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
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f7f8fb',
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
    backgroundColor: '#5f8d3e',
    borderRadius: 8,
    flexDirection: 'row',

    text: {
      fontSize: 24,
      color: 'white',
      marginLeft: 12,
    },
  },
});

export default CastList;
