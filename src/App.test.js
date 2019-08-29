import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
});

test('renders without crashing', () => {
  // const div = document.createElement('div');
  // ReactDOM.render(<App />, div);
  // ReactDOM.unmountComponentAtNode(div);
  const { debug } = render(<App />);
  debug();
});

test('testing', () => {});
