export const AUTH_STORAGE_KEY = 'lumio-superadmin-session';
export const AUTH_EVENT_NAME = 'lumio-superadmin-auth-change';

export const DEFAULT_CREDENTIALS = {
  login: 'admin@gmail.com',
  password: 'admin',
};

export type AuthSession = {
  login: string;
  signedInAt: string;
};

const isBrowser = () => typeof window !== 'undefined';

export const readSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const signIn = (login: string, password: string) => {
  if (
    login !== DEFAULT_CREDENTIALS.login ||
    password !== DEFAULT_CREDENTIALS.password
  ) {
    return false;
  }

  if (!isBrowser()) {
    return false;
  }

  const session: AuthSession = {
    login,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));

  return true;
};

export const signOut = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
};
