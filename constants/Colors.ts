/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const gray = {
  darkest: '#11181C',
  dark: '#858585',
  neutral: '#AAB8C2',
  light: '#E5E5E5',
  lightest: '#f3f3f3',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  primary: '#056270',
  secondary: '#F3675C',
  tertiary: '#CCCCCC',
  white: '#FFF',
  text: '#11181C',
  gray: {
    darkest: gray.darkest,
    dark: gray.dark,
    neutral: '#AAB8C2',
    light: '#E1E8ED',
    lightest: '#F5F8FA',
  },
  border: {
    light: gray.light,
    dark: gray.dark,
  },
  background: {
    primary: '#FFF',
    input: gray.lightest,
  },
  cardColors: {
    coral: "#FF6B6B",
    tangerine: "#FF9F45",
    sunflower: "#FFC75F",
    mint: "#00C49A",
    skyBlue: "#00B5E2",
    lavender: "#A88ADD",
    deepPurple: "#6C5CE7",
    rose: "#FF5C8A",
    cerulean: "#007BA7",
    oceanBlue: "#0096C7",
    emerald: "#2ECC71",
    softOrange: "#FF7F50",
    plum: "#8E44AD",
    deepRed: "#C0392B",
    midnightBlue: "#2C3E50",
    steel: "#4B6584",
    jade: "#00A896",
    tealGreen: "#1E9C89",
    duskyPink: "#D8838A",
    warmGray: "#7E7F9A",
  }
};
