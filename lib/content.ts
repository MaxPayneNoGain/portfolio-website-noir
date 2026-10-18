export const NOW = {
  role: "Digital Innovation Specialist",
  org: "Roy Howard Community Journalism Center",
  href: "https://rhcjcnews.com/staff_name/nischit-sharma/",
  dates: "MAY 2026 — PRESENT",
}

export type Entry = {
  id: string
  title: string
  org: string
  dates?: string
  tech?: string[]
  points: string[]
}

export const WORK: Entry[] = [
  {
    id: "rhcjc",
    title: "Digital Innovation Specialist",
    org: "Roy Howard Community Journalism Center · Hattiesburg, MS",
    dates: "MAY 2026 — PRESENT",
    points: [
      "Shipped the RHCJC News app (React Native) to the App Store and Google Play, handling builds, code signing and distribution.",
      "Built production web features for a news site reaching 65,000+ readers across 10 Mississippi counties, cutting manual publishing work by over 90%.",
      "Wrote a Python pipeline that pulls press releases from city and county sites, RSS feeds and email, then files them as WordPress drafts.",
    ],
  },
  {
    id: "pcs",
    title: "Full Stack Java Development Intern",
    org: "Professional Computer System (P) Ltd. · Kathmandu, Nepal",
    dates: "JUN 2022 — SEP 2022",
    points: [
      "Built REST endpoints for an inventory management system in Java and Spring Boot, from data model to controllers.",
      "Built React components for a client-facing web app and wired them to the team's Spring Boot APIs.",
      "Sped up slow Oracle queries by restructuring joins and indexing high-traffic lookups.",
    ],
  },
]

export const PROJECTS: Entry[] = [
  {
    id: "epl",
    title: "Premier League Predictive Data",
    org: "Personal project",
    tech: ["Python", "FastAPI", "PostgreSQL", "pandas", "SciPy"],
    points: [
      "Match model over two seasons of fixture and odds data: win/draw/loss odds, scorelines and expected goals for every game.",
      "Tested on 700 unseen matches, it closed 77% of the gap between league averages and the betting market.",
      "Versioned data archive keyed by fetch time, so backtests never peek at the future.",
    ],
  },
  {
    id: "pothole",
    title: "Pothole Detection",
    org: "Personal project",
    tech: ["Python", "TensorFlow", "scikit-learn", "NumPy"],
    points: [
      "Image classifier trained on 1,294 road photos merged from two public datasets, deduplicated and stratified.",
      "Transfer learning on MobileNetV2 beat a from-scratch CNN, lifting accuracy from 87.6% to 96.1%.",
    ],
  },
]

export const SKILLS = [
  { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "SQL"] },
  {
    group: "Frameworks & Libraries",
    items: ["React", "React Native", "FastAPI", "Next.js", "pandas", "SQLAlchemy", "SciPy", "Spring Boot", "NumPy"],
  },
  { group: "Databases", items: ["PostgreSQL", "Firebase", "SQL Server", "MySQL", "Oracle", "SQLite"] },
  { group: "Tools & Platforms", items: ["Git/GitHub", "Azure", "Docker", "WordPress", "AWS"] },
]
