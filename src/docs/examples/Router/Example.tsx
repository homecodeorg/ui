import { withStore } from 'justorm/react';
import { Router, Link } from 'uilib';

const StartPage = () => (
  <>
    <Link href="/">Home</Link>
    &gt; <Link href="/users">Users</Link>
  </>
);
const UsersPage = () => (
  <>
    <Link href="/">Home</Link>
    &gt; <Link href="/users">Users</Link>
    <br />
    <Link href="/users/azaza">azaza</Link>
    <Link href="/users/ololosh">ololosh</Link>
  </>
);
const UserPage = ({ id, rootPath }) => {
  const currPage = `/users/${id}`;

  return (
    <>
      <Link href="/">Home</Link>
      &gt; <Link href="/users">Users</Link>
      &gt; <Link href={currPage}>{id}</Link>
      <br />
      <Router rootPath={`${rootPath}${currPage}`}>
        <UserMenu id={id} />
        <UserFriends path="/friends" />
        <UserCreatures path="/creatures" />
      </Router>
    </>
  );
};
const UserMenu = ({ id }) => (
  <>
    <Link href="/friends">friends</Link>
    <Link href="/creatures">creatures</Link>
  </>
);
const UserFriends = () => 'friends: foo, bar';
const UserCreatures = () => 'creatures: sas';

export default withStore('router')(({ store: { router } }) => {
  const rootPath = '/components/Router/demo';

  return (
    <>
      {router.path.replace(new RegExp(`^${rootPath}`), '') || '/'}
      <br />
      <Router rootPath={rootPath}>
        <StartPage />
        <UsersPage path="/users" />
        <UserPage exact path="/users/:id" rootPath={rootPath} />
      </Router>
    </>
  );
});
