import Link from "next/link";
import type { CollectionGuideData, GuideLink } from "@/data/collectionGuides";

function RichText({ parts }: { parts: GuideLink[] }) {
  return (
    <>
      {parts.map((part, i) =>
        part.href ? (
          <Link key={i} href={part.href} className="underline underline-offset-4">
            {part.text}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

/** Guía de colección: introducción, tabla comparativa, secciones y consejos. */
export function CollectionGuide({ guide }: { guide: CollectionGuideData }) {
  const { intro, table, sections, tips } = guide;
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">{intro.heading}</h2>
        {intro.paragraphs.map((p, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-charcoal/85 md:text-lg">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="border-b border-ink text-xs uppercase tracking-wide text-mineral">
              {table.columns.map((col) => (
                <th key={col} scope="col" className="py-3 pr-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.name} className="border-b border-stone-beige align-top text-charcoal/85">
                <th scope="row" className="py-3 pr-4 font-medium text-ink">
                  {row.href ? (
                    <Link href={row.href} className="underline-offset-4 hover:underline">
                      {row.name}
                    </Link>
                  ) : (
                    row.name
                  )}
                </th>
                {row.cells.map((cell, i) => (
                  <td key={i} className="py-3 pr-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 text-xs text-mineral">{table.note}</p>}

      <div className="mt-14 max-w-3xl space-y-12">
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-serif text-2xl text-ink md:text-3xl">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-base leading-relaxed text-charcoal/85 md:text-lg">
                {p}
              </p>
            ))}
          </div>
        ))}

        <div>
          <h2 className="font-serif text-2xl text-ink md:text-3xl">{tips.heading}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-charcoal/85 md:text-lg">
            {tips.items.map((parts, i) => (
              <li key={i}>
                <RichText parts={parts} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
