"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Brain() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Rotate the brain
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = time * 0.05;

    // Pulse effect when hovered
    const scale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[1, 64, 64]} // Increased segments
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={1.2}
      >
        <MeshDistortMaterial
          color={hovered ? "#00ffff" : "#8a2be2"}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
      <Sparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color="#00ffff" />
    </group>

  );
}

const Brain3D = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a2be2" />
        <Brain />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Brain3D;
