import { FlatList, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import _, { orderBy } from 'lodash';
import { setFilter } from '../../redux/filterSlice';
import Card from '../../components/Card';
import { router } from 'expo-router';

// fetch cards with pagination, search and filters query
const fetchCards = async ({ pageParam = 1, queryKey }) => {
  const [, filters] = queryKey;
  const { nameFilter, rarity, cardType } = filters;

  const query = [];

  if (nameFilter) query.push(`name:${nameFilter}`);
  if (rarity) query.push(`rarity:${rarity}`);
  if (cardType) query.push(`types:${cardType}`);

  const res = await axios.get('https://api.pokemontcg.io/v2/cards/', {
    params: {
      page: pageParam,
      pageSize: 15,
      q: query.length > 0 ? query.join(' ') : '',
    },
  });
  return {
    cards: res.data.data,
    nextPage: pageParam + 1,
    hasMore: res.data.data.length > 0,
  };
};

// Fetch rarities and card types 
const fetchRaritiesAndTypes = async () => {
  try {
    const rarityResponse = await axios.get('https://api.pokemontcg.io/v2/rarities');
    const typeResponse = await axios.get('https://api.pokemontcg.io/v2/types');

    return {
      rarities: rarityResponse.data.data,
      cardTypes: typeResponse.data.data,
    };
  } catch (error) {
    console.error('Error fetching rarities and card types:', error);
    return { rarities: [], cardTypes: [] };
  }
};

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [rarity, setRarity] = useState('');
  const [cardType, setCardType] = useState('');
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  const queryClient = useQueryClient();

  // Fetch rarities and card types
  const { data: optionsData } = useQuery('raritiesAndTypes', fetchRaritiesAndTypes);

  // Debounce setFilter function for optimization
  const debouncedSetFilter = useMemo(
    () =>
      _.debounce((name, rarity, type) => {
        dispatch(setFilter({
          nameFilter: name,
          rarity: rarity,
          cardType: type
        }));
      }, 500),
    [dispatch]
  );

  // Use effect to trigger debounced function when inputValue changes
  useEffect(() => {
    debouncedSetFilter(inputValue, rarity, cardType);
  }, [inputValue, rarity, cardType, debouncedSetFilter]);

  // Use effect to reset query data when the filter changes
  useEffect(() => {
    queryClient.invalidateQueries('cards'); // Reset the query when the filter changes
  }, [filter, queryClient]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery(['cards', filter], fetchCards, {
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleNavigateToDetail = (id) => {
    router.push(`/${id}`);  // Navigate to detail page with ID
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const cards = data?.pages.flatMap((page) => page.cards) || [];

  return (
    <SafeAreaView style={styles.container}>

      {/* name search */}
      <TextInput
        style={styles.input}
        placeholder="Search Pokémon by name..."
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
      />
      <View style={styles.pickerContainer}>
        {/* Rarity Filter */}
        <Picker
          selectedValue={rarity}
          onValueChange={setRarity}
          style={styles.picker}
        >
          <Picker.Item label="Select Rarity" value="" />
          {optionsData?.rarities?.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>

        {/* Card Type Filter */}
        <Picker
          selectedValue={cardType}
          onValueChange={setCardType}
          style={styles.picker}
          
        >
          <Picker.Item label="Select Card Type" value="" />
          {optionsData?.cardTypes?.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>


      <FlatList
        data={cards}
        renderItem={({ item }) => <Card name={item.name} imageSrc={item.images?.small} handlePress={() => handleNavigateToDetail(item.id)} />}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        // Performance optimizations
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-between', // Add space between the pickers
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
    fontSize: 10,
    padding:0,
    borderColor: '#000', // Border color
    borderWidth: 1, // Border width
    borderRadius: 5,
  },
});
