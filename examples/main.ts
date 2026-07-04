import * as three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { init, addThreeHelpers, Image, Screen } from '@node-3d/core';
import { init as initWebaudio } from '@node-3d/plugin-webaudio';

const cwd = import.meta.dirname;

const { doc, loop } = init({
	isGles3: true,
	isWebGL2: true,
	autoEsc: true,
	autoFullscreen: true,
});

addThreeHelpers(three);

initWebaudio({ window: doc });

const icon = new Image(`${cwd}/webaudio.png`);
icon.on('load', () => {
	if (icon.data) {
		doc.icon = { width: icon.width, height: icon.height, data: icon.data };
	}
});
doc.title = 'Web Audio';

const SPHERE_RADIUS = 0.3;
const OUTLINE_SIZE = 0.02;
const count = 6;
const radius = 6;
const speed = 0.001;
const height = 3;
const offset = 0.5;

const sphereGeometry = new three.IcosahedronGeometry(SPHERE_RADIUS, 5);
const outlineGeometry = new three.IcosahedronGeometry(SPHERE_RADIUS + OUTLINE_SIZE, 5);
sphereGeometry.translate(0, SPHERE_RADIUS, 0);
outlineGeometry.translate(0, SPHERE_RADIUS, 0);
const sphereMaterial = new three.MeshToonMaterial({ color: 0xffeeff });
const outlineMaterial = new three.MeshBasicMaterial({ color: 0, side: three.BackSide });

const floorGeometry = new three.PlaneGeometry(40, 20);
const floorMaterial = new three.MeshToonMaterial({ color: 0xc78757 });

const camera = new three.PerspectiveCamera(60, doc.w / doc.h, 0.5, 50);
camera.position.set(0, 3, 7);
const controls = new OrbitControls(camera, doc as typeof doc & HTMLElement);
controls.update();

const screen = new Screen({ three, camera });
const scene = screen.scene;
scene.background = new three.Color(0x8dcede);

const ambientLight = new three.AmbientLight(0xffeeee, 0.2);
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xeeeeff, 1.3);
directionalLight.position.set(-15, 25, 25);
scene.add(directionalLight);

const d = 30;
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
directionalLight.shadow.camera.near = 10;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.mapSize.x = 2048;
directionalLight.shadow.mapSize.y = 2048;

const audioLoader = new three.AudioLoader();
const listener = new three.AudioListener();
camera.add(listener);

const floor = new three.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

screen.renderer.shadowMap.enabled = true;

window.addEventListener('resize', () => {
	controls.update();
});

type TBall = {
	mesh: three.Mesh;
	audio: three.PositionalAudio | null;
	down: boolean;
};

const balls: TBall[] = [];

const time1 = Date.now();
const time0 = time1 - 16;

for (let i = 0; i < count; i++) {
	const mesh = new three.Mesh(sphereGeometry, sphereMaterial);
	const outlineMesh = new three.Mesh(outlineGeometry, outlineMaterial);
	mesh.add(outlineMesh);
	mesh.castShadow = true;

	const spread = (i / count) * Math.PI * 2;
	mesh.position.x = radius * Math.cos(spread);
	mesh.position.z = radius * Math.sin(spread);

	let down = false;
	const angle0 = i * offset + time0 * speed;
	const previousHeight = Math.abs(Math.sin(angle0) * height);
	const angle1 = i * offset + time1 * speed;
	mesh.position.y = Math.abs(Math.sin(angle1) * height);
	if (mesh.position.y < previousHeight) {
		down = true;
	}

	scene.add(mesh);

	balls.push({ mesh, audio: null, down });
}

audioLoader.load(`${cwd}/sounds/hit.wav`, (buffer: AudioBuffer) => {
	for (const ball of balls) {
		const audio = new three.PositionalAudio(listener);
		audio.setBuffer(buffer);
		ball.audio = audio;
		ball.mesh.add(audio);
	}
});

const animate = (time: number) => {
	for (let i = 0; i < balls.length; i++) {
		const ball = balls[i];
		const previousHeight = ball.mesh.position.y;

		const angle = i * offset + time * speed;
		ball.mesh.position.y = Math.abs(Math.sin(angle) * height);

		if (ball.mesh.position.y === previousHeight) {
			continue;
		}

		if (ball.down && ball.mesh.position.y > previousHeight) {
			ball.audio?.play();
			ball.down = false;
			continue;
		}

		if (!ball.down && ball.mesh.position.y < previousHeight) {
			ball.down = true;
		}
	}

	controls.update();
	screen.draw();
};

loop(animate);
