import { ConfigException } from '../schema/config';

export function isException(
  exceptionPolicy: ConfigException | undefined,
  commitBody: string
): string | undefined {
  if (!exceptionPolicy?.note || exceptionPolicy.note.length === 0)
    return undefined;

  for (const exception of exceptionPolicy.note) {
    // `\\n` matches literal backslash-n text in API responses; `^` with `m` flag handles actual newlines
    const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
    const matches = commitBody.matchAll(regexp);

    for (const match of matches) {
      if (Array.isArray(match) && match.length >= 3) {
        return match[2];
      }
    }
  }
}
