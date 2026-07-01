import type { CSSProperties } from "react";

export type WallpaperId =
  | "clouds"
  | "win98"
  | "space"
  | "underwater"
  | "creatures"
  | "baseball"
  | "sports"
  | "morewindows"
  | "teal"
  | "blue"
  | "spruce"
  | "eggplant"
  | "black";

export type Wallpaper = {
  id: WallpaperId;
  label: string;
  /** CSS class applied to the desktop (used for the dithered photo wallpaper). */
  className?: string;
  /** Solid background color. */
  color?: string;
  /** Image wallpaper (served from /public). */
  image?: string;
};

export const WALLPAPERS: Record<WallpaperId, Wallpaper> = {
  clouds: { id: "clouds", label: "Clouds", className: "floppyy-wallpaper" },
  win98: { id: "win98", label: "Windows 98", image: "/wallpapers/win98.jpg" },
  space: { id: "space", label: "Space", image: "/wallpapers/Space.jpg" },
  underwater: { id: "underwater", label: "Underwater", image: "/wallpapers/Underwater.jpg" },
  creatures: { id: "creatures", label: "Creatures", image: "/wallpapers/Creatures.jpg" },
  baseball: { id: "baseball", label: "Baseball", image: "/wallpapers/Baseball.jpg" },
  sports: { id: "sports", label: "Sports", image: "/wallpapers/Sports.jpg" },
  morewindows: { id: "morewindows", label: "More Windows", image: "/wallpapers/More_Windows.jpg" },
  teal: { id: "teal", label: "Teal (Windows Standard)", color: "#008080" },
  blue: { id: "blue", label: "Royal Blue", color: "#3a6ea5" },
  spruce: { id: "spruce", label: "Spruce", color: "#1a6b54" },
  eggplant: { id: "eggplant", label: "Eggplant", color: "#5b3a78" },
  black: { id: "black", label: "Black", color: "#000000" },
};

export const WALLPAPER_LIST: Wallpaper[] = Object.values(WALLPAPERS);

export const DEFAULT_WALLPAPER: WallpaperId = "clouds";

export function isWallpaperId(value: unknown): value is WallpaperId {
  return typeof value === "string" && value in WALLPAPERS;
}

/** Background style for an image/solid wallpaper (clouds uses its own class). */
export function wallpaperStyle(wp: Wallpaper): CSSProperties | undefined {
  if (wp.color) return { backgroundColor: wp.color };
  if (wp.image) {
    return {
      backgroundImage: `url('${wp.image}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundColor: "#5a7da0",
    };
  }
  return undefined;
}

/** Small swatch style for the wallpaper picker list. */
export function wallpaperSwatchStyle(wp: Wallpaper): CSSProperties {
  if (wp.className === "floppyy-wallpaper") {
    return { backgroundImage: "url('/wallpapers/clouds.jpg')", backgroundSize: "cover", backgroundPosition: "center" };
  }
  if (wp.image) {
    return { backgroundImage: `url('${wp.image}')`, backgroundSize: "cover", backgroundPosition: "center" };
  }
  return { background: wp.color };
}
