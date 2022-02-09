import { Fragment } from 'react';
import { State, getRandomItem } from 'helpers';
import { Router, Lazy } from 'uilib';

import { Container } from 'components/Container/Container';
import { Heading } from 'components/Heading/Heading';

import { Select } from 'components/Select/Select';
import * as H from './helpers';

import BasicExample from './basic';
import { Title } from 'uilib/docs/components';

import NAV_CONFIG from './navigation';

// const OPTIONS = H.generateOptions();
// const TREE_OPTIONS = H.generateTreeOptions();
// const PRESET_LETER = getRandomItem(OPTIONS).label[0];
// const OPTIONS_PRESET = OPTIONS.filter(({ label }) =>
//   new RegExp(`^${PRESET_LETER}`).test(label)
// );
// const GROUPED_OPTIONS = (function () {
//   let goroupCount = 1;

//   return OPTIONS.reduce((acc, item, i) => {
//     if (i === 1 || i % 5 === 0) {
//       const num = goroupCount++;
//       acc.push({ isGroup: true, id: `group-${num}`, label: `Group ${num}` });
//     }

//     return [...acc, item];
//   }, []);
// })();

// console.log('OPTIONS', OPTIONS);

function API() {
  return <>
    <Title text='API' />

    
  </>
}

// export default () => <div>123123</div>;
export default () => (
  <>
    <Router>
      {NAV_CONFIG.map(({ slug, loader }) => (
        <Lazy path={`/select/${slug}`} loader={loader} key={slug} exact />
      ))}
    </Router>
  </>
);

// export default () => (
//   <Fragment>
//     <Container fullHeight>
//       <State initial={{ value: OPTIONS[0].id }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight vertical>
//       <State initial={{ lang: OPTIONS[0].id, cluster: OPTIONS[0].id }}>
//         {state => [
//           <Select
//             key="list1"
//             inputProps={{ placeholder: 'List 1' }}
//             options={[...OPTIONS]}
//             value={state.lang}
//             onChange={value => (state.value = value)}
//             popupProps={{ inline: true }}
//           />,
//           '-----------',
//           <Select
//             key="list2"
//             inputProps={{ placeholder: 'List 2' }}
//             options={[...OPTIONS]}
//             value={state.cluster}
//             onChange={value => (state.value = value)}
//             popupProps={{ inline: true }}
//           />,
//         ]}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: null }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={GROUPED_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={GROUPED_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [OPTIONS[0].id] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [OPTIONS[0].id] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={[...OPTIONS]}
//             value={state.value}
//             onChange={value => (state.value = value)}
//             presets={[
//               {
//                 label: `All "${PRESET_LETER}"`,
//                 ids: OPTIONS_PRESET.map(({ id }) => id),
//               },
//             ]}
//             selectAllButton
//             clearButton
//           />
//         )}
//       </State>
//     </Container>
//     <Container fullHeight>
//       <State initial={{ value: [] }}>
//         {state => (
//           <Select
//             label="Lorem Ipsum"
//             options={TREE_OPTIONS}
//             value={state.value}
//             onChange={value => (state.value = value)}
//           />
//         )}
//       </State>
//     </Container>
//   </Fragment>
// );
