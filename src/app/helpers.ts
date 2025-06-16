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

type JoinableElement = string | number | string[] | number[];
export function JoinedString(
  firstElement: JoinableElement | undefined,
  secondElement: JoinableElement | undefined,
  joinString: string = ','
): string {
  let joinArray: string[] = [];

  if (firstElement) {
    joinArray = [...joinArray, ...JoinableElementToArray(firstElement)];
  }

  if (secondElement) {
    joinArray = [...joinArray, ...JoinableElementToArray(secondElement)];
  }

  return joinArray.join(joinString);
}

function JoinableElementToArray(input: JoinableElement): string[] {
  switch (typeof input) {
    case 'string':
      return [input];

    case 'object':
      return Object.values(input)
        .map((element) => {
          if (typeof element === 'string' && element) {
            return element;
          } else if (typeof element === 'number') return element.toLocaleString();
          return undefined;
        })
        .filter((element) => element !== undefined);

    default:
    case 'number':
      return [input.toLocaleString()];
  }
}

export function ArrayShuffle(input: any[]) {
  let m = input.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [input[m], input[i]] = [input[i], input[m]];
  }
  return input;
}
