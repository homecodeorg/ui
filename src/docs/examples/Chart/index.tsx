import * as chart from 'uilib/components/Chart/Chart';
import { ComponentLayout } from 'docs/components';

import example from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Line, area, bar or pie chart from plain series. Dashed series are
      forecasts: they start at the last point of the solid series they continue.
      Bands shade a low–high range (e.g. quantiles) and fan out from that same
      point.
    </p>
    <p>
      It needs <code>recharts</code> (an optional peer dependency), so import it
      from <code>@homecode/ui/chart</code>, not the main entry.
    </p>
  </>
);

export default () => (
  <ComponentLayout
    name="Chart"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example, scope: { chart } }]}
  />
);
