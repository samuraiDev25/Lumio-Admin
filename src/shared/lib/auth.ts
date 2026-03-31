export const AUTH_STORAGE_KEY = 'lumio-superadmin-access-token';
export const AUTH_EVENT_NAME = 'lumio-superadmin-auth-change';

const isBrowser = () => typeof window !== 'undefined';

export const readAccessToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }

  const token = window.localStorage.getItem(AUTH_STORAGE_KEY);

  return token?.trim() ? token : null;
};

export const saveAccessToken = (accessToken: string) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
};

export const clearAccessToken = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
};

export const isAuthenticated = () => Boolean(readAccessToken());
