import React from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { dismiss } from '@/store/uiSlice'
export default function Toasts(){
  const items=useAppSelector(s=>s.ui.toasts); const dispatch=useAppDispatch();
  React.useEffect(()=>{ const timers:any[]=[]; items.forEach(it=>{ const id=setTimeout(()=>dispatch(dismiss(it.id)),3500); timers.push(id) }); return ()=>{ timers.forEach(clearTimeout) } },[items,dispatch])
  return (<div className="toast-wrap">{items.map(it=>(<div key={it.id} className="toast" onClick={()=>dispatch(dismiss(it.id))}>{it.text}</div>))}</div>)
}
