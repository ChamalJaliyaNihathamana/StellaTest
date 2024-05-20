import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import { combineReducers } from 'redux'; // Added for combining reducers
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'; 
import celebrityStyleSlice from './features/celebrity-style/celebrityStyleSlice';
import userProfileSlice from './features/user-profile/userProfileSlice';

const persistConfig = {
    key: 'root',
    storage,
};


// Combine Reducers (Important when using redux-persist)
const rootReducer = combineReducers({
    celebrityStyle: celebrityStyleSlice,
    userProfile: userProfileSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
    const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore redux-persist actions
                },
            }),
    });

    const persistor = persistStore(store);
    return { store, persistor }; // Return both store and persistor
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['store']['getState']>;
export type AppDispatch = AppStore['store']['dispatch'];
