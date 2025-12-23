import { useState } from "react";
import { RoundedBox, Cylinder, Box, Float, Text, Torus, MeshReflectorMaterial } from "@react-three/drei";
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

  // Shared props
  const commonProps = {
    hovered, setHover,
    colors: { mattress: mattressColor, backrest: backrestColor, armrest: armrestColor, pattern: patternColor },
    patterns: { mattress: mattressPattern, backrest: backrestPattern, armrest: armrestPattern }
  };

  return (
    <group>
      {/* --- High Quality Floor --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={floorColor}
          metalness={0.1}
        />
      </mesh>

      {/* --- Furniture Layout --- */}

      {/* Back Wall Seating */}
      <MajlisSection 
        {...commonProps}
        position={[0, 0, -backOffset]} 
        rotation={[0, 0, 0]} 
        length={width} 
        name="BACK"
      />

      {/* Wall Decor behind Back Seating */}
      <WallDecor position={[0, 2, -backOffset - 0.4]} color={patternColor} />

      {/* Left Wall Seating */}
      <MajlisSection 
        {...commonProps}
        position={[-sideOffset, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        length={depth - 0.85} 
        name="LEFT"
      />

      {/* Right Wall Seating */}
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

      {/* Corner Curtains */}
      <Curtain position={[-sideOffset - 0.5, 2.5, -backOffset - 0.5]} color={mattressColor} />
      <Curtain position={[sideOffset + 0.5, 2.5, -backOffset - 0.5]} color={mattressColor} />

      {/* --- Center Pieces --- */}
      <Table position={[0, 0, 0]} color={patternColor} />
      
      {/* Carpet */}
      <group position={[0, 0.01, 0]}>
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[width - 1.5, depth - 1.5]} />
          <meshStandardMaterial color={mattressColor} roughness={1} />
        </mesh>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[width - 1.8, depth - 1.8]} />
          <meshStandardMaterial color={patternColor} roughness={1} />
        </mesh>
      </group>

      {/* --- TV Unit (Placed opposite the Back seating) --- */}
      <TVUnit 
        position={[0, 0, backOffset + 1.5]} 
        rotation={[0, Math.PI, 0]} 
        baseColor={armrestColor}
        accentColor={patternColor}
      />

      {/* Floating Text */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.1]}>
        <Text 
          position={[0, 3, -backOffset]} 
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

function TVUnit({ position, rotation, baseColor, accentColor }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Media Table Body */}
      <RoundedBox args={[2.5, 0.5, 0.6]} radius={0.05} smoothness={4} position={[0, 0.25, 0]} castShadow>
        <meshStandardMaterial color={baseColor} roughness={0.2} />
      </RoundedBox>
      
      {/* Drawers / Pattern */}
      <mesh position={[0, 0.25, 0.31]}>
        <planeGeometry args={[2.3, 0.4]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Legs */}
      <Cylinder args={[0.04, 0.02, 0.2]} position={[-1.1, 0.1, 0.2]}><meshStandardMaterial color="#333" /></Cylinder>
      <Cylinder args={[0.04, 0.02, 0.2]} position={[1.1, 0.1, 0.2]}><meshStandardMaterial color="#333" /></Cylinder>
      <Cylinder args={[0.04, 0.02, 0.2]} position={[-1.1, 0.1, -0.2]}><meshStandardMaterial color="#333" /></Cylinder>
      <Cylinder args={[0.04, 0.02, 0.2]} position={[1.1, 0.1, -0.2]}><meshStandardMaterial color="#333" /></Cylinder>

      {/* The TV Screen */}
      <group position={[0, 0.85, 0]}>
        {/* Frame */}
        <RoundedBox args={[2.0, 1.1, 0.05]} radius={0.02} smoothness={4} castShadow>
          <meshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
        </RoundedBox>
        {/* Actual Screen (Emissive) */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.9, 1.0]} />
          <meshStandardMaterial color="#000" emissive="#1a2b3c" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Stand Neck */}
        <Box args={[0.2, 0.4, 0.05]} position={[0, -0.6, -0.05]}>
           <meshStandardMaterial color="#111" />
        </Box>
        {/* Stand Base */}
        <Box args={[0.6, 0.02, 0.3]} position={[0, -0.8, -0.05]}>
           <meshStandardMaterial color="#111" />
        </Box>
      </group>
    </group>
  )
}

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
            <RoundedBox args={[length, 0.3, 0.85]}Nm radius={0.02} smoothness={4} castShadow receiveShadow>
              <meshStandardMaterial color={colors.mattress} roughness={0.8} />
            </RoundedBox>
            <Piping args={[length, 0.3, 0.85]} />
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
            <PatternStrip 
              type={patterns.backrest} 
              length={length - 0.2} 
              position={[0, 0, 0.13]} 
              rotation={[0, 0, 0]} 
              color={colors.pattern} 
              scale={0.8}
            />
          </group>

          {/* 3. Armrests & Pillows */}
          {Array.from({ length: count + 1 }).map((_, i) => {
            const xPos = -length/2 + (i * (length / count));
            if (i === count && xPos > length/2 - 0.1) return null;

            return (
              <group key={i} position={[xPos, 0.45, 0]}>
                <RoundedBox args={[0.15, 0.4, 0.8]} radius={0.05} smoothness={4} castShadow>
                   <meshStandardMaterial color={colors.armrest} roughness={0.7} />
                </RoundedBox>
                <mesh position={[0, 0.2, 0]} rotation={[0,0,Math.PI/2]}>
                   <torusGeometry args={[0.08, 0.005, 8, 16]} />
                   <meshStandardMaterial color="white" />
                </mesh>
                <PatternStrip 
                  type={patterns.armrest}
                  length={0.7}
                  position={[0.08, 0, 0]}
                  rotation={[0, Math.PI/2, 0]}
                  color={colors.pattern}
                  scale={0.5}
                />
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

function WallDecor({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.8, 0.9, 4, 1, Math.PI/4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-1.5, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 4, 1, Math.PI/4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[1.5, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 4, 1, Math.PI/4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function Curtain({ position, color }) {
  return (
    <group position={position}>
      <Cylinder args={[0.4, 0.6, 3, 8, 1, true, 0, Math.PI]} rotation={[0, Math.PI/4, 0]} side={2}>
        <meshStandardMaterial color={color} side={2} />
      </Cylinder>
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

// --- Pattern Logic ---
function PatternStrip({ type, length, position, rotation, color, scale = 1 }) {
  const segmentSize = 0.25;
  const repeats = Math.max(1, Math.floor(length / segmentSize));
  
  const Geom = ({ index }) => {
    const x = -(length - 0.1)/2 + (segmentSize/2) + (index * ((length - 0.1) / repeats));
    
    return (
      <group position={[x, 0, 0.002]}>
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
        {type === "Damascus" && (
          <group>
             <mesh position={[0.05, 0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[-0.05, 0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0.05, -0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[-0.05, -0.05, 0]}><circleGeometry args={[0.04, 16]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, 0, 0.001]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="white" /></mesh>
          </group>
        )}
        {type === "Kufic" && (
          <group>
             <mesh position={[-0.05, 0, 0]}><planeGeometry args={[0.04, 0.18]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0.05, 0, 0]}><planeGeometry args={[0.04, 0.18]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, 0.07, 0]}><planeGeometry args={[0.1, 0.04]} /><meshStandardMaterial color={color} /></mesh>
             <mesh position={[0, -0.07, 0]}><planeGeometry args={[0.1, 0.04]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
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
      <mesh>
        <planeGeometry args={[length - 0.1, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {Array.from({ length: repeats }).map((_, i) => <Geom key={i} index={i} />)}
      <mesh position={[0, 0.12, 0.001]}><planeGeometry args={[length, 0.01]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0, -0.12, 0.001]}><planeGeometry args={[length, 0.01]} /><meshStandardMaterial color="white" /></mesh>
    </group>
  )
}