import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { init } from '@node-3d/core';
import { init as initWebaudio } from '@node-3d/plugin-webaudio';
import type { TAudioWindow } from '@node-3d/plugin-webaudio';

const { doc } = init();
const audioWindow = doc as typeof doc & TAudioWindow;
const { webaudio } = initWebaudio({ window: audioWindow });
console.log('webaudio.AudioContext', webaudio.AudioContext);

const tested = describe('Webaudio 3D Inited', () => {
	it('returns `webaudio` from init', () => {
		assert.strictEqual(typeof webaudio, 'object');
	});

	it('has `AudioContext` in `webaudio`', () => {
		assert.strictEqual(typeof webaudio.AudioContext, 'function');
	});

	it('sets `AudioContext` on `window`', () => {
		assert.strictEqual(audioWindow.AudioContext, webaudio.AudioContext);
	});

	it('sets `AudioContext` on `global`', () => {
		assert.strictEqual(Reflect.get(globalThis, 'AudioContext'), webaudio.AudioContext);
	});
});

const interv = setInterval(() => {
	/* nop */
}, 15);
await tested;
clearInterval(interv);
