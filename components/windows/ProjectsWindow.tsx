"use client";

import { FloppyyIcon } from "@/components/desktop/FloppyyIcon";
import { projects } from "@/lib/projects";
import type { WindowComponentProps } from "@/lib/windows";
import { MenuBar } from "./MenuBar";

export function ProjectsWindow({ openWindow, notify }: WindowComponentProps) {
  const visit = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full flex-col">
      <MenuBar onHelp={() => notify("Double click a project folder to view details.")} />
      <div className="field-border mb-2 flex gap-2 bg-white px-2 py-1">
        <span>Address:</span>
        <span className="font-mono">C:\PORTFOLIO\PROJECTS</span>
      </div>
      <div className="sunken-panel min-h-0 flex-1 overflow-auto bg-white">
        <div className="flex min-h-full flex-col">
          <div>
            {projects.map((project) => (
              <div
                key={project.slug}
                className="grid grid-cols-[34px_1fr_auto] items-center gap-2 border-b border-[#dfdfdf] p-2 hover:bg-[#000080] hover:text-white"
                onDoubleClick={() => openWindow("project-details", project.slug)}
              >
                <FloppyyIcon type="folder" size={28} />
                <div>
                  <div className="font-bold">{project.name}</div>
                  <div>{project.description}</div>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <button className="win-button" onClick={() => visit(project.site)}>
                    Visit Site
                  </button>
                  <button className="win-button" onClick={() => visit(project.github)}>
                    GitHub
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-4 border-t border-[#dfdfdf] px-3 py-4">
              <img src="/misc/author.png" alt="Umid" className="h-[40px] w-[40px] rounded-sm" style={{ imageRendering: "pixelated" }} />
            <div className="flex-1 text-[11px] text-[#404040]">
              <p className="mb-1 font-bold text-black">Hi, I&apos;m Umid</p>
              <p>Software engineer and open source enthusiast. Feel free to explore, fork or contribute.</p>
            </div>
            <button className="win-button shrink-0" onClick={() => window.open("https://github.com/madeburo", "_blank", "noopener,noreferrer")}>
              GitHub
            </button>
          </div>
        </div>
      </div>
      <div className="status-bar mt-2">
        <p className="status-bar-field">{projects.length} object(s)</p>
        <p className="status-bar-field">Ready</p>
      </div>
    </div>
  );
}
