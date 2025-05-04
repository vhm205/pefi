export const getEnv = (): string => import.meta.env.VITE_ENV;

export const isDev = (): boolean => getEnv() === "development";