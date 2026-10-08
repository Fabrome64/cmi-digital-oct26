'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface KiroCanvasProps {
  onMountReady?: () => void;
  sayHiTrigger?: number;
}

export default function KiroCanvas({ onMountReady, sayHiTrigger = 0 }: KiroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const sayHiRef = useRef<number>(0);

  useEffect(() => {
    if (sayHiTrigger > 0) {
      sayHiRef.current = 2; // Active elevation & gesture duration in seconds
    }
  }, [sayHiTrigger]);

  useEffect(() => {
    const host = containerRef.current;
    const mount = mountRef.current;
    const hero = host?.closest('.hero') || host?.parentElement;
    const status = document.querySelector('#metrics');

    if (!host || !mount) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    let visible = true;
    let disposed = false;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let frameCount = 0;
    let measured = 0;
    let meanFrame = 0;

    const pointer = new THREE.Vector2(0, 0);
    const smooth = new THREE.Vector2(0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      if (status) status.textContent = 'WebGL no disponible. Se conserva la composición estática.';
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.76;
    renderer.setClearColor(0x000000, 0);

    // Apply canvas CSS filter as per demo prompt: filter: saturate(1.28) contrast(1.045)
    renderer.domElement.style.filter = 'saturate(1.28) contrast(1.045)';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.12, 7.8);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();

    const geo = <T extends THREE.BufferGeometry>(g: T): T => { geometries.add(g); return g; };
    const mat = <T extends THREE.Material>(m: T): T => { materials.add(m); return m; };

    function mesh(g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = group, pos: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) {
      const n = new THREE.Mesh(geo(g), m);
      n.position.set(...pos);
      n.scale.set(...scale);
      parent.add(n);
      return n;
    }

    // Studio Environment & Lighting
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTarget = pmrem.fromScene(room, 0.025);
    scene.environment = envTarget.texture;
    room.dispose();
    scene.environmentIntensity = 0.55;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x434137, 0.75));
    const key = new THREE.DirectionalLight(0xffebd5, 2.3);
    key.position.set(-3, 5, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xd4ecff, 1.3);
    fill.position.set(4, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 3);
    rim.position.set(0, 3, -3);
    scene.add(rim);

    // Kiro Procedural Construction
    const physical = (color: number, roughness = 0.32, metalness = 0.05) =>
      mat(new THREE.MeshPhysicalMaterial({ color, roughness, metalness, clearcoat: 0.7, clearcoatRoughness: 0.32 }));
    const sphere = (r: number, m: THREE.Material, parent: THREE.Object3D, pos: [number, number, number], scale: [number, number, number] = [1, 1, 1]) =>
      mesh(new THREE.SphereGeometry(r, 48, 32), m, parent, pos, scale);
    const capsule = (r: number, l: number, m: THREE.Material, parent: THREE.Object3D, pos: [number, number, number]) =>
      mesh(new THREE.CapsuleGeometry(r, l, 8, 24), m, parent, pos);
    const box = (w: number, h: number, d: number, r: number, m: THREE.Material, parent: THREE.Object3D, pos: [number, number, number]) =>
      mesh(new RoundedBoxGeometry(w, h, d, 4, r), m, parent, pos);

    const shell = physical(0xcbd0bb, 0.29, 0.32);
    const dark = physical(0x101b22, 0.27, 0.38);
    const lime = physical(0xd2ff32, 0.3, 0.2);
    const joint = physical(0x373f42, 0.54, 0.3);
    const eyeMat = mat(new THREE.MeshBasicMaterial({ color: 0xe2ff93 }));

    const head = new THREE.Group();
    head.position.y = 0.66;
    group.add(head);

    const eyes: THREE.Mesh[] = [];
    const ears: THREE.Group[] = [];
    const arms: THREE.Group[] = [];

    // Spherical helmet & visor
    sphere(1.13, shell, head, [0, 0, 0], [1, 1, 0.93]);
    sphere(1.0, joint, head, [0, -0.07, 0.49], [1, 0.79, 0.63]);
    sphere(0.94, dark, head, [0, -0.06, 0.59], [1, 0.77, 0.61]);

    // Visor lenses & side hinges
    for (const side of [-1, 1]) {
      const eye = capsule(0.065, 0.15, eyeMat, head, [side * 0.34, -0.035, 1.18]);
      eyes.push(eye);
      const hinge = mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.15, 40), joint, head, [side * 1.09, -0.08, 0]);
      hinge.rotation.z = Math.PI / 2;
      const cap = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.18, 40), lime, head, [side * 1.14, -0.08, 0]);
      cap.rotation.z = Math.PI / 2;
    }

    // Top forehead badge & antenna
    box(0.3, 0.075, 0.055, 0.025, lime, head, [0, 0.87, 0.62]);
    capsule(0.025, 0.38, joint, head, [-0.83, 1.01, -0.15]).rotation.z = 0.24;
    sphere(0.065, lime, head, [-0.89, 1.22, -0.15]);

    // Backpack & suit body
    box(1.33, 1.25, 0.7, 0.2, joint, group, [0, -0.83, -0.55]);

    for (const side of [-1, 1]) {
      capsule(0.22, 0.7, shell, group, [side * 0.77, -0.85, -0.43]);
      mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.2, 24), lime, group, [side * 0.77, -1.39, -0.43]);
    }

    mesh(new THREE.TorusGeometry(0.48, 0.14, 16, 64), joint, group, [0, -0.43, 0]).rotation.x = Math.PI / 2;
    box(1.25, 1.14, 0.87, 0.3, shell, group, [0, -1.0, 0]);
    box(0.65, 0.39, 0.12, 0.08, joint, group, [0, -0.92, 0.458]);

    for (let i = 0; i < 3; i++) {
      box(0.09, 0.17, 0.04, 0.02, lime, group, [-0.18 + i * 0.18, -0.92, 0.535]);
    }

    // Arms, Gloves, Boots
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.66, -0.65, 0);
      arm.rotation.z = side * 0.27;
      group.add(arm);
      arms.push(arm);

      sphere(0.24, joint, arm, [0, 0, 0]);
      capsule(0.23, 0.3, shell, arm, [side * 0.1, -0.28, 0]);
      mesh(new THREE.TorusGeometry(0.215, 0.055, 10, 32), lime, arm, [side * 0.12, -0.54, 0]).rotation.x = Math.PI / 2;
      sphere(0.23, shell, arm, [side * 0.12, -0.66, 0.025], [1, 1.05, 1]);

      capsule(0.23, 0.3, joint, group, [side * 0.33, -1.62, 0]);
      box(0.54, 0.46, 0.8, 0.16, shell, group, [side * 0.34, -1.93, 0.14]);
      box(0.55, 0.09, 0.79, 0.04, lime, group, [side * 0.34, -2.14, 0.14]);
    }

    group.rotation.set(0.04, -0.2, 0.12);
    const baseEyes = eyes.map((e) => e.position.x);

    // Render loop animation
    function updateCharacter(t: number, p: THREE.Vector2, gesture: number) {
      head.rotation.set(-p.y * 0.2, p.x * 0.36, Math.sin(t * 0.8) * 0.025);
      const blink = 1 - Math.pow(Math.max(0, Math.cos(t * 1.1)), 60) * 0.92;
      eyes.forEach((eye, i) => {
        eye.scale.y = blink;
        eye.position.x = baseEyes[i] + p.x * 0.025;
      });
      group.position.y = Math.sin(t * 1.2) * 0.07 + (Math.sin(Math.min(gesture, 1) * Math.PI) * 0.35);
      ears.forEach((ear, i) => (ear.rotation.z = (i ? -0.16 : 0.16) + Math.sin(t * 1.8 + i) * 0.045 + Math.sin(gesture * 7) * 0.12));
      arms.forEach((arm, i) => (arm.rotation.z = (i ? 1 : -1) * (0.15 + Math.sin(t + i) * 0.035) + (i === 1 ? Math.sin(gesture * 8) * 0.4 : 0)));
    }

    function render(now = performance.now()) {
      raf = 0;
      if (disposed || !visible || document.hidden) return;

      const rawDt = (now - (last || now)) / 1000;
      const dt = Math.min(rawDt, 0.05);
      last = now;

      if (!paused) elapsed += dt;
      const damping = 1 - Math.exp(-dt * 6);
      if (!paused) smooth.lerp(pointer, damping);

      if (!paused) {
        sayHiRef.current = Math.max(0, sayHiRef.current - dt);
        updateCharacter(elapsed, smooth, sayHiRef.current);
      }

      renderer.render(scene, camera);
      if (hero) hero.classList.add('webgl-ready');

      frameCount++;
      if (rawDt > 0 && rawDt < 0.25 && !paused) {
        meanFrame += rawDt * 1000;
        measured++;
      }

      if (status && (frameCount % 60 === 0 || frameCount === 1 || paused)) {
        status.textContent = `Three.js r${THREE.REVISION} · ${renderer.info.render.calls} draw calls · ${renderer.info.render.triangles.toLocaleString('es')} triángulos · DPR ${renderer.getPixelRatio()} · ${
          measured ? (meanFrame / measured).toFixed(1) + ' ms medios (kiro)' : 'sin medición'
        } · ${paused ? 'pausado' : 'activo'}`;
      }

      if (!paused) {
        raf = requestAnimationFrame(render);
      }
    }

    function wake() {
      if (!raf && !disposed) {
        last = performance.now();
        raf = requestAnimationFrame(render);
      }
    }

    function resize() {
      if (!host) return;
      const r = host.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      wake();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const onMove = (e: PointerEvent) => {
      if (!host) return;
      const r = host.getBoundingClientRect();
      pointer.set(
        THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(1 - ((e.clientY - r.top) / r.height) * 2, -1, 1)
      );
      wake();
    };

    const onLeave = () => {
      pointer.set(0, 0);
      wake();
    };

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'Home') pointer.set(0, 0);
        else {
          pointer.x = THREE.MathUtils.clamp(pointer.x + (e.key === 'ArrowLeft' ? -0.2 : e.key === 'ArrowRight' ? 0.2 : 0), -1, 1);
          pointer.y = THREE.MathUtils.clamp(pointer.y + (e.key === 'ArrowUp' ? 0.2 : e.key === 'ArrowDown' ? -0.2 : 0), -1, 1);
        }
        wake();
      }
    };

    host.addEventListener('pointermove', onMove as any);
    host.addEventListener('pointerdown', onMove as any);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('keydown', onKey as any);

    const onPreference = () => {
      paused = reduced.matches;
      wake();
    };
    reduced.addEventListener('change', onPreference);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 }
    );
    if (hero) observer.observe(hero);

    function onContextLost(e: Event) {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      if (hero) hero.classList.remove('webgl-ready');
      if (status) status.textContent = 'Contexto gráfico perdido. Recarga para reintentar.';
      disposed = true;
    }

    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    resize();
    wake();
    if (onMountReady) onMountReady();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      if (hero) observer.unobserve(hero);
      host.removeEventListener('pointermove', onMove as any);
      host.removeEventListener('pointerdown', onMove as any);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('keydown', onKey as any);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onPreference);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="visual"
      tabIndex={0}
      className="relative w-full h-[380px] sm:h-[480px] lg:h-[620px] focus:outline-none focus:ring-2 focus:ring-[#d2ff32] rounded-3xl"
    >
      <div className="canvas-mount w-full h-full" />
    </div>
  );
}
