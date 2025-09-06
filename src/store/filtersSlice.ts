import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export type Filters = {
  q: string; assigneeId?: string | null; labelId?: string | null;
  due?: 'overdue' | 'soon' | 'none' | null;
  saved: { id: string; name: string; data: Omit<Filters, 'saved'> }[]
}
const initial: Filters = {
  q: '', assigneeId: null, labelId: null, due: null,
  saved: []
}
const filters = createSlice({
  name: 'filters', initialState: initial,
  reducers: {
    clearFilters(s){ s.q=''; s.assigneeId=null; s.labelId=null; s.due=null },
    setQ(s, a: PayloadAction<string>) { s.q = a.payload },
    setAssignee(s, a: PayloadAction<string | null>) { s.assigneeId = a.payload },
    setLabel(s, a: PayloadAction<string | null>) { s.labelId = a.payload },
    setDue(s, a: PayloadAction<Filters['due']>) { s.due = a.payload },
    saveView(s, a: PayloadAction<{ id: string; name: string }>) {
      s.saved.push({ id: a.payload.id, name: a.payload.name, data: { q: s.q, assigneeId: s.assigneeId, labelId: s.labelId, due: s.due } })
    },
    applySaved(s, a: PayloadAction<string>) {
      const v = s.saved.find(x => x.id === a.payload); if (!v) return
      s.q = v.data.q; s.assigneeId = v.data.assigneeId ?? null; s.labelId = v.data.labelId ?? null; s.due = v.data.due ?? null
    },
    __REPLACE_STATE__(_, a: PayloadAction<any>) { return a.payload.filters }
  }
})
export const { applySaved, clearFilters, saveView, setAssignee, setDue, setLabel, setQ } = filters.actions
export default filters.reducer
