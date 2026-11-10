/* ============================================================
 * Capa de persistencia intercambiable (sección 6.4)
 * MemoryAdapter → LocalStorageAdapter (opcional) → ApiAdapter (futuro)
 * ============================================================ */
import type { LudikState } from "@/types/ludik";

export interface PersistenceAdapter {
  load(): LudikState | null;
  save(state: LudikState): void;
  clear(): void;
}

export class MemoryAdapter implements PersistenceAdapter {
  private data: LudikState | null = null;
  load() {
    return this.data;
  }
  save(state: LudikState) {
    this.data = state;
  }
  clear() {
    this.data = null;
  }
}

const KEY = "ludik:state:v1";

export class LocalStorageAdapter implements PersistenceAdapter {
  load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LudikState;
      return parsed?.version === 1 ? parsed : null;
    } catch {
      return null;
    }
  }
  save(state: LudikState) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* sin espacio o modo privado: se mantiene en memoria */
    }
  }
  clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Futuro: ApiAdapter que llame al backend de Ludik (SSO Moodle).
 * Debe implementar la misma interfaz PersistenceAdapter.
 */

export function createAdapter(): PersistenceAdapter {
  if (typeof window === "undefined") return new MemoryAdapter();
  try {
    window.localStorage.setItem("ludik:probe", "1");
    window.localStorage.removeItem("ludik:probe");
    return new LocalStorageAdapter();
  } catch {
    return new MemoryAdapter();
  }
}
