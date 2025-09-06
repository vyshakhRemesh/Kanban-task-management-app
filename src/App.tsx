import React from 'react'
import Board from './components/Board'
import CardModal from './components/CardModal'
import Toasts from './components/Toast'
import Topbar from './components/Topbar'

import { store } from './store'

export default function App() {
  React.useEffect(() => { (window as any).__store__ = store }, [])
  const boardRef = React.useRef<HTMLDivElement>(null)

  // Persist to localStorage (throttled)
  React.useEffect(() => {
    let t: any = null
    const unsub = store.subscribe(()=>{
      if (t) return
      t = setTimeout(()=>{
        try{ localStorage.setItem('kanban-pro-state-v1', JSON.stringify(store.getState())) } catch (e) {}
        t = null
      }, 500)
    })
    return () => { unsub(); if (t) clearTimeout(t) }
  }, [])

  return (
    <div className="app">
      <Topbar boardRef={boardRef} />
      <div ref={boardRef}><Board /></div>
      <CardModal />
      <Toasts />
    </div>
  )
}
