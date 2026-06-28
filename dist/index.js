import * as __rspack_external__node_3d_webaudio_c121db08 from "@node-3d/webaudio";
const initPlugin = (opts)=>{
    const { window } = opts;
    const { AudioContext } = __rspack_external__node_3d_webaudio_c121db08;
    window.AudioContext = AudioContext;
    Object.defineProperty(globalThis, 'AudioContext', {
        value: AudioContext,
        configurable: true,
        writable: true
    });
    return {
        webaudio: __rspack_external__node_3d_webaudio_c121db08
    };
};
let inited = null;
const init = (opts)=>{
    if (inited) return inited;
    inited = initPlugin(opts);
    return inited;
};
const ts = {
    init: init
};
export default ts;
export { init };
