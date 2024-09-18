import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native'
import React from 'react'

const Card = ({ name, imageSrc, handlePress, ...props }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: imageSrc }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  )
}

export default Card;


const styles = StyleSheet.create({
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

