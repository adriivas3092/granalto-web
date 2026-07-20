import type { StudioProject } from "@/lib/studio/types";

/**
 * Persistencia en IndexedDB para los proyectos del configurador (MVP).
 * IndexedDB admite imágenes grandes (dataURL) que no caben de forma fiable en
 * localStorage. En la Parte 2 con backend, estas funciones se sustituyen por
 * llamadas a la API manteniendo la misma forma de datos (`StudioProject`).
 */
const DB_NAME = "granalto-studio";
const STORE = "projects";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB no disponible"));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export async function putProject(project: StudioProject): Promise<void> {
  try {
    await tx("readwrite", (s) => s.put(project));
  } catch {
    // En el MVP se ignoran errores de almacenamiento (cuota/soporte).
  }
}

export async function getProject(id: string): Promise<StudioProject | undefined> {
  try {
    return (await tx<StudioProject | undefined>("readonly", (s) => s.get(id))) ?? undefined;
  } catch {
    return undefined;
  }
}

export async function getAllProjects(): Promise<StudioProject[]> {
  try {
    const all = await tx<StudioProject[]>("readonly", (s) => s.getAll());
    return [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export async function removeProject(id: string): Promise<void> {
  try {
    await tx("readwrite", (s) => s.delete(id));
  } catch {
    /* noop */
  }
}

/** Id fijo del borrador actual (autoguardado). */
export const DRAFT_ID = "draft-actual";
