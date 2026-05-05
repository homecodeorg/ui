export type LangLoader =
  | Record<string, any>
  | (() => Promise<{ default: object }>);

export type RegisterConfig = Record<string, LangLoader>;

/** Number = plural count. Object: roddeh keys `plural` / `params` / `context`, or any other keys → interpolation params (see getTrans). */
export type I18NPropsField = number | Record<string, unknown>;

export type I18NProps = {
  id?: string;
  children?: React.ReactNode;
  props?: I18NPropsField;
};

export type I18NStore = {
  lang: string;
  changeLang: (lang: string) => Promise<void>;
};
