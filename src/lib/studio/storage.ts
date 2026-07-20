import type { StudioProject } from "@/lib/studio/types";

/**
 * Persistencia local de proyectos (MVP sin backend).
 * En la fase con servidor esto se reemplaza por la API/DB manteniendo la
 * misma forma de datos.
 */
const KEY = "granalto-studio-projects";

export function loadProjects(): StudioProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StudioProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProject(project: StudioProject): StudioProject[] {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  const next =
    idx >= 0
      ? projects.map((p) => (p.id === project.id ? project : p))
      : [project, ...projects];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Cuota excedida u otro error: se ignora en el MVP.
  }
  return next;
}

export function deleteProject(id: string): StudioProject[] {
  const next = loadProjects().filter((p) => p.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
  return next;
}
