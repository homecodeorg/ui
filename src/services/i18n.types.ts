export type LangLoader =
  | Record<string, any>
  | (() => Promise<{ default: object }>);

export type RegisterConfig = Record<string, LangLoader>;

export type I18NPropsField =
  | number
  | {
      plural?: number;
      params?: Record<string, any>;
      context?: string;
    };

export type I18NProps = {
  id?: string;
  children?: React.ReactNode;
  props?: I18NPropsField;
};

export type I18NStore = {
  lang: string;
  changeLang: (lang: string) => Promise<void>;
};
