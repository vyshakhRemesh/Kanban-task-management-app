import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Toast = { id: string; text: string }
type UIState = { activeCardId?: string | null; toasts: Toast[] }

const initial: UIState = { activeCardId: null, toasts: [] }

const ui = createSlice({
  name: 'ui',
  initialState: initial,
  reducers: {
    openCard(s, a: PayloadAction<string | null>) {
      s.activeCardId = a.payload
    },
    toast(s, a: PayloadAction<string>) {
      s.toasts.push({ id: String(Date.now() + Math.random()), text: a.payload })
    },
    dismiss(s, a: PayloadAction<string>) {
      s.toasts = s.toasts.filter(t => t.id !== a.payload)
    },
    __REPLACE_STATE__(_, a: PayloadAction<any>) {
      // Used by import/replace logic
      return a.payload.ui
    }
  }
})

export const { openCard, toast, dismiss, __REPLACE_STATE__ } = ui.actions
export default ui.reducer
