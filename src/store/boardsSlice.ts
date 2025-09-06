import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { Board, ID, Label } from '@/types'
const now = () => new Date().toISOString()
const initialBoard: Board = {
  id: 'b1', name: 'Kanban Pro Demo', createdAt: now(), updatedAt: now(),
  labelDefs: {
    l1: { id: 'l1', name: 'Bug', color: '#ef4444' },
    l2: { id: 'l2', name: 'Feature', color: '#22c55e' },
    l3: { id: 'l3', name: 'Chore', color: '#3b82f6' }
  },
  members: [{ id: 'u1', name: 'Alex' }, { id: 'u2', name: 'Sam' }, { id: 'u3', name: 'Riya' }]
}
type State = { byId: Record<ID, Board>; allIds: ID[] }
const initial: State = { byId: { [initialBoard.id]: initialBoard }, allIds: [initialBoard.id] }
const boards = createSlice({
  name: 'boards', initialState: initial,
  reducers: {
    addLabel(s, a: PayloadAction<{ boardId: ID; label: Omit<Label,'id'> }>) {
      const id = nanoid(); s.byId[a.payload.boardId].labelDefs[id] = { ...a.payload.label, id }
    },
    __REPLACE_STATE__(_, a: PayloadAction<any>) { return a.payload.boards }
  }
})
export const { addLabel } = boards.actions
export default boards.reducer
