'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  CanvasTexture,
  Color,
  EquirectangularReflectionMapping,
  ExtrudeGeometry,
  type Group,
  type Mesh,
  MeshPhysicalMaterial,
  Shape,
  SRGBColorSpace,
  type Texture,
} from 'three';

/**
 * The WebGL hero: rounded rectangular slabs drifting around the brand mark.
 *
 * CONCEPT: the legacy site's isometric cube illustration, made real. The site
 * is called WebRectangle and the rectangle is the brand motif, so turning the
 * flat SVG into actual geometry is the strongest continuity link between the
 * old identity and the new one. Two of the slabs are frosted glass, echoing
 * the glass panels used throughout the interface.
 *
 * DEPENDENCY CHOICE: no @react-three/drei. Its `Environment` presets fetch an
 * HDR map from a CDN at runtime, which is a network dependency a marketing
 * page should not carry, and its helpers would roughly double the chunk. The
 * rounded geometry and the environment map below are a few dozen lines each
 * and ship with no external fetch.
 *
 * PERFORMANCE: capped device pixel ratio, antialiasing off in favour of the
 * cheaper post-free look, and the render loop parks entirely when the tab is
 * hidden or the hero scrolls out of view.
 */

/** Slab layout. Hand-placed so the composition stays balanced at any width. */
const SLABS = [
  { pos: [0, 0, 0], rot: [0.1, 0.5, 0.05], size: [2.6, 1.7, 0.16], glass: false, phase: 0 },
  {
    pos: [-2.1, 1.15, -1.1],
    rot: [0.2, -0.4, -0.12],
    size: [1.5, 1.0, 0.12],
    glass: true,
    phase: 1.1,
  },
  {
    pos: [2.2, 0.75, -0.9],
    rot: [-0.15, 0.6, 0.1],
    size: [1.35, 0.95, 0.12],
    glass: false,
    phase: 2.2,
  },
  {
    pos: [-1.7, -1.45, -0.5],
    rot: [0.05, 0.35, 0.18],
    size: [1.2, 0.8, 0.1],
    glass: true,
    phase: 3.3,
  },
  {
    pos: [1.85, -1.35, -1.4],
    rot: [0.22, -0.55, -0.08],
    size: [1.05, 0.7, 0.1],
    glass: false,
    phase: 4.4,
  },
  {
    pos: [0.35, 1.9, -2.0],
    rot: [-0.1, 0.25, 0.14],
    size: [0.85, 0.6, 0.09],
    glass: false,
    phase: 5.5,
  },
] as const;

const BRAND = new Color('#0165FB');
const BRAND_DEEP = new Color('#0142A6');

/**
 * Rounded-rectangle geometry.
 *
 * three has no rounded box primitive, so the profile is drawn as a Shape and
 * extruded. The bevel is what catches the key light along each edge, which is
 * most of what makes the slabs read as solid objects rather than flat planes.
 */
function useSlabGeometry(width: number, height: number, depth: number) {
  return useMemo(() => {
    const radius = Math.min(width, height) * 0.12;
    const shape = new Shape();

    const w = width / 2;
    const h = height / 2;

    shape.moveTo(-w + radius, -h);
    shape.lineTo(w - radius, -h);
    shape.quadraticCurveTo(w, -h, w, -h + radius);
    shape.lineTo(w, h - radius);
    shape.quadraticCurveTo(w, h, w - radius, h);
    shape.lineTo(-w + radius, h);
    shape.quadraticCurveTo(-w, h, -w, h - radius);
    shape.lineTo(-w, -h + radius);
    shape.quadraticCurveTo(-w, -h, -w + radius, -h);

    const geometry = new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.25,
      bevelSize: depth * 0.25,
      bevelSegments: 2,
      curveSegments: 8,
    });

    geometry.center();
    return geometry;
  }, [width, height, depth]);
}

/**
 * Procedural environment map.
 *
 * A vertical gradient painted to a 2D canvas and mapped equirectangularly.
 * Physically meaningless, but it gives the glass and the clearcoat something
 * to reflect, which is the difference between "glass" and "grey plastic". A
 * 64x64 texture is plenty at the blur levels involved and costs nothing.
 */
function useEnvironmentMap() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, 0, 64);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.45, '#dce8ff');
    gradient.addColorStop(0.75, '#5b9bfd');
    gradient.addColorStop(1, '#01337e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new CanvasTexture(canvas);
    texture.mapping = EquirectangularReflectionMapping;
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
}

function Slab({ config, envMap }: { config: (typeof SLABS)[number]; envMap: Texture | null }) {
  const ref = useRef<Mesh>(null);
  const geometry = useSlabGeometry(config.size[0], config.size[1], config.size[2]);

  const material = useMemo(() => {
    if (config.glass) {
      // MeshPhysicalMaterial's transmission gives real refraction without
      // drei's custom transmission shader, at a fraction of the bundle cost.
      return new MeshPhysicalMaterial({
        color: '#eaf2ff',
        transmission: 0.92,
        thickness: 0.5,
        roughness: 0.12,
        ior: 1.42,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: true,
        envMap,
        envMapIntensity: 1.4,
      });
    }

    return new MeshPhysicalMaterial({
      color: BRAND,
      roughness: 0.28,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      envMap,
      envMapIntensity: 0.9,
      emissive: BRAND_DEEP,
      emissiveIntensity: 0.12,
    });
  }, [config.glass, envMap]);

  // Per-slab bob, mirroring the legacy 6s `floaty` keyframe. The phase offset
  // stops the group from pulsing in unison, which reads as mechanical.
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = config.pos[1] + Math.sin(t * 0.55 + config.phase) * 0.12;
    ref.current.rotation.z = config.rot[2] + Math.sin(t * 0.32 + config.phase) * 0.04;
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      position={[config.pos[0], config.pos[1], config.pos[2]]}
      rotation={[config.rot[0], config.rot[1], config.rot[2]]}
    />
  );
}

/**
 * Slow orbit plus damped pointer parallax.
 *
 * Parallax is capped at a few degrees and eased toward the target rather than
 * tracking the cursor directly - unbounded tilt turns a premium backdrop into
 * a novelty toy, and the brief explicitly warns against excessive animation.
 */
function SceneContents() {
  const group = useRef<Group>(null);
  const envMap = useEnvironmentMap();
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.05;

    const targetX = pointer.y * 0.07;
    const targetZ = -pointer.x * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(delta * 2.2, 1);
    group.current.rotation.z += (targetZ - group.current.rotation.z) * Math.min(delta * 2.2, 1);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.7} color="#5b9bfd" />

      <group ref={group}>
        {SLABS.map((config, i) => (
          <Slab key={i} config={config} envMap={envMap} />
        ))}
      </group>
    </>
  );
}

/**
 * @param paused Parks the render loop. Driven by tab visibility and by an
 * IntersectionObserver on the hero, so an off-screen canvas costs nothing.
 */
export default function HeroScene({ paused }: { paused: boolean }) {
  return (
    <Canvas
      // Capped so a 3x phone or a Retina display does not quadruple the
      // fragment cost for a background decoration.
      dpr={[1, 1.75]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ pointerEvents: 'none' }}
    >
      <SceneContents />
    </Canvas>
  );
}
