import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View, Alert, Button, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import {CustomButton, Loader} from '../components';

import { useGlobalContext } from "../context/globalProvider";


export default function App() {
    const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className=" bg-primary h-full">
        <Loader isLoading={loading} />
      <ScrollView contentContainerStyle={{ heiht: '100%' }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image
            source={images.pokeLogo}
            className='w-[180px] h-[84px]'
            resizeMode='contain'
          />
          <Image
            source={images.pokeCard}
            className='max-w-[350px] w-full h-[300px]'
            resizeMode='contain'
          />
          <View className='relative mt-5'>
            <Text className='text-3xl text-white font-bold text-center'>
              Let's collect 
              <Text className='text-secondary-200'>
                Pokémon
              </Text>
            </Text>
            <Image
              source={images.path}
              className='w-[136px] h-[13px] absolute -bottom-1 -right-8'
              resizeMode='contain'
            />
          </View>
          <Text className='text-sm font-pregualr text-gray-100 mt-7 text-center'>
            Browse and collect your own battle cards with poke cards
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles='w-full mt-7'
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
}
