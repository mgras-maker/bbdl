import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { 
  MeshDistortMaterial, 
  OrbitControls, 
  Text, 
  Environment, 
  PerspectiveCamera,
  Sparkles,
  shaderMaterial
} from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import { useProcessContext } from '../../context/ProcessContext';
import * as THREE from 'three';
import styled from '@emotion/styled';

// Import tekstury używając bezpośredniej ścieżki względnej
import mPiekneTexture from '/src/assets/images/m_piekne.png';

// Define the container for the 3D canvas
const ProcessCircle3DContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  background: white;
  overflow: hidden;
`;

// Create animated version of MeshDistortMaterial
const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

// Definicja niestandardowego shader materiału
const CityShaderMaterial = shaderMaterial(
  // Uniform variables
  {
    time: 0,
    baseColor: new THREE.Color('#7CC9E8'),
    resolution: new THREE.Vector2(1, 1),
    amplitude: 0.5,
    frequency: 3.0,
  },
  // Vertex shader
  /*glsl*/`
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 baseColor;
    uniform vec2 resolution;
    uniform float amplitude;
    uniform float frequency;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Funkcja do generowania czegoś przypominającego miasto
    float cityPattern(vec2 p) {
      vec2 grid = fract(p * frequency) - 0.5;
      float buildings = abs(grid.x) * abs(grid.y);
      buildings = smoothstep(0.01, 0.05, buildings);
      
      // Dodanie efektu świecących okien
      vec2 windows = fract(p * frequency * 5.0);
      float windowEffect = step(0.8, windows.x) * step(0.8, windows.y);
      
      return mix(buildings, 1.0, windowEffect * 0.5);
    }
    
    void main() {
      // Podstawowy gradient
      vec3 color = baseColor;
      
      // Pozycja UV z dodanym ruchem
      vec2 uv = vUv;
      uv.x += sin(uv.y * 10.0 + time) * amplitude * 0.01;
      
      // Dodanie wzoru miasta
      float cityEffect = cityPattern(uv + vec2(sin(time * 0.2), cos(time * 0.1)) * 0.1);
      color = mix(color, vec3(1.0), cityEffect * 0.3);
      
      // Dodanie świecących punktów
      float glow = pow(sin(time + uv.x * 20.0) * 0.5 + 0.5, 5.0);
      glow *= pow(sin(time * 0.7 + uv.y * 15.0) * 0.5 + 0.5, 3.0);
      color = mix(color, vec3(1.0, 1.0, 1.0), glow * 0.3);
      
      // Animowany świecący pierścień
      float ring = length(vPosition.xy);
      float ringEffect = smoothstep(0.9, 1.0, sin(ring * 10.0 - time) * 0.5 + 0.5);
      color = mix(color, vec3(1.0), ringEffect * 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Rejestrujemy material do użycia w @react-three/fiber
extend({ CityShaderMaterial });

// Definicja hipnotyzującego shader materiału
const HypnoticShaderMaterial = shaderMaterial(
  // Uniform variables
  {
    time: 0,
    baseColor: new THREE.Color('#7CC9E8'),
    pulseSpeed: 1.0,
    noiseIntensity: 0.8,
    ringScale: 5.0,
  },
  // Vertex shader
  /*glsl*/`
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 baseColor;
    uniform float pulseSpeed;
    uniform float noiseIntensity;
    uniform float ringScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Funkcja szumu (simplex noise 3D)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    
    void main() {
      // Podstawowe kolory i efekty
      vec3 color = baseColor;
      
      // Pulsujący efekt
      float pulse = sin(time * pulseSpeed) * 0.5 + 0.5;
      
      // Zniekształcenie pozycji dla szumu
      vec3 noisePos = vPosition * 2.0 + vec3(0.0, 0.0, time * 0.3);
      float noise = snoise(noisePos) * noiseIntensity;
      
      // Spiralne wzory
      vec3 viewDir = normalize(vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      
      // Hipnotyzujące pierścienie
      float rings = sin(length(vPosition.xy) * ringScale - time * 2.0) * 0.5 + 0.5;
      rings *= fresnel;
      
      // Animowane spirale
      float angle = atan(vPosition.y, vPosition.x);
      float spiral = sin(angle * 10.0 + time * 3.0 + length(vPosition.xy) * 5.0) * 0.5 + 0.5;
      spiral *= fresnel * pulse;
      
      // Pulsujące jasne punkty
      float dots = pow(sin(vUv.x * 20.0) * 0.5 + 0.5, 10.0) * pow(sin(vUv.y * 20.0) * 0.5 + 0.5, 10.0);
      dots *= pulse;
      
      // Łączenie efektów
      vec3 finalColor = mix(color, vec3(1.0, 1.0, 1.0), rings * 0.5);
      finalColor = mix(finalColor, vec3(0.9, 0.95, 1.0), spiral * 0.4);
      finalColor = mix(finalColor, vec3(1.0), dots * 0.7);
      finalColor = mix(finalColor, color * 1.5, noise * 0.5);
      
      // Końcowy jasny połysk
      finalColor += fresnel * pulse * vec3(0.3, 0.4, 0.5);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Rejestrujemy material do użycia w @react-three/fiber
extend({ HypnoticShaderMaterial });

// Process object component with enhanced materials and lighting
const ProcessObject = ({ position, color, hoverColor, title, stageIndex, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Make colors more vibrant
  const enhanceColor = (hex) => {
    const color = new THREE.Color(hex);
    color.multiplyScalar(1.5); // Makes colors more vibrant
    return color;
  };
  
  const enhancedBaseColor = enhanceColor(color);
  // Nie używamy już hoverColor
  
  // More energetic rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      // More intense rotation in normal state
      const amplitude = hovered ? 0.4 : 0.3; // Increased base amplitude, even more on hover
      const speed = hovered ? 0.2 : 0.15; // Faster animation, even faster on hover
      
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * speed) * amplitude;
      meshRef.current.rotation.y += hovered ? 0.004 : 0.003; // Faster continuous rotation
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * speed * 0.8) * amplitude * 0.7;
    }
  });

  // Spring animations with enhanced colors and higher distortion
  const springs = useSpring({
    color: enhancedBaseColor, // Zawsze używamy podstawowego koloru, bez zmiany podczas hovera
    distort: hovered ? 0.65 : 0.45, // Zachowujemy zmianę distortion
    scale: clicked ? 1.15 : hovered ? 1.08 : 1,
    emissiveIntensity: hovered ? 0.8 : 0.4, // Zachowujemy zmianę intensywności emisji
    config: { 
      mass: 3,
      tension: 120,
      friction: 45,
      clamp: false,
      duration: 800
    }
  });

  // Handle interaction
  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
    onClick(stageIndex);
  };

  return (
    <group position={position}>      
      {/* Main object */}
      <animated.mesh 
        ref={meshRef}
        scale={springs.scale}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.5, 64, 32]} />
        <AnimatedMeshDistortMaterial
          ref={materialRef}
          speed={2} 
          distort={springs.distort}
          color={springs.color}
          envMapIntensity={hovered ? 3 : 2} // Zwiększone odbicie w stanie hover
          metalness={hovered ? 0.5 : 0.3} // Zwiększona metaliczność w stanie hover
          roughness={hovered ? 0.1 : 0.2} // Zmniejszona chropowatość w stanie hover
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={springs.color}
          emissiveIntensity={springs.emissiveIntensity}
          transparent={true}
        />
      </animated.mesh>
      
      {/* Text with standard styling */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.5}
        color={enhancedBaseColor}
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      
      {/* Subtle particle effects */}
      <Sparkles 
        count={hovered ? 80 : 50} // Więcej cząsteczek w stanie hover
        scale={[3, 3, 3]} 
        position={[0, 0, 0]} 
        size={hovered ? 0.6 : 0.5} // Większe cząsteczki w stanie hover
        speed={hovered ? 0.3 : 0.2} // Szybsze cząsteczki w stanie hover
        color={enhancedBaseColor} 
      />
    </group>
  );
};

// Main scene component
const ProcessScene = () => {
  const { goToStage, STAGES } = useProcessContext();
  
  // Stage colors with more vibrant versions
  const stageColors = {
    empathy: '#7CC9E8',     // miasto piękne - sky blue
    reasoning: '#FCC900',   // miasto dostępne - golden yellow
    materialization: '#F85974'  // miasto kreatywne - coral pink
  };
  
  // Even brighter versions of the colors for hover states
  const stageHoverColors = {
    empathy: '#A0DFFF',     // brighter sky blue
    reasoning: '#FFE055',   // brighter golden yellow
    materialization: '#FF7A93'  // brighter coral pink
  };
  
  // Handle stage selection
  const handleStageSelect = (stageIndex) => {
    const stages = [STAGES.EMPATHY, STAGES.REASONING, STAGES.MATERIALIZATION];
    goToStage(stages[stageIndex]);
  };

  return (
    <>
      {/* Reduced ambient lighting for black background */}
      <ambientLight intensity={0.2} />
      
      {/* Subtle directional lights */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5} 
        color="#ffffff"
      />
      
      {/* Colored accent lights for each object - key lighting elements now */}
      <pointLight position={[-7, 0, 5]} intensity={1.5} color="#7CC9E8" distance={20} />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#FCC900" distance={20} />
      <pointLight position={[7, 0, 5]} intensity={1.5} color="#F85974" distance={20} />
      
      {/* Three objects with wider spacing */}
      <ProcessObject 
        position={[-7, 0, 0]} 
        color={stageColors.empathy}
        hoverColor={stageHoverColors.empathy}
        title="miasto piękne"
        stageIndex={0}
        onClick={handleStageSelect}
      />
      
      <ProcessObject 
        position={[0, 0, 0]} 
        color={stageColors.reasoning}
        hoverColor={stageHoverColors.reasoning}
        title="miasto dostępne"
        stageIndex={1}
        onClick={handleStageSelect}
      />
      
      <ProcessObject 
        position={[7, 0, 0]} 
        color={stageColors.materialization}
        hoverColor={stageHoverColors.materialization}
        title="miasto kreatywne"
        stageIndex={2}
        onClick={handleStageSelect}
      />
      
      {/* Enhanced camera with wider field of view */}
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 18]} 
        fov={40}
      />
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        rotateSpeed={0.3}
        dampingFactor={0.1}
        enableDamping={true}
        minPolarAngle={Math.PI / 2 - 0.3}
        maxPolarAngle={Math.PI / 2 + 0.3}
      />
    </>
  );
};

// Main exported component
const ProcessCircle3D = () => {
  return (
    <ProcessCircle3DContainer id="3d-process">
      <Canvas
        dpr={[1.5, 2]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ background: 'black' }}
      >
        <Suspense fallback={null}>
          <ProcessScene />
        </Suspense>
      </Canvas>
    </ProcessCircle3DContainer>
  );
};

// Export the component as default
export default ProcessCircle3D;