const en = {
  meta_title: "Knotfix Clima — Workplace climate measured by segment",
  meta_description:
    "Measure workplace climate by segment, not by average. Combine filters, weight what matters, and compare results across teams and over time.",

  // Navigation
  nav_links: [
    { label: "How it works", href: "#how" },
    { label: "Analysis", href: "#weights" },
    { label: "Confidentiality", href: "#confidentiality" },
  ],
  nav_cta: "Start",

  // Hero
  hero_title: "Engaged teams always achieve extraordinary results",
  // The headline split into pieces, so one word can be dimmed and the tiles can
  // sit in the middle. Six words and ONE grey. `hero_title` stays as the flat
  // version metadata uses.
  hero_title_segments: [
    { text: "Engaged" },
    { face: true },
    { text: "teams" },
    { text: "always", tone: "muted" },
    { text: "achieve" },
    { weather: true },
    { text: "extraordinary", tone: "muted" },
    { text: "results" },
  ],
  hero_subtitle:
    "Measure workplace climate by segment, not by average. Combine filters and compare teams against each other.",
  hero_cta_primary: "Start free",
  hero_cta_secondary: "See how it works",

  // Hero video. `hero_video_title` is the iframe title: never rendered, but it
  // is what a screen reader announces when it enters the frame.
  hero_video_title: "Knotfix Clima in two minutes",
  hero_video_play: "Play the product video",

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
  measurement_title: "A measurement, not a survey",
  measurement_body:
    "Most climate surveys end up as a file of loose opinions that can't be compared against anything. Here every answer adds up to a number, and that number rests on a model.",
  // Same rule as `problem_items`: the title states the fact — how many options,
  // which three dimensions, how results are stored — instead of hinting at it.
  // "Ready to present" and "A model behind it" went for that reason: they read
  // like brochure promises and you had to finish the body to learn the point.
  measurement_items: [
    {
      title: "A four-point scale, no middle option",
      body: "No “neither agree nor disagree” to hide in: everyone commits.",
    },
    {
      title: "Three dimensions: existence, relationships, conditions",
      body: "Questions live in a model, not in a loose list. Everyone answers the same core.",
    },
    {
      title: "Results are stored per segment",
      body: "Not one global average: each segment with its count. It can't be rebuilt later.",
    },
    {
      title: "Charts come out of the system ready",
      body: "With the breakdown you chose. Nothing to rebuild in Excel before the meeting.",
    },
  ],

  // The last card in the carousel: product shots cycling.
  // **The files under `/shots/` are placeholders**, there so the block has real
  // proportions and rhythm. They are Unsplash photos for now, to see how the
  // block behaves with real images instead of the drawn SVGs. Swap them for
  // actual product captures keeping the same keys; the `alt` describes what is
  // shown — today the photo, tomorrow the capture — since it is all that
  // reaches anyone who cannot see the image.
  measurement_shots_title: "Inside the result",
  measurement_shots: [
    {
      src: "/shots/unsplash_segments.jpg",
      alt: "A screen with several result charts open at once",
    },
    {
      src: "/shots/unsplash_compare.jpg",
      alt: "A results dashboard open on a laptop",
    },
    {
      src: "/shots/unsplash_team.jpg",
      alt: "A team gathered around a presentation of results",
    },
  ],

  // Section 2 — the problem.
  // The title is short and split in two sentences on purpose: it comes in word
  // by word with `BlurText`, and a long line takes too long to finish building.
  // The second sentence names WHAT does not change. Without the explicit
  // subject — "nothing changed" — the reader is left asking changed about what.
  //
  // Split into pieces like `hero_title_segments`, so the payoff can be painted.
  // `tone: "brand"` is the purple, and it goes ONLY there — those are the words
  // that sum up the whole section.
  problem_title_segments: [
    { text: "The" },
    { text: "survey" },
    { text: "ran." },
    { text: "The" },
    { text: "climate" },
    { text: "stayed", tone: "brand" },
    { text: "the", tone: "brand" },
    { text: "same.", tone: "brand" },
  ],
  // **The title asserts; the body fills in.** Each one names ONE concrete
  // failure — the average, the format that keeps changing, the delay — and holds
  // up on its own. No sentences that circle before saying what went wrong.
  //
  // The body sticks to a single idea, one or two lines. Three was tried and goes
  // unread: this is a stack going by with the scroll, not a documentation page.
  problem_items: [
    {
      title: "The average hides the sinking team",
      body: "The company-wide number looks fine while one team falls apart. You find out once they've quit.",
    },
    {
      title: "Change the format and there's nothing to compare",
      body: "Different questions each year leave two results that can't be lined up.",
    },
    {
      title: "The report lands weeks late",
      body: "Tables get built by hand. By the time it's ready, the problem has moved.",
    },
  ],

  // Section 3 — how it works
  how_title: "Three steps, and the system does the first one",
  how_steps: [
    {
      step_title: "Upload your roster",
      step_body:
        "Drag in your CSV or Excel file and pick which columns form your hierarchy. The system builds your org tree on its own — regions, companies, sites, areas — and shows it to you to review before you confirm.",
    },
    {
      step_title: "Launch the study",
      step_body:
        "Choose who to measure and you're done. Each person's questionnaire assembles itself: the common core everyone answers, plus the questions that belong to their branch. You never configure surveys one by one.",
    },
    {
      step_title: "Read the results",
      step_body:
        "They arrive broken down by segment from the very first study. Compare areas against each other, follow how each one moves, and see where to act — not just what the overall number was.",
    },
  ],

  // Section 4 — weights and filters (the differentiator)
  weights_title: "Combine filters. Weight what matters.",
  weights_body:
    "Analysis isn't a bigger average. It's being able to ask your data specific questions and get an answer.",
  weights_points: [
    {
      title: "Stack filters together",
      body: "North region, tenure over five years, and night shift — all at once. You see the exact result for that cross-section, not an approximation.",
    },
    {
      title: "Weight by category",
      body: "In your operation not everything carries the same weight. Assign weights and compare the weighted result against the flat one to see what shifts.",
    },
    {
      title: "Compare like with like",
      body: "One segment against another, or against its own history. The system never puts a company-wide study and a regional one on the same line.",
    },
    {
      title: "Know when it isn't enough",
      body: "Stack filters and groups shrink fast. When a cross-section is left with too few responses, the system says so instead of showing you a fragile number.",
    },
  ],

  // Section 5 — scale
  scale_title: "From 20 employees to 50,000, the same system",
  scale_body:
    "Your organization doesn't fit into fixed columns, so we don't force it. You declare it as a tree: a flat company is a one-level tree, and a group with regions, companies, and sites is that same tree, deeper. Adding a site means hanging a branch — and the history of what you already measured stays intact.",
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

  // Section 6 — confidentiality
  confidentiality_title: "If it isn't confidential, it doesn't work",
  confidentiality_body:
    "People answer honestly only when they know they can't be identified. That isn't a promise — it's how the system is built.",
  confidentiality_points: [
    "Responses are detached from identity. Tokens are issued per segment, never per name.",
    "No segment shows results below the minimum number of responses you set.",
    "That minimum applies when filters are combined too — which is exactly where groups shrink without anyone noticing.",
  ],

  // Section 7 — final CTA
  final_cta_title: "Launch your first study this week",
  final_cta_body:
    "Create your account, upload your roster, and measure. No implementation project, no sales call.",
  final_cta_button: "Start free",

  // Footer
  footer_tagline: "Workplace climate measured by segment.",
  footer_rights: "All rights reserved.",

  // Accessibility
  a11y_toggle_theme: "Toggle theme",
  a11y_open_menu: "Open menu",
  a11y_close_menu: "Close menu",
  a11y_switch_lang: "Change language",
  a11y_main_nav: "Main navigation",
  a11y_mobile_nav: "Menu navigation",
  // The measurement rail only takes focus when it is NOT pinned: there it is
  // scrolled by hand, and without this there is no way to move it by keyboard.
  a11y_measurement_rail: "Measurement cards: scroll sideways",
  a11y_mood_face: "Face cycling between happy, neutral and sad",
  a11y_weather_tile: "Weather cycling between sunny, cloudy and rainy",
  a11y_skip_to_content: "Skip to content",
};

export default en;
