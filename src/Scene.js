import { useState } from "react";
import { RoundedBox, Cylinder, Box, Float, Text, Torus } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";

export function Scene({ config }) {
  const { 
    width, depth, 
    mattressPattern, backrestPattern, armrestPattern,
    mattressColor, backrestColor, armrestColor, patternColor, floorColor 
  } = config;
  
  const [hovered, setHover] = useState(null);

  const sideOffset = width / 2;
  const backOffset = depth / 2;

  // Props to pass down to sections
  const commonProps = {
    hovered, setHover,
    colors: { mattress: mattressColor, backrest: backrestColor, armrest: armrestColor, pattern: patternColor },
    patterns: { mattress: mattressPattern, backrest: backrestPattern, armrest: armrestPattern }
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[width + 6, depth + 6]} />
        <meshStandardMaterial color={floorColor} roughness={0.3} />
      </mesh>

      {/* --- Furniture Layout --- */}

      {/* Back Wall */}
      <MajlisSection 
        {...commonProps}
        position={[0, 0, -backOffset]} 
        rotation={[0, 0, 0]} 
        length={width} 
        name="BACK"
      />

      {/* Left Wall */}
      <MajlisSection 
        {...commonProps}
        position={[-sideOffset, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        length={depth - 0.85} 
        name="LEFT"
      />

      {/* Right Wall */}
      <MajlisSection 
        {...commonProps}
        position={[sideOffset, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        length={depth - 0.85} 
        name="RIGHT"
      />

      {/* Corner Towers (Mada'a) */}
      <MadaaTower position={[-sideOffset, 0, -backOffset]} color={armrestColor} pattern={patternColor} />
      <MadaaTower position={[sideOffset, 0, -backOffset]} color={armrestColor} pattern={patternColor} />

      {/* --- Center Pieces --- */}
      <Table position={[0, 0, 0]} color={patternColor} />
      
      {/* Carpet */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width - 1.5, depth - 1.5]} />
        <meshStandardMaterial color={mattressColor} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[width - 1.8, depth - 1.8]} />
        <meshStandardMaterial color={patternColor} roughness={1} />
      </mesh>

      {/* Floating Text */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.1]}>
        <Text 
          position={[0, 2.5, -backOffset]} 
          color={patternColor} 
          fontSize={0.3} 
          font="Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          AL-MAJLIS
        </Text>
      </Float>
    </group>
  );
}

// --- Furniture Components ---

function MajlisSection({ position, rotation, length, colors, patterns, hovered, setHover, name }) {
  const cushionWidth = 0.9;
  const count = Math.floor(length / cushionWidth);
  
  return (
    <group position={position} rotation={rotation}>
      <Select enabled={hovered === name}>
        <group 
          onPointerOver={(e) => (e.stopPropagation(), setHover(name))} 
          onPointerOut={() => setHover(null)}
        >
          {/* 1. Base Mattress */}
          <group position={[0, 0.15, 0]}>
            <RoundedBox args={[length, 0.3, 0.85]} radius={0.02} smoothness={4} castShadow receiveShadow>
              <meshStandardMaterial color={colors.mattress} roughness={0.8} />
            </RoundedBox>
            <Piping args={[length, 0.3, 0.85]} />
            
            {/* Mattress Pattern */}
            <PatternStrip 
              type={patterns.mattress} 
              length={length} 
              position={[0, 0, 0.43]} 
              rotation={[Math.PI/2, 0, 0]} 
              color={colors.pattern} 
            />
          </group>

          {/* 2. Backrest Cushions */}
          <group position={[0, 0.55, -0.25]}>
            <RoundedBox args={[length, 0.5, 0.25]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color={colors.backrest} roughness={0.9} />
            </RoundedBox>
            <Piping args={[length, 0.5, 0.25]} />

            {/* Backrest Pattern */}
            <PatternStrip 
              type={patterns.backrest} 
              length={length - 0.2} 
              position={[0, 0, 0.13]} 
              rotation={[0, 0, 0]} 
              color={colors.pattern} 
              scale={0.8}
            />
          </group>

          {/* 3. Armrests/Dividers */}
          {Array.from({ length: count + 1 }).map((_, i) => {
            const xPos = -length/2 + (i * (length / count));
            if (i === count && xPos > length/2 - 0.1) return null;

            return (
              <group key={i} position={[xPos, 0.45, 0]}>
                <RoundedBox args={[0.15, 0.4, 0.8]}YZ radius={0.05} smoothness={4} castShadow>
                   <meshStandardMaterial color={colors.armrest} roughness={0.7} />
                </RoundedBox>
                {/* Armrest Piping */}
                <mesh position={[0, 0.2, 0]} rotation={[0,0,Math.PI/2]}>
                   <torusGeometry args={[0.08, 0.005, 8, 16]} />
                   <meshStandardMaterial color="white" />
                </mesh>
                
                {/* Armrest Pattern */}
                <PatternStrip 
                  type={patterns.armrest}
                  length={0.7}
                  position={[0.08, 0, 0]}
                  rotation={[0, Math.PI/2, 0]}
                  color={colors.pattern}
                  scale={0.5}
                />

                {/* Pillow */}
                {i < count && (
                  <group position={[0.45, 0, 0.1]}>
                    <RoundedBox args={[0.45, 0.45, 0.1]} radius={0.1} rotation={[-0.2, 0, 0]} castShadow>
                      <meshStandardMaterial color={i % 2 === 0 ? colors.pattern : colors.armrest} />
                    </RoundedBox>
                  </group>
                )}
              </group>
            )
          })}

        </group>
      </Select>
    </group>
  );
}

function MadaaTower({ position, color, pattern }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.85, 0.75, 0.85]} radius={0.02} smoothness={4} position={[0, 0.375, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      <Piping args={[0.85, 0.75, 0.85]} />
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.76, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color={pattern} />
      </mesh>
    </group>
  )
}

function Table({ position, color }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.2, 0.35, 1.2]} radius={0.05} position={[0, 0.175, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI/2,0,0]}>
         <planeGeometry args={[1,1]} />
         <meshStandardMaterial color="#111" roughness={0.1} />
      </mesh>
    </group>
  )
}

function Piping({ args }) {
  const [w, h, d] = args;
  const t = 0.008;
  const color = "#fff"; 
  return (
    <group>
      <mesh position={[0, h/2, d/2]}><boxGeometry args={[w, t, t]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, h/2, -d/2]}><boxGeometry args={[w, t, t]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[w/2, h/2, 0]}><boxGeometry args={[t, t, d]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-w/2, h/2, 0]}><boxGeometry args={[t, t, d]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  )
}

// --- Enhanced Pattern System (Tattoos) ---
function PatternStrip({ type, length, position, rotation, color, scale = 1 }) {
  const segmentSize = 0.25;
  const repeats = Math.max(1, Math.floor(length / segmentSize));
  
  // Helper for geometry creation inside the loop
  const Geom = ({ index }) => {
    const x = -(length - 0.1)/2 + (segmentSize/2) + (index * ((length - 0.1) / repeats));
    
    return (
      <group position={[x, 0, 0.002]}>
        
        {/* 1. SADU: Traditional Diamond */}
        {type === "Sadu" && (
          <group>
            <mesh rotation={[0, 0, Math.PI/4]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0,0,0.001]} scale={0.5} rotation={[0, 0, Math.PI/4]}>
               <planeGeometry args={[0.15, 0.15]} />
               <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        )}

        {/* 2. NAJDI: Triangles (Sawtooth) */}
        {type === "Najdi" && (
          <group>
            <mesh position={[0, 0.05, 0]}>
               <coneGeometry args={[0.08, 0.15, 3]} rotation={[0,0,0]} />
               <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[0,0,Math.PI]}>
               <coneGeometry args={[0.08, 0.15, 3]} />
               <meshStandardMaterial color={color} />
            </mesh>
          </group>
        )}

        {/* 3. ROYAL: Islamic Star / Octagon */}
        {type === "Royal" && (
          <group>
            <mesh rotation={[0, 0, Math.PI/4]}>
              <circleGeometry args={[0.08, 4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.08, 4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0,0,0.001]}>
               <circleGeometry args={[0.04, 8]} />
               <meshStandardMaterial color="#d4af37" />
            </mesh>
          </group>
        )}

        {/* 4. DAMASCUS: Floral Circles */}
        {type === "Damascus" && (
          <group>
             <mesh position={[0.05, 0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[-0.05, 0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0.05, -0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[-0.05, -0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="white" /></mesh>
          </group>
        )}

        {/* 5. KUFIC: Geometric Squares */}
        {type === "Kufic" && (
          <group>
             <mesh position={[-0.05, 0, 0]}><planeGeometry args={[0.04, 0.18]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0.05, 0, 0]}><planeGeometry args={[0.04, 0.18]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, 0.07, 0]}><planeGeometry args={[0.1, 0.04]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, -0.07, 0]}><planeGeometry args={[0.1, 0.04]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}

        {/* 6. MODERN: Minimal Lines */}
        {type === "Modern" && (
          <group>
             <mesh position={[-0.02, 0, 0]}><planeGeometry args={[0.01, 0.22]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0.02, 0, 0]}><planeGeometry args={[0.01, 0.22]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}

      </group>
    )
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Background Strip */}
      <mesh>
        <planeGeometry args={[length - 0.1, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Generate the selected pattern */}
      {Array.from({ length: repeats }).map((_, i) => <Geom key={i} index={i} />)}
      
      {/* Border Lines */}
      <mesh position={[0, 0.12, 0.001]}><planeGeometry args={[length, 0.01]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0, -0.12, 0.001]}><planeGeometry args={[length, 0.01]} /><meshStandardMaterial color="white" /></mesh>
    </group>
  )
}