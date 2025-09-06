LocalStorage persistence is enabled.

- Persists: boards, columns, cards, filters
- Not persisted: transient UI (modals/toasts)
- Throttled writes to avoid excessive storage operations
- You can clear via DevTools > Application > Local Storage > remove key "kanban:v1"

If you want a Reset button in the UI, import { clearState } from '@/store/persist'
and add a button that calls clearState() then reloads the page.
