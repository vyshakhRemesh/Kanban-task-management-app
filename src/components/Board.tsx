import React from 'react'
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDndSensors } from '@/dnd/sensors'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { moveColumn } from '@/store/columnsSlice'
import { moveCard } from '@/store/cardsSlice'
import ColumnView from './Column'
import CardItem from './CardItem'
import { LiveRegion } from '@/dnd/accessibility'
import { store } from '@/store'

export default function Board(){
  const dispatch = useAppDispatch()
  const boardId = useAppSelector(s => s.boards.allIds[0])
  const colIds = useAppSelector(s => s.columns.byBoard[boardId] || [])
  const sensors = useDndSensors()
  const [dragCard, setDragCard] = React.useState<string|null>(null)
  const [announce, setAnnounce] = React.useState('')

  const onDragEnd = (e:any) => {
    const { active, over } = e
    setDragCard(null)
    if (!over) return

    const st = store.getState() as any
    const activeData = active.data?.current
    const overData = over.data?.current
    const activeId = String(active.id)
    const overId = String(over.id)

    // Move card
    if (activeData?.type === 'card') {
      const fromColumnId: string = activeData.columnId
      const fromIndex = (st.cards.byColumn[fromColumnId] || []).indexOf(activeId)

      let toColumnId: string
      let toIndex: number
      if (overData?.type === 'card') {
        toColumnId = overData.columnId
        const list = st.cards.byColumn[toColumnId] || []
        toIndex = Math.max(0, list.indexOf(overId))
      } else {
        toColumnId = overId
        const list = st.cards.byColumn[toColumnId] || []
        toIndex = list.length
      }

      if (fromIndex !== -1 && toColumnId) {
        dispatch(moveCard({ fromColumnId, toColumnId, fromIndex, toIndex }))
        setAnnounce('Moved card')
      }
      return
    }

    // Move column
    const ids = (store.getState() as any).columns.byBoard[boardId] || []
    const from = ids.indexOf(activeId)
    const to = ids.indexOf(overId)
    if (from !== -1 && to !== -1 && from !== to) {
      dispatch(moveColumn({ boardId, from, to }))
      setAnnounce('Reordered columns')
    }
  }

  const onDragStart = (e:any) => {
    const d = e.active?.data?.current
    if (d?.type === 'card') setDragCard(d.id)
  }

  return (
    <div className="board">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="columns">
          <SortableContext items={colIds} strategy={verticalListSortingStrategy}>
            {colIds.map((id:string) => <ColumnView key={id} id={id} />)}
          </SortableContext>
        </div>
        <DragOverlay>{dragCard ? <CardItem id={dragCard} /> : null}</DragOverlay>
      </DndContext>
      <LiveRegion message={announce} />
    </div>
  )
}
