import AsyncStorage from '@react-native-async-storage/async-storage'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AnyAction, combineReducers, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE,} from 'redux-persist'
import authentication from '../shared/reducers/authentication.reducer'
import ghillie from '../shared/reducers/ghillie.reducer'
import post from '../shared/reducers/post.reducer'
import notifications from '../shared/reducers/notifications.reducer'

const reducers = combineReducers({
  authentication,
  ghillie,
  post,
  notifications
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
  },
})

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  IRootState,
  unknown,
  AnyAction
  >;

const persistor = persistStore(store)

setupListeners(store.dispatch)

export { store, persistor }
