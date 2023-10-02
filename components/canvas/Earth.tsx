
"use client"
import {Suspense} from 'react'
import {Canvas} from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, useGLTF } from '@react-three/drei'
import CanvasLoader from './Loader';

const Earth = () => {
  const earth = useGLTF('/planet/scene.gltf')
  return (
    <object3D scale={1.9}>
    <primitive object={earth.scene}  position-y={0} rotation-y={0} />
    </object3D>
  )
}

const EarthCanvas = () => {
  return <Canvas 
  shadows
  className="cursor-grab active:cursor-grabbing "
  frameloop='demand' 
  gl={{preserveDrawingBuffer:true}}
  camera={{ fov: 45, near: 0.1, far: 200, position: [-4,0,6] }}
  >
    <directionalLight args={['white', 2]} position={[10, 10, 10]} />
    <directionalLight args={['white', 2]} position={[10, 10, -10]} />
    <directionalLight args={['white', 2]} position={[10, -10, -10]} />
    <directionalLight args={['white', 2]} position={[-10, -10, -10]} />
    <Suspense fallback={<CanvasLoader />} >
      <OrbitControls autoRotate={true} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      <Earth />
    </Suspense>
  </Canvas>
}

export default EarthCanvas







