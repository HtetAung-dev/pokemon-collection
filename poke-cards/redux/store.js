import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterReducer from './filterSlice';
import authReducer from './authSlice';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage, // Use AsyncStorage as the storage engine
    whitelist: ['auth']
  };

const rootReducer = combineReducers({
    // collection: collectionReducer,
    auth: authReducer, // Add auth reducer to the store
    filter: filterReducer // Add filter reducer to the store
  });
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: ['persist/PERSIST'],
                ignoredPaths: ['register', 'rehydrate']
            },
        }),
  });
  
  export const persistor = persistStore(store);