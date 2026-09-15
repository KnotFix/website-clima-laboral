const en = {
  // <title> and meta description of the home page: what the search engine
  // shows. "Workplace climate surveys" is what people type; "by segment" is
  // what sets us apart. Under 60 characters so it does not get cut off.
  meta_title: "Censuma — Workplace climate surveys by segment",
  // Also the text of the Open Graph card (`opengraph-image.js`), so it has
  // to keep fitting in four lines at 52px.
  meta_description:
    "Measure workplace climate and job satisfaction by segment, not by average. Combine filters, compare teams and track results study after study. Free trial.",

  // Navigation
  nav_links: [
    { label: "How it works", href: "#how" },
    { label: "Analysis", href: "#weights" },
    { label: "FAQ", href: "#faq" },
  ],
  // "Start free" and not "Start": a link that only says "Start" counts as
  // generic link text for search engines (same bin as "click here"), and
  // "free" is the word that earns the click.
  nav_cta: "Start free",
  // Kept OUT of `nav_links`: the items in that list are anchors on the home
  // page and `NavLinks` derives their id by cutting the "#". See `navbar.jsx`.
  nav_docs: "Docs",
  // Also kept OUT, for the same reason: it is not an anchor but the product's
  // sign-up screen, which is where the plans are shown. See
  // `site_config.register_url`.
  nav_pricing: "Pricing",

  // Hero
  hero_title: "Your company's climate, measured by the people who live it",
  // The headline split into pieces, so words can be dimmed and the tiles can
  // sit in the middle. Each tile sits next to what it shows: the weather by
  // "climate" and the faces by "the people who live it". Only the link
  // ("measured by") is grey, so the two weighted halves read on their own.
  // `hero_title` stays as the flat version metadata uses.
  hero_title_segments: [
    { text: "Your" },
    { text: "company's" },
    { text: "climate," },
    { weather: true },
    { text: "measured", tone: "muted" },
    { text: "by", tone: "muted" },
    { face: true },
    { text: "the" },
    { text: "people" },
    { text: "who" },
    { text: "live" },
    { text: "it." },
  ],
  // In pieces like the headline: `tone: "strong"` lifts the word to the text
  // colour over the grey of the rest. They are the two things being measured;
  // highlight more and the subtitle has nothing left to stand out against.
  hero_subtitle_segments: [
    { text: "Measure workplace" },
    { text: "climate", tone: "strong" },
    { text: "and job" },
    { text: "satisfaction", tone: "strong" },
    { text: "by segment." },
  ],
  hero_cta_primary: "Start free",
  hero_cta_secondary: "See how it works",

  // The panel under the CTAs: one capture and three cards floating over it.
  // **The numbers come from the SAME demo series as the capture** — Clima
  // Laboral 2027 - eNPS, 144 responses, the eleventh study of Ingenio Santa
  // Rita — and must keep matching it: a card that contradicts the panel
  // underneath reads as made up. If the capture changes, check them here.
  // The capture is the 2027 one because it is the one that shows the eNPS next
  // to the two indices; `trend` ends on the same 71.42% the panel shows.
  // `goal` is still the 2026 target — the one in `metas_resultado`, further
  // down —: the 2027 one was missed by 20 points and is not hero material.
  // `series` is the climate index study by study, 2017 to 2027, read off
  // `indices_evolucion` plus the 2027 point; it only draws the line, it is
  // never printed. The `*_value` fields are the goal bar lengths, 0 to 100.
  hero_showcase: {
    shot: {
      light: "/shots/resumen_estudio-light.png",
      dark: "/shots/resumen_estudio-dark.png",
      alt: "A workplace climate study summary: 144 respondents, 71.52% job satisfaction, 71.42% workplace climate, an eNPS of +0.69 with promoters, passives and detractors, and every category with its percentage",
    },
    trend: {
      label: "Workplace climate",
      value: "71.42%",
      delta: "+11.1 pts",
      span: "11 studies, 2017 to 2027",
      series: [60.31, 64.0, 65.7, 65.4, 65.4, 70.0, 71.7, 70.7, 71.7, 75.41, 71.42],
    },
    goal: {
      label: "Job satisfaction 2026",
      status: "Target met",
      target_label: "Target",
      target: "73.13%",
      target_value: 73.13,
      result_label: "Result",
      result: "75.03%",
      result_value: 75.03,
    },
    anonymity: {
      title: "Anonymous by design",
      body: "No segment is shown below the minimum N.",
    },
  },

  // Reach: text on the left, globe on the right.
  // The heading is split into pieces so the rotating word can be embedded, the
  // same way `hero_title_segments` embeds the hero tiles.
  world_title_segments: [
    { text: "Any" },
    { rotating: true },
    { text: "in" },
    { text: "the" },
    { text: "world," },
    { text: "one" },
    { text: "system" },
  ],
  world_rotating_words: ["organization", "company", "business"],

  // Why the numbers mean something: scale, model and breakdown
  measurement_title_segments: [
    { text: "A" },
    { text: "measurement,", tone: "brand" },
    { text: "not" },
    { text: "a" },
    { text: "survey" },
  ],
  measurement_body:
    "Most climate and job-satisfaction surveys end up as a file that can't be compared against anything. Here every answer adds up to a number, and that number rests on a model.",
  // Same rule as `problem_items`: the title states the fact — how many options,
  // how many models, where the charts come from — instead of hinting at it.
  // "Ready to present" and "A model behind it" went for that reason: they read
  // like brochure promises and you had to finish the body to learn the point.
  //
  // **The body fits in three lines, and that is a limit, not a style.** In the
  // pinned rail the cards are centred (`items-center`), so they do not match
  // heights: one with an extra line sticks out above and below its neighbours.
  // At 320px wide and a 16px body that is ~88 characters.
  //
  // **THREE, not four.** "Results are stored per segment" was pulled: the
  // per-segment breakdown is what the whole section says — the headline, the
  // body, the filters that follow — and as its own card it repeated without
  // adding. Pulling it also drops its icon from `ITEM_ICONS`, which goes by
  // position.
  measurement_items: [
    {
      title: "A four-point scale, no middle option",
      body: "No “neither agree nor disagree” to hide in: everyone commits.",
    },
    {
      title: "Several models, one per dimension",
      body: "There isn't one model: there are several, and each one gives a number you can compare.",
    },
    {
      title: "Charts come out of the system ready",
      body: "With the breakdown you chose. Nothing to rebuild in Excel before the meeting.",
    },
  ],

  // The last card in the carousel: product shots cycling.
  // These are real captures of the panel, taken from DEMO MODE — seeded data,
  // read only — never from a customer account.
  // **Each one ships in both themes.** The site renders light or dark depending
  // on who is looking, and a light capture on the dark background is a slab that
  // glares; `ImageCycle` keeps the matching one visible. Both keys are required:
  // there is no fallback to a single file.
  // The `alt` describes what is shown, since it is all that reaches anyone who
  // cannot see the image; it is written once per pair — the theme does not
  // change what the screen says.
  // **`resumen_estudio` is not here**: it is the hero capture, and repeating it
  // in the carousel shows the same screen twice in one scroll.
  measurement_shots_title: "Inside the result",
  measurement_shots: [
    {
      light: "/shots/indices_evolucion-light.png",
      dark: "/shots/indices_evolucion-dark.png",
      alt: "The climate index study by study, 2017 to 2026, with one point opened to its value",
    },
    {
      light: "/shots/pregunta_serie-light.png",
      dark: "/shots/pregunta_serie-dark.png",
      alt: "A single question across the years, with how each study's answers split shown underneath",
    },
    {
      light: "/shots/metas_resultado-light.png",
      dark: "/shots/metas_resultado-dark.png",
      alt: "Target against result per period, each study marked as met or missed",
    },
  ],

  // Section 2 — the problem.
  // **It asks, it doesn't assert.** Asserted — "The survey ran. The climate
  // stayed the same." — the reader had to recognize themselves in someone
  // else's sentence and work out that it was about them. Asked straight, there
  // is nothing to work out: either it happened to them or it didn't.
  // Still short: it comes in word by word with `BlurText`, and a long line takes
  // too long to finish building. It names the subject — "your climate" —
  // because without it the question never says what was supposed to change.
  //
  // Split into pieces like `hero_title_segments`, so the payoff can be painted.
  // `tone: "brand"` is the purple, and it goes ONLY there — those are the words
  // that sum up the whole section.
  problem_title_segments: [
    { text: "You" },
    { text: "ran" },
    { text: "the" },
    { text: "survey" },
    { text: "and" },
    { text: "your" },
    { text: "climate" },
    { text: "is" },
    { text: "still", tone: "brand" },
    { text: "the", tone: "brand" },
    { text: "same?", tone: "brand" },
  ],
  // **The title asserts; the body fills in.** Each one names ONE concrete
  // failure — the average, the format that keeps changing, the delay — and holds
  // up on its own. No sentences that circle before saying what went wrong.
  //
  // The body sticks to a single idea, one or two lines. Three was tried and goes
  // unread: this is a stack going by with the scroll, not a documentation page.
  //
  // Second person throughout: the problem belongs to whoever is reading, not to
  // some abstract company.
  problem_items: [
    {
      title: "The average hides the sinking team",
      body: "The result looks fine while the team falls apart. You find out once they've quit.",
    },
    {
      title: "Change the format and there's nothing to compare",
      body: "You ask different questions each year, and then the results don't line up.",
    },
    {
      title: "The report lands weeks late",
      body: "Tables get built by hand. By the time it's ready, the problem has moved.",
    },
  ],

  // Section 3 — how it works
  // **FOUR steps, and there used to be three.** The first one was missing:
  // building the organization. The roster step implied the tree came out of the
  // CSV, and it is the other way around — you build the tree and the system
  // hands you the template to fill in. With that step in place the headline
  // can't claim the system does the first one either: it names the whole run.
  how_title_segments: [
    { text: "Four" },
    { text: "steps," },
    { text: "from" },
    { text: "org" },
    { text: "chart" },
    { text: "to", tone: "brand" },
    { text: "result", tone: "brand" },
  ],
  how_steps: [
    {
      step_title: "Create your organization",
      step_body:
        "You build your company tree: branches, departments and areas, however they stand today.",
    },
    {
      step_title: "Upload your roster",
      step_body:
        "The system hands you a template of the tree you just built. You fill it in with your people and upload it.",
    },
    {
      step_title: "Launch the study",
      step_body:
        "Pick whether to measure one department or the whole company. Each questionnaire assembles itself: the model's questions plus the ones you added.",
    },
    {
      step_title: "Read the results",
      step_body:
        "They arrive split by segment. Compare areas and see where to act, not just the overall number.",
    },
  ],

  // Section 4 — combining filters and comparing (the differentiator)
  //
  // > **The weighting point was pulled**, and its mockup with it. The key and
  // > the section `id` still say `weights` because they are the address of a menu
  // > anchor: renaming them breaks `#weights` without changing anything visible.
  // > The HEADLINE did change: it announced "Weight what matters" and there was
  // > nothing below it to deliver on that.
  weights_title: "Combine filters. Compare what matters.",
  weights_body:
    "Analysis isn't a bigger average. It's being able to ask your data specific questions and get an answer.",
  // Titles say what you do, bodies say what you get. The bodies used to describe
  // the mechanism — "assign weights and compare" — leaving the reader to work
  // out what it was for.
  weights_points: [
    {
      title: "Stack filters together",
      body: "North region, night shift and over five years, all at once. You stop arguing about averages and see the exact group you care about.",
    },
    {
      title: "Compare like with like",
      body: "One area against another, or against its own past. Nobody gets to tell you the comparison wasn't fair.",
    },
    {
      title: "Know when it isn't enough",
      body: "If a cross-section is left with too few responses, the system says so. You don't decide on a number that can't hold.",
    },
  ],

  // One product mock per point, in the same order as `weights_points`. Each one
  // shows the product doing what its point promises.
  //
  // **The numbers are content**: Spanish writes the decimal with a comma and
  // English with a period, so they can't live in the component. The length of
  // each bar comes from dividing them by `scale_max`.
  // The MOVING captures, per point. They replace the drawn mockup of that same
  // point: `weights_filters.jsx` uses the clip when a row declares one, and
  // falls back to `weights_shots` when it does not.
  //
  // They come out of demo mode, like the ones under `/shots/`, and ship without
  // audio: they play on their own, on a loop, and a video that makes noise by
  // itself is nobody's friend.
  //
  // **They come in a light/dark pair, like the still captures.** The light one
  // on the dark site is a white panel that glares, and each is its own
  // recording, not a filter over the other. `SystemClip` only downloads the one
  // for the active theme, and only once the row gets close.
  weights_clips: {
    cross: {
      light: {
        src: "/clips/filtros_cruzados.mp4",
        poster: "/clips/filtros_cruzados-poster.webp",
      },
      dark: {
        src: "/clips/filtros_cruzados-dark.mp4",
        poster: "/clips/filtros_cruzados-dark-poster.webp",
      },
      title: "The cross, being built",
      a11y: "Video of the system: a branch and a role are picked in the filter panel and the group's result recalculates",
    },
    compare: {
      light: {
        src: "/clips/poblaciones_comparadas.mp4",
        poster: "/clips/poblaciones_comparadas-poster.webp",
      },
      dark: {
        src: "/clips/poblaciones_comparadas-dark.mp4",
        poster: "/clips/poblaciones_comparadas-dark-poster.webp",
      },
      title: "Branch against branch",
      a11y: "Video of the system: a segment's branches set against each other and against the overall result, across the radar, the ranking, the gap and the per-category table",
    },
    threshold: {
      light: {
        src: "/clips/umbral_muestra.mp4",
        poster: "/clips/umbral_muestra-poster.webp",
      },
      dark: {
        src: "/clips/umbral_muestra-dark.mp4",
        poster: "/clips/umbral_muestra-dark-poster.webp",
      },
      title: "A cross that can't hold",
      a11y: "Video of the system: role, sex and age-range filters are added until the group is down to very few people, and the panel warns that the segment can't be shown without compromising anonymity",
    },
  },

  weights_shots: {
    scale_max: "4",
    cross: {
      a11y: "Product mock: three filters stacked and the result for that group",
      title: "Cross-section result",
      chips: ["North region", "Night shift", "Tenure > 5 years"],
      count: "214",
      count_label: "responses in this cross-section",
      bars: [
        { label: "This cross-section", value: "3.4" },
        { label: "Company-wide", value: "2.9" },
      ],
    },
    compare: {
      a11y: "Product mock: two regions compared over the same period",
      title: "North against South",
      bars: [
        { label: "North region", value: "3.4" },
        { label: "South region", value: "2.8" },
      ],
      footnote:
        "Same period, same core questions and the same scale. That is why the two numbers can sit on one line.",
    },
    threshold: {
      a11y: "Product mock: a cross-section with too few responses and no result",
      title: "Cross-section below the minimum",
      chips: ["Night shift", "Site 3"],
      count: "6",
      count_label: "responses in this cross-section",
      result_label: "Result",
      notice:
        "Below the minimum you set. The system hides this segment instead of handing you a number that can't hold.",
    },
  },

  // Section 4b — the reports that come out of the analysis
  //
  // It sits right after the analysis and shares its band: it is its
  // consequence. First you cross and compare, and only then does it make sense
  // to say what format you take that away in.
  reports_title_segments: [
    { text: "Everything" },
    { text: "you" },
    { text: "cross," },
    { text: "in" },
    { text: "one", tone: "brand" },
    { text: "report", tone: "brand" },
  ],
  reports_body:
    "The report comes out with the cross-sections you built: the filters applied, the result for each segment and the comparisons. Download it as XLSX, PDF or HTML, depending on what you'll do with it.",
  // The three formats, in the order they are shown. The body says what each one
  // is good for, not what an XLSX is. The icon goes by position in
  // `reports.jsx`: dropping a format means dropping its icon too.
  reports_formats: [
    {
      name: "XLSX",
      body: "The full table, to keep slicing it in your spreadsheet.",
    },
    {
      name: "PDF",
      body: "The finished report, ready to print or present to leadership.",
    },
    {
      name: "HTML",
      body: "The report as a page, with the charts and the filters you applied.",
    },
  ],
  // The captures of the deliverable, in the SAME order as `reports_formats`:
  // the spreadsheet, a page of the PDF, and the report open in a browser.
  //
  // **They ship as ONE image, not as a light/dark pair** — the only exception on
  // the site: an export has no theme, a PDF is white on both screens, so there
  // is no dark version to ship. `reports.jsx` dims them slightly in dark so the
  // paper doesn't glare.
  //
  // The first two also show **a segment hidden for falling below the minimum
  // number of responses** ("Distribución", dashes instead of numbers). It is the
  // threshold promise the site makes in the analysis and the FAQ, kept inside
  // the deliverable — which is why neither one is cropped out.
  //
  // The `alt` describes what is on screen; the `caption` is the line under it.
  reports_shots: [
    {
      src: "/shots/reporte_xlsx.png",
      alt: "The report open in a spreadsheet: one table per question, with each segment's responses split across Nada, Algo, Mucho and Completamente, and its acceptable percentage",
      caption: "The spreadsheet, question by question",
    },
    {
      src: "/shots/reporte_pdf.png",
      alt: "A page of the PDF report: how one question's answers break down per segment, with each segment's response count, the counts table, and one segment hidden for falling below the minimum",
      caption: "The report, ready to present",
    },
    {
      src: "/shots/reporte_html.png",
      alt: "The HTML report open in a browser: the job satisfaction index at 87.64 out of 100 from 324 responses, and the result for each category",
      caption: "The report as a page",
    },
  ],

  // Section 5 — scale
  scale_title_segments: [
    { text: "From" },
    { text: "20" },
    { text: "employees" },
    { text: "to" },
    { text: "50,000," },
    { text: "in" },
    { text: "the", tone: "brand" },
    { text: "same", tone: "brand" },
    { text: "system", tone: "brand" },
  ],
  // The point is that it adapts, not the tree. The previous version explained the
  // data structure — "you declare it as a tree", "a one-level tree" — and that is
  // how we do it, not what the reader gets. The four charts below already show
  // the tree; the copy has to say what it is good for.
  scale_body:
    "You don't adapt to our system: the system adapts to your company. Company, branches, departments, and areas, however they are set up today. Open a branch tomorrow and you just add it — the history of what you already measured stays intact.",
  // Four organizations, smallest to largest. Each chart is drawn from `tree`:
  // a node with children, recursive.
  scale_orgs: [
    {
      label: "A single company",
      size: "20 people",
      tree: {
        label: "Company",
        children: [
          { label: "Production" },
          { label: "Sales" },
          { label: "Administration" },
        ],
      },
    },
    {
      label: "With branches",
      size: "300 people",
      tree: {
        label: "Company",
        children: [
          {
            label: "Central branch",
            children: [{ label: "Operations" }, { label: "Sales" }],
          },
          {
            label: "North branch",
            children: [{ label: "Operations" }, { label: "Sales" }],
          },
        ],
      },
    },
    {
      label: "A group of companies",
      size: "4,000 people",
      tree: {
        label: "Group",
        children: [
          {
            label: "Company A",
            children: [{ label: "Plant 1" }, { label: "Plant 2" }],
          },
          { label: "Company B", children: [{ label: "Plant 3" }] },
        ],
      },
    },
    {
      label: "A group across countries",
      size: "50,000 people",
      tree: {
        label: "Group",
        children: [
          {
            label: "North region",
            children: [
              {
                label: "Company A",
                children: [{ label: "Plant 1" }, { label: "Plant 2" }],
              },
            ],
          },
          {
            label: "South region",
            children: [{ label: "Company B", children: [{ label: "Plant 3" }] }],
          },
        ],
      },
    },
  ],

  // Section 6 — FAQ
  // > **The confidentiality section used to live here.** It was dropped as a
  // > section of its own, but the argument was NOT lost: it is the single
  // > biggest objection a climate survey faces, so it became the first FAQ
  // > entry — which is where someone goes looking for it — together with the
  // > minimum threshold, which was its second point.
  //
  // **No answer claims anything the site does not already state elsewhere.**
  // These sell on their own through self-service: there is nobody on the other
  // side to walk back an over-promise. Pricing, trial length and concrete
  // timelines are deliberately left out, because they are not in the documented
  // product.
  // Training on hiring is the exception: it comes from a business decision
  // (2026-09-11), not from the product, and it is repeated in the final CTA.
  // If the commitment changes, it changes in both places.
  faq_title_segments: [
    { text: "Before" },
    { text: "you" },
    { text: "start," },
    { text: "what", tone: "brand" },
    { text: "everyone", tone: "brand" },
    { text: "asks", tone: "brand" },
  ],
  faq_body:
    "The questions that come up before launching a first study, answered straight.",
  faq_items: [
    {
      question: "Can anyone see what I answered?",
      answer:
        "No. Responses are detached from identity: tokens are issued per segment, never per name. People answer honestly only when they know they can't be identified, and that isn't a promise — it's how the system is built.",
    },
    {
      question: "What if my team is very small?",
      answer:
        "No segment shows results below the minimum number of responses you set. That minimum applies when filters are combined too, which is exactly where groups shrink without anyone noticing.",
    },
    {
      question: "What questions does it include?",
      answer:
        "A universal core everyone answers the same way, plus the questions you add attached to a branch of your organization. The scale has four options and no middle point: everyone commits.",
    },
    {
      question: "Can I compare against the previous study?",
      answer:
        "Yes, as long as the question core and the scale are the same. That is why the core does not change between studies: it is what lets two results sit on the same line.",
    },
    {
      question: "How long does it take to get running?",
      answer:
        "The system gives you a template of your company tree. You fill in the roster and upload it in the roster section. Then you pick who to measure and launch the study. There is no implementation project.",
    },
    {
      question: "Do you train us to use it?",
      answer:
        "Yes. When you hire us, training is included from the start: how to build the roster, launch the study, and read results by segment.",
    },
    {
      question: "Do I have to talk to someone to try it?",
      answer: "No. You create the account and start.",
    },
    // The only answer that states something the site says nowhere else, on
    // purpose: the assisted study is not a product feature but a separate
    // service, and this is the question that offers it.
    {
      question: "What if I don't want to run the study myself?",
      answer:
        "You don't have to. We offer a separate service in which we run the study at your company from start to finish: we build the roster, launch the collection and hand you the results. Write to knotfixservice@knotfix.com.",
    },
  ],

  // Section 7 — final CTA
  final_cta_title_segments: [
    { text: "Launch" },
    { text: "your" },
    { text: "first" },
    { text: "study" },
    { text: "this", tone: "brand" },
    { text: "week", tone: "brand" },
  ],
  final_cta_body:
    "Create your account, upload your roster, and measure. Training is included when you hire us.",
  final_cta_button: "Start free",

  // Docs. Only the chrome lives here: the titles and prose of each page live
  // in `src/content/docs/**.mdx` and in `docs/nav.js`. Putting long-form text
  // in the dictionary becomes unmanageable by the tenth page.
  docs_index_title: "Documentation",
  docs_index_body:
    "How Censuma works underneath: the concepts you need to read a result correctly, and the guides for each module.",
  docs_all_pages: "All pages",
  docs_on_this_page: "On this page",
  docs_prev: "Previous",
  docs_next: "Next",

  // Footer
  footer_tagline: "Workplace climate and job satisfaction.",
  footer_rights: "All rights reserved.",

  // Legal. Only the chrome lives here, same as docs: the text of each document
  // lives in `src/content/legal/**.mdx`, and its title, version and date in
  // `legal/nav.js` — which is also where the product's acceptance record reads
  // them from.
  // What's new. Each entry's prose lives in `src/content/changelog/en/*.mdx`
  // —one per date—; only the page header and the link that offers it from the
  // docs index live here.
  changelog_title: "What's new",
  changelog_body:
    "What changed in Censuma and when. Newest first; older entries are not rewritten.",
  changelog_hint: "Looking for what changed, and when?",

  legal_version: "Version",
  legal_updated: "Updated",
  legal_draft_title: "Draft, not reviewed by counsel",
  legal_draft_body:
    "This document has not yet been reviewed by a lawyer and is not in force. It is published so it can be worked on, not to be relied upon.",

  // Accessibility
  a11y_toggle_theme: "Toggle theme",
  a11y_open_menu: "Open menu",
  a11y_close_menu: "Close menu",
  a11y_switch_lang: "Change language",
  a11y_main_nav: "Main navigation",
  a11y_mobile_nav: "Menu navigation",
  a11y_legal_nav: "Legal documents",
  // Three distinct names rather than one repeated: the docs pages hold the
  // side tree, its collapsed mobile copy and the page index all at once. With
  // the same accessible name a screen reader lists identical landmarks.
  a11y_docs_nav: "Documentation pages",
  a11y_docs_nav_mobile: "Documentation pages (collapsed)",
  a11y_docs_toc: "Sections on this page",
  // The measurement rail only takes focus when it is NOT pinned: there it is
  // scrolled by hand, and without this there is no way to move it by keyboard.
  a11y_measurement_rail: "Measurement cards: scroll sideways",
  // The analysis mocks carry their own `a11y` inside `weights_shots`: there are
  // four of them and each describes something different, so the text lives next
  // to the content it describes instead of loose in here.
  a11y_mood_face: "Face cycling between happy, neutral and sad",
  a11y_weather_tile: "Weather cycling between sunny, cloudy and rainy",
  a11y_skip_to_content: "Skip to content",
};

export default en;
