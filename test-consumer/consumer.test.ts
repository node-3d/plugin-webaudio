import assert from 'node:assert/strict';
import { platform } from 'node:process';
import test from 'node:test';

import type { TGlfw } from '@node-3d/core';
import type { TAudioWindow } from '@node-3d/plugin-webaudio';

const useHeadlessGlfw = platform === 'darwin';
const useGles = useHeadlessGlfw || platform === 'linux';

if (useHeadlessGlfw) {
	const nodeGlobal = globalThis as typeof globalThis & { __isGlfwInited?: boolean };
	nodeGlobal.__isGlfwInited = true;
}

const { glfw, init: initCore } = await import('@node-3d/core');

if (useHeadlessGlfw) {
	glfw.initHint(glfw.PLATFORM, glfw.PLATFORM_NULL);
	assert.equal(glfw.init(), true);
	glfw.defaultWindowHints();
}

const core = initCore({
	height: 32,
	isGles3: useGles,
	isVisible: false,
	isWebGL2: useGles,
	width: 32,
	onBeforeWindow(_window, currentGlfw) {
		if (!useGles) {
			return;
		}
		const current = currentGlfw as TGlfw;
		if (useHeadlessGlfw) {
			current.windowHint(current.CONTEXT_CREATION_API, current.EGL_CONTEXT_API);
		}
		current.windowHint(current.VISIBLE, current.FALSE);
		current.windowHint(current.OPENGL_PROFILE, current.OPENGL_ANY_PROFILE);
		current.windowHint(current.CONTEXT_VERSION_MAJOR, 3);
		current.windowHint(current.CONTEXT_VERSION_MINOR, 2);
		current.windowHint(current.CLIENT_API, current.OPENGL_ES_API);
		current.windowHint(current.STENCIL_BITS, 0);
		current.windowHint(current.DEPTH_BITS, 0);
		current.windowHint(current.SAMPLES, 0);
	},
});
const { init: initWebaudio } = await import('@node-3d/plugin-webaudio');
const audioWindow = core.doc as typeof core.doc & TAudioWindow;
const extended = { ...core, ...initWebaudio({ window: audioWindow }) };

test('uses the packed WebAudio plugin to extend core', () => {
	assert.equal(typeof extended.doc.createElement, 'function');
	assert.equal(typeof extended.webaudio.AudioContext, 'function');
	assert.equal(audioWindow.AudioContext, extended.webaudio.AudioContext);
	assert.equal(Reflect.get(globalThis, 'AudioContext'), extended.webaudio.AudioContext);
	extended.doc.destroy();
});
