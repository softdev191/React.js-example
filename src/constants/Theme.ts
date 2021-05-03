import { createGlobalStyle } from '../styled-components';

const baseColors = {
  atomic: '#3F4D55',
  blueWhale: '#002F49',
  black: '#000000',
  emerald: '#3AD47C',
  ghostWhite: '#F1F1F3',
  gainsboro: '#E1E1E1',
  grey: '#7f7f7f',
  matterhorn: '#565656',
  pelorous: '#2388C1',
  red: '#FF0000',
  white: '#FFFFFF',
  destructiveColor: '#FF0000',
  companyBlue: '#0303f1',
  alabaster: '#F8F8F8',
  azure: '#0091FF',
  silverAlice: '#ACACAC',
  silver: '#C7C7C7',
  dustyGray: '#949494'
};

const appBaseColors = {
  appBar: baseColors.black,
  primary: baseColors.companyBlue,
  secondary: baseColors.ghostWhite
};

const componentStateColors = {
  activeNavLink: baseColors.azure,
  signInButtonBackground: baseColors.emerald,
  signInFormBackground: baseColors.blueWhale,
  inputBackground: baseColors.gainsboro,
  inputLabel: baseColors.pelorous,
  inputValid: baseColors.emerald,
  inputInvalid: baseColors.red
};

const theme = {
  ...baseColors,
  ...appBaseColors,
  ...componentStateColors
};

/**
 * The floating label color bug as of today:
 * https://bitbucket.org/isbx/boilerplates-cms/pull-requests/2/feature-bplt-66-cms-set-up-theming/diff#comment-102555670
 * https://github.com/material-components/material-components-web/issues/2718
 */

export const GlobalThemeStyle = createGlobalStyle`
  ${({ theme }) => `
    * {
      @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;700;800;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Chathura&display=swap');
    }
    :root {
      --mdc-theme-primary: ${theme.primary};
      --mdc-theme-secondary: ${theme.secondary};
      --mdc-theme-error: ${theme.destructiveColor};
      [class^="mdc"] {
        font-family: 'Nunito Sans', 'Helvetica', 'Arial', 'Roboto', sans-serif;
      }

      .mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label {
        color: var(--mdc-theme-primary);
      }

      .mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label {
        color:  ${theme.destructiveColor};
      }

      .mdc-text-field:not(.mdc-text-field--disabled) + .mdc-text-field-helper-line .mdc-text-field-helper-text {
        color: var(--mdc-theme-error) !important;
      }

      .mdc-button__label {
        font-family: 'Chathura', 'Nunito Sans';
      }
      .mdc-button__ripple::before,
      .mdc-button__ripple::after {
        background-color: unset;
      }
    }
  `}
`;

export type Theme = Readonly<typeof theme>;
export default theme;
