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
  // The items of the navbar's "Product" dropdown (and the first footer
  // column): anchors on the home page. See `lib/nav_menu.js`.
  nav_product: "Product",
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
  // page, and this is the `/en/docs` ROUTE. In the navbar it is a direct link,
  // between "Pricing" and "Resources". See `lib/nav_menu.js`.
  nav_docs: "Docs",
  // Also kept OUT, for the same reason: it is the `/en/pricing` ROUTE. A
  // direct link in the bar, like the docs.
  nav_pricing: "Pricing",
  // Also STANDALONE: it's the `/en/resources` index ROUTE, in the navbar and
  // the footer. The only section with a translated slug (`/es/recursos`): see
  // `content/resources/nav.js`.
  nav_resources: "Resources",
  // The secondary link to the app, for people who already have an account. It
  // goes to the app ROOT, which shows the login when signed out.
  nav_login: "Log in",

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
        "You don't have to. We offer a separate service in which we run the study at your company from start to finish: we build the roster, launch the collection and hand you the results. Write to censumaservice@censuma.com.",
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
  footer_contact_title: "Contact",
  footer_contact_whatsapp: "WhatsApp",
  footer_contact_email: "Email",
  // The message pre-filled in the WhatsApp of whoever taps the button.
  footer_contact_whatsapp_message: "Hi, I have a question about Censuma.",
  // The social buttons are just a logo: this is their accessible name.
  footer_social_label: "Censuma on social media",
  footer_social_instagram: "Censuma on Instagram",
  footer_social_facebook: "Censuma on Facebook",
  footer_social_youtube: "Censuma on YouTube",

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

  // Pricing (`/en/pricing`). Only the copy that does not change from plan to
  // plan lives here: names, prices and limits come from the product's catalog
  // on every regeneration (`lib/pricing.js`). Templates use `{key}` and are
  // filled by `fill()`.
  pricing_meta_title: "Pricing and plans",
  pricing_meta_description:
    "Annual plans to measure workplace climate and satisfaction, every feature included. What changes is how many people you measure. Free 30-day trial, no card.",
  pricing_title: "Plans and pricing",
  pricing_body:
    "Every plan includes every feature of the product. What changes is how many people you measure, how many studies you launch per year and how many invitations you send.",
  pricing_billing: "Billed annually",
  pricing_currency_note:
    "Prices in US dollars (USD), taxes included: the amount you see is the amount you are charged.",
  pricing_trial_note:
    "The 30-day trial requires no card and lets you configure your entire organization; the only thing it does not do is launch surveys. Paid plans are charged when the account is created and start out active.",
  pricing_unavailable:
    "We could not load the plans right now. You will see all of them when you create your account, or write to us and we will send them over.",
  pricing_unavailable_button: "See the plans in the app",
  pricing_limits: {
    studies: {
      one: "{number} study per year",
      other: "{number} studies per year",
      unlimited: "Unlimited studies per year",
    },
    people: {
      one: "{number} person on payroll",
      other: "{number} people on payroll",
      unlimited: "Unlimited people on payroll",
    },
    forms: {
      one: "{number} survey form",
      other: "{number} survey forms",
      unlimited: "Unlimited survey forms",
    },
    kiosks: {
      one: "{number} kiosk station",
      other: "{number} kiosk stations",
      unlimited: "Unlimited kiosk stations",
    },
    emails: {
      one: "{number} email per period",
      other: "{number} emails per period",
      unlimited: "Unlimited emails",
    },
    whatsapp: {
      one: "{number} WhatsApp message per period",
      other: "{number} WhatsApp messages per period",
      unlimited: "Unlimited WhatsApp messages",
    },
  },
  pricing_extra: "{price} per year for each additional person",
  pricing_extra_up_to: "{price} per year for each additional person (up to {number} more)",
  pricing_trial: {
    title: "Trial",
    description:
      "Set up your whole organization without a card. When the trial ends, choose a plan to launch your first study.",
    price: "Free",
    period: "for {days} days",
    button: "Start for free",
    features: [
      "Unlimited people on payroll",
      "Full structure, payroll and survey forms",
      "No credit card",
      "Does not launch survey collection",
    ],
  },
  pricing_paid: {
    description: "The year is charged when you create the account. Starts active, no trial.",
    featured: "Most popular",
    period: "per year, taxes included",
    per_person: "{price} per person per year",
    button: "Subscribe",
  },
  pricing_custom: {
    description:
      "More than {number} people, several studies a year or special needs. We build the plan with you.",
    description_plain:
      "Several studies a year, large payrolls or special needs. We build the plan with you.",
    price: "Custom",
    button: "Contact us",
    mail_subject: "Question about the {plan} plan",
    features: [
      "Unlimited people on payroll",
      "Unlimited studies per year",
      "Unlimited emails",
      "Every product feature",
      "Implementation support",
    ],
  },
  pricing_demo_title: "See the product running, with sample data",
  pricing_demo_body: "Want to see what the results look like first?",
  pricing_demo_button: "See the demo",
  pricing_assisted_title: "Would you rather we do it?",
  pricing_assisted_body:
    "You don't have to launch the study yourself. We offer a separate service in which we run the study at your company, from start to finish.",
  pricing_assisted_button: "Contact us",
  pricing_assisted_subject: "I want Censuma to run the study for us",
  pricing_docs_hint: "How is the overage charged, and what happens at renewal or cancellation?",
  pricing_docs_link: "Read “Account and plan”",
  pricing_card_label: "{action}: {plan}",

  // Free resources (`/en/resources`). Marketing for people who aren't
  // customers yet: **nothing here comes from the product's method** (not the
  // core questions, the models, or how the indices or anonymity are computed).
  // Censuma is only named for what the home page already says, as a benefit.
  // The full rule is in `content/resources/nav.js`.
  resources_meta_title: "Free resources to measure workplace climate",
  resources_meta_description:
    "Free templates to measure workplace climate in your organization. Download them and use them without creating an account.",
  resources_title: "Resources",
  resources_body:
    "Free material to measure workplace climate on your own. Download it and use it without creating an account.",
  resources_free: "Free",
  resources_card_cta: "View the resource",

  // The survey template (`/en/resources/workplace-climate-survey-template`).
  // The questions, steps and Excel copy DON'T live here: they're in
  // `content/resources/survey_template.json`, which the script that builds the
  // file also reads. What you see and what you download stay the same.
  template_meta_title: "Free workplace climate survey template in Excel",
  template_meta_description:
    "Download a free workplace climate survey template in Excel: 30 statements across 6 dimensions, eNPS and results that calculate themselves.",
  template_title: "Workplace climate survey template in Excel (free)",
  template_intro: [
    "A 30-statement survey ready to print or move to a form, with a sheet to enter the answers and another one that calculates the results on its own.",
    "It includes eNPS and two open questions. It's free and doesn't ask you to sign up.",
  ],
  template_preview_title: "Preview",
  template_preview_body:
    "The 30 statements, in 6 dimensions of 5. Each one is answered with four options: Not at all, Somewhat, Very much and Completely.",
  template_shot_title: "The Results sheet",
  template_shot_alt:
    "The template's Results sheet with the example data: 80% participation, 68% overall favorable, the eNPS and the percentage favorable for each dimension.",
  template_shot_caption: "Calculated with the 20 example responses that come in the file.",
  template_download_title: "Download the template",
  template_download_body:
    "An Excel file with four sheets: how to use it, the survey, the responses and the results.",
  template_download_button: "Download the template",
  // The page fills in `{size}` with the file's real size.
  template_download_meta: "Excel (.xlsx), {size}",
  template_steps_title: "How to use it, in 5 steps",
  template_limits_title: "What a template can't do",
  template_limits_items: [
    {
      title: "The average hides the area that's struggling",
      body: "A 70% overall favorable score can hide a team sitting at 30%. If nobody looks by area, that team only shows up once people start leaving.",
    },
    {
      title: "Crossing filters doesn't fit in a sheet",
      body: "Looking at one area, one tenure band and one shift at once takes hours. And every cross makes the group smaller, which is exactly where anonymity gets lost.",
    },
    {
      title: "Year-over-year comparison is built by hand",
      body: "To know whether things improved, you have to put two surveys on the same line. With loose files, you do that all over again every time.",
    },
  ],
  template_limits_body:
    "Censuma measures by segment, crosses filters and compares each study with the previous one. It doesn't show results for a group below the minimum number of responses, and reports come out in XLSX, PDF and HTML.",
  template_cta: "Try Censuma for free",
  template_faq_title: "Frequently asked questions",
  // General on purpose: they're useful with or without Censuma. They also go
  // into the page's JSON-LD as FAQPage, with this same text.
  template_faq_items: [
    {
      question: "How many questions should a workplace climate survey have?",
      answer:
        "Between 25 and 40 closed questions is usually enough: they cover the important topics and take 10 to 15 minutes to answer. Any longer and people start answering without reading. This template has 30, plus one recommendation question and two open ones.",
    },
    {
      question: "How often should we run it?",
      answer:
        "Once a year is the most common, and it's the minimum to see a trend. If you make big changes after the survey, a shorter one six months later shows whether they worked. Surveying more often than changes take to show up wears people out.",
    },
    {
      question: "How do I protect anonymity?",
      answer:
        "Don't ask for anything that identifies the person, merge small areas with others and never show results for a group so small that someone could guess who answered. The manager of the area being surveyed shouldn't enter the answers, and summarize open comments instead of quoting them word for word.",
    },
    {
      question: "What do I do with the results?",
      answer:
        "Share them with the team soon, even if they're not good. Pick two or three topics with the lowest percentage favorable, make a plan with owners and dates, and tell people what changed before the next survey. A survey with no visible action lowers participation in the next one.",
    },
  ],

  legal_version: "Version",
  legal_updated: "Updated",
  legal_draft_title: "Draft, not reviewed by counsel",
  legal_draft_body:
    "This document has not yet been reviewed by a lawyer and is not in force. It is published so it can be worked on, not to be relied upon.",

  // Cookie consent. The banner and the footer link that reopens it.
  consent_title: "Cookies and measurement",
  consent_body:
    "We use our own and third-party cookies to measure how the site is used and whether our ads work. They only switch on if you accept; the essential ones always work.",
  consent_privacy_link: "Privacy policy",
  consent_accept_all: "Accept all",
  consent_reject: "Reject",
  consent_configure: "Customize",
  consent_save: "Save",
  consent_necessary_label: "Essential",
  consent_necessary_body: "Language, theme and this very choice.",
  consent_necessary_state: "Always on",
  consent_analytics_label: "Analytics",
  consent_analytics_body:
    "How many people visit the site and which pages they read, so we can improve it (Google Analytics and Microsoft Clarity).",
  consent_marketing_label: "Marketing",
  consent_marketing_body:
    "Knowing which ad brought you here and showing you ours on other sites (Google Ads and Meta).",
  footer_cookie_prefs: "Cookie preferences",

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
  // The floating WhatsApp button is only the logo: this is its accessible name.
  a11y_whatsapp_float: "Message us on WhatsApp",
};

export default en;
