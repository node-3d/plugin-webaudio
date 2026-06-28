import type * as webaudio from '@node-3d/webaudio';
import type { TDocument } from '@node-3d/core';

export type TWebaudio = typeof webaudio;
export type TAudioContext = typeof webaudio.AudioContext;

export type TAudioWindow = TDocument & {
	AudioContext?: TAudioContext;
};

export type TAudioGlobal = {
	AudioContext?: TAudioContext;
};

export type TInitOpts = Readonly<{
	window: TAudioWindow;
}>;

export type TWebaudio3D = Readonly<{
	/**
	 * Re-export of `@node-3d/webaudio`.
	 */
	webaudio: TWebaudio;
}>;
