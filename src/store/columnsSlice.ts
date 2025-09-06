import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { Column, ID } from '@/types'
type State = { byId: Record<ID, Column>, byBoard: Record<ID, ID[]> }
const initial: State = {
  byId: {
    c1: { id: 'c1', boardId: 'b1', title: 'To Do', order: 0, wipLimit: 6 },
    c2: { id: 'c2', boardId: 'b1', title: 'In Progress', order: 1, wipLimit: 4 },
    c3: { id: 'c3', boardId: 'b1', title: 'Done', order: 2, wipLimit: null }
  }, byBoard: { b1: ['c1','c2','c3'] }
}
const columns = createSlice({
  name: 'columns', initialState: initial,
  reducers: {
    addColumn(s, a: PayloadAction<{ boardId: ID; title: string }>) {
      const id = nanoid(); const order = s.byBoard[a.payload.boardId].length
      s.byId[id] = { id, boardId: a.payload.boardId, title: a.payload.title, order, wipLimit: null }
      s.byBoard[a.payload.boardId].push(id)
    },
    updateColumn(s, a: PayloadAction<Partial<Column> & { id: ID }>) {
      s.byId[a.payload.id] = { ...s.byId[a.payload.id], ...a.payload }
    },
    deleteColumn(s, a: PayloadAction<{ id: ID }>) {
      const col = s.byId[a.payload.id]; if (!col) return
      s.byBoard[col.boardId] = s.byBoard[col.boardId].filter(i => i !== col.id); delete s.byId[col.id]
    },
    moveColumn(s, a: PayloadAction<{ boardId: ID; from: number; to: number }>) {
      const arr = s.byBoard[a.payload.boardId]
      const [sp] = arr.splice(a.payload.from, 1); arr.splice(a.payload.to, 0, sp)
      arr.forEach((id, idx) => s.byId[id].order = idx)
    },
    __REPLACE_STATE__(_, a: PayloadAction<any>) { return a.payload.columns }
  }
})
export const { addColumn, updateColumn, deleteColumn, moveColumn } = columns.actions
export default columns.reducer
