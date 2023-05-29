import { Icon, icons, Scroll } from 'uilib';

const iconNames = Object.keys(icons);

export default () => {
  return (
    <Scroll y className={S.root} fadeSize="l">
      {iconNames.map(name => (
        <div className={S.item} key={name}>
          <Icon type={name} size="l" />
          <span>{name}</span>
        </div>
      ))}
    </Scroll>
  );
};
