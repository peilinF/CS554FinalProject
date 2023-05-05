import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['chatroom', 'userInfo'], // only chatroom will be persisted, add other reducers if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware
});

export const persistor = persistStore(store);
