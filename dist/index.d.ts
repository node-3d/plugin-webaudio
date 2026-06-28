import type { TInitOpts, TWebaudio3D } from './types.ts';
/**
 * Initialize Webaudio3D.
 *
 * This function can be called repeatedly, but will ignore further calls.
 * The return value is cached and will be returned immediately for repeating calls.
 */
declare const init: (opts: TInitOpts) => TWebaudio3D;
export { init };
export type { TAudioContext, TAudioGlobal, TAudioWindow, TInitOpts, TWebaudio, TWebaudio3D } from './types.ts';
declare const _default: {
    init: (opts: TInitOpts) => TWebaudio3D;
};
export default _default;
