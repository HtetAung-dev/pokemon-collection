import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, SafeAreaView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from '../../components';
import Card from '../../components/Card';
import { router } from 'expo-router';

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stored cards from AsyncStorage
  const fetchCollection = async () => {
    try {
      setLoading(true);
      const storedCollection = await AsyncStorage.getItem('collection');
      if(storedCollection) {
        const cards = JSON.parse(storedCollection);
        setCollection(cards);
      } else {
        setCollection([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      setCollection([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch collection on component mount
  useEffect( () => {
    fetchCollection();
  }, []);

  const handleNavigateToDetail = (id) => {
    router.push(`/detail/${id}`);  
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Collection</Text>

      {collection.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards in your collection yet.</Text>
        </View>
      ) : (
        <FlatList
          data={collection}
          renderItem={({item}) => <Card name={item.name} imageSrc={item.images?.small} handlePress={() => handleNavigateToDetail(item.id)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Button to refresh the collection */}
      <CustomButton title="Refresh Collection" handlePress={fetchCollection} />
    </SafeAreaView>
  );
};

export default Collection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: 80,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 5,
    marginRight: 15,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});
