import { createContext } from 'react';

export type ContextType = { basePath: string };

export default createContext<ContextType>({ basePath: '' });
