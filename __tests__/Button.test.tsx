import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button', () => {

  test('renderiza con el texto correcto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
  });

  test('dispara onClick al hacer clic', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('respeta el estado disabled', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick} disabled>Nope</Button>);
    const btn = screen.getByRole('button', { name: /nope/i });

    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('aplica variantes correctamente', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let btn = screen.getByRole('button', { name: /primary/i });
    expect(btn).toBeInTheDocument();

    rerender(<Button variant="secondary">Secondary</Button>);
    btn = screen.getByRole('button', { name: /secondary/i });
    expect(btn).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    btn = screen.getByRole('button', { name: /outline/i });
    expect(btn).toBeInTheDocument();
  });

  test('aplica tamaños correctamente', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let btn = screen.getByRole('button', { name: /small/i });
    expect(btn).toBeInTheDocument();

    rerender(<Button size="md">Medium</Button>);
    btn = screen.getByRole('button', { name: /medium/i });
    expect(btn).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    btn = screen.getByRole('button', { name: /large/i });
    expect(btn).toBeInTheDocument();
  });

  test('aplica fullWidth correctamente', () => {
    render(<Button fullWidth>Full Width</Button>);
    const btn = screen.getByRole('button', { name: /full width/i });
    expect(btn).toBeInTheDocument();
  });

});

