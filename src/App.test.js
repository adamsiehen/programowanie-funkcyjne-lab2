import { render, screen } from '@testing-library/react';
import App from './App';

test('renderuje nagłówek analizatora wydatków', () => {
  render(<App />);
  const naglowek = screen.getByText(/analizator wydatków osobistych/i);
  expect(naglowek).toBeInTheDocument();
});
