import { Select2 } from '../Select/Select2';
import { LangSelectorProps } from './LangSelector.types';
import { useI18N } from 'uilib/services/i18n';

export function LangSelector(props: LangSelectorProps) {
  const i18n = useI18N();
  return <Select2 value={i18n.lang} onChange={i18n.changeLang} {...props} />;
}
