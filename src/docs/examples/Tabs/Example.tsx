import { Tabs } from 'uilib';

export default () => {
  const size = 'm';

  const tabs = [
    {
      id: 'run',
      label: 'Run params',
      content: <>asdasd</>,
    },
    {
      id: 'type',
      label: 'Type',
      content: <>a222222222</>,
    },
  ];

  return (
    <Tabs size={size} items={tabs}>
      Just tabs
    </Tabs>
  );
};
