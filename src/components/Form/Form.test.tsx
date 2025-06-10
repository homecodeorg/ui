import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Form } from './Form';

// Simple mock input component
const TestInput = (props: any) => {
  const { error, ...inputProps } = props;
  return (
    <div>
      <input
        data-testid={`input-${props.name}`}
        value={props.value || ''}
        onChange={e => props.onChange?.(e, e.target.value)}
        onBlur={props.onBlur}
        {...inputProps}
      />
      {error && <span data-testid={`error-${props.name}`}>{error}</span>}
    </div>
  );
};

describe('Form', () => {
  const defaultProps = {
    initialValues: { username: '', email: '' },
    children: (api: any) => (
      <div>
        {/* @ts-ignore */}
        <api.Field name="username" component={TestInput} />
        {/* @ts-ignore */}
        <api.Field name="email" component={TestInput} />
        <button type="submit" disabled={!api.isValid}>
          Submit
        </button>
        <div data-testid="form-state">
          {JSON.stringify({
            isValid: api.isValid,
            isDirty: api.isDirty,
            isLoading: api.isLoading,
            isEmpty: api.isEmpty,
          })}
        </div>
      </div>
    ),
  };

  test('renders with default props', () => {
    render(<Form {...defaultProps} />);

    expect(screen.getByTestId('input-username')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    const { container } = render(
      <Form {...defaultProps} className="custom-form" />
    );

    expect(container.firstChild).toHaveClass('custom-form');
  });

  test('initializes with initial values', () => {
    const initialValues = { username: 'john', email: 'john@example.com' };

    render(
      <Form
        initialValues={initialValues}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            {/* @ts-ignore */}
            <api.Field name="email" component={TestInput} />
          </div>
        )}
      />
    );

    expect(screen.getByTestId('input-username')).toHaveValue('john');
    expect(screen.getByTestId('input-email')).toHaveValue('john@example.com');
  });

  test('calls onInit callback with form API', () => {
    const onInitMock = jest.fn();

    render(<Form {...defaultProps} onInit={onInitMock} />);

    expect(onInitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        values: { username: '', email: '' },
        isValid: true,
        isDirty: false,
        isLoading: false,
        setValue: expect.any(Function),
        setValues: expect.any(Function),
        reset: expect.any(Function),
        submit: expect.any(Function),
      })
    );
  });

  test('handles field value changes', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn().mockReturnValue(true);

    render(<Form {...defaultProps} onChange={onChangeMock} />);

    const usernameInput = screen.getByTestId('input-username');
    await user.type(usernameInput, 'john');

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith({
        username: 'john',
        email: '',
      });
    });
  });

  test('prevents field changes when onChange returns false', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn().mockReturnValue(false);

    render(<Form {...defaultProps} onChange={onChangeMock} />);

    const usernameInput = screen.getByTestId('input-username');
    await user.type(usernameInput, 'john');

    expect(usernameInput).toHaveValue('');
  });

  test('validates fields with validation schema', async () => {
    const user = userEvent.setup();
    const validationSchema = {
      username: { type: 'string', min: 3, message: 'Username too short' },
      email: { type: 'email', message: 'Invalid email' },
    };

    render(
      <Form
        initialValues={{ username: '', email: '' }}
        validationSchema={validationSchema}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            {/* @ts-ignore */}
            <api.Field name="email" component={TestInput} />
          </div>
        )}
      />
    );

    const usernameInput = screen.getByTestId('input-username');
    const emailInput = screen.getByTestId('input-email');

    await user.type(usernameInput, 'ab');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('error-username')).toHaveTextContent(
        'Username too short'
      );
      expect(screen.getByTestId('error-email')).toHaveTextContent(
        'Invalid email'
      );
    });
  });

  test('shows loading state during form submission', async () => {
    const user = userEvent.setup();
    let resolveSubmit: any;
    const onSubmitMock = jest.fn().mockImplementation(
      () =>
        new Promise<void>(resolve => {
          resolveSubmit = resolve;
        })
    );

    const { container } = render(
      <Form
        initialValues={{ username: '' }}
        onSubmit={onSubmitMock}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            <button type="submit">Submit</button>
            <div data-testid="loading">
              {api.isLoading ? 'Loading...' : 'Ready'}
            </div>
          </div>
        )}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
      expect(container.firstChild).toHaveClass('isLoading');
    });

    resolveSubmit();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });
  });

  test('tracks dirty state when fields change', async () => {
    const user = userEvent.setup();

    render(<Form {...defaultProps} />);

    const formState = screen.getByTestId('form-state');
    expect(formState).toHaveTextContent('"isDirty":false');

    const usernameInput = screen.getByTestId('input-username');
    await user.type(usernameInput, 'john');

    await waitFor(() => {
      expect(formState).toHaveTextContent('"isDirty":true');
    });
  });

  test('tracks empty state correctly', async () => {
    const user = userEvent.setup();

    render(<Form {...defaultProps} />);

    const formState = screen.getByTestId('form-state');
    expect(formState).toHaveTextContent('"isEmpty":true');

    const usernameInput = screen.getByTestId('input-username');
    await user.type(usernameInput, 'john');

    await waitFor(() => {
      expect(formState).toHaveTextContent('"isEmpty":false');
    });
  });

  test('resets form to initial values', async () => {
    const user = userEvent.setup();

    render(
      <Form
        initialValues={{ username: '' }}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            <button type="button" onClick={api.reset}>
              Reset
            </button>
            <div data-testid="dirty">{api.isDirty ? 'Dirty' : 'Clean'}</div>
          </div>
        )}
      />
    );

    const usernameInput = screen.getByTestId('input-username');
    const resetButton = screen.getByRole('button', { name: /reset/i });

    await user.type(usernameInput, 'john');
    await waitFor(() => {
      expect(screen.getByTestId('dirty')).toHaveTextContent('Dirty');
    });

    await user.click(resetButton);

    await waitFor(() => {
      expect(usernameInput).toHaveValue('');
      expect(screen.getByTestId('dirty')).toHaveTextContent('Clean');
    });
  });

  test('setValue API method updates single field', async () => {
    const user = userEvent.setup();

    render(
      <Form
        initialValues={{ username: '' }}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            <button
              type="button"
              onClick={() => api.setValue('username', 'john')}
            >
              Set Username
            </button>
          </div>
        )}
      />
    );

    const usernameInput = screen.getByTestId('input-username');
    const setButton = screen.getByRole('button', { name: /set username/i });

    await user.click(setButton);

    await waitFor(() => {
      expect(usernameInput).toHaveValue('john');
    });
  });

  test('setValues API method updates multiple fields', async () => {
    const user = userEvent.setup();

    render(
      <Form
        initialValues={{ username: '', email: '' }}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            {/* @ts-ignore */}
            <api.Field name="email" component={TestInput} />
            <button
              type="button"
              onClick={() =>
                api.setValues({ username: 'john', email: 'john@example.com' })
              }
            >
              Set All
            </button>
          </div>
        )}
      />
    );

    const usernameInput = screen.getByTestId('input-username');
    const emailInput = screen.getByTestId('input-email');
    const setButton = screen.getByRole('button', { name: /set all/i });

    await user.click(setButton);

    await waitFor(() => {
      expect(usernameInput).toHaveValue('john');
      expect(emailInput).toHaveValue('john@example.com');
    });
  });

  test('handles field blur events', async () => {
    const user = userEvent.setup();

    render(
      <Form
        initialValues={{ username: '' }}
        children={(api: any) => (
          /* @ts-ignore */
          <api.Field
            name="username"
            component={(props: any) => (
              <div>
                <TestInput {...props} />
                <div data-testid="touched">
                  {props.isTouched ? 'Touched' : 'Not Touched'}
                </div>
              </div>
            )}
          />
        )}
      />
    );

    const usernameInput = screen.getByTestId('input-username');

    expect(screen.getByTestId('touched')).toHaveTextContent('Not Touched');

    await user.click(usernameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId('touched')).toHaveTextContent('Touched');
    });
  });

  test('handles custom field components', () => {
    const CustomInput = ({ value, onChange, error, ...props }: any) => (
      <div>
        <span data-testid="custom-label">Custom:</span>
        <input
          {...props}
          value={value || ''}
          onChange={e => onChange?.(e, e.target.value)}
          data-testid="custom-input"
        />
      </div>
    );

    render(
      <Form
        initialValues={{ username: '' }}
        children={(api: any) => (
          /* @ts-ignore */
          <api.Field name="username" component={CustomInput} />
        )}
      />
    );

    expect(screen.getByTestId('custom-label')).toHaveTextContent('Custom:');
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const user = userEvent.setup();
    const onSubmitMock = jest.fn().mockResolvedValue(undefined);

    render(
      <Form
        initialValues={{ username: '' }}
        onSubmit={onSubmitMock}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            <button type="submit">Submit</button>
          </div>
        )}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({ username: '' });
    });
  });

  test('prevents form submission when onSubmit is not provided', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Form
        initialValues={{ username: '' }}
        children={(api: any) => (
          <div>
            {/* @ts-ignore */}
            <api.Field name="username" component={TestInput} />
            <button type="submit">Submit</button>
          </div>
        )}
      />
    );

    const form = container.querySelector('form')!;
    const submitSpy = jest.fn();
    form.addEventListener('submit', submitSpy);

    const usernameInput = screen.getByTestId('input-username');
    await user.type(usernameInput, 'john{enter}');

    expect(submitSpy).toHaveBeenCalled();
    expect(submitSpy.mock.calls[0][0].defaultPrevented).toBe(true);
  });
});
