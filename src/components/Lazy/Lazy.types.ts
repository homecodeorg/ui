import { ReactNode } from 'react';

export type Loader = () => Promise<any>;
export type Props = { loader: Loader; progressElem: ReactNode };
export type State = { loading: boolean };
