import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { Link,router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { images } from '../../constants';
import { registerUser } from '../../lib/appwrite/appwriteClient'

const SignUp = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if(!form.username || !form.email || !form.password){
            Alert.alert('Errors', 'Please fill in all fields')
        }
        setIsSubmitting(true);
        try {
            await registerUser(form.username, form.email, form.password );
            router.replace('/home')
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false);
        }
        
    }
  return (
    <SafeAreaView className='bg-primary h-full'>
        <ScrollView>
            <View className='w-full justify-center h-[84vh] px-4 my-6'>
                <Image source={images.pokeLogo} 
                resizeMode='contain'
                className='w-[150px] h-[84px]'
                />
                <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
                    Sign Up To PokéCards
                </Text>
                <FormField 
                title='Username'
                value={form.username}
                handleChangeText={(e)=> setForm({
                     ...form,
                    username: e
                    })}
                otherStyles='mt-7'
                />
                <FormField 
                title='Email'
                value={form.email}
                handleChangeText={(e)=> setForm({
                     ...form,
                    email: e
                    })}
                otherStyles='mt-7'
                keyboardType='email-address'
                />
                <FormField 
                title='Password'
                value={form.password}
                handleChangeText={(e)=> setForm({
                     ...form,
                    password: e
                    })}
                otherStyles='mt-7'
                />
                <CustomButton 
                    title="Sign Up"
                    containerStyles='mt-7 '
                    isLoading={isSubmitting}
                    handlePress={submit}
                />
                <View className='justify-center pt-5 flex-row gap-2' >
                    <Text className='text-lg text-gray-100 font-pregualr'>
                        Already have an account?
                    </Text>
                    <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>
                    Sign In
                    </Link>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({})