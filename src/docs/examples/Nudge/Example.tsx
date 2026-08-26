import { Button, Nudge, NudgeError, NudgeText } from 'uilib';

export default () => (
  <Nudge>
    <NudgeText>
      Research is a day old. Re-run it to pick up the latest news.
    </NudgeText>
    <NudgeError>Could not re-run research</NudgeError>
    <Button size="s" round>
      Re-run research
    </Button>
  </Nudge>
);
