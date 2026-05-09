import { render } from '@testing-library/react';

import RudraCore from './rudra-core';

describe('RudraCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RudraCore />);
    expect(baseElement).toBeTruthy();
  });
});
