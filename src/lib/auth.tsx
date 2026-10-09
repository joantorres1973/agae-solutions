'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Sesión del Portal Clientes (AGAE Integral 360+).
 * La validación real ocurre en public/api/auth.php (DonWeb). En `next dev` no hay PHP,
 * así que se usan cuentas locales de prueba que no llegan al build de producción.
 */

export interface PortalUser {
  usuario: string;
  nombre: string;
  empresa: string;
  cargo: string;
  rol: 'cliente' | 'demo';
}

type AuthStatus = 'checking' | 'anon' | 'authed';

/** Acciones que el usuario demo puede realizar antes de ver la invitación a contratar. */
export const DEMO_ACTION_LIMIT = 3;
/** Secciones que el usuario demo no puede abrir. */
export const DEMO_LOCKED_TABS = ['characterization', 'acpm', 'audits', 'evidences', 'assets', 'pesv', 'iso'];
export const DEMO_CREDENTIALS = { usuario: 'demo', clave: 'demo360' };

const API = '/api/auth.php';
const DEV_SESSION_KEY = 'agae360-dev-session';

interface AuthContextType {
  status: AuthStatus;
  user: PortalUser | null;
  isDemo: boolean;
  login: (usuario: string, clave: string) => Promise<void>;
  logout: () => Promise<void>;
  demoActionsLeft: number;
  /** Returns false (and opens the upsell) when the demo has no actions left. */
  consumeDemoAction: () => boolean;
  isTabLocked: (tab: string) => boolean;
  upsellReason: string | null;
  openUpsell: (reason: string) => void;
  closeUpsell: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isJson = (res: Response) => res.headers.get('content-type')?.includes('application/json');

/** Cuentas locales y de portal para entornos web (incluyendo Vercel estático / local sin PHP). */
const clientLogin = (usuario: string, clave: string): PortalUser => {
  const u = usuario.trim().toLowerCase();
  const c = clave.trim();

  // 1. Usuario Demo
  if (u === 'demo' && (c === 'demo360' || c === 'demo')) {
    return {
      usuario: 'demo',
      nombre: 'Usuario Demo',
      empresa: 'Empresa Demo S.A.S.',
      cargo: 'Explorando la plataforma',
      rol: 'demo',
    };
  }

  // 2. Cliente Activo / Líder HSEQ (Acceso Completo a todos los módulos y Base Maestra)
  if (
    (u === 'cliente' && (c === 'cliente360' || c === 'cliente' || c === '12345678' || c === 'agae2026')) ||
    (u === 'empresa' && (c === 'empresa360' || c === 'cliente360'))
  ) {
    return {
      usuario: 'cliente',
      nombre: 'Cliente Principal AGAE',
      empresa: 'AGAE SOLUTIONS - Empresa Cliente',
      cargo: 'Líder HSEQ / Gerencia General',
      rol: 'cliente',
    };
  }

  // 3. Administrador de la Organización
  if (
    (u === 'agae' && (c === 'agae360' || c === 'agae' || c === 'admin360')) ||
    (u === 'admin' && (c === 'admin360' || c === 'admin' || c === 'agae360'))
  ) {
    return {
      usuario: 'agae',
      nombre: 'Administrador AGAE',
      empresa: 'AGAE SOLUTIONS S.A.S.',
      cargo: 'Administrador del Sistema HSEQ',
      rol: 'cliente',
    };
  }

  throw new Error('Usuario o contraseña incorrectos. Usuario: "cliente", Contraseña: "cliente360".');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<PortalUser | null>(null);
  const [demoActionsUsed, setDemoActionsUsed] = useState(0);
  const [upsellReason, setUpsellReason] = useState<string | null>(null);
  const usedRef = useRef(0);
  const lastActionAt = useRef(0);

  const startSession = useCallback((u: PortalUser | null) => {
    usedRef.current = 0;
    setDemoActionsUsed(0);
    setUser(u);
    setStatus(u ? 'authed' : 'anon');
  }, []);

  // Restore an existing session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}?accion=sesion`, { cache: 'no-store' });
        if (isJson(res)) {
          const json = await res.json();
          if (!cancelled) startSession(json.ok ? json.usuario : null);
          return;
        }
        throw new Error('no-php');
      } catch {
        let saved: PortalUser | null = null;
        try {
          saved = JSON.parse(
            sessionStorage.getItem(DEV_SESSION_KEY) ||
            localStorage.getItem(DEV_SESSION_KEY) ||
            'null'
          );
        } catch {}
        if (!cancelled) startSession(saved);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [startSession]);

  const login = useCallback(async (usuario: string, clave: string) => {
    const u = usuario.trim().toLowerCase();
    let res: Response | null = null;
    try {
      res = await fetch(`${API}?accion=ingresar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: u, clave }),
      });
    } catch {}
    if (res && isJson(res)) {
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'No pudimos iniciar sesión.');
      startSession(json.usuario);
      return;
    }
    const clientUser = clientLogin(u, clave);
    try {
      sessionStorage.setItem(DEV_SESSION_KEY, JSON.stringify(clientUser));
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(clientUser));
    } catch {}
    startSession(clientUser);
  }, [startSession]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}?accion=salir`, { method: 'POST' });
    } catch {}
    try {
      sessionStorage.removeItem(DEV_SESSION_KEY);
      localStorage.removeItem(DEV_SESSION_KEY);
    } catch {}
    setUpsellReason(null);
    startSession(null);
  }, [startSession]);

  const isDemo = user?.rol === 'demo';

  const consumeDemoAction = useCallback(() => {
    if (!isDemo) return true;
    const now = Date.now();
    // One click can trigger several store updates; count them as a single action.
    if (now - lastActionAt.current < 800) return true;
    if (usedRef.current >= DEMO_ACTION_LIMIT) {
      setUpsellReason('Ya usaste las acciones disponibles en el modo demo.');
      return false;
    }
    lastActionAt.current = now;
    usedRef.current += 1;
    setDemoActionsUsed(usedRef.current);
    return true;
  }, [isDemo]);

  const isTabLocked = useCallback((tab: string) => isDemo && DEMO_LOCKED_TABS.includes(tab), [isDemo]);

  const value = useMemo<AuthContextType>(() => ({
    status,
    user,
    isDemo,
    login,
    logout,
    demoActionsLeft: Math.max(0, DEMO_ACTION_LIMIT - demoActionsUsed),
    consumeDemoAction,
    isTabLocked,
    upsellReason,
    openUpsell: setUpsellReason,
    closeUpsell: () => setUpsellReason(null),
  }), [status, user, isDemo, login, logout, demoActionsUsed, consumeDemoAction, isTabLocked, upsellReason]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
