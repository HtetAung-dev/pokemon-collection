import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/globalProvider';
import { signOut } from '../../lib/appwrite/appwriteClient';
import { icons, images } from '../../constants';

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const router = useRouter();

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);

      router.replace("/sign-in");
    } catch (error) {
      console.error('Failed to log out:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  useEffect(() => {
    console.log('user avater', user.avater)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <View className="w-100 flex justify-center items-center">
            <View className="w-20 h-20 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg "
                resizeMode="cover"
              />
            </View>
          </View>
          <Text style={styles.title}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View>
            <TouchableOpacity style={styles.card} onPress={()=> router.push('/collection')}>
              <Image source={images.pokeLogo} style={styles.image} />
              <Text style={styles.name}>Browse Your Collection ➡️</Text>
            </TouchableOpacity>
          </View>


          <Button title="Logout" onPress={handleLogout} color="#FF6347" />
        </>
      ) : (
        <Text style={styles.emptyText}>No user information available.</Text>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 50,
    height: 70,
    marginRight: 15,
    borderRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});
