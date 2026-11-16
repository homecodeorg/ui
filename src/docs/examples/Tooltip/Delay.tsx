import { Button, Tooltip } from 'uilib';

export default () => (
  <>
    {[0, 300, 1000].map(delay => (
      <Tooltip content={`Shown after ${delay}ms`} delay={delay} key={delay}>
        <Button className={S.item}>delay={delay}</Button>
      </Tooltip>
    ))}
  </>
);
