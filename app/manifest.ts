import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Floppyy - The web you grew up on",
    short_name: "Floppyy",
    description:
      "Floppyy is a retro computer in your browser. A browser desktop built on pure nostalgia.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#008080",
    theme_color: "#c0c0c0",
    categories: ["entertainment", "games", "productivity"],
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
