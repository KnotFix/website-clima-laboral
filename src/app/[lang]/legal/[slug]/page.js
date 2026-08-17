import { notFound } from "next/navigation";

import { LegalLayout } from "@/components/legal/legal_layout";
import { LEGAL_NAV } from "@/content/legal/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { resolve_legal } from "@/lib/legal";
import { LOCALES, is_locale } from "@/lib/site_config";

/**
 * `[slug]` y no una catch-all: los documentos legales son una lista plana. Si
 * algun dia hay uno anidado, el cambio es de ruta y no de contenido.
 */
export function generateStaticParams() {
  return LEGAL_NAV.map((entry) => ({ slug: entry.slug }));
}

/** Un slug fuera de `LEGAL_NAV` responde 404 en vez de intentar renderizarse. */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!is_locale(lang)) return {};

  const legal = await resolve_legal(lang, slug);
  if (!legal) return {};

  return {
    title: legal.title,
    // Los slugs son los MISMOS en los dos idiomas, asi que el hreflang se arma
    // sin tabla de traduccion de rutas — igual que en las docs.
    alternates: {
      canonical: `/${lang}/legal/${slug}`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}/legal/${slug}`]),
      ),
    },
  };
}

export default async function LegalPage({ params }) {
  const { lang, slug } = await params;
  if (!is_locale(lang)) notFound();

  const legal = await resolve_legal(lang, slug);
  if (!legal) notFound();

  const { Legal, entry, title } = legal;
  const dict = await get_dictionary(lang);

  return (
    <LegalLayout lang={lang} dict={dict} title={title} entry={entry}>
      <Legal />
    </LegalLayout>
  );
}
