import { Button, Icon, NestedMenu } from 'uilib';

import { useState } from 'react';

const GROUPS = ['Founders', 'Design', 'Engineering'];
const AGENTS = ['Claude', 'ChatGPT', 'Gemini'];

export default () => {
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [groups, setGroups] = useState(['Design']);
  const [last, setLast] = useState('Open a submenu or click an item');

  function toggleGroup(name) {
    setGroups(current =>
      current.includes(name)
        ? current.filter(item => item !== name)
        : [...current, name]
    );
    setLast(`Toggled ${name}`);
  }

  const items = [
    {
      id: 'email',
      label: 'ada@example.com',
      disabled: true,
    },
    {
      id: 'groups',
      icon: <Icon type="group" size="xs" />,
      label: 'Add to group',
      hint: String(groups.length),
      submenu: (
        <div>
          {GROUPS.map(name => (
            <NestedMenu.Item
              key={name}
              onClick={() => toggleGroup(name)}
            >
              <NestedMenu.Label>{name}</NestedMenu.Label>
              {groups.includes(name) && <Icon type="check" size="xs" />}
            </NestedMenu.Item>
          ))}
          <NestedMenu.Item onClick={() => setLast('Create group')}>
            + Create new group
          </NestedMenu.Item>
        </div>
      ),
    },
    {
      id: 'discuss',
      icon: <Icon type="chat" size="xs" />,
      label: 'Discuss with',
      submenu: (
        <div>
          {AGENTS.map(name => (
            <NestedMenu.Item
              key={name}
              onClick={() => setLast(`Discuss with ${name}`)}
            >
              {name}
            </NestedMenu.Item>
          ))}
        </div>
      ),
    },
    {
      id: 'profile',
      icon: <Icon type="avatar" size="xs" />,
      label: 'Profile',
      onClick: () => setLast('Profile'),
    },
    {
      id: 'theme',
      icon: (
        <Icon type={theme === 'dark' ? 'eye' : 'colors'} size="xs" />
      ),
      label: theme === 'dark' ? 'Light theme' : 'Dark theme',
      onClick: () => setTheme(value => (value === 'dark' ? 'light' : 'dark')),
    },
    {
      id: 'delete',
      icon: <Icon type="delete" size="xs" />,
      label: 'Delete',
      danger: true,
      onClick: () => setLast('Delete'),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NestedMenu
          open={open}
          onOpenChange={setOpen}
          align="end"
          trigger={
            <Button size="s" round>
              Account
            </Button>
          }
          items={items}
        />
      </div>
      <div style={{ opacity: 0.6, fontSize: 13 }}>{last}</div>
    </div>
  );
};
