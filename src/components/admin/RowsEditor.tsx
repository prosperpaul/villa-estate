"use client";

// A small editable table: each row is an object, each column edits one key.
// Used for title documents, FAQs and nearby places on the residence form.
//
// Example:
//   <RowsEditor rows={faqs} onChange={setFaqs} empty={{ q: "", a: "" }}
//     columns={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", multiline: true }]} />

type Column<T> = {
  key: keyof T & string;
  label: string;
  placeholder?: string;
  type?: "text" | "number";
  multiline?: boolean;
  width?: string; // CSS grid column width, e.g. "1fr" or "90px"
};

export default function RowsEditor<T extends Record<string, string | number | undefined>>({
  rows,
  onChange,
  columns,
  empty,
  addLabel = "Add row",
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  columns: Column<T>[];
  empty: T;
  addLabel?: string;
}) {
  const grid = { gridTemplateColumns: `${columns.map((c) => c.width ?? "1fr").join(" ")} 32px` };

  const update = (i: number, key: keyof T, value: string) => {
    const col = columns.find((c) => c.key === key);
    const v = col?.type === "number" ? (value === "" ? "" : Number(value)) : value;
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));
  };

  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="hidden gap-2 md:grid" style={grid}>
          {columns.map((c) => (
            <span key={c.key} className="eyebrow">{c.label}</span>
          ))}
        </div>
      )}

      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-1 items-start gap-2 md:[grid-template-columns:var(--cols)]" style={{ ["--cols" as string]: grid.gridTemplateColumns }}>
          {columns.map((c) =>
            c.multiline ? (
              <textarea
                key={c.key}
                aria-label={c.label}
                className="input !py-2 min-h-[64px] text-[14px]"
                value={String(row[c.key] ?? "")}
                placeholder={c.placeholder ?? c.label}
                onChange={(e) => update(i, c.key, e.target.value)}
              />
            ) : (
              <input
                key={c.key}
                aria-label={c.label}
                type={c.type ?? "text"}
                className="input !py-2 text-[14px]"
                value={String(row[c.key] ?? "")}
                placeholder={c.placeholder ?? c.label}
                onChange={(e) => update(i, c.key, e.target.value)}
              />
            ),
          )}
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            aria-label="Remove row"
            className="flex h-9 w-8 items-center justify-center rounded text-fg-subtle hover:bg-surface-2 hover:text-error"
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" onClick={() => onChange([...rows, { ...empty }])} className="btn btn-secondary !px-4 !py-2 text-[12px]">
        + {addLabel}
      </button>
    </div>
  );
}
