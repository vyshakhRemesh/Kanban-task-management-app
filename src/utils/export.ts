import type { RootState } from '@/store'
export function exportJSON(state: RootState){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='kanban-export.json'; a.click(); URL.revokeObjectURL(url) }
