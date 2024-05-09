import { useStore } from 'justorm/react';
import { Router, Route, Link, Button, LightBox } from 'uilib';

const menu = items => (
  <>
    <br />[
    {items.map(id => (
      <Link href={`/${id}`}>{id}</Link>
    ))}
    ]
  </>
);

const UsersPage = () => (
  <Router>
    {menu(['azaza', 'ololosh'])}
    <Route path="/:id" component={UserPage} />
  </Router>
);

const UserPage = () => (
  <Router>
    {menu(['friends', 'creatures'])}

    <br />
    <Route path="/friends" component={UserFriends} />
    <Route path="/creatures" component={UserCreatures} />
  </Router>
);

const UserFriends = () => '👮👷‍♀️💂‍♂️🕵🏻👩‍🌾';
const UserCreatures = () => {
  const { router } = useStore({ router: ['path', 'query'] });

  return (
    <>
      🦫🐬🦕🐙🐢🦄
      <Button onClick={() => router.go(null, { modal: true })}>
        Open modal
      </Button>
      <LightBox isOpen={!!router.query.modal} onClose={() => router.back()}>
        👻👻👻
      </LightBox>
    </>
  );
};

const basePath = '/components/Router/demo';

export default () => {
  const { router } = useStore({ router: [] });
  const currPath = router.path.replace(basePath, '');

  return (
    <>
      {currPath || '/'}
      <br />
      <Link href="/">Home</Link>
      &gt; <Link href="/users">Users</Link>
      <Router>
        <Route component={UsersPage} path="/users" />
      </Router>
    </>
  );
};
