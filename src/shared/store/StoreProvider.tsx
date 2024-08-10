import {
  ReactNode,
  createContext,
  useContext,
  useState,
  MutableRefObject,
  useCallback,
} from "react";
import { TIMER_SECONDS_COUNT } from "../../constants";

type StoreType = {
  words: JSX.Element[];
  count: {
    all: number;
    error: number;
    correct: number;
  };
  timer: {
    ref: MutableRefObject<HTMLDivElement> | undefined;
    isStarted: boolean;
    countdown: number;
  };
  letterRef: MutableRefObject<HTMLLIElement> | undefined;
  inputRef: MutableRefObject<HTMLInputElement> | undefined;
  cursorRef: MutableRefObject<HTMLDivElement> | undefined;
};

const storeInit = {
  store: {
    words: [] as StoreType["words"],
    count: {
      all: 0,
      error: 0,
      correct: 0,
    },
    timer: {
      ref: undefined as StoreType["timer"]["ref"],
      isStarted: false,
      countdown: TIMER_SECONDS_COUNT,
    },
    letterRef: undefined as StoreType["letterRef"],
    inputRef: undefined as StoreType["inputRef"],
    cursorRef: undefined as StoreType["cursorRef"],
  },
  updateStore: (_value: Partial<StoreType>) => {},
  resetStore: () => {},
};

const StoreContext = createContext(storeInit);

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(storeInit["store"]);

  const updateStore = (value: Partial<StoreType>) => {
    setStore((prevState) => ({ ...prevState, ...value }));
  };

  const resetStore = useCallback(() => {
    setStore(storeInit["store"]);
  }, [store, storeInit]);

  return (
    <StoreContext.Provider value={{ store, updateStore, resetStore }}>
      {children}
    </StoreContext.Provider>
  );
}
