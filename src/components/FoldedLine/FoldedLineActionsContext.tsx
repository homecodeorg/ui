import { ReactNode, createContext, useContext, useEffect, useId } from 'react';

type RegisterAction = (id: string, node: ReactNode | null) => void;

const FoldedLineActionsContext = createContext<RegisterAction | null>(null);

export function useFoldedLineActionsRegister(): RegisterAction | null {
  return useContext(FoldedLineActionsContext);
}

export function FoldedLineActionsProvider({
  registerAction,
  children,
}: {
  registerAction: RegisterAction;
  children: ReactNode;
}) {
  return (
    <FoldedLineActionsContext.Provider value={registerAction}>
      {children}
    </FoldedLineActionsContext.Provider>
  );
}

export function FoldedLineAction({ children }: { children: ReactNode }) {
  const register = useFoldedLineActionsRegister();
  const id = useId();

  useEffect(() => {
    if (!register) return undefined;
    register(id, children);
    return () => register(id, null);
  }, [register, id, children]);

  if (!register) return <>{children}</>;
  return null;
}
