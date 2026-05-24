const LONG_LABEL_MIN = 18;

export function labelTextWrap(text: string, width = 132): Record<string, unknown> {
  if (text.trim().length <= LONG_LABEL_MIN) return {};
  return {
    textWrap: {
      width,
      height: null,
      ellipsis: false,
    },
  };
}
