import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Floppyy - The web you grew up on",
    short_name: "Floppyy",
    description:
      "A browser desktop built on pure nostalgia.",
    start_url: "/",
    display: "standalone",
    background_color: "#c5d5e6",
    theme_color: "#c5d5e6",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
