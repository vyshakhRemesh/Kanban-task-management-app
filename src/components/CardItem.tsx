import { deleteCard } from '@/store/cardsSlice'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { openCard } from '@/store/uiSlice'
import { differenceInCalendarDays, isBefore, addDays, parseISO } from 'date-fns'
export default function CardItem({ id }: { id: string }) {
  const dispatch = useAppDispatch()
  const c = useAppSelector(s => s.cards.byId[id])
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: { type:'card', id, columnId: c.columnId } })
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .5 : 1, cursor: 'grab' }
  let badge: React.ReactNode = null
  if (c.due) {
    const dueDate = parseISO(c.due); const now = new Date()
    if (isBefore(dueDate, now)) badge = <span className="badge overdue">Overdue</span>
    else if (isBefore(dueDate, addDays(now, 7))) badge = <span className="badge soon">Due soon</span>
    else badge = <span className="badge">Due {differenceInCalendarDays(dueDate, now)}d</span>
  }
  return (
    <div className="card" ref={setNodeRef} style={style} {...attributes}>
      <div className="row">
        <div className="title grow" onDoubleClick={()=>dispatch(openCard(id))}>{c.title}</div>
        <button className="icon-btn" {...listeners} aria-label="drag card">⠿</button>
      </div>
      <div className="meta">
        {badge}
        {c.checklist.length ? <span className="badge">✔ {c.checklist.filter(x=>x.done).length}/{c.checklist.length}</span> : null}
        {c.labels.map(lid => <span key={lid} className="badge" style={{borderColor:'transparent', background: 'var(--border)'}}>{lid}</span>)}
      </div>
    </div>
  )
}
