import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, Slot, Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useSelector, useDispatch } from "react-redux";
import GlobalProvider from "../context/globalProvider";
import "react-native-url-polyfill/auto"

SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient();

// const AppContent = () => {
//     const { isAuthenticated } = useSelector((state) => state.auth);
//     return (
//         <Stack>
//             {/* Check is authenticated or not! */}
//             {!isAuthenticated ? (
//                 <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//             ) : (
//                 <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             )}
//         </Stack>
//     );
// }

const AppLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });


    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error])

    if (!fontsLoaded && !error) return null;
    return (
        <GlobalProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <QueryClientProvider client={queryClient}>
                        <Stack>

                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="[id]" options={{ title: 'Card Detail', headerShown: true }} />
                        </Stack>
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
        </GlobalProvider>
    )
}

export default AppLayout;