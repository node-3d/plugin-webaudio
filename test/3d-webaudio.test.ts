import { strict as assert } from 'node:assert';
import { after, describe, it } from 'node:test';
import { platform } from 'node:process';
import { init as initWebaudio } from '@node-3d/plugin-webaudio';
import type { TGlfw, TInitOpts } from '@node-3d/core';
import type { TAudioWindow } from '@node-3d/plugin-webaudio';

const shouldUseHeadlessGlfw = platform === 'darwin';
const shouldUseGlesTestWindowHints = platform === 'darwin' || platform === 'linux';

const applyGlesWindowHints = (glfw: TGlfw): void => {
	glfw.windowHint(glfw.VISIBLE, glfw.FALSE);
	glfw.windowHint(glfw.OPENGL_PROFILE, glfw.OPENGL_ANY_PROFILE);
	glfw.windowHint(glfw.CONTEXT_VERSION_MAJOR, 3);
	glfw.windowHint(glfw.CONTEXT_VERSION_MINOR, 2);
	glfw.windowHint(glfw.CLIENT_API, glfw.OPENGL_ES_API);
	glfw.windowHint(glfw.STENCIL_BITS, 0);
	glfw.windowHint(glfw.DEPTH_BITS, 0);
	glfw.windowHint(glfw.SAMPLES, 0);
};

const bootstrapHeadlessGlfw = async (): Promise<void> => {
	if (!shouldUseHeadlessGlfw) {
		return;
	}

	const nodeGlobal = globalThis as Record<string, unknown>;
	nodeGlobal['__isGlfwInited'] = true;
	const { glfw: glfwRaw } = await import('@node-3d/glfw');
	const glfw = glfwRaw as TGlfw;
	glfw.initHint(glfw.PLATFORM, glfw.PLATFORM_NULL);

	if (!glfw.init()) {
		throw new Error('Failed to initialize GLFW for headless tests');
	}

	glfw.defaultWindowHints();
	nodeGlobal['__isGlfwInited'] = true;
};

await bootstrapHeadlessGlfw();

const { init } = await import('@node-3d/core');
const initOpts: TInitOpts = shouldUseGlesTestWindowHints
	? {
			isGles3: true,
			isWebGL2: true,
			isVisible: !shouldUseHeadlessGlfw,
			onBeforeWindow(_window, glfwRaw) {
				const glfw = glfwRaw as TGlfw;
				if (shouldUseHeadlessGlfw) {
					glfw.windowHint(glfw.CONTEXT_CREATION_API, glfw.EGL_CONTEXT_API);
				}
				applyGlesWindowHints(glfw);
			},
		}
	: {};
const { doc } = init(initOpts);
const audioWindow = doc as typeof doc & TAudioWindow;
const { webaudio } = initWebaudio({ window: audioWindow });

after(() => {
	doc.destroy();
});

describe('Webaudio 3D Inited', () => {
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
