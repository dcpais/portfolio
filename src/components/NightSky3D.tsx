import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

type CameraControllerProps = {
  mouseX: number
  mouseY: number
}

const CameraController = ({ mouseX, mouseY }: CameraControllerProps) => {
  const { camera } = useThree()
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const currentPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Convert normalized mouse position (-1 to 1) to camera movement range
    // Adjust the multiplier to control how far the camera moves
    targetPositionRef.current = {
      x: mouseX * 10, // Max 10 units movement in X
      y: mouseY * 10, // Max 10 units movement in Y
    }
  }, [mouseX, mouseY])

  useFrame(() => {
    const easing = 0.08 // Same easing as 2D version
    
    // Smoothly interpolate camera position
    currentPositionRef.current.x += (targetPositionRef.current.x - currentPositionRef.current.x) * easing
    currentPositionRef.current.y += (targetPositionRef.current.y - currentPositionRef.current.y) * easing

    // Update camera position (only x and y, keep z at 0)
    camera.position.x = currentPositionRef.current.x
    camera.position.y = currentPositionRef.current.y
    camera.position.z = 0
  })

  return null
}

type SceneContentProps = {
  mouseX: number
  mouseY: number
}

const SceneContent = ({ mouseX, mouseY }: SceneContentProps) => {
  return (
    <>
      <CameraController mouseX={mouseX} mouseY={mouseY} />
      <ambientLight intensity={0.1} />
      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
      />
    </>
  )
}

const NightSky3D = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5
        
        // Normalize to -1 to 1 range
        const normalizedX = relativeX * 2
        const normalizedY = relativeY * 2
        
        setMouseX(normalizedX)
        setMouseY(normalizedY)
      }
    }

    const handleMouseLeave = () => {
      setMouseX(0)
      setMouseY(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContent mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  )
}

export default NightSky3D

