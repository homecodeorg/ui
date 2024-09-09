import React from 'react';
import { render, fireEvent, screen, cleanup, act, waitFor } from '@testing-library/react';
import { Popup } from './Popup';
import { config } from 'uilib/tools/config';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const customRender = (ui, options = {}) => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', config.appOverlayId);
  document.body.appendChild(portalRoot);

  const result = render(ui, { ...options });

  return {
    ...result,
    cleanup: () => {
      cleanup();
      if (portalRoot) document.body.removeChild(portalRoot);
    },
  };
};

describe('Popup Component', () => {
  afterEach(() => {
    cleanup();
  });

  // Test initial closed state and toggle functionality
  it('should render closed by default and toggle open/close', async () => {
    const { findByTestId, queryByTestId, findByText } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Open Popup</button>}
        content={<div data-testid="popup-content">Popup Content</div>}
      />
    );

    const trigger = await findByTestId('popup-trigger');

    // Check initial closed state
    expect(queryByTestId('popup-content')).not.toBeInTheDocument();
    expect(trigger).not.toHaveClass('isOpen');

    // Open the popup
    fireEvent.click(trigger);

    const popupContent = await findByTestId('popup-content', {}, { timeout: 5000 });
    expect(popupContent).toBeInTheDocument();
    expect(popupContent).toBeVisible();

    const popupWrapper = popupContent.closest('.contentWrapper');
    expect(popupWrapper).toHaveClass('isOpen');
    expect(trigger).toHaveClass('isOpen');

    // Verify additional popup state
    expect(popupContent.closest('.isOpen')).toBeInTheDocument();

    // Close the popup
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(queryByTestId('popup-content')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Verify the popup is closed
    expect(queryByTestId('popup-content')).not.toBeInTheDocument();
    expect(document.querySelector('.isOpen')).not.toBeInTheDocument();
    expect(popupWrapper).not.toHaveClass('isOpen');
    expect(trigger).not.toHaveClass('isOpen');
  });

  // Test animation and hover control
  it('should apply animation class and respond to hover', async () => {
    const { findByTestId, queryByTestId } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Hover Me</button>}
        content={<div data-testid="popup-content">Hover Content</div>}
        animated={true}
        hoverControl={true}
      />
    );

    const trigger = await findByTestId('popup-trigger');

    // Hover over the trigger
    fireEvent.pointerOver(trigger);

    // Wait for the content to appear
    const popupContent = await findByTestId('popup-content', {}, { timeout: 5000 });
    expect(popupContent).toBeInTheDocument();
    expect(popupContent).toBeVisible();

    const popupWrapper = popupContent.closest('.contentWrapper');
    expect(popupWrapper).toHaveClass('isOpen');
    expect(popupWrapper).toHaveClass('animating');

    // Move pointer out of the trigger
    fireEvent.pointerOut(trigger);

    // Wait for the content to disappear
    await waitFor(() => {
      expect(queryByTestId('popup-content')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Ensure the popup is closed
    expect(queryByTestId('popup-content')).not.toBeInTheDocument();
    expect(document.querySelector('.isOpen')).not.toBeInTheDocument();
  });

  // Test focus control and keyboard interactions
  it('should open on focus and close on Escape key', async () => {
    const { getByTestId, getByText, queryByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Focus Me</button>}
        content={<div>Focus Content</div>}
        focusControl={true}
      />
    );

    const trigger = getByTestId('popup-trigger');

    await act(async () => {
      fireEvent.focus(trigger);
      await delay(200); // Increased delay for animation
    });

    await waitFor(() => {
      expect(getByText('Focus Content')).toBeInTheDocument();
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.keyUp(trigger, { key: 'Escape' });
      await delay(200); // Increased delay for animation
    });

    await waitFor(() => {
      expect(queryByText('Focus Content')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    cleanup();
  });

  // Test disabled state and outline
  it('should not open when disabled and apply outline class', async () => {
    const { getByTestId, queryByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Disabled Popup</button>}
        content={<div>Disabled Content</div>}
        disabled={true}
        outlined={true}
      />
    );

    const trigger = getByTestId('popup-trigger');
    expect(trigger).toHaveClass('disabled');
    expect(trigger.closest('.outlined')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    await waitFor(() => {
      expect(queryByText('Disabled Content')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    cleanup();
  });

  // Test inline rendering and paranja
  it('should render inline and with paranja', async () => {
    const { getByTestId, getByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Inline Popup</button>}
        content={<div>Inline Content</div>}
        inline={true}
        paranja={true}
      />
    );

    const trigger = getByTestId('popup-trigger');

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    const content = await waitFor(() => getByText('Inline Content'), { timeout: 3000 });
    expect(content.closest('.inline')).toBeInTheDocument();
    expect(document.querySelector('.paranja')).toBeInTheDocument();

    cleanup();
  });

  // Test blur effect, size, and elevation
  it('should apply blur, size, and elevation classes', async () => {
    const { getByTestId, getByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Styled Popup</button>}
        content={<div>Styled Content</div>}
        blur={true}
        size="m"
        elevation={2}
      />
    );

    const trigger = getByTestId('popup-trigger');

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    const content = await waitFor(() => getByText('Styled Content'), { timeout: 3000 });
    expect(content.closest('.blur')).toBeInTheDocument();
    expect(content.closest('.size-m')).toBeInTheDocument();
    expect(content.closest('.elevation-2')).toBeInTheDocument();

    cleanup();
  });

  // Test direction
  it('should apply correct direction class', async () => {
    const { getByTestId, getByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Directional Popup</button>}
        content={<div>Directional Content</div>}
        direction="top-right"
      />
    );

    const trigger = getByTestId('popup-trigger');

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    const content = await waitFor(() => getByText('Directional Content'), { timeout: 3000 });
    expect(content.closest('.axis-top')).toBeInTheDocument();
    expect(content.closest('.float-right')).toBeInTheDocument();

    cleanup();
  });

  // Test onOpen and onClose callbacks
  it('should call onOpen and onClose callbacks', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const { getByTestId, getByText, queryByText, cleanup } = customRender(
      <Popup
        trigger={<button data-testid="popup-trigger">Callback Popup</button>}
        content={<div>Callback Content</div>}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    const trigger = getByTestId('popup-trigger');

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    await waitFor(() => {
      expect(getByText('Callback Content')).toBeInTheDocument();
      expect(onOpen).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });

    await act(async () => {
      fireEvent.click(trigger);
      await delay(200);
    });

    await waitFor(() => {
      expect(queryByText('Callback Content')).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });

    cleanup();
  });

  // Test initial open state
  it('should render open when isOpen prop is true', async () => {
    const { findByTestId } = customRender(
      <Popup
        isOpen={true}
        trigger={<button data-testid="popup-trigger">Open Popup</button>}
        content={<div data-testid="popup-content">Popup Content</div>}
      />
    );

    const popupContent = await findByTestId('popup-content', {}, { timeout: 5000 });
    expect(popupContent).toBeInTheDocument();
    expect(popupContent).toBeVisible();

    const popupWrapper = popupContent.closest('.contentWrapper');
    expect(popupWrapper).toHaveClass('isOpen');
  });
});
