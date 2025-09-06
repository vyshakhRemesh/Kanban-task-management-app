import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { Card, ID, Attachment, CheckItem } from '@/types'
import { formatISO } from 'date-fns'
type State = { byId: Record<ID, Card>, byColumn: Record<ID, ID[]> }
const now = () => formatISO(new Date())
const demo: Record<ID, Card> = {
  k1: { id: 'k1', columnId: 'c1', order: 0, title: 'Design login screen', labels: ['l2'], assigneeId: 'u1', due: null, checklist: [], customFields: {}, attachments: [], createdAt: now(), updatedAt: now() },
  k2: { id: 'k2', columnId: 'c1', order: 1, title: 'Fix crash on drag', labels: ['l1'], assigneeId: 'u2', due: null, checklist: [], customFields: {}, attachments: [], createdAt: now(), updatedAt: now() },
  k3: { id: 'k3', columnId: 'c2', order: 0, title: 'Implement DnD keyboard', labels: ['l3'], assigneeId: 'u3', due: null, checklist: [{id:'ci1', text:'Start', done:true},{id:'ci2', text:'Finish', done:false}], customFields: {}, attachments: [], createdAt: now(), updatedAt: now() }
}
const initial: State = { byId: demo, byColumn: { c1: ['k1','k2'], c2: ['k3'], c3: [] } }
const cards = createSlice({
  name: 'cards', initialState: initial,
  reducers: {
    addCard(s, a: PayloadAction<{ columnId: ID; title: string }>) {
      const id = nanoid(); const order = s.byColumn[a.payload.columnId]?.length ?? 0
      const c: Card = { id, columnId: a.payload.columnId, order, title: a.payload.title, labels: [], assigneeId: undefined, due: null, checklist: [], customFields: {}, attachments: [], createdAt: now(), updatedAt: now() }
      s.byId[id] = c; s.byColumn[c.columnId] = s.byColumn[c.columnId] ? [...s.byColumn[c.columnId], id] : [id]
    },
    updateCard(s, a: PayloadAction<Partial<Card> & { id: ID }>) {
      const prev = s.byId[a.payload.id]; if (!prev) return
      s.byId[a.payload.id] = { ...prev, ...a.payload, updatedAt: now() }
    },
    deleteCard(s, a: PayloadAction<{ id: ID }>) {
      const c = s.byId[a.payload.id]; if (!c) return
      s.byColumn[c.columnId] = (s.byColumn[c.columnId] || []).filter(i => i !== c.id); delete s.byId[c.id]
    },
    moveCard(s, a: PayloadAction<{ fromColumnId: ID; toColumnId: ID; fromIndex: number; toIndex: number }>) {
      const { fromColumnId, toColumnId, fromIndex, toIndex } = a.payload
      const fromArr = s.byColumn[fromColumnId]; const [movedId] = fromArr.splice(fromIndex, 1)
      const toArr = s.byColumn[toColumnId] || (s.byColumn[toColumnId] = []); toArr.splice(toIndex, 0, movedId)
      toArr.forEach((id, idx) => { s.byId[id].order = idx; s.byId[id].columnId = toColumnId })
      fromArr.forEach((id, idx) => { s.byId[id].order = idx; s.byId[id].columnId = fromColumnId })
    },
    addAttachment(s, a: PayloadAction<{ cardId: ID; att: Attachment }>) {
      const c = s.byId[a.payload.cardId]; if (!c) return
      c.attachments.push(a.payload.att); c.updatedAt = now()
    },
    toggleCheck(s, a: PayloadAction<{ cardId: ID; itemId: ID }>) {
      const c = s.byId[a.payload.cardId]; if (!c) return
      c.checklist = c.checklist.map(it => it.id === a.payload.itemId ? { ...it, done: !it.done } : it)
    },
    addCheck(s, a: PayloadAction<{ cardId: ID; text: string; id?: ID }>) {
      const c = s.byId[a.payload.cardId]; if (!c) return
      const item: CheckItem = { id: a.payload.id ?? nanoid(), text: a.payload.text, done: false }
      c.checklist.push(item)
    },
    __REPLACE_STATE__(_, a: PayloadAction<any>) { return a.payload.cards }
  }
})
export const { addCard, updateCard, deleteCard, moveCard, addAttachment, toggleCheck, addCheck } = cards.actions
export default cards.reducer
