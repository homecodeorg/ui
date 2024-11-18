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

      <div className={S.item}>
        <span>Custom:</span>
        &nbsp;
        <Icon
          icon={props => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              stroke="green"
              viewBox="0 0 20 20"
              {...props}
            >
              <path stroke-width="3" d="m1.695 7.106 7.384 8.35 9.32-11.099" />
            </svg>
          )}
          size="l"
        />
      </div>
    </Scroll>
  );
};
