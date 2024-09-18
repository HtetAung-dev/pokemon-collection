import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Detail = () => {
    const {id} = useLocalSearchParams(id);
    console.log(id)
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`https://api.pokemontcg.io/v2/cards/${id}`);
        setCard(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  const addToCollection = async () => {
    try {
      // Get existing collection from AsyncStorage
      const existingCollection = await AsyncStorage.getItem('collection');
      let collection = existingCollection ? JSON.parse(existingCollection) : [];

      // Check if the card is already in the collection
      const isAlreadyInCollection = collection.some((item) => item.id === card.id);
      if (isAlreadyInCollection) {
        Alert.alert('Already in Collection', 'This card is already in your collection.');
        return;
      }

      // Add the new card to the collection
      collection.push(card);

      // Save the updated collection to AsyncStorage
      await AsyncStorage.setItem('collection', JSON.stringify(collection));
      Alert.alert('Success', 'Card added to collection!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add card to collection.');
    }
  };


  if (loading) return <Text className='justify-center items-center text-center'>Loading...</Text>;

  if (!card) return <Text className='justify-center items-center text-center text-red-500'>No card found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Card Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: card.images?.large }} style={styles.image} />
      </View>

      {/* Card Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.setText}>Set: {card.set?.name}</Text>
        <Text style={styles.rarityText}>Rarity: {card?.rarity}</Text>
      </View>

      {/* Card Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          {card.flavorText || 'No description available for this card.'}
        </Text>
      </View>
      {/* Card Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Stats</Text>
        <Text style={styles.statText}>HP 💪: {card.hp || 'N/A'}</Text>

        {/* Abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.statSubtitle}>Abilities 💬:</Text>
            {card.abilities.map((ability, index) => (
              <Text key={index} style={styles.statText}>
                - {ability.name}: {ability.text}
              </Text>
            ))}
          </View>
        )}

        {/* Attacks */}
        {card.attacks && card.attacks.length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.statSubtitle}>Attacks 🔥:</Text>
            {card.attacks.map((attack, index) => (
              <Text key={index} style={styles.statText}>
                - {attack.name}: {attack.text} (Damage: {attack.damage || 'N/A'})
              </Text>
            ))}
          </View>
        )}

        {/* Weaknesses */}
        {card.weaknesses && card.weaknesses.length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.statSubtitle}>Weaknesses ❤️‍🩹:</Text>
            {card.weaknesses.map((weakness, index) => (
              <Text key={index} style={styles.statText}>
                - {weakness.type}: {weakness.value}
              </Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add to Collection" onPress={addToCollection} color="#FFA001" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '90%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  setText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  rarityText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsSection: {
    marginTop: 10,
  },
  statSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  statText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginVertical: 2,
  },
  buttonContainer: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default Detail;
