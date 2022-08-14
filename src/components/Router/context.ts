import { createContext } from 'react';

export default createContext<{ rootPath: string }>({ rootPath: '' });
