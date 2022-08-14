import { createRoot } from 'react-dom/client';

import App from './App/App';

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
