import { Chip } from 'uilib';

export default () =>
  ['xs', 's', 'm', 'l', 'xl'].map(size => (
    <div key={size} className={S.row}>
      <Chip size={size}>{size}</Chip>
      <Chip size={size} selected>
        selected
      </Chip>
      <Chip size={size} onRemove={() => {}}>
        removable
      </Chip>
    </div>
  ));
