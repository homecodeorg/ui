import { LangSelector, i18n } from 'uilib';

const { I18N } = i18n.init({
  en: () => ({
    default: {
      Components: 'Components',
      'Hello %{name}': 'Hello %{name}!',
      'You have %{count} messages': [
        [null, 0, 'You have no messages'],
        [1, 4, 'You have %{count} message'],
        [5, null, 'You have %{count} messages'],
      ],
    },
  }),
  ua: () => ({
    default: {
      Components: 'Компоненти',
      'Hello %{name}': 'Привіт %{name}!',
      'You have %{count} messages': [
        [null, 0, 'У вас немає повідомлень'],
        [1, 4, 'У вас %{count} повідомлення'],
        [5, null, 'У вас %{count} повідомлень'],
      ],
    },
  }),
});

export default function Simple() {
  const langOptions = [
    { id: 'en', label: '🇬🇧' },
    { id: 'ua', label: '🇺🇦' },
  ];
  const count = 3;

  return (
    <div>
      <h2>
        <I18N id="Components" />
        <LangSelector variant="clear" options={langOptions} />
        <br />
        <I18N id="Hello %{name}" props={{ params: { name: 'John' } }} />
        <br />
        <I18N
          id="You have %{count} messages"
          props={{ plural: count, params: { count } }}
        />
      </h2>
    </div>
  );
}
