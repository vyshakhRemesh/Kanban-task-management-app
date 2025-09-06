import { configureStore } from '@reduxjs/toolkit'
import boards from './boardsSlice'
import columns from './columnsSlice'
import cards from './cardsSlice'
import filters from './filtersSlice'
import ui from './uiSlice'
import { historyMiddleware } from './history'

function loadState(){ try{ const raw = localStorage.getItem('kanban-pro-state-v1'); return raw ? JSON.parse(raw) : undefined } catch (e) { return undefined } }
export const store = configureStore({
  reducer: { boards, columns, cards, filters, ui },
  middleware: (gdm) => gdm().concat(historyMiddleware),
  devTools: true,
  preloadedState: (typeof window!=='undefined' ? loadState() : undefined)
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
