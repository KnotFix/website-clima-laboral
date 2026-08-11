"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALES, swap_locale_in_path } from "@/lib/site_config";
import { cn } from "@/lib/utils";

export function LangSwitch({ lang, dict }) {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
      aria-label={dict.a11y_switch_lang}
    >
      {LOCALES.map((locale) => {
        const is_active = locale === lang;
        return (
          // scroll={false}: es la misma pagina traducida, no un destino nuevo.
          // Sin esto Next salta al tope al navegar y, como el sitio declara
          // scroll-behavior: smooth, ese salto se vuelve un scroll animado de
          // casi un segundo que arrastra al lector fuera de lo que estaba
          // leyendo. Quedandose quieto, la seccion se traduce en el lugar.
          <Link
            key={locale}
            href={swap_locale_in_path(pathname, locale)}
            hrefLang={locale}
            scroll={false}
            aria-current={is_active ? "true" : undefined}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium uppercase transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              is_active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
