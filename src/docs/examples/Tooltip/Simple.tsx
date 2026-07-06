import { Button, Tooltip } from 'uilib';

export default () => {
  const size = 'm';

  return (
    <>
    <Tooltip content="Just do it">
      <Button size={size}>Hey!</Button>
    </Tooltip>
    <br/><br/>
    <Tooltip overTrigger content="Just do it Just do it Just do it Just do it Just do it Just do it Just do it Just do it Just do it " >
    <div style={{width: 100, height: 20, overflow: 'hidden' }}>
    Just do it Just do it Just do it Just do it Just do it Just do it Just do it Just do it Just do it
            </div>
        </Tooltip>
    </>
  );
};
