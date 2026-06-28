import * as webaudio from '@node-3d/webaudio';
import type { TInitOpts, TWebaudio3D } from './types.ts';

const initPlugin = (opts: TInitOpts): TWebaudio3D => {
	const { window } = opts;
	const { AudioContext } = webaudio;
	
	window.AudioContext = AudioContext;
	Object.defineProperty(globalThis, 'AudioContext', {
		value: AudioContext,
		configurable: true,
		writable: true,
	});
	
	return {
		webaudio,
	};
};

let inited: TWebaudio3D | null = null;

/**
 * Initialize Webaudio3D.
 *
 * This function can be called repeatedly, but will ignore further calls.
 * The return value is cached and will be returned immediately for repeating calls.
 */
const init = (opts: TInitOpts): TWebaudio3D => {
	if (inited) {
		return inited;
	}
	inited = initPlugin(opts);
	return inited;
};

export { init };
export type { TAudioContext, TAudioGlobal, TAudioWindow, TInitOpts, TWebaudio, TWebaudio3D } from './types.ts';
export default { init 
};
