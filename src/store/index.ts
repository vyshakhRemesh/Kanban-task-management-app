import { configureStore } from '@reduxjs/toolkit'
import boards from './boardsSlice'
import columns from './columnsSlice'
import cards from './cardsSlice'
import filters from './filtersSlice'
import ui from './uiSlice'
import { loadState, saveState, throttle } from './persist'

const preloaded = loadState();

export const store = configureStore({
  reducer: { boards, columns, cards, filters, ui },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  preloadedState: preloaded,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

;(window as any).__store__ = store
export default store


store.subscribe(
  throttle(() => {
    const s = store.getState() as any;
    saveState({
      boards: s.boards,
      columns: s.columns,
      cards: s.cards,
      filters: s.filters,
    });
  }, 500)
);
