import { storiesOf } from '@storybook/preact';
import { State } from 'src/storybook.helpers';
import cn from 'classnames';

import Container from '../Container/Container';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';

import Popup from './Popup';
import S from './Popup.stories.styl';

const TEST_TEXT =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

const TextBlock = <div className={S.minWidth}>{TEST_TEXT}</div>;
const Cell = ({
  children,
  direction = 'row',
  align = 'center',
  justify = '',
}) => {
  const classes = cn(
    S.cell,
    S[direction],
    justify && S[`justify-${justify}`],
    align && S[`align-${align}`]
  );

  return <div className={classes}>{children}</div>;
};

storiesOf('Popup', module)
  .add('directions', () => (
    <Container centered vertical fullHeight>
      <Cell>
        <Popup
          direction="top"
          contentProps={{ className: S.padded }}
          trigger={<Button>top</Button>}
          content={TextBlock}
        />
      </Cell>
      <Cell>
        <Cell justify="end">
          <Popup
            direction="top-left"
            contentProps={{ className: S.padded }}
            trigger={<Button>top-left</Button>}
            content={TextBlock}
          />
        </Cell>
        <Cell justify="start">
          <Popup
            direction="top-right"
            contentProps={{ className: S.padded }}
            trigger={<Button>top-right</Button>}
            content={TextBlock}
          />
        </Cell>
      </Cell>
      <Cell>
        <Cell>
          <Popup
            direction="left"
            contentProps={{ className: S.padded }}
            trigger={<Button>left</Button>}
            content={TextBlock}
          />
        </Cell>
        <Cell direction="column" align="end">
          <Popup
            direction="left-top"
            contentProps={{ className: S.padded }}
            trigger={<Button>left-top</Button>}
            content={TextBlock}
          />
          <Popup
            direction="left-bottom"
            contentProps={{ className: S.padded }}
            trigger={<Button>left-bottom</Button>}
            content={TextBlock}
          />
        </Cell>
        <Cell direction="column" align="start">
          <Popup
            direction="right-top"
            contentProps={{ className: S.padded }}
            trigger={<Button>right-top</Button>}
            content={TextBlock}
          />
          <Popup
            direction="right-bottom"
            contentProps={{ className: S.padded }}
            trigger={<Button>right-bottom</Button>}
            content={TextBlock}
          />
        </Cell>
        <Cell>
          <Popup
            direction="right"
            contentProps={{ className: S.padded }}
            trigger={<Button>right</Button>}
            content={TextBlock}
          />
        </Cell>
      </Cell>
      <Cell>
        <Cell justify="end">
          <Popup
            direction="bottom-left"
            contentProps={{ className: S.padded }}
            trigger={<Button>bottom-left</Button>}
            content={TextBlock}
          />
        </Cell>
        <Cell justify="start">
          <Popup
            direction="bottom-right"
            contentProps={{ className: S.padded }}
            trigger={<Button>bottom-right</Button>}
            content={TextBlock}
          />
        </Cell>
      </Cell>
      <Cell>
        <Popup
          direction="bottom"
          contentProps={{ className: S.padded }}
          trigger={<Button>bottom</Button>}
          content={TextBlock}
        />
      </Cell>
    </Container>
  ))
  .add('autoClose', () => (
    <Container centered>
      <div>
        <Popup
          autoClose
          direction="bottom-left"
          trigger={<Button>click me</Button>}
          content={<Button>click to close</Button>}
        />
      </div>
    </Container>
  ))
  .add('inline', () => (
    <Container vertical fullHeight>
      <div style={{ maxWidth: 200 }}>
        <Popup
          inline
          contentProps={{ className: S.padded }}
          direction="bottom-right"
          trigger={<Button>click me</Button>}
          content={TextBlock}
        />
      </div>
      some other content...
    </Container>
  ))
  .add('nested', () => (
    <Container centered>
      <State initial={{ isOpenLv1: false, isOpenLv2: false }}>
        {state => (
          <Popup
            direction="bottom-left"
            isOpen={state.isOpenLv1}
            trigger={
              <Button onClick={() => (state.isOpenLv1 = !state.isOpenLv1)}>
                click me
              </Button>
            }
            content={
              <Popup
                direction="right-bottom"
                contentProps={{ className: S.padded }}
                outlined
                isOpen={state.isOpenLv2}
                trigger={
                  <Button
                    variant="clear"
                    onClick={() => (state.isOpenLv2 = !state.isOpenLv2)}
                  >
                    we need to go deeper
                  </Button>
                }
                content={TextBlock}
              />
            }
          />
        )}
      </State>
    </Container>
  ))
  .add('controllable', () => (
    <Container centered>
      <State initial={{ isOpen: false }}>
        {state => (
          <Container centered>
            <Popup
              direction="bottom-left"
              outlined
              controllable
              isOpen={state.isOpen}
              trigger={<Icon size="xl" type="image" />}
              content={
                <div className={cn(S.minWidth, S.padded)}>
                  This popup close only when you click on button again.
                </div>
              }
            />
            &nbsp;––––––&nbsp;
            <Button onClick={() => (state.isOpen = !state.isOpen)}>
              toggle popup state
            </Button>
          </Container>
        )}
      </State>
    </Container>
  ));
