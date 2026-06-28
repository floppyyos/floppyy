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
    slug: "brewwery",
    name: "Brewwery",
    description: "GUI for Homebrew, native macOS app",
    status: "Online",
    stack: ["macOS", "Homebrew", "Desktop"],
    site: "https://www.brewwery.com",
    github: "https://github.com/brewwery",
    details: "GUI for Homebrew",
  },
  {
    slug: "titanbase",
    name: "Titanbase",
    description: "Visual Schema Designer For Developers and Product Teams.",
    status: "Online",
    stack: ["Schema Design", "Developer Tools", "Product Teams"],
    site: "https://www.titanbase.run",
    github: "https://github.com/titanbaserun",
    details: "Visual Schema Designer For Developers and Product Teams.",
  },
  {
    slug: "openmodels",
    name: "OpenModels",
    description: "Open Registry & Telemetry for AI Infrastructure.",
    status: "Online",
    stack: ["AI Infrastructure", "Registry", "Telemetry"],
    site: "https://www.openmodels.run",
    github: "https://github.com/openmodelsrun",
    details: "Open Registry & Telemetry for AI Infrastructure.",
  },
  {
    slug: "with-no-hype",
    name: "With No Hype",
    description: "AI and new tech explained honestly. No Hype.",
    status: "Online",
    stack: ["AI", "Education", "Writing"],
    site: "https://www.withnohype.com",
    github: "https://github.com/withnohype",
    details: "AI and new tech explained honestly. No Hype.",
  },
  {
    slug: "floppyy",
    name: "Floppyy",
    description: "Floppyy is a browser desktop built on pure nostalgia.",
    status: "Online",
    stack: ["Retro Web", "Browser Desktop", "Nostalgia"],
    site: "https://www.floppyy.com",
    github: "https://github.com/floppyyos",
    details: "Floppyy is a browser desktop built on pure nostalgia.",
  },
];
