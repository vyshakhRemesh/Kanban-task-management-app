import React from 'react'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { addCard, deleteCard } from '@/store/cardsSlice'
import { updateColumn, deleteColumn } from '@/store/columnsSlice'
import { toast } from '@/store/uiSlice'
import CardItem from './CardItem'
import { parseISO, addDays, isBefore } from 'date-fns'

export default function ColumnView({ id }: { id: string }) {
  const dispatch = useAppDispatch()
  const col = useAppSelector(s => s.columns.byId[id])
  const cardIds = useAppSelector(s => s.cards.byColumn[id] || [])
  const cardsMap = useAppSelector(s => s.cards.byId)
  const filters = useAppSelector(s => s.filters)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: { type: 'column', id } })
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .6 : 1 }

  const [editingTitle, setEditingTitle] = React.useState(false)
  const [tempTitle, setTempTitle] = React.useState('')
  const [editingWip, setEditingWip] = React.useState(false)
  const [tempWip, setTempWip] = React.useState<string>('')

  // Apply filters (text + due)
  const q = (filters.q || '').toLowerCase()
  const now = new Date()
  const filteredIds = cardIds.filter(cid => {
    const c = cardsMap[cid]
    if (!c) return false
    if (q && !((c.title||'').toLowerCase().includes(q) || (c.desc||'').toLowerCase().includes(q))) return false
    if (filters.due === 'overdue') { if (!(c.due && isBefore(parseISO(c.due), now))) return false }
    if (filters.due === 'soon') { if (!(c.due && isBefore(parseISO(c.due), addDays(now, 7)))) return false }
    if (filters.due === 'none') { if (c.due) return false }
    return true
  })

  const overLimit = col.wipLimit != null && col.wipLimit > 0 && cardIds.length > col.wipLimit!

  return (
    <div className="column" ref={setNodeRef} style={style} {...attributes}>
      <div className="column-header">
        <div className="column-title grow" {...listeners} onDoubleClick={()=>{ setTempTitle(col.title); setEditingTitle(true) }}>
          {editingTitle ? (
            <input className="input" autoFocus value={tempTitle}
              onChange={e=>setTempTitle(e.target.value)}
              onBlur={()=>{ setEditingTitle(false); if (tempTitle.trim() && tempTitle!==col.title) dispatch(updateColumn({id, title: tempTitle.trim()})) }}
              onKeyDown={e=>{
                if(e.key==='Enter'){ (e.currentTarget as HTMLInputElement).blur() }
                if(e.key==='Escape'){ setEditingTitle(false) }
              }}
            />
          ) : col.title}
        </div>
        <div className={`wip-badge ${overLimit ? 'warn' : ''}`} style={{cursor:'pointer'}}
          onMouseDown={(e)=>e.stopPropagation()}
          onClick={(e)=>{ e.stopPropagation(); setTempWip(col.wipLimit?String(col.wipLimit):''); setEditingWip(true) }}
          role="button" tabIndex={0} aria-label="Edit WIP limit">
          {editingWip ? (
            <input className="input" inputMode="numeric" pattern="[0-9]*" placeholder="WIP"
              autoFocus value={tempWip}
              onChange={e=>setTempWip(e.target.value.replace(/[^0-9]/g,''))}
              onBlur={(e)=>{
                e.stopPropagation(); setEditingWip(false);
                const num = Number(tempWip);
                const next = !tempWip || num<=0 ? null : num;
                if (next !== (col.wipLimit ?? null)) dispatch(updateColumn({id, wipLimit: next as any}))
              }}
              onKeyDown={e=>{
                e.stopPropagation();
                if(e.key==='Enter'){ (e.currentTarget as HTMLInputElement).blur() }
                if(e.key==='Escape'){ setEditingWip(false) }
              }}
              style={{width:80}}
            />
          ) : (col.wipLimit ? <>WIP {cardIds.length} / {col.wipLimit}</> : <>WIP —</>)}
        </div>
        <button className="button" onClick={()=>{
          if (confirm(`Delete column "${col.title}" and its ${cardIds.length} cards?`)) {
            (cardIds || []).forEach(cid => dispatch(deleteCard({ id: cid })))
            dispatch(deleteColumn({ id }))
            dispatch(toast('Column deleted'))
          }
        }}>Delete</button>
        <button className="button" onClick={()=>{
          dispatch(addCard({ columnId: id, title: 'New card' }))
          if (col.wipLimit && (cardIds.length + 1) > col.wipLimit) dispatch(toast(`WIP limit exceeded for "${col.title}"`))
        }}>+ Card</button>
      </div>
      <SortableContext items={filteredIds} strategy={verticalListSortingStrategy}>
        {filteredIds.map(cid => <CardItem key={cid} id={cid} />)}
      </SortableContext>
    </div>
  )
}
