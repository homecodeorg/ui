import { createContext } from 'react';

export type ContextType = { rootPath: string };

export default createContext<ContextType>({ rootPath: '' });
