import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
  createMigrate,
} from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { api } from "./api";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  session: {
    user: User | null;
    token: string | null;
  };
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  session: {
    user: null,
    token: null,
  },
};

// REDUX SLICE
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setSession: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.session = {
        user: action.payload.user,
        token: action.payload.token,
      };
    },
  },
});

// REDUX PERSISTENCE
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const NEW_VERSION = 0;
const persistConfig = {
  key: "root",
  version: NEW_VERSION,
  storage,
  whitelist: ["global"],
  migrate: createMigrate(
    {
      [NEW_VERSION]: (state) => {
        return {
          ...state,
          global: {
            isSidebarCollapsed: false,
            isDarkMode: false,
            session: {
              user: null,
              token: null,
            },
          },
          _persist: {
            version: NEW_VERSION,
            rehydrated: true,
          },
        };
      },
    },
    { debug: true },
  ),
};

// Root Reducer
const rootReducer = combineReducers({
  global: globalSlice.reducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and export the store globally
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Setup listeners for store
setupListeners(store.dispatch);

// Create and export the persistor globally
export const persistor = persistStore(store);

// Redux Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const { setIsSidebarCollapsed, setIsDarkMode, setSession } =
  globalSlice.actions;
