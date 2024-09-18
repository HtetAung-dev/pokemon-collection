import { ScrollView, StyleSheet, Text, View, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, Redirect, router } from 'expo-router';
import { signIn, getCurrentUser } from '../../lib/appwrite/appwriteClient';
import { useGlobalContext } from '../../context/globalProvider';
import { useSelector } from 'react-redux';

const SignIn = () => {
    const {setUser, setIsLogged, isLogged} = useGlobalContext();
    const {isAuthenticated} = useSelector((state) => state.auth);

    if(isAuthenticated && isLogged) return <Redirect href="/home" />;
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (form.email === "" || form.password === "") {
            Alert.alert("Error", "Please fill in all fields");
          }
      
          setIsSubmitting(true);
      
          try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            setUser(result);
            setIsLogged(true);
            
            Alert.alert("Success", "User signed in successfully");
            router.replace('/home');
          } catch (error) {
            Alert.alert("Error", error.message);
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
                        Log in to PokéCards
                    </Text>
                    <FormField
                        title='Email'
                        value={form.email}
                        handleChangeText={(e) => setForm({
                            ...form,
                            email: e
                        })}
                        otherStyles='mt-7'
                        keyboardType='email-address'
                    />
                    <FormField
                        title='Password'
                        value={form.password}
                        handleChangeText={(e) => setForm({
                            ...form,
                            password: e
                        })}
                        otherStyles='mt-7'
                    />
                    <CustomButton
                        title="Sign In"
                        containerStyles='mt-7 '
                        isLoading={isSubmitting}
                        handlePress={submit}
                    />
                    <View className='justify-center pt-5 flex-row gap-2' >
                        <Text className='text-lg text-gray-100 font-pregualr'>
                            Don't have account?
                        </Text>
                        <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})