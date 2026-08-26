import { Breadcrumb } from "@/components/seo/Breadcrumb";
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

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const blocks = document.content
    .trim()
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="container-site py-10 md:py-14">
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "Yasal", href: "/yasal" },
          { label: document.title },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-primary md:text-4xl">
        {document.title}
      </h1>
      <p className="mt-2 text-sm text-primary/60">{document.description}</p>

      <article className="prose-petloog mt-8 max-w-3xl space-y-5 rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
        {blocks.map((block, index) => {
          const lines = block.split("\n").filter(Boolean);

          if (lines.length > 1 && lines.every((l) => l.startsWith("- "))) {
            return (
              <ul key={index} className="list-disc space-y-2 pl-5 text-primary/75">
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
              <h2
                key={index}
                className="text-lg font-extrabold text-primary md:text-xl"
              >
                {lines[0].replace(/^\d+\.\s*/, "")}
              </h2>
            );
          }

          return (
            <div key={index} className="space-y-2 text-sm leading-relaxed text-primary/75 md:text-base">
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
