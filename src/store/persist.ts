// src/store/persist.ts
// Minimal, safe localStorage persistence with throttling and versioning.

const KEY = "kanban:v1";

type RootSliceBag = {
  boards: any;
  columns: any;
  cards: any;
  filters: any;
};

export function loadState(): Partial<RootSliceBag> | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return undefined;
    return {
      boards: parsed.boards,
      columns: parsed.columns,
      cards: parsed.cards,
      filters: parsed.filters,
    };
  } catch (e) {
    return undefined;
  }
}

export function saveState(state: RootSliceBag) {
  try {
    const payload = { version: 1, ...state };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (e) {}
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}
}

// trailing-edge throttle (writes at most once per `wait` ms)
export function throttle<T extends (...args: any[]) => void>(fn: T, wait = 500): T {
  let last = 0;
  let timer: number | undefined;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    const remain = wait - (now - last);
    if (remain <= 0) {
      last = now;
      fn.apply(this, args);
    } else {
      if (timer) clearTimeout(timer);
      // @ts-ignore
      timer = window.setTimeout(() => {
        last = Date.now();
        fn.apply(this, args);
      }, remain);
    }
  } as T;
}
