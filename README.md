# Node.js 3D WebAudio

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://badge.fury.io/js/@node-3d%2Fplugin-webaudio.svg)](https://badge.fury.io/js/@node-3d/plugin-webaudio)
[![Lint](https://github.com/node-3d/plugin-webaudio/actions/workflows/lint.yml/badge.svg)](https://github.com/node-3d/plugin-webaudio/actions/workflows/lint.yml)
[![Test](https://github.com/node-3d/plugin-webaudio/actions/workflows/test.yml/badge.svg)](https://github.com/node-3d/plugin-webaudio/actions/workflows/test.yml)

```console
npm install @node-3d/plugin-webaudio
```

![Example](examples/screenshot.jpg)

This plugin injects WebAudio API into Node3D's `window`. It ain't much, but it's honest work.

The WebAudio implementation is provided by [@node-3d/webaudio](https://github.com/node-3d/webaudio).
Some WebAudio features may be missing, but it works with Three.js. With positional audio.

Refer to [@node-3d/webaudio](https://github.com/node-3d/webaudio) for the full list
of currently implemented API.

```typescript
import { init } from '@node-3d/core';
import { init as initWebaudio } from '@node-3d/plugin-webaudio';

// Fetch `window` from standard Node3D init
const { window } = init();

// Initialize Webaudio
const { webaudio } = initWebaudio({ window });
// webaudio.AudioContext === window.AudioContext === global.AudioContext
```

Here, `webaudio` is directly re-exported [@node-3d/webaudio](https://github.com/node-3d/webaudio).
You can also use it through `window.AudioContext` or just `AudioContext`. But the main idea is
using it with Three.js, [like this](https://threejs.org/docs/#api/en/audio/PositionalAudio).
