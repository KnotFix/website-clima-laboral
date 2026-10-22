import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";

import { FaqList } from "@/components/home/faq_list";
import { Button } from "@/components/ui/button";
import { fill } from "@/lib/pricing";
import { public_file_size, public_png_size, survey_template_content } from "@/lib/resources";
import { site_config } from "@/lib/site_config";

/**
 * La pagina de la plantilla de encuesta, en el orden que pidio el usuario: que
 * es, la vista previa, la descarga, como usarla, lo que no puede hacer y las
 * preguntas frecuentes.
 *
 * **Las preguntas van como texto y no solo en la captura**: es lo que lee el
 * buscador, y lo que deja a alguien decidir si le sirve antes de bajar nada.
 * Salen del mismo `.json` que arma el Excel (`scripts/build_survey_template.py`),
 * asi que lo que se ve es exactamente lo que se descarga.
 *
 * Server Component: lo unico interactivo es el acordeon del FAQ, que ya es su
 * propio componente de cliente.
 */
export function SurveyTemplate({ lang, dict }) {
  const content = survey_template_content(lang);
  const file_size = public_file_size(content.download_path, lang);
  const shot = public_png_size(content.preview_image);
  // El numero de la primera pregunta de cada dimension: la numeracion corre
  // seguida de P1 a P30, como en el Excel.
  const starts = content.dimensions.map(
    (_, index) =>
      content.dimensions
        .slice(0, index)
        .reduce((total, dimension) => total + dimension.questions.length, 0) + 1,
  );

  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {dict.template_title}
        </h1>
        {dict.template_intro.map((line) => (
          <p key={line} className="mt-4 text-lg text-muted-foreground text-pretty">
            {line}
          </p>
        ))}
      </header>

      <section aria-labelledby="preview" className="mt-14">
        <h2 id="preview" className="text-2xl font-semibold tracking-tight">
          {dict.template_preview_title}
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground text-pretty">
          {dict.template_preview_body}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.dimensions.map((dimension, dimension_index) => {
            const start = starts[dimension_index];
            return (
              <div
                key={dimension.name}
                className="rounded-xl border border-border bg-card p-5 text-card-foreground"
              >
                <h3 className="text-base font-semibold tracking-tight">{dimension.name}</h3>
                <ol start={start} className="mt-3 space-y-2.5 text-sm">
                  {dimension.questions.map((question, index) => (
                    <li key={question} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="w-8 shrink-0 font-medium tabular-nums text-muted-foreground"
                      >
                        {content.question_prefix}
                        {start + index}
                      </span>
                      <span className="text-foreground/90 text-pretty">{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <h3 className="text-base font-semibold tracking-tight">
              {content.survey_sheet.enps_title} ({content.enps.label})
            </h3>
            <p className="mt-3 text-sm text-foreground/90 text-pretty">{content.enps.question}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {content.enps.low} · {content.enps.high}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <h3 className="text-base font-semibold tracking-tight">
              {content.survey_sheet.open_title}
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm text-foreground/90">
              {content.open_questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="mt-12">
          <h3 className="text-lg font-semibold tracking-tight">{dict.template_shot_title}</h3>
          {/* La captura es la hoja tal cual sale de Excel: fondo blanco en los
              dos temas, como cualquier planilla. El borde la separa del fondo
              oscuro. */}
          <div className="mt-4 max-w-3xl overflow-hidden rounded-xl border border-border bg-white">
            <Image
              src={content.preview_image}
              alt={dict.template_shot_alt}
              width={shot.width}
              height={shot.height}
              sizes="(min-width: 800px) 768px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {dict.template_shot_caption}
          </figcaption>
        </figure>
      </section>

      <section
        id="download"
        aria-labelledby="download-title"
        className="mt-14 flex scroll-mt-28 flex-col items-start gap-5 rounded-xl border border-foreground/40 bg-card p-6 text-card-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="max-w-xl">
          <h2 id="download-title" className="text-xl font-semibold tracking-tight">
            {dict.template_download_title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {dict.template_download_body}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <Button asChild size="lg">
            <a
              href={content.download_path}
              download
              data-track="template_download"
              data-track-location="resource"
            >
              <Download aria-hidden="true" />
              {dict.template_download_button}
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            {fill(dict.template_download_meta, { size: file_size })}
          </p>
        </div>
      </section>

      <section aria-labelledby="steps" className="mt-14 max-w-3xl">
        <h2 id="steps" className="text-2xl font-semibold tracking-tight">
          {dict.template_steps_title}
        </h2>
        <ol className="mt-6 space-y-5">
          {content.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium tabular-nums text-background"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 text-muted-foreground text-pretty">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="limits"
        className="mt-14 rounded-xl border border-border bg-muted/40 p-6 sm:p-8"
      >
        <h2 id="limits" className="text-2xl font-semibold tracking-tight">
          {dict.template_limits_title}
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {dict.template_limits_items.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-border bg-card p-5 text-card-foreground"
            >
              <h3 className="font-medium text-pretty">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-foreground/90 text-pretty">
          {dict.template_limits_body}
        </p>
        <Button asChild size="lg" className="mt-6">
          <a
            href={site_config.signup_url}
            data-track="template_start"
            data-track-location="resource"
          >
            {dict.template_cta}
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </section>

      <section aria-labelledby="faq" className="mt-14">
        <h2 id="faq" className="text-2xl font-semibold tracking-tight">
          {dict.template_faq_title}
        </h2>
        <FaqList items={dict.template_faq_items} track_prefix="template_faq" class_name="mt-4" />
      </section>
    </>
  );
}
