import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";

import { setQ, setDue, clearFilters } from "@/store/filtersSlice";
import { addColumn } from "@/store/columnsSlice";
import { exportJSON } from "@/utils/export";
import { screenshot } from "@/utils/screenshot";

export default function Topbar({
  boardRef,
}: {
  boardRef: React.RefObject<HTMLDivElement>;
}) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s);
  const boardId = state.boards.allIds[0];
  const q = state.filters.q;
  const due = state.filters.due ?? "";

  return (
    <div className="topbar">
      <div className="title">Kanban Pro</div>

      <input
        className="input"
        placeholder="Search..."
        value={q}
        onChange={(e) => dispatch(setQ(e.target.value))}
        style={{ minWidth: 220, marginLeft: 8 }}
      />

      <label className="row" style={{ gap: 6, marginLeft: 8 }}>
        <span>Due</span>
        <select
          className="select"
          value={due as any}
          onChange={(e) => dispatch(setDue((e.target.value || null) as any))}
        >
          <option value="">All</option>
          <option value="overdue">Overdue</option>
          <option value="soon">Due in 7d</option>
          <option value="none">No due date</option>
        </select>
      </label>

      <button
        className="button"
        style={{ marginLeft: 8 }}
        onClick={() => dispatch(clearFilters())}
      >
        Clear
      </button>

      <div className="row" style={{ gap: 8, marginLeft: "auto" }}>
        <button
          className="button"
          onClick={() => dispatch(addColumn({ boardId, title: "New Column" }))}
        >
          + Column
        </button>
        <button className="button" onClick={() => exportJSON(state)}>
          Export
        </button>
        <button
          className="button"
          onClick={() => boardRef?.current && screenshot(boardRef.current)}
        >
          Screenshot
        </button>
      </div>
    </div>
  );
}
