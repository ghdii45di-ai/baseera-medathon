// Fail safe: only an explicit research build exposes the local research workflow.
const env=(import.meta as unknown as {env:Record<string,string>}).env;
export const PUBLIC_DEMO = env.MODE !== 'research' || env.VITE_BASEERA_MODE !== 'research';
