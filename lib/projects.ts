export type Project = {
  slug: string;
  name: string;
  description: string;
  status: string;
  stack: string[];
  site: string;
  github: string;
  details: string;
};

export const projects: Project[] = [
  {
    slug: "floppyy",
    name: "Floppyy",
    description: "A browser desktop built on pure nostalgia.",
    status: "Online",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    site: "https://www.floppyy.com",
    github: "https://github.com/floppyyos",
    details: "Blue floppy, Windows 98 cloud desktop, pixel UI, classic apps, games, and a full boot sequence.",
  },
  {
    slug: "openmodels",
    name: "OpenModels",
    description: "A catalog interface for browsing practical AI models.",
    status: "Online",
    stack: ["Next.js", "TypeScript", "Search"],
    site: "https://openmodels.app",
    github: "https://github.com/madeburo/openmodels",
    details: "Model cards, filters, and tiny decisions that make research feel usable.",
  },
  {
    slug: "onebit",
    name: "OneBit",
    description: "Minimal product experiments with a strong systems taste.",
    status: "Prototype",
    stack: ["React", "Tailwind", "Edge"],
    site: "https://onebit.dev",
    github: "https://github.com/madeburo/onebit",
    details: "Small, fast, and opinionated tools for getting from idea to shipped interface.",
  },
  {
    slug: "titanbase",
    name: "TitanBase",
    description: "A structured workspace for technical knowledge and decisions.",
    status: "Private beta",
    stack: ["Postgres", "Next.js", "Workers"],
    site: "https://titanbase.dev",
    github: "https://github.com/madeburo/titanbase",
    details: "Built around traceable notes, resilient search, and calm operational workflows.",
  },
];
