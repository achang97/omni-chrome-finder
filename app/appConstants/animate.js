// Debounce / Animations
export const DEBOUNCE = {
  HZ_60: 166,
  MS_300: 300
};

export const TIMEOUT = {
  SEC_3: 3000
};

export const TRANSITIONS = {
  FADE_IN: {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  }
};

export default { DEBOUNCE, TIMEOUT, TRANSITIONS };
