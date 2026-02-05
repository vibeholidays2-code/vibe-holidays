import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SpinningWorld3DAdvancedProps {
  width?: number;
  height?: number;
  className?: string;
}

const SpinningWorld3DAdvanced: React.FC<SpinningWorld3DAdvancedProps> = ({
  width = 400,
  height = 400,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Earth texture (using a simple gradient for now)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;
    
    // Create earth-like texture
    const gradient = context.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#1e3c72');
    gradient.addColorStop(0.5, '#2a5298');
    gradient.addColorStop(1, '#4facfe');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
    
    // Add some continent-like shapes
    context.fillStyle = '#2d5016';
    context.beginPath();
    context.arc(100, 80, 30, 0, Math.PI * 2);
    context.arc(200, 120, 25, 0, Math.PI * 2);
    context.arc(350, 90, 35, 0, Math.PI * 2);
    context.arc(400, 180, 20, 0, Math.PI * 2);
    context.arc(150, 200, 28, 0, Math.PI * 2);
    context.fill();
    
    const earthTexture = new THREE.CanvasTexture(canvas);
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      shininess: 100
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Create airplanes
    const airplanes: THREE.Group[] = [];
    const airplaneGeometry = new THREE.ConeGeometry(0.05, 0.2, 4);
    const airplaneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 3; i++) {
      const airplane = new THREE.Mesh(airplaneGeometry, airplaneMaterial);
      const airplaneGroup = new THREE.Group();
      airplaneGroup.add(airplane);
      
      // Position airplane at different distances and angles
      const radius = 1.5 + i * 0.3;
      airplane.position.set(radius, 0, 0);
      airplane.rotation.z = Math.PI / 2;
      
      // Rotate the group to different starting positions
      airplaneGroup.rotation.y = (i * Math.PI * 2) / 3;
      airplaneGroup.rotation.x = (i - 1) * 0.3;
      
      scene.add(airplaneGroup);
      airplanes.push(airplaneGroup);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate Earth
      earth.rotation.y += 0.005;
      atmosphere.rotation.y += 0.003;

      // Rotate airplanes around Earth
      airplanes.forEach((airplane, index) => {
        airplane.rotation.y += 0.01 + index * 0.002;
        airplane.rotation.x += 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);

  return (
    <div 
      ref={mountRef} 
      className={`spinning-world-3d-advanced ${className}`}
      style={{ width, height }}
    />
  );
};

export default SpinningWorld3DAdvanced;