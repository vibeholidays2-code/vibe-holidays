import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Destination coordinates (lat, lon converted to 3D)
const destinations = [
  { name: 'Bali', lat: -8.3405, lon: 115.092 },
  { name: 'Kashmir', lat: 34.0837, lon: 74.7973 },
  { name: 'Goa', lat: 15.2993, lon: 74.124 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Maldives', lat: 3.2028, lon: 73.2207 },
  { name: 'Thailand', lat: 15.87, lon: 100.9925 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
];

// Convert lat/lon to 3D coordinates
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Load Earth texture
  const earthTexture = useTexture(
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  );

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const destinationPoints = useMemo(() => {
    return destinations.map((dest) => latLonToVector3(dest.lat, dest.lon, 2.52));
  }, []);

  // Create flight arc paths
  const flightPaths = useMemo(() => {
    const paths = [];
    for (let i = 0; i < destinationPoints.length - 1; i++) {
      const start = destinationPoints[i];
      const end = destinationPoints[i + 1];
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(3.5);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      paths.push(points);
    }
    return paths;
  }, [destinationPoints]);

  return (
    <group>
      {/* Main Globe — Realistic Earth */}
      <Sphere ref={globeRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.3}
          metalness={0.05}
          emissive="#667799"
          emissiveIntensity={0.35}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[2.62, 64, 64]}>
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer atmosphere haze */}
      <Sphere args={[2.78, 64, 64]}>
        <meshBasicMaterial
          color="#81d4fa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Orbiting Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FFA726" transparent opacity={0.6} />
      </mesh>

      {/* Destination Dots */}
      {destinationPoints.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#FFA726" />
          {/* Pulsing glow */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#FFA726" transparent opacity={0.3} />
          </mesh>
        </mesh>
      ))}

      {/* Flight Arc Paths */}
      {flightPaths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#14B8A6"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
};

const FloatingGlobe3D = () => {
  return (
    <div className="w-full h-[500px] lg:h-[600px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={2} />
        <pointLight position={[-10, -5, -10]} intensity={0.6} color="#4fc3f7" />
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default FloatingGlobe3D;
