import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Edges,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import { cameraViews } from '../data/cars'
import { createDecalTexture, disposeTexture } from '../lib/textures'

function SurfaceMaterial({ mode, color, glass = false, dark = false }) {
  if (glass) {
    return (
      <meshPhysicalMaterial
        color={mode === 'cute' ? '#bde0fe' : '#101722'}
        roughness={0.08}
        metalness={0.12}
        transmission={mode === 'real' ? 0.62 : 0.12}
        thickness={0.45}
        transparent
        opacity={mode === 'real' ? 0.82 : 0.92}
      />
    )
  }

  if (mode === 'real') {
    return (
      <meshPhysicalMaterial
        color={dark ? '#111318' : color}
        metalness={dark ? 0.7 : 0.58}
        roughness={dark ? 0.33 : 0.2}
        clearcoat={dark ? 0.35 : 1}
        clearcoatRoughness={0.13}
      />
    )
  }

  return <meshToonMaterial color={dark ? (mode === 'cute' ? '#3d405b' : '#12141a') : color} />
}

function Outline({ mode, color = '#111218', threshold = 22 }) {
  if (mode === 'real') return null
  return <Edges threshold={threshold} color={mode === 'cute' ? '#42435a' : color} />
}

function Wheel({ position, radius, width, mode, accent }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, mode === 'cute' ? 20 : 32]} />
        <SurfaceMaterial mode={mode} color="#111318" dark />
        <Outline mode={mode} />
      </mesh>
      <mesh position={[0, width / 2 + 0.012, 0]}>
        <cylinderGeometry args={[radius * 0.57, radius * 0.57, 0.035, 16]} />
        <SurfaceMaterial mode={mode} color={mode === 'cute' ? accent : '#b9c0ca'} />
        <Outline mode={mode} threshold={12} />
      </mesh>
      <mesh position={[0, width / 2 + 0.035, 0]}>
        <cylinderGeometry args={[radius * 0.17, radius * 0.17, 0.045, 12]} />
        <SurfaceMaterial mode={mode} color="#20242c" dark />
      </mesh>
    </group>
  )
}

function HeadLight({ position, rear = false, mode }) {
  return (
    <RoundedBox args={[0.08, 0.16, 0.48]} radius={0.05} smoothness={3} position={position}>
      <meshStandardMaterial
        color={rear ? '#ff334f' : '#eaf7ff'}
        emissive={rear ? '#ff163b' : '#a9e8ff'}
        emissiveIntensity={mode === 'real' ? 4 : 1.5}
        toneMapped={false}
      />
      <Outline mode={mode} threshold={8} />
    </RoundedBox>
  )
}

function StandardBody({ car, mode, paint, texture }) {
  const { body } = car
  const cute = mode === 'cute'
  const roofX = car.type === 'gt' ? -0.35 : car.type === 'classic' ? -0.05 : -0.18
  const wheelRadius = cute ? 0.48 : car.type === 'classic' ? 0.5 : 0.46
  const wheelWidth = cute ? 0.38 : 0.32
  const wheelZ = body.width / 2 + 0.03
  const wheelY = wheelRadius

  return (
    <group scale={cute ? [0.96, 1.08, 1] : 1}>
      <RoundedBox
        args={[body.length, cute ? 0.68 : 0.58, body.width]}
        radius={cute ? 0.24 : 0.18}
        smoothness={5}
        position={[0, 0.67, 0]}
        castShadow
        receiveShadow
      >
        <SurfaceMaterial mode={mode} color={paint} />
        <Outline mode={mode} />
      </RoundedBox>

      <RoundedBox
        args={[body.nose + 0.42, cute ? 0.43 : 0.34, body.width * 0.93]}
        radius={0.16}
        smoothness={4}
        position={[body.length / 2 - body.nose / 2, 0.98, 0]}
        rotation={[0, 0, cute ? -0.04 : -0.075]}
        castShadow
      >
        <SurfaceMaterial mode={mode} color={paint} />
        <Outline mode={mode} />
      </RoundedBox>

      <RoundedBox
        args={[body.cabin, body.cabinHeight, body.width * 0.72]}
        radius={cute ? 0.3 : 0.22}
        smoothness={6}
        position={[roofX, 1.18 + body.cabinHeight / 2, 0]}
        castShadow
      >
        <SurfaceMaterial mode={mode} color={paint} />
        <Outline mode={mode} />
      </RoundedBox>

      <RoundedBox
        args={[body.cabin * 0.71, body.cabinHeight * 0.72, body.width * 0.735]}
        radius={cute ? 0.26 : 0.18}
        smoothness={5}
        position={[roofX + 0.12, 1.21 + body.cabinHeight / 2, 0]}
      >
        <SurfaceMaterial mode={mode} color="#131923" glass />
        <Outline mode={mode} />
      </RoundedBox>

      {car.type === 'roadster' && (
        <mesh position={[-0.16, 1.7, 0]}>
          <boxGeometry args={[1.4, 0.2, body.width * 0.64]} />
          <SurfaceMaterial mode={mode} color="#171b22" dark />
          <Outline mode={mode} />
        </mesh>
      )}

      {['hyper', 'classic'].includes(car.type) && (
        <group position={[-body.length / 2 + 0.48, 1.48, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[0.1, 0.55, body.width * 0.58]} />
            <SurfaceMaterial mode={mode} color="#171a20" dark />
          </mesh>
          <RoundedBox args={[0.22, 0.13, body.width * 0.94]} radius={0.05} smoothness={3}>
            <SurfaceMaterial mode={mode} color={mode === 'cute' ? car.accent : '#16191f'} dark={mode !== 'cute'} />
            <Outline mode={mode} />
          </RoundedBox>
        </group>
      )}

      {[body.wheelbase / 2, -body.wheelbase / 2].flatMap((x) =>
        [wheelZ, -wheelZ].map((z) => (
          <Wheel
            key={`${x}-${z}`}
            position={[x, wheelY, z]}
            radius={wheelRadius}
            width={wheelWidth}
            mode={mode}
            accent={car.accent}
          />
        )),
      )}

      {[body.width * 0.31, -body.width * 0.31].map((z) => (
        <HeadLight key={`front-${z}`} position={[body.length / 2 + 0.025, 0.82, z]} mode={mode} />
      ))}
      {[body.width * 0.31, -body.width * 0.31].map((z) => (
        <HeadLight key={`rear-${z}`} position={[-body.length / 2 - 0.025, 0.83, z]} rear mode={mode} />
      ))}

      <mesh position={[0, 0.83, body.width / 2 + 0.008]}>
        <planeGeometry args={[body.length * 0.76, 0.48]} />
        <meshBasicMaterial map={texture} transparent opacity={mode === 'real' ? 0.68 : 0.92} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.83, -body.width / 2 - 0.008]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[body.length * 0.76, 0.48]} />
        <meshBasicMaterial map={texture} transparent opacity={mode === 'real' ? 0.68 : 0.92} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.32, 0]} receiveShadow>
        <boxGeometry args={[body.length * 0.88, 0.12, body.width * 0.87]} />
        <SurfaceMaterial mode={mode} color="#111318" dark />
      </mesh>
    </group>
  )
}

function TruckBody({ car, mode, paint, texture }) {
  const { body } = car
  const cute = mode === 'cute'
  const wheelRadius = cute ? 0.68 : 0.62
  const wheelZ = body.width / 2 + 0.08

  return (
    <group scale={cute ? [0.96, 1.03, 1] : 1}>
      <RoundedBox args={[body.length, 0.62, body.width]} radius={0.18} smoothness={4} position={[0, 0.68, 0]} castShadow>
        <SurfaceMaterial mode={mode} color={paint} />
        <Outline mode={mode} />
      </RoundedBox>
      <RoundedBox args={[2.08, 1.52, body.width * 0.88]} radius={0.25} smoothness={5} position={[0.82, 1.56, 0]} castShadow>
        <SurfaceMaterial mode={mode} color={paint} />
        <Outline mode={mode} />
      </RoundedBox>
      <RoundedBox args={[1.42, 0.72, body.width * 0.9]} radius={0.16} smoothness={4} position={[1.16, 1.78, 0]}>
        <SurfaceMaterial mode={mode} color="#141b26" glass />
        <Outline mode={mode} />
      </RoundedBox>
      <RoundedBox args={[2.25, 0.42, body.width * 0.88]} radius={0.12} smoothness={3} position={[-1.55, 1.12, 0]} castShadow>
        <SurfaceMaterial mode={mode} color="#15181e" dark />
        <Outline mode={mode} />
      </RoundedBox>
      <group position={[-2.1, 2.0, 0]}>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.12, 0.88, body.width * 0.62]} />
          <SurfaceMaterial mode={mode} color="#15181e" dark />
        </mesh>
        <RoundedBox args={[0.32, 0.16, body.width * 1.08]} radius={0.05} smoothness={3}>
          <SurfaceMaterial mode={mode} color={car.accent} />
          <Outline mode={mode} />
        </RoundedBox>
      </group>
      {[body.wheelbase / 2, -body.wheelbase / 2].flatMap((x) =>
        [wheelZ, -wheelZ].map((z) => (
          <Wheel key={`${x}-${z}`} position={[x, wheelRadius, z]} radius={wheelRadius} width={0.42} mode={mode} accent={car.accent} />
        )),
      )}
      <mesh position={[0, 0.91, body.width / 2 + 0.009]}>
        <planeGeometry args={[body.length * 0.78, 0.58]} />
        <meshBasicMaterial map={texture} transparent opacity={0.94} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.91, -body.width / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[body.length * 0.78, 0.58]} />
        <meshBasicMaterial map={texture} transparent opacity={0.94} depthWrite={false} />
      </mesh>
      {[body.width * 0.31, -body.width * 0.31].map((z) => (
        <HeadLight key={`truck-front-${z}`} position={[body.length / 2 + 0.02, 0.9, z]} mode={mode} />
      ))}
    </group>
  )
}

function Vehicle({ car, mode, colorIndex, autoRotate }) {
  const group = useRef()
  const paint = car.colors[colorIndex % car.colors.length]
  const texture = useMemo(() => createDecalTexture(car.decal, car.accent), [car.decal, car.accent])

  useEffect(() => () => disposeTexture(texture), [texture])

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.16
  })

  return (
    <group ref={group} rotation={[0, -0.62, 0]} position={[0, -0.08, 0]}>
      {car.type === 'truck' ? (
        <TruckBody car={car} mode={mode} paint={paint} texture={texture} />
      ) : (
        <StandardBody car={car} mode={mode} paint={paint} texture={texture} />
      )}
    </group>
  )
}

function CameraRig({ view }) {
  const { camera } = useThree()
  const destination = useRef(new THREE.Vector3(...cameraViews.hero.position))
  const moving = useRef(false)

  useEffect(() => {
    destination.current.set(...cameraViews[view].position)
    moving.current = true
  }, [view])

  useFrame(() => {
    if (!moving.current) return
    camera.position.lerp(destination.current, 0.075)
    camera.lookAt(0, 0.85, 0)
    if (camera.position.distanceTo(destination.current) < 0.03) moving.current = false
  })

  return null
}

function Studio({ car, mode, colorIndex, autoRotate, view, night }) {
  const bg = night ? '#06070a' : mode === 'cute' ? '#eaf2ff' : '#d8d9dc'
  const floor = night ? '#101218' : mode === 'cute' ? '#dce8f7' : '#bfc1c5'

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 11, 26]} />
      <ambientLight intensity={night ? 0.55 : 1.1} />
      <directionalLight
        castShadow
        position={[6, 9, 7]}
        intensity={night ? 3.6 : 4.8}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight position={[-7, 5, -2]} intensity={night ? 80 : 45} angle={0.5} penumbra={0.7} color={car.accent} />
      <spotLight position={[3, 3, -7]} intensity={night ? 55 : 30} angle={0.55} penumbra={0.8} color="#8ac7ff" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={2} position={[5, 2, 1]} rotation={[0, Math.PI / 2, 0]} scale={[5, 2, 1]} />
        <Lightformer form="ring" intensity={2} position={[-4, 3, 2]} scale={2} />
      </Environment>
      <Vehicle car={car} mode={mode} colorIndex={colorIndex} autoRotate={autoRotate} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <circleGeometry args={[10, 96]} />
        <meshStandardMaterial color={floor} roughness={0.76} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.105, 0]}>
        <ringGeometry args={[4.2, 4.24, 96]} />
        <meshBasicMaterial color={car.accent} transparent opacity={night ? 0.62 : 0.25} />
      </mesh>
      <ContactShadows position={[0, -0.1, 0]} opacity={night ? 0.68 : 0.38} scale={12} blur={2.5} far={5} />
      {night && <Sparkles count={38} scale={[12, 5, 12]} size={1.4} speed={0.22} opacity={0.35} />}
      <CameraRig view={view} />
      <OrbitControls
        makeDefault
        target={[0, 0.9, 0]}
        enablePan={false}
        minDistance={5.6}
        maxDistance={13}
        minPolarAngle={0.42}
        maxPolarAngle={Math.PI / 2.02}
        autoRotate={false}
      />
    </>
  )
}

export default function CarScene(props) {
  return (
    <Canvas
      className="car-canvas"
      shadows
      dpr={[1, 1.75]}
      camera={{ position: cameraViews.hero.position, fov: 34, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
    >
      <Studio {...props} />
    </Canvas>
  )
}
