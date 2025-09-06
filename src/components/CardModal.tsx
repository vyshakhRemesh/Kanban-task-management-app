import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { openCard, toast } from "@/store/uiSlice";
import {
  updateCard,
  addAttachment,
  addCheck,
  toggleCheck,
  deleteCard,
} from "@/store/cardsSlice";
import { uid } from "@/utils/id";
import { saveBlob, loadBlob } from "@/utils/storage";
import { addDays, endOfDay } from "date-fns";

export default function CardModal() {
  const id = useAppSelector((s) => s.ui.activeCardId);
  const card = useAppSelector((s) => (id ? s.cards.byId[id] : null));
  const dispatch = useAppDispatch();
  const [editingCheckId, setEditingCheckId] = React.useState<string | null>(
    null
  );
  const [tempCheckText, setTempCheckText] = React.useState("");
  if (!card) return null;
  return (
    <div className="modal-backdrop" onClick={() => dispatch(openCard(null))}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <input
            className="input grow"
            value={card.title}
            onChange={(e) =>
              dispatch(updateCard({ id: card.id, title: e.target.value }))
            }
          />
          <button
            className="button"
            onClick={() => {
              if (confirm("Delete this card?")) {
                const idToDelete = card.id;
                dispatch(deleteCard({ id: idToDelete }));
                dispatch(openCard(null));
                dispatch((toast as any)("Card deleted"));
              }
            }}
          >
            Delete
          </button>

          <button className="button" onClick={() => dispatch(openCard(null))}>
            Close
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div>
            <textarea
              className="input"
              style={{ width: "100%", minHeight: 120 }}
              placeholder="Description"
              value={card.desc ?? ""}
              onChange={(e) =>
                dispatch(updateCard({ id: card.id, desc: e.target.value }))
              }
            />
            <div style={{ marginTop: 12 }}>
              <strong>Due date</strong>
              <div
                className="row"
                style={{ marginTop: 6, alignItems: "center" }}
              >
                <input
                  className="input"
                  type="date"
                  value={card.due ? card.due.slice(0, 10) : ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    dispatch(
                      updateCard({
                        id: card.id,
                        due: v ? endOfDay(new Date(v)).toISOString() : null,
                      })
                    );
                  }}
                />
                <button
                  className="button"
                  onClick={() =>
                    dispatch(
                      updateCard({
                        id: card.id,
                        due: endOfDay(new Date()).toISOString(),
                      })
                    )
                  }
                >
                  Today
                </button>
                <button
                  className="button"
                  onClick={() =>
                    dispatch(
                      updateCard({
                        id: card.id,
                        due: endOfDay(addDays(new Date(), 3)).toISOString(),
                      })
                    )
                  }
                >
                  +3d
                </button>
                <button
                  className="button"
                  onClick={() =>
                    dispatch(
                      updateCard({
                        id: card.id,
                        due: endOfDay(addDays(new Date(), 7)).toISOString(),
                      })
                    )
                  }
                >
                  +7d
                </button>
                <button
                  className="button"
                  onClick={() =>
                    dispatch(updateCard({ id: card.id, due: null }))
                  }
                >
                  Clear
                </button>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <strong>Checklist</strong>
              <div style={{ marginTop: 6 }}>
                {card.checklist.map((ci) => {
                  const editing = editingCheckId === ci.id;
                  return (
                    <label
                      key={ci.id}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={ci.done}
                        onChange={() =>
                          dispatch(
                            toggleCheck({ cardId: card.id, itemId: ci.id })
                          )
                        }
                      />
                      {editing ? (
                        <input
                          className="input"
                          style={{ flex: 1 }}
                          autoFocus
                          value={tempCheckText}
                          onChange={(e) => setTempCheckText(e.target.value)}
                          onBlur={() => {
                            const next = card.checklist.map((it) =>
                              it.id === ci.id
                                ? { ...it, text: tempCheckText }
                                : it
                            );
                            dispatch(
                              updateCard({ id: card.id, checklist: next })
                            );
                            setEditingCheckId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.currentTarget as HTMLInputElement).blur();
                            }
                            if (e.key === "Escape") {
                              setEditingCheckId(null);
                            }
                          }}
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingCheckId(ci.id);
                            setTempCheckText(ci.text);
                          }}
                          style={{ cursor: "text" }}
                        >
                          {ci.text}
                        </span>
                      )}
                    </label>
                  );
                })}
                <button
                  className="button"
                  onClick={() => {
                    const nid = uid();
                    dispatch(
                      addCheck({ cardId: card.id, text: "New item", id: nid })
                    );
                    setEditingCheckId(nid);
                    setTempCheckText("New item");
                  }}
                >
                  + Item
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="row">
              <label className="button" style={{ cursor: "pointer" }}>
                + Attachment
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const key = "blob_" + uid();
                    await saveBlob(key, file);
                    dispatch(
                      addAttachment({
                        cardId: card.id,
                        att: {
                          id: uid(),
                          name: file.name,
                          blobKey: key,
                          mime: file.type,
                        },
                      })
                    );
                    dispatch(toast("Attachment added"));
                  }}
                />
              </label>
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
              {card.attachments.map((a) => (
                <AttachmentThumb key={a.id} name={a.name} blobKey={a.blobKey} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function AttachmentThumb({ name, blobKey }: { name: string; blobKey: string }) {
  const [url, setUrl] = React.useState<string>("");
  React.useEffect(() => {
    let revoke: string | null = null;
    loadBlob(blobKey).then((b) => {
      if (b) {
        const u = URL.createObjectURL(b);
        setUrl(u);
        revoke = u;
      }
    });
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [blobKey]);
  if (!url) return <div className="skeleton" style={{ height: 60 }} />;
  return (
    <a className="row" href={url} target="_blank">
      <img
        src={url}
        height={40}
        style={{ borderRadius: 8, border: "1px solid var(--border)" }}
      />
      <span>{name}</span>
    </a>
  );
}
