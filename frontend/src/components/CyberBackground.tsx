import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WireframeGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* A globe-like structure with somewhat detailed wireframe */}
      <icosahedronGeometry args={[2.5, 3]} />
      <meshBasicMaterial color="#00f3ff" wireframe={true} transparent={true} opacity={0.1} />
    </mesh>
  );
};

export const CyberBackground = () => {
  const [shouldRender3D, setShouldRender3D] = useState(true);

  useEffect(() => {
    // Disable 3D on small screens, low concurrency devices, or if reduced motion is preferred
    const isSmallScreen = window.innerWidth < 768;
    const isLowConcurrency = (navigator.hardwareConcurrency || 4) <= 4;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isSmallScreen || isLowConcurrency || prefersReducedMotion) {
      setShouldRender3D(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden mix-blend-screen">
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent blur-3xl"></div>
      {shouldRender3D && (
        <div className="w-[100vw] h-[100vh]">
          <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 1.5]}>
            <WireframeGlobe />
          </Canvas>
        </div>
      )}
    </div>
  );
};
