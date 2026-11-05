import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import type { LegalDocument } from "@/lib/legal/registry";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-extrabold text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

/** Temporary notice shown on every legal page until counsel's texts arrive. */
export function LegalUpdatingNotice() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-amber/50 bg-amber/10 p-4 text-primary"
    >
      <Icon name="info" size={22} className="mt-0.5 shrink-0 text-amber" />
      <p className="font-bold">Bu metin güncelleniyor.</p>
    </div>
  );
}

export function LegalDocumentView({
  document,
  children,
}: {
  document: LegalDocument;
  /** Optional non-legal content shown above the legal text (e.g. how-to steps). */
  children?: React.ReactNode;
}) {
  const blocks = document.content
    .trim()
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="container-site py-10 md:py-14">
      <Breadcrumb
        items={[
          { label: "Ana sayfa", href: "/" },
          { label: "Yasal", href: "/yasal" },
          { label: document.title },
        ]}
      />
      <div className="max-w-3xl">
        <LegalUpdatingNotice />
        <h1 className="mt-6 text-[2rem] font-extrabold leading-tight text-primary md:text-4xl">
          {document.title}
        </h1>
        <p className="mt-2 text-muted">{document.description}</p>
      </div>

      {children ? <div className="mt-8 max-w-3xl">{children}</div> : null}

      <article className="mt-8 max-w-3xl space-y-5 rounded-3xl border border-line bg-surface p-5 md:p-8">
        {blocks.map((block, index) => {
          const lines = block.split("\n").filter(Boolean);

          if (lines.length > 1 && lines.every((l) => l.startsWith("- "))) {
            return (
              <ul key={index} className="list-disc space-y-2 pl-5 leading-relaxed text-muted">
                {lines.map((line) => (
                  <li key={line}>{renderInline(line.replace(/^-\s+/, ""))}</li>
                ))}
              </ul>
            );
          }

          const isHeading =
            /^\d+\.\s/.test(lines[0] ?? "") ||
            (lines.length === 1 &&
              lines[0].length < 80 &&
              !lines[0].includes(".") &&
              index > 0);

          if (isHeading && lines.length === 1) {
            return (
              <h2 key={index} className="pt-2 text-lg font-extrabold text-primary md:text-xl">
                {lines[0].replace(/^\d+\.\s*/, "")}
              </h2>
            );
          }

          return (
            <div key={index} className="space-y-2 leading-relaxed text-muted">
              {lines.map((line) => (
                <p key={line}>{renderInline(line)}</p>
              ))}
            </div>
          );
        })}
      </article>
    </div>
  );
}
