import { Theme, ThemeDefaults } from 'uilib';

const colors = { active: '#00ff00' };
const theme = ThemeDefaults.getConfig({ colors });
const style = { backgroundColor: colors.active };

export default () => (
  <>
    <Theme config={theme} />
    <div className={S.color} style={style} />
  </>
);
