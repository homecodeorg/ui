import { withStore } from 'justorm/react';
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
const UserCreatures = withStore({ router: ['path', 'query'] })(
  ({ store: { router } }) => (
    <>
      🦫🐬🦕🐙🐢🦄
      <Button onClick={() => router.go(`${router.path}?modal`)}>
        Open modal
      </Button>
      <LightBox isOpen={'modal' in router.query} onClose={() => router.back()}>
        👻👻👻
      </LightBox>
    </>
  )
);

const basePath = '/components/Router/demo';

export default withStore('router')(({ store: { router } }) => {
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
});
