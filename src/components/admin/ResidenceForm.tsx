"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { agents } from "@/lib/agents";
import type { Residence } from "@/lib/residences";
import {
  createResidenceAction,
  updateResidenceAction,
  deleteResidenceAction,
  type ResidencePayload,
} from "@/lib/residences-actions";

type Props = {
  mode: "new" | "edit";
  initial?: Partial<Residence>;
};

const types = ["Villa", "Estate", "Pavilion", "Retreat", "Compound", "Townhouse"] as const;
const statuses = ["Available", "Reserved", "In Confidence", "Sold"] as const;
const currencies = ["EUR", "USD", "GBP"] as const;

export default function ResidenceForm({ mode, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<string>(initial?.type ?? "Villa");
  const [status, setStatus] = useState<string>(initial?.status ?? "Available");
  const [town, setTown] = useState(initial?.location?.town ?? "");
  const [country, setCountry] = useState(initial?.location?.country ?? "");
  const [region, setRegion] = useState(initial?.location?.region ?? "");
  const [lat, setLat] = useState<number | "">(initial?.location?.lat ?? "");
  const [lng, setLng] = useState<number | "">(initial?.location?.lng ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [currency, setCurrency] = useState<string>(initial?.currency ?? "EUR");
  const [beds, setBeds] = useState<number | "">(initial?.beds ?? "");
  const [baths, setBaths] = useState<number | "">(initial?.baths ?? "");
  const [interiorArea, setInteriorArea] = useState<number | "">(initial?.interiorArea ?? "");
  const [plotArea, setPlotArea] = useState<number | "">(initial?.plotArea ?? "");
  const [architect, setArchitect] = useState(initial?.architect?.name ?? "");
  const [architectYear, setArchitectYear] = useState<number | "">(initial?.architect?.year ?? new Date().getFullYear());
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [abstract, setAbstract] = useState(initial?.abstract ?? "");
  const [agentSlug, setAgentSlug] = useState(initial?.agentSlug ?? agents[0].slug);
  const [features, setFeatures] = useState<string[]>(initial?.features ?? []);
  const [featureDraft, setFeatureDraft] = useState("");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);

  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload: ResidencePayload = {
      name,
      type: type as Residence["type"],
      status: status as Residence["status"],
      tagline,
      abstract,
      location: {
        town,
        region,
        country,
        lat: typeof lat === "number" ? lat : 0,
        lng: typeof lng === "number" ? lng : 0,
      },
      architect: {
        name: architect,
        year: typeof architectYear === "number" ? architectYear : new Date().getFullYear(),
      },
      price: typeof price === "number" ? price : 0,
      currency: currency as Residence["currency"],
      beds: typeof beds === "number" ? beds : 0,
      baths: typeof baths === "number" ? baths : 0,
      interiorArea: typeof interiorArea === "number" ? interiorArea : 0,
      plotArea: typeof plotArea === "number" ? plotArea : 0,
      cover,
      gallery,
      features,
      agentSlug,
    };

    startTransition(async () => {
      const result =
        mode === "new"
          ? await createResidenceAction(payload)
          : await updateResidenceAction(initial?.slug ?? "", payload);

      if (!result.ok) {
        setErrorMsg(result.error);
        return;
      }

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);

      if (mode === "new") {
        setTimeout(() => router.push("/admin/residences"), 700);
      } else {
        router.refresh();
      }
    });
  };

  const onDelete = () => {
    if (!initial?.slug) return;
    const ok = window.confirm(
      `Delete "${initial.name}"? This cannot be undone.`,
    );
    if (!ok) return;
    setDeleting(true);
    setErrorMsg(null);
    startTransition(async () => {
      const result = await deleteResidenceAction(initial.slug!);
      if (!result.ok) {
        setErrorMsg(result.error);
        setDeleting(false);
        return;
      }
      router.push("/admin/residences");
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        {/* Basics */}
        <Section title="Basics" description="The name and category visitors will see first.">
          <Field label="Name" required>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Villa Aurelia" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                {types.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tagline">
            <input className="form-input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A long-glazed pavilion above the Antibes coastline." />
          </Field>
          <Field label="Abstract" help="A 1–2 sentence summary shown on the index page and in search results.">
            <textarea className="form-input min-h-[88px]" value={abstract} onChange={(e) => setAbstract(e.target.value)} />
          </Field>
        </Section>

        {/* Specifications */}
        <Section title="Specifications">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Field label="Bedrooms"><input type="number" className="form-input" value={beds} onChange={(e) => setBeds(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Bathrooms"><input type="number" className="form-input" value={baths} onChange={(e) => setBaths(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Interior (m²)"><input type="number" className="form-input" value={interiorArea} onChange={(e) => setInteriorArea(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Plot (m²)"><input type="number" className="form-input" value={plotArea} onChange={(e) => setPlotArea(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field label="Architect"><input className="form-input" value={architect} onChange={(e) => setArchitect(e.target.value)} /></Field>
            </div>
            <Field label="Year"><input type="number" className="form-input" value={architectYear} onChange={(e) => setArchitectYear(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Town"><input className="form-input" value={town} onChange={(e) => setTown(e.target.value)} /></Field>
            <Field label="Region"><input className="form-input" value={region} onChange={(e) => setRegion(e.target.value)} /></Field>
            <Field label="Country"><input className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude"><input type="number" step="0.001" className="form-input" value={lat} onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
            <Field label="Longitude"><input type="number" step="0.001" className="form-input" value={lng} onChange={(e) => setLng(e.target.value === "" ? "" : Number(e.target.value))} /></Field>
          </div>
        </Section>

        {/* Features */}
        <Section title="Features of note">
          <div className="flex gap-2">
            <input
              className="form-input flex-1"
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (featureDraft.trim()) {
                    setFeatures([...features, featureDraft.trim()]);
                    setFeatureDraft("");
                  }
                }
              }}
              placeholder="e.g. Reflecting basin · Olive grove · Hammam"
            />
            <button
              type="button"
              onClick={() => {
                if (featureDraft.trim()) {
                  setFeatures([...features, featureDraft.trim()]);
                  setFeatureDraft("");
                }
              }}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          {features.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-sm">
                  {f}
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                    className="text-fg-subtle hover:text-fg"
                    aria-label={`Remove ${f}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Photography */}
        <Section title="Photography" description="Drag photos here, or pick from the media library.">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {/* Cover slot */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-dashed border-border bg-surface-2">
              {cover ? (
                <Image src={cover} alt="" fill sizes="200px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-fg-subtle">
                  Cover
                </div>
              )}
              <span className="absolute bottom-2 left-2 rounded bg-fg/90 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-bg">
                Cover
              </span>
            </div>
            {gallery.map((g, i) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-2">
                <Image src={g} alt="" fill sizes="200px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                  className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-fg hover:bg-white"
                  aria-label="Remove"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Paste image URL (or path under /public)");
                if (!url) return;
                if (!cover) setCover(url);
                else setGallery([...gallery, url]);
              }}
              className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-border text-fg-subtle hover:border-fg hover:bg-surface-2 hover:text-fg"
            >
              <div className="text-center">
                <div className="text-2xl">+</div>
                <div className="text-xs">Add image</div>
              </div>
            </button>
          </div>
        </Section>
      </div>

      {/* Right column */}
      <aside className="space-y-6 lg:col-span-1">
        <Section title="Publishing">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="font-medium text-fg">Status</div>
              <div className="text-fg-muted">{status}</div>
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input w-auto">
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="font-medium text-fg">Visibility</div>
              <div className="text-fg-muted">Public on the site</div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-brand" />
              <span className="text-sm text-fg-muted">Visible</span>
            </label>
          </div>
          <div className="border-t border-border pt-3 text-xs text-fg-muted">
            {mode === "edit" ? "Last edited just now" : "Not yet saved"}
          </div>
        </Section>

        <Section title="Pricing">
          <div className="grid grid-cols-[1fr_90px] gap-2">
            <Field label="Guide price">
              <input
                type="number"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
            <Field label="Currency">
              <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Agent">
          <Field label="Represented by">
            <select className="form-input" value={agentSlug} onChange={(e) => setAgentSlug(e.target.value)}>
              {agents.map((a) => <option key={a.slug} value={a.slug}>{a.name} — {a.basedIn}</option>)}
            </select>
          </Field>
        </Section>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={pending || deleting}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {pending && !deleting
              ? mode === "edit"
                ? "Saving…"
                : "Creating…"
              : mode === "edit"
                ? "Save changes"
                : "Create residence"}
          </button>
          <Link href="/admin/residences" className="btn btn-secondary w-full">
            Cancel
          </Link>
          {mode === "edit" && initial?.slug && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending || deleting}
              className="btn w-full text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete this residence"}
            </button>
          )}
        </div>
      </aside>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-soft-lg">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </span>
          <span>{mode === "edit" ? "Changes saved" : "Residence created"}</span>
        </div>
      )}

      <style jsx>{`
        .form-input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          font: inherit;
          font-size: 14px;
          color: var(--fg);
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-soft);
        }
      `}</style>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg">{title}</h2>
        {description && <p className="text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
          {label} {required && <span className="text-brand">*</span>}
        </span>
        {help && <span className="text-xs text-fg-subtle">{help}</span>}
      </div>
      {children}
    </label>
  );
}
