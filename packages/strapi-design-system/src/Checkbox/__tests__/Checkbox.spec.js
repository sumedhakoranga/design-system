import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { Checkbox } from '../Checkbox';
import { ThemeProvider } from '../../ThemeProvider';
import { lightTheme } from '../../themes';

describe('Checkbox', () => {
  it('snapshots when the value is undefined (should have name=default)', async () => {
    const { container } = render(
      <ThemeProvider theme={lightTheme}>
        <div>
          <Checkbox name="default" onValueChange={() => undefined} value={undefined}>
            Label
          </Checkbox>
        </div>
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByRole('checkbox').getAttribute('name')).toBe('default'));

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <label
          class="sc-eCssSg sc-pFZIQ bCaUrK AtDtz"
        >
          <input
            class="sc-bdfBwQ bkarNm"
            name="default"
            type="checkbox"
          />
          <div
            class="sc-fubCfw lkaSCX"
          >
            Label
          </div>
        </label>
      </div>
    `);
  });

  it('snapshots when the checkbox is checked', async () => {
    const { container } = render(
      <ThemeProvider theme={lightTheme}>
        <div>
          <Checkbox name="default-true" onValueChange={() => undefined} value={true}>
            Label
          </Checkbox>
        </div>
      </ThemeProvider>,
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        <label
          class="sc-eCssSg sc-pFZIQ bCaUrK AtDtz"
        >
          <input
            checked=""
            class="sc-bdfBwQ bkarNm"
            name="default-true"
            type="checkbox"
          />
          <div
            class="sc-fubCfw lkaSCX"
          >
            Label
          </div>
        </label>
      </div>
    `);
  });
});