import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

const NightSky3D = () => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#000000',
    }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Stars
          radius={50}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
        />
      </Canvas>
    </div>
  )
}

export default NightSky3D

