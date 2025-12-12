"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text3D, Center, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

const InteractiveShape = ({ position, color }: { position: [number, number, number], color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.3 + (hovered ? 1 : 0);
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={meshRef}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <dodecahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial
                    color={hovered ? "#ff0080" : color}
                    roughness={0.1}
                    metalness={0.8}
                    transparent
                    opacity={0.8}
                    wireframe={hovered}
                />
            </mesh>
        </Float>
    );
};

const RotatingTorus = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.1;
        meshRef.current.rotation.y = time * 0.1;
    });

    return (
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={[0, 0, -10]} scale={[10, 10, 10]}>
                <torusGeometry args={[1, 0.02, 16, 100]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.1} wireframe />
            </mesh>
        </Float>
    )
}

export const QuizCompleted3D = () => {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-black">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, 5, -5]} intensity={0.5} color="#ff00ff" />
                <spotLight position={[0, 10, 0]} intensity={1} angle={0.5} penumbra={1} color="#ffffff" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={12} size={6} speed={0.4} opacity={0.5} color="#00ffff" />

                <InteractiveShape position={[-5, 2, -2]} color="#00ffff" />
                <InteractiveShape position={[5, -2, -2]} color="#8a2be2" />
                <RotatingTorus />

                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Center position={[0, 1.5, 0]}>
                        <Text3D
                            font="/fonts/helvetiker_regular.typeface.json"
                            size={2.5}
                            height={0.2}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.1}
                            bevelSize={0.05}
                            bevelOffset={0}
                            bevelSegments={5}
                        >
                            NICE
                            <meshStandardMaterial color="#00ffff" roughness={0.1} metalness={0.9} />
                        </Text3D>
                    </Center>
                    <Center position={[0, -1.5, 0]}>
                        <Text3D
                            font="/fonts/helvetiker_regular.typeface.json"
                            size={2.5}
                            height={0.2}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.1}
                            bevelSize={0.05}
                            bevelOffset={0}
                            bevelSegments={5}
                        >
                            WORK
                            <meshStandardMaterial color="#ff00ff" roughness={0.1} metalness={0.9} />
                        </Text3D>
                    </Center>
                </Float>

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
