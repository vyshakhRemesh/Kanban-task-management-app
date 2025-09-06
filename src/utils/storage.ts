import { set, get, del } from 'idb-keyval'
export async function saveBlob(key: string, blob: Blob) { await set(key, blob) }
export async function loadBlob(key: string) { return get(key) }
export async function deleteBlob(key: string) { await del(key) }
