import { render } from '@testing-library/react';

import MyUiLib from './my-ui-lib';

describe('MyUiLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyUiLib />);
    expect(baseElement).toBeTruthy();
  });
});
