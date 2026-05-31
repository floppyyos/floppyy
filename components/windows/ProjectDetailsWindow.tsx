"use client";

import { projects } from "@/lib/projects";
import type { WindowComponentProps } from "@/lib/windows";

export function ProjectDetailsWindow({ window, notify }: WindowComponentProps) {
  const project = projects.find((item) => item.slug === window.payload) ?? projects[0];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="win-bevel-inset bg-white p-3">
        <h2 className="mb-2 text-lg font-bold">{project.name}</h2>
        <p>{project.details}</p>
      </div>
      <div className="grid grid-cols-[90px_1fr] gap-2">
        <span className="font-bold">Status</span>
        <span>{project.status}</span>
        <span className="font-bold">Stack</span>
        <span>{project.stack.join(", ")}</span>
      </div>
      <div className="mt-auto flex justify-end gap-2">
        <button className="win-button" onClick={() => notify(`${project.name}: site placeholder`)}>
          Visit Site
        </button>
        <button className="win-button" onClick={() => notify(`${project.name}: GitHub placeholder`)}>
          GitHub
        </button>
      </div>
    </div>
  );
}
