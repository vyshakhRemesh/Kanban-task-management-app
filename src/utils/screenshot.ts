import { toPng } from 'html-to-image'
export async function screenshot(element: HTMLElement){ const dataUrl = await toPng(element,{cacheBust:true}); const a=document.createElement('a'); a.href=dataUrl; a.download='board.png'; a.click() }
