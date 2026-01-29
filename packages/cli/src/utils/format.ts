/**
 * Format an object as plain text "key: value", one property per line.
 * Suitable for use with log.info().
 */
export function toText(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      let text: string;
      if (value === null || value === undefined) {
        text = '';
      } else if (typeof value === 'object') {
        text = JSON.stringify(value);
      } else {
        text = String(value as string | number | boolean);
      }
      return `${key}: ${text}`.trimEnd();
    })
    .join('\n');
}
