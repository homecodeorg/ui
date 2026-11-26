import { Heading } from 'uilib';
import { ComponentLayout } from 'docs/components';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';
import * as chart from 'uilib/components/Chart/Chart';

import demo from '!!raw-loader!./Example';
import compare from '!!raw-loader!./Compare';
import forecast from '!!raw-loader!./Forecast';
import bars from '!!raw-loader!./Bars';
import pie from '!!raw-loader!./Pie';
import colors from '!!raw-loader!./Colors';

const name = 'Chart';

const Docs = () => (
  <>
    <p>
      Line, area, bar or pie chart from plain series. Each series is a name and
      a list of <code>[x, y]</code> points: for time charts x is epoch ms, for
      category charts (bars, pie) it is a label. Values get the{' '}
      <code>unit</code> in the axis and tooltip (<code>USD</code>,{' '}
      <code>EUR</code> and <code>%</code> as signs, anything else as a
      suffix), and dates are formatted for the chart's span.
    </p>

    <Heading id="Forecasts" text="Forecasts and bands" />
    <p>
      A series with <code>style: 'dashed'</code> is a forecast. It starts at
      the last point of the solid series it <code>continues</code> (by default
      the only solid one), so the line has no gap. <code>bands</code> shade a
      low–high range per x, e.g. quantiles: <code>[x, low, high]</code>. A band
      starts at zero width on that same last point and fans out (a cone), and
      takes the color of the series it surrounds (<code>of</code>, by default
      the first dashed one).
    </p>

    <Heading id="Zoom" text="Zoom" />
    <p>
      Time charts zoom in when you drag across the plot; double-click or the
      Reset zoom button (<code>resetZoomLabel</code>) goes back. Pass{' '}
      <code>zoom={'{false}'}</code> to turn it off.
    </p>

    <Heading id="Import" text="Import" />
    <p>
      The chart is built on <code>recharts</code>, an optional peer dependency,
      so it has its own entry and the main one stays free of it:
    </p>
    <pre>{`yarn add recharts
import { Chart } from '@homecode/ui/chart';`}</pre>

    <Heading id="Props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

const scope = { chart };

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'demo', label: 'Demo', code: demo, scope },
      { id: 'compare', label: 'Compare series', code: compare, scope },
      { id: 'forecast', label: 'Forecast and bands', code: forecast, scope },
      { id: 'bars', label: 'Bars', code: bars, scope },
      { id: 'pie', label: 'Pie', code: pie, scope },
      { id: 'colors', label: 'Colors and size', code: colors, scope },
    ]}
  />
);
