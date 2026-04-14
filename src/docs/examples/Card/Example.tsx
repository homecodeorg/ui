import { Button, Card, CardContent, CardFooter, CardHeader } from 'uilib';

export default () => (
  <Card paddingSize="m" blur>
    <CardHeader title="Card title" description="Supporting description text." />
    <CardContent>
      Card content area. Use Card as a layout shell for panels, lists, or forms.
    </CardContent>
    <CardFooter>
      <Button size="s" variant="primary" round>
        Action
      </Button>
    </CardFooter>
  </Card>
);
