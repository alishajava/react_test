import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app content', () => {
  render(<App />);
  const linkElement = screen.getByText(/리액트 테스트 합니다/i);
  expect(linkElement).toBeInTheDocument();
});
