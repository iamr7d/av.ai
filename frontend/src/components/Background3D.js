import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = ({ position, size, color, speed, distort = 0.4, segments = 32 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.2;
      ref.current.rotation.z = state.clock.getElapsedTime() * (speed * 0.2);
      ref.current.rotation.x = state.clock.getElapsedTime() * (speed * 0.1);
    }
  });
    return (
    <Sphere ref={ref} args={[size, segments, segments]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed * 2}
        roughness={0.4}
        metalness={0.2}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
};

// GlassCube component for more variety
const GlassCube = ({ position, size, color, rotation }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.003 * rotation;
      ref.current.rotation.y += 0.005 * rotation;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0}
        transmission={0.9}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Hexagonal Prism component
const HexagonalPrism = ({ position, size, color, rotationSpeed = 0.002 }) => {
  const ref = useRef();
  
  // Create hexagon geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const radius = size;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    
    const extrudeSettings = {
      steps: 1,
      depth: size * 0.5,
      bevelEnabled: true,
      bevelThickness: size * 0.1,
      bevelSize: size * 0.1,
      bevelSegments: 3
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [size]);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed;
      ref.current.rotation.y += rotationSpeed * 1.5;
    }
  });
  
  return (
    <mesh ref={ref} position={position} geometry={geometry}>
      <meshPhysicalMaterial 
        color={color} 
        metalness={0.5}
        roughness={0.2}
        transmission={0.6}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Floating Ring component
const FloatingRing = ({ position, radius, tubeRadius, color, rotationSpeed = 0.001 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * rotationSpeed * 2) * 0.5;
      ref.current.rotation.y += rotationSpeed;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, tubeRadius, 16, 32]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.3}
        roughness={0.1}
        transmission={0.5}
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Dodecahedron component - new complex shape
const DodecahedronShape = ({ position, radius, color, speed = 0.002 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += speed;
      ref.current.rotation.y += speed * 0.7;
      ref.current.rotation.z += speed * 0.5;
      // Add slight oscillation in position
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <dodecahedronGeometry args={[radius, 0]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        transmission={0.4}
        transparent
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Icosahedron component - another complex shape
const IcosahedronShape = ({ position, radius, color, speed = 0.003 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.8;
      ref.current.rotation.y += speed * 1.2;
      // Add slight oscillation in position
      ref.current.position.x = position[0] + Math.cos(state.clock.getElapsedTime() * 0.8) * 0.15;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[radius, 0]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.4}
        roughness={0.3}
        transmission={0.5}
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

// Octahedron component - yet another complex shape
const OctahedronShape = ({ position, radius, color, speed = 0.004 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += speed * 0.6;
      ref.current.rotation.z += speed * 1.1;
      // Add slight oscillation in position
      ref.current.position.z = position[2] + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.2;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[radius, 0]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.5}
        roughness={0.2}
        transmission={0.6}
        transparent
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Double Helix component - DNA-like structure
const DoubleHelix = ({ position, width = 2, height = 3, color1 = "#6366f1", color2 = "#ec4899", segments = 20, radius = 0.08 }) => {
  const group = useRef();
  const points1 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 4; // 2 complete rotations
      const x = Math.sin(angle) * width / 2;
      const y = (i / segments) * height - height / 2;
      const z = Math.cos(angle) * width / 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [width, height, segments]);
  
  const points2 = useMemo(() => {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 4 + Math.PI; // 2 complete rotations, offset by half
      const x = Math.sin(angle) * width / 2;
      const y = (i / segments) * height - height / 2;
      const z = Math.cos(angle) * width / 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [width, height, segments]);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group ref={group} position={position}>
      {points1.map((point, i) => (
        <mesh key={`helix1-${i}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[radius, 8, 8]} />
          <meshStandardMaterial color={color1} emissive={color1} emissiveIntensity={0.2} />
        </mesh>
      ))}
      
      {points2.map((point, i) => (
        <mesh key={`helix2-${i}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[radius, 8, 8]} />
          <meshStandardMaterial color={color2} emissive={color2} emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
};

// Floating particles effect
const ParticleCloud = ({ count = 100, size = 0.02, spread = 20 }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread - 5;
      temp.push({ position: [x, y, z], color: new THREE.Color(
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7,
        0.3 + Math.random() * 0.7
      )});
    }
    return temp;
  }, [count, spread]);
  
  return particles.map((particle, i) => (
    <mesh key={i} position={particle.position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={particle.color} transparent opacity={0.6} />
    </mesh>
  ));
};

// Scene setup component
const Scene = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Slowly move the camera
    const interval = setInterval(() => {
      camera.position.x = Math.sin(Date.now() / 10000) * 2;
      camera.position.y = Math.sin(Date.now() / 15000) * 1;
      camera.lookAt(0, 0, 0);
    }, 50);
    
    return () => clearInterval(interval);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#6366f1" />
      <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={0.5} color="#ec4899" />
      
      {/* Original spheres */}
      <AnimatedSphere position={[-3.5, 0, -5]} size={1.5} color="#6366f1" speed={0.5} distort={0.5} />
      <AnimatedSphere position={[3, 1.5, -10]} size={2} color="#8b5cf6" speed={0.3} distort={0.3} />
      <AnimatedSphere position={[0, -2, -8]} size={1.8} color="#ec4899" speed={0.4} distort={0.7} />
      <AnimatedSphere position={[-5, 2.5, -12]} size={2.2} color="#10b981" speed={0.2} distort={0.4} />
      <AnimatedSphere position={[5, -1.2, -15]} size={2.5} color="#f59e0b" speed={0.6} distort={0.2} />
      
      {/* Glass cubes */}
      <GlassCube position={[-4, -3, -10]} size={1.5} color="#6366f1" rotation={1} />
      <GlassCube position={[4, 2, -8]} size={1} color="#8b5cf6" rotation={-1.5} />
      <GlassCube position={[0, 3, -12]} size={1.2} color="#ec4899" rotation={0.8} />
      
      {/* Hexagonal prisms */}
      <HexagonalPrism position={[-2, -1, -6]} size={0.8} color="#10b981" rotationSpeed={0.003} />
      <HexagonalPrism position={[3, -2, -9]} size={0.6} color="#6366f1" rotationSpeed={0.002} />
      <HexagonalPrism position={[0, 2, -7]} size={0.7} color="#f59e0b" rotationSpeed={0.0015} />
      
      {/* Floating rings */}
      <FloatingRing position={[-3, 0, -8]} radius={1.2} tubeRadius={0.05} color="#8b5cf6" rotationSpeed={0.0015} />
      <FloatingRing position={[2, 1, -5]} radius={0.8} tubeRadius={0.03} color="#ec4899" rotationSpeed={0.001} />
      <FloatingRing position={[0, -2, -10]} radius={1.5} tubeRadius={0.06} color="#10b981" rotationSpeed={0.002} />
      
      {/* New complex shapes */}
      <DodecahedronShape position={[-2.5, 1.5, -7]} radius={0.7} color="#6366f1" speed={0.002} />
      <DodecahedronShape position={[4, -0.5, -9]} radius={0.5} color="#10b981" speed={0.0015} />
      
      <IcosahedronShape position={[1, -1.5, -6]} radius={0.6} color="#ec4899" speed={0.003} />
      <IcosahedronShape position={[-3.5, -2, -11]} radius={0.8} color="#8b5cf6" speed={0.0025} />
      
      <OctahedronShape position={[2.5, 2.5, -8]} radius={0.55} color="#f59e0b" speed={0.0035} />
      <OctahedronShape position={[-1, 0, -5]} radius={0.4} color="#6366f1" speed={0.004} />
      
      {/* Add a double helix structure */}
      <DoubleHelix position={[0, 0, -15]} width={2.5} height={8} segments={30} radius={0.08} />
      
      {/* Particle cloud */}
      <ParticleCloud count={200} size={0.015} spread={40} />
      
      {/* Stars in the background */}
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={1} />
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

// 3D Background component
const Background3D = () => {
  const mountRef = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // transparent
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Helper to create a random position
    const randomPos = () => [
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 10
    ];

    // Create cubes
    const cubes = [];
    for (let i = 0; i < 7; i++) {
      const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.7
      });
      const cube = new THREE.Mesh(geometry, material);
      const [x, y, z] = randomPos();
      cube.position.set(x, y, z);
      scene.add(cube);
      cubes.push(cube);
    }

    // Create triangles (as tetrahedrons)
    const triangles = [];
    for (let i = 0; i < 7; i++) {
      const geometry = new THREE.TetrahedronGeometry(1.1);
      const material = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        metalness: 0.4,
        roughness: 0.4,
        transparent: true,
        opacity: 0.7
      });
      const triangle = new THREE.Mesh(geometry, material);
      const [x, y, z] = randomPos();
      triangle.position.set(x, y, z);
      scene.add(triangle);
      triangles.push(triangle);
    }

    // Animation loop
    const animate = () => {
      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.005 + i * 0.0007;
        cube.rotation.y += 0.007 + i * 0.0005;
        cube.position.x += Math.sin(Date.now() * 0.0003 + i) * 0.002;
        cube.position.y += Math.cos(Date.now() * 0.0002 + i) * 0.002;
      });
      triangles.forEach((tri, i) => {
        tri.rotation.x += 0.008 + i * 0.0006;
        tri.rotation.y += 0.006 + i * 0.0008;
        tri.position.x += Math.cos(Date.now() * 0.0004 + i) * 0.002;
        tri.position.y += Math.sin(Date.now() * 0.0003 + i) * 0.002;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black opacity-90">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 75 }}>
        <fog attach="fog" args={['black', 10, 50]} />
        <Scene />
      </Canvas>
      <Background3D />
    </div>
  );
};

export default Background;
