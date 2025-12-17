import { useState, useMemo } from "react";
import { RoundedBox, Cylinder, Box, Float, Text } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";

export function Scene({ config }) {
  const { width, depth, mainColor, patternColor, accentColor } = config;
  const [hovered, setHover] = useState(null);

  // Calculate positions based on config
  const sideOffset = width / 2;
  const backOffset = depth / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[width + 4, depth + 4]} />
        <meshStandardMaterial color="#e8e0d5" roughness={0.3} />
      </mesh>

      {/* --- U-Shape Layout --- */}

      {/* Back Wall Seating (Center) */}
      <MajlisSection 
        position={[0, 0, -backOffset]} 
        rotation={[0, 0, 0]} 
        length={width} 
        colors={{ main: mainColor, pattern: patternColor, accent: accentColor }}
        hovered={hovered} setHover={setHover} name="BACK"
      />

      {/* Left Wall Seating */}
      <MajlisSection 
        position={[-sideOffset, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        length={depth - 0.8} // Subtract corner overlap
        colors={{ main: mainColor, pattern: patternColor, accent: accentColor }}
        hovered={hovered} setHover={setHover} name="LEFT"
      />

      {/* Right Wall Seating */}
      <MajlisSection 
        position={[sideOffset, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        length={depth - 0.8} 
        colors={{ main: mainColor, pattern: patternColor, accent: accentColor }}
        hovered={hovered} setHover={setHover} name="RIGHT"
      />

      {/* Corners (Tall Armrests/Mada'a) */}
      <MadaaCorner position={[-sideOffset, 0, -backOffset]} color={mainColor} pattern={patternColor} />
      <MadaaCorner position={[sideOffset, 0, -backOffset]} color={mainColor} pattern={patternColor} />

      {/* --- Central Decor --- */}
      
      {/* Carpet */}
      <group position={[0, 0.01, 0]}>
        <mesh rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[width - 1, depth - 1]} />
          <meshStandardMaterial color={patternColor} />
        </mesh>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[width - 1.4, depth - 1.4]} />
          <meshStandardMaterial color={mainColor} />
        </mesh>
      </group>

      {/* Central Table */}
      <Table position={[0, 0, 0]} color={accentColor} />

      {/* Floating Title */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.2} floatingRange={[0, 0.1]}>
        <Text 
          position={[0, 2.5, -backOffset]} 
          color={patternColor} 
          fontSize={0.4} 
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

// --- High Detail Components ---

function MajlisSection({ position, rotation, length, colors, hovered, setHover, name }) {
  // Determine how many cushions fit
  const cushionCount = Math.floor(length / 0.9);
  
  return (
    <group position={position} rotation={rotation}>
      <Select enabled={hovered === name}>
        <group 
          onPointerOver={(e) => (e.stopPropagation(), setHover(name))} 
          onPointerOut={() => setHover(null)}
        >
          {/* Base Mattress (Mafranj) */}
          <RoundedBox args={[length, 0.35, 0.9]} radius={0.05} smoothness={4} position={[0, 0.175, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={colors.main} roughness={0.9} />
          </RoundedBox>

          {/* Sadu Pattern Strip on Front of Mattress */}
          <SaduStrip 
            length={length} 
            width={0.2} 
            position={[0, 0.175, 0.455]} 
            rotation={[Math.PI/2, 0, 0]} 
            baseColor={colors.pattern} 
            detailColor="#ffffff" 
          />

          {/* Backrest (Flat Cushions against wall) */}
          <RoundedBox args={[length, 0.5, 0.2]} radius={0.05} smoothness={4} position={[0, 0.6, -0.35]} castShadow>
            <meshStandardMaterial color={colors.main} roughness={0.9} />
          </RoundedBox>

          {/* Intricate Pattern on Backrest */}
          <SaduStrip 
            length={length - 0.2} 
            width={0.3} 
            position={[0, 0.6, -0.245]} 
            rotation={[0, 0, 0]} 
            baseColor={colors.pattern} 
            detailColor={colors.accent} 
          />

          {/* Cylindrical Armrests (Bolsters) placed at intervals */}
          {Array.from({ length: cushionCount + 1 }).map((_, i) => {
            const xPos = -length/2 + (i * (length / cushionCount));
            return (
              <group key={i} position={[xPos, 0.45, 0]}>
                <Cylinder args={[0.12, 0.12, 0.9, 24]} rotation={[Math.PI/2, 0, 0]} castShadow>
                  <meshStandardMaterial color={colors.main} roughness={0.8} />
                </Cylinder>
                {/* Gold Rings on Bolster */}
                <Cylinder args={[0.125, 0.125, 0.05, 24]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.35]}>
                  <meshStandardMaterial color={colors.accent} metalness={0.8} roughness={0.2} />
                </Cylinder>
                <Cylinder args={[0.125, 0.125, 0.05, 24]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, -0.35]}>
                  <meshStandardMaterial color={colors.accent} metalness={0.8} roughness={0.2} />
                </Cylinder>
              </group>
            )
          })}

          {/* Scatter Pillows */}
          {Array.from({ length: cushionCount }).map((_, i) => {
             const xPos = -length/2 + (0.9/2) + (i * 0.9);
             // Alternate pillow colors
             const pColor = i % 2 === 0 ? colors.pattern : colors.accent;
             return <Pillow key={i} position={[xPos, 0.45, 0.1]} rotation={[0.2, 0, 0]} color={pColor} />
          })}

        </group>
      </Select>
    </group>
  );
}

function MadaaCorner({ position, color, pattern }) {
  return (
    <group position={position}>
      {/* Tall Boxy Corner Piece */}
      <RoundedBox args={[0.85, 0.7, 0.85]} radius={0.02} smoothness={4} position={[0, 0.35, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      {/* Pattern Top */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.701, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial color={pattern} />
      </mesh>
      {/* Decorative Object (Lamp base) */}
      <Cylinder args={[0.1, 0.15, 0.4, 8]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#cdcdcd" metalness={0.5} />
      </Cylinder>
    </group>
  )
}

function Table({ position, color }) {
  return (
    <group position={position}>
      {/* Glass Top */}
      <RoundedBox args={[1.2, 0.05, 1.2]} radius={0.05} position={[0, 0.4, 0]}>
        <meshPhysicalMaterial 
          color="white" 
          transmission={0.6} 
          roughness={0} 
          metalness={0} 
          thickness={0.5} 
        />
      </RoundedBox>
      {/* Ornate Base */}
      <Box args={[1, 0.35, 1]} position={[0, 0.175, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      {/* Inner dark box for depth */}
      <Box args={[0.8, 0.36, 0.8]} position={[0, 0.175, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
    </group>
  )
}

function Pillow({ position, rotation, color }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.5, 0.5, 0.15]} radius={0.1} smoothness={8} castShadow>
        <meshStandardMaterial color={color} roughness={1} />
      </RoundedBox>
      {/* Button in middle */}
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

// --- Procedural Sadu Pattern System ---
// Creates a strip of geometry to simulate embroidery without textures
function SaduStrip({ length, width, position, rotation, baseColor, detailColor }) {
  const repeats = Math.floor(length / 0.2); // How many diamonds fits
  
  return (
    <group position={position} rotation={rotation}>
      {/* Background Strip */}
      <mesh>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Geometric Details */}
      {Array.from({ length: repeats }).map((_, i) => {
        const x = -length/2 + (0.2/2) + (i * 0.2);
        return (
          <group key={i} position={[x, 0, 0.001]}>
            {/* Diamond */}
            <mesh rotation={[0, 0, Math.PI/4]}>
              <planeGeometry args={[width * 0.5, width * 0.5]} />
              <meshStandardMaterial color={detailColor} />
            </mesh>
            {/* Small center dot */}
            <mesh position={[0, 0, 0.001]}>
               <circleGeometry args={[width * 0.1, 8]} />
               <meshStandardMaterial color={baseColor} />
            </mesh>
          </group>
        )
      })}
      
      {/* Top and Bottom Lines */}
      <mesh position={[0, width/2 - 0.02, 0.001]}>
        <planeGeometry args={[length, 0.01]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, -width/2 + 0.02, 0.001]}>
        <planeGeometry args={[length, 0.01]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  )
}