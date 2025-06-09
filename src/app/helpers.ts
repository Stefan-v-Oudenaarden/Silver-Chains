export function GetCssVariableFromDocument(cssVariable: string, fallback: string = '#fff') {
  if (!cssVariable.startsWith('--')) {
    cssVariable = `--${cssVariable}`;
  }

  const result = window.getComputedStyle(document.head).getPropertyValue(cssVariable);
  if (!result) {
    return fallback;
  }

  return result;
}
