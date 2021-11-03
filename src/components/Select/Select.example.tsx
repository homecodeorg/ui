import { Fragment } from 'preact';
import { State, getRandomItem } from 'helpers';

import { Container } from 'components/Container/Container';

import { Select } from './Select';
import * as H from './Select.example-helpers';

const OPTIONS = H.generateOptions();
const TREE_OPTIONS = H.generateTreeOptions();
const PRESET_LETER = getRandomItem(OPTIONS).label[0];
const OPTIONS_PRESET = OPTIONS.filter(({ label }) =>
  new RegExp(`^${PRESET_LETER}`).test(label)
);
const GROUPED_OPTIONS = (function () {
  let goroupCount = 1;

  return OPTIONS.reduce((acc, item, i) => {
    if (i === 1 || i % 5 === 0) {
      const num = goroupCount++;
      acc.push({ isGroup: true, id: `group-${num}`, label: `Group ${num}` });
    }

    return [...acc, item];
  }, []);
})();

export default () => (
  <Fragment>
    <Container fullHeight>
      <State initial={{ value: OPTIONS[0].id }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
          />
        )}
      </State>
    </Container>
    <Container fullHeight vertical>
      <State initial={{ lang: OPTIONS[0].id, cluster: OPTIONS[0].id }}>
        {state => [
          <Select
            key="list1"
            inputProps={{ placeholder: 'List 1' }}
            options={OPTIONS}
            value={state.lang}
            onChange={value => (state.value = value)}
            popupProps={{ inline: true }}
          />,
          '-----------',
          <Select
            key="list2"
            inputProps={{ placeholder: 'List 2' }}
            options={OPTIONS}
            value={state.cluster}
            onChange={value => (state.value = value)}
            popupProps={{ inline: true }}
          />,
        ]}
      </State>
    </Container>
    <Container fullHeight>
      <State initial={{ value: null }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={GROUPED_OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
          />
        )}
      </State>
    </Container>
    <Container fullHeight>
      <State initial={{ value: [] }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={GROUPED_OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
          />
        )}
      </State>
    </Container>
    <Container fullHeight>
      <State initial={{ value: [OPTIONS[0].id] }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
          />
        )}
      </State>
    </Container>
    <Container fullHeight>
      <State initial={{ value: [OPTIONS[0].id] }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
            presets={[
              {
                label: `All "${PRESET_LETER}"`,
                ids: OPTIONS_PRESET.map(({ id }) => id),
              },
            ]}
            selectAllButton
            clearButton
          />
        )}
      </State>
    </Container>
    <Container fullHeight>
      <State initial={{ value: [] }}>
        {state => (
          <Select
            label="Lorem Ipsum"
            options={TREE_OPTIONS}
            value={state.value}
            onChange={value => (state.value = value)}
          />
        )}
      </State>
    </Container>
  </Fragment>
);
