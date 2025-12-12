"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Dodecahedron, Octahedron, Torus, Environment, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

const GeometricShape = ({ position, color, type }: { position: [number, number, number], color: string, type: 'dodecahedron' | 'octahedron' | 'torus' }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                {type === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
                {type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
                {type === 'torus' && <torusGeometry args={[0.7, 0.2, 16, 32]} />}
                <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} transparent opacity={0.6} />
            </mesh>
        </Float>
    );
};

export const QuizBackground3D = () => {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, 5, -5]} intensity={0.5} color="#ff00ff" />

                {/* Adjusted positions for centered view in the left column */}
                <GeometricShape position={[-2, 3, -2]} color="#00ffff" type="dodecahedron" />
                <GeometricShape position={[2, -3, -1]} color="#8a2be2" type="octahedron" />
                <GeometricShape position={[-3, -2, -3]} color="#ff0080" type="torus" />
                <GeometricShape position={[3, 2, -4]} color="#4facfe" type="dodecahedron" />

                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Center position={[0, 1, -5]}>
                        <Text3D
                            font="/fonts/helvetiker_regular.typeface.json"
                            size={3}
                            height={0.5}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.1}
                            bevelSize={0.05}
                            bevelOffset={0}
                            bevelSegments={5}
                        >
                            QUIZ
                            <meshStandardMaterial color="#00ffff" roughness={0.1} metalness={0.9} />
                        </Text3D>
                    </Center>
                    <Center position={[0, -2, -5]}>
                        <Text3D
                            font="/fonts/helvetiker_regular.typeface.json"
                            size={2}
                            height={0.5}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.05}
                            bevelSize={0.02}
                            bevelOffset={0}
                            bevelSegments={5}
                        >
                            LAB
                            <meshStandardMaterial color="#ff00ff" roughness={0.1} metalness={0.9} />
                        </Text3D>
                    </Center>
                </Float>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
