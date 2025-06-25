import { z } from 'zod';
import { configExceptionSchema } from '../schema/config';
export function isException(exceptionPolicy, commitBody) {
    const exceptionPolicySafe = configExceptionSchema
        .extend({ note: z.array(z.string()) })
        .safeParse(exceptionPolicy);
    if (!exceptionPolicySafe.success)
        return undefined;
    for (const exception of exceptionPolicySafe.data.note) {
        const regexp = new RegExp(`(^\\s*|\\\\n|\\n)(${exception})$`, 'gm');
        const matches = commitBody.matchAll(regexp);
        for (const match of matches) {
            if (Array.isArray(match) && match.length >= 3) {
                return exception;
            }
        }
    }
}
//# sourceMappingURL=util.js.map