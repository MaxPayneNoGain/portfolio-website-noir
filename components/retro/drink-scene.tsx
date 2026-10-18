"use client"

import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

export type Glass = "empty" | "pour" | "full" | "drain"

// half the glass in cross-section, spun into 3d: outer wall, rim, inner wall, thick base
const PROFILE = [
  [0, 0],
  [0.95, 0],
  [1, 0.05],
  [1, 1.58],
  [0.99, 1.605],
  [0.965, 1.615],
  [0.94, 1.605],
  [0.93, 1.58],
  [0.93, 0.36],
  [0.88, 0.32],
  [0, 0.32],
]

const INNER = 0.92
const FLOOR = 0.322
const DEPTH = 0.42
const TOP = 4

function radial(stops: [number, string][]) {
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  for (const [at, color] of stops) grad.addColorStop(at, color)
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function linear(top: string, bottom: string) {
  const c = document.createElement("canvas")
  c.width = 4
  c.height = 256
  const g = c.getContext("2d")!
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, top)
  grad.addColorStop(1, bottom)
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function meltedIce(size: number) {
  const geo = new RoundedBoxGeometry(size, size, size, 6, 0.09)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // slight wobble so the cubes don't look machined
    const n = Math.sin(v.x * 9.1 + v.y * 4.3) * Math.cos(v.z * 7.7 - v.x * 3.1) * 0.018
    v.multiplyScalar(1 + n)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

// adds light on top of the page instead of covering it
const ADDITIVE = {
  blending: THREE.CustomBlending,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
  depthWrite: false,
}

function liquidMaterial(depth: THREE.Texture) {
  const m = new THREE.MeshPhysicalMaterial({
    color: "#2a1203",
    emissive: "#fff",
    emissiveMap: depth,
    emissiveIntensity: 0.6,
    roughness: 0.04,
  })
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      // dimmer toward the edges, where you look through more liquid
      `#include <emissivemap_fragment>
      totalEmissiveRadiance *= 0.3 + 0.7 * pow(abs(dot(normal, normalize(vViewPosition))), 1.4);`,
    )
  }
  return m
}

function iceMaterial(surface: { value: number }) {
  // drawn over the liquid so the cubes still show through it
  const m = new THREE.MeshPhysicalMaterial({ color: "#000", roughness: 0.1, envMapIntensity: 0.12, depthTest: false, ...ADDITIVE })
  m.onBeforeCompile = (s) => {
    s.uniforms.uSurface = surface
    s.vertexShader = s.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;")
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vWorldY;\nuniform float uSurface;")
      .replace(
        "#include <emissivemap_fragment>",
        // frosty edges, clear faces, amber below the waterline
        `#include <emissivemap_fragment>
        float edge = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
        totalEmissiveRadiance += vWorldY < uSurface
          ? vec3(1.0, 0.62, 0.25) * (0.04 + edge * 0.4)
          : vec3(0.85, 0.92, 1.0) * (0.01 + edge * 0.55);`,
      )
  }
  return m
}

function Studio() {
  const { gl, scene } = useThree()

  useEffect(() => {
    // light strips for the glass to reflect
    const room = new THREE.Scene()
    room.background = new THREE.Color("#2a2a2d")
    const strip = (color: string, power: number, pos: [number, number, number], size: [number, number, number]) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...size),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power) }),
      )
      mesh.position.set(...pos)
      mesh.lookAt(0, 0.8, 0)
      room.add(mesh)
    }
    strip("#fff", 4, [-4, 1.5, 2.5], [0.25, 9, 0.05])
    strip("#fff", 4, [4, 1.5, 2.5], [0.25, 9, 0.05])
    strip("#ffe2b8", 2.5, [0, 6, 1], [4, 0.05, 2])

    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(room, 0).texture
    scene.environment = env

    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
      room.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          o.material.dispose()
        }
      })
    }
  }, [gl, scene])

  return null
}

function Rocks({ glass }: { glass: Glass }) {
  const held = useRef<THREE.Group>(null!)
  const liquid = useRef<THREE.Mesh>(null!)
  const stream = useRef<THREE.Mesh>(null!)
  const glow = useRef<THREE.MeshBasicMaterial>(null!)
  const shadow = useRef<THREE.MeshBasicMaterial>(null!)
  const level = useRef(0)
  const flow = useRef(0)
  const lift = useRef(0)
  const surfaceY = useMemo(() => ({ value: -1 }), [])

  const res = useMemo(
    () => ({
      glass: new THREE.LatheGeometry(
        PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
        128,
      ),
      liquid: new THREE.CylinderGeometry(INNER, INNER, 1, 128).translate(0, 0.5, 0),
      iceA: meltedIce(0.6),
      iceB: meltedIce(0.55),
      stream: new THREE.CylinderGeometry(0.028, 0.034, 1, 24).translate(0, 0.5, 0),
      liquidMat: liquidMaterial(linear("#5a2805", "#f2a040")),
      iceMat: iceMaterial(surfaceY),
      top: new THREE.MeshPhysicalMaterial({
        color: "#2a1203",
        emissive: "#5a2a06",
        emissiveIntensity: 0.5,
        roughness: 0.02,
        envMapIntensity: 1.5,
      }),
      shadow: radial([
        [0, "rgba(0,0,0,0.8)"],
        [1, "rgba(0,0,0,0)"],
      ]),
      glow: radial([
        [0, "rgba(255,160,60,1)"],
        [1, "rgba(255,160,60,0)"],
      ]),
    }),
    [surfaceY],
  )

  useEffect(() => () => Object.values(res).forEach((r) => r.dispose()), [res])

  useFrame((state, dt) => {
    const pouring = glass === "pour"
    flow.current = THREE.MathUtils.clamp(flow.current + (pouring ? dt : -dt) * 4, 0, 1)
    if (pouring && flow.current > 0.6) level.current = Math.min(1, level.current + dt / 2.3)
    // lift and tilt first, then drain
    const drinking = glass === "drain" && level.current > 0
    lift.current = THREE.MathUtils.damp(lift.current, drinking ? 1 : 0, 6, dt)
    if (drinking && lift.current > 0.8) level.current = Math.max(0, level.current - dt / 1.2)

    held.current.position.y = lift.current * 0.25
    held.current.rotation.set(lift.current * 0.35, 0, lift.current * 0.1)
    shadow.current.opacity = 1 - lift.current * 0.6

    const surface = FLOOR + level.current * DEPTH
    surfaceY.value = level.current > 0.002 ? surface + held.current.position.y : -1
    liquid.current.visible = level.current > 0.002
    liquid.current.scale.y = Math.max(level.current * DEPTH, 0.001)

    stream.current.visible = flow.current > 0
    stream.current.position.y = surface
    stream.current.scale.set(flow.current, TOP - surface, flow.current)
    glow.current.opacity = level.current * 0.22

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.3, 0.05)
    state.camera.lookAt(0, 0.95, 0)
  })

  return (
    <group>
      <group ref={held}>
        <mesh geometry={res.glass} renderOrder={3}>
          <meshPhysicalMaterial color="#202328" roughness={0} envMapIntensity={1.8} side={THREE.DoubleSide} {...ADDITIVE} />
        </mesh>
        <mesh ref={liquid} geometry={res.liquid} material={[res.liquidMat, res.top, res.liquidMat]} position-y={FLOOR} renderOrder={1} />
        <mesh geometry={res.iceA} material={res.iceMat} position={[-0.32, FLOOR + 0.3, -0.2]} rotation-y={0.35} renderOrder={2} />
        <mesh geometry={res.iceB} material={res.iceMat} position={[0.3, FLOOR + 0.275, 0.22]} rotation-y={-0.5} renderOrder={2} />
      </group>
      <mesh ref={stream} geometry={res.stream} material={res.liquidMat} position={[-0.45, 0, 0.35]} renderOrder={1} />
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial ref={shadow} map={res.shadow} transparent depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, 0.15]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          ref={glow}
          map={res.glow}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function DrinkScene({ glass }: { glass: Glass }) {
  return (
    <Canvas camera={{ position: [0, 1.9, 5.8], fov: 30 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Studio />
      <directionalLight position={[2, 5, 3]} intensity={1.5} color="#fff1dc" />
      <Rocks glass={glass} />
    </Canvas>
  )
}
