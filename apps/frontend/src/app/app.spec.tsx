import { render } from '@testing-library/react';

import App from './app';

// @ts-expect-error just for fun
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(undefined),
  })
);

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });
});
