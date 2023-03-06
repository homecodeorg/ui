import { Table, DateTime } from 'uilib';

const columns = [
  {
    id: 'age',
    label: 'Age',
    dataField: 'age',
  },
  {
    id: 'name',
    label: 'Name',
    sticky: true,
    dataField: 'name',
  },
  {
    id: 'lastName',
    label: 'Last Name',
    dataField: 'lastName',
  },
  {
    id: 'occupation',
    label: 'Occupation',
    dataField: 'occupation',
  },
  {
    id: 'date',
    label: 'Date',
    render: ({ date }) => <DateTime value={date} format="toNow" />,
  },
];

export default () => (
  <>
    <Table columns={columns} data={testData} />
    <style>{`th {min-width: 200px !important}`}</style>
  </>
);
