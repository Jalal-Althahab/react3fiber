import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Bvh, OrbitControls, ContactShadows, BakeShadows } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, ToneMapping, Bloom, Vignette } from "@react-three/postprocessing"
import { Scene } from "./Scene"

export const App = () => {
  // Enhanced Configuration State
  const [config, setConfig] = useState({
    width: 4.0,
    depth: 3.5,
    
    // Pattern Selection Per Part
    mattressPattern: "Sadu", 
    backrestPattern: "Royal", 
    armrestPattern: "Najdi",
    
    // Colors
    mattressColor: "#006064", 
    backrestColor: "#004d40", 
    armrestColor: "#00838f",  
    patternColor: "#e0f7fa",  
    floorColor: "#f0f0f0" // Lighter for better reflection
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const patternOptions = [
    { value: "Sadu", label: "Sadu (Diamonds)" },
    { value: "Najdi", label: "Najdi (Triangles)" },
    { value: "Royal", label: "Royal (Islamic Star)" },
    { value: "Damascus", label: "Damascus (Floral)" },
    { value: "Kufic", label: "Kufic (Geometric)" },
    { value: "Modern", label: "Modern (Lines)" },
  ];

  return (
    <>
      {/* HTML Overlay Controls */}
      <div className="controls">
        <h3>Majlis Designer</h3>
        
        <div className="section-title">Dimensions</div>
        <div className="control-group">
          <label>Room Width <span className="value-display">{config.width}m</span></label>
          <input type="range" min="3" max="6" step="0.1" value={config.width} onChange={(e) => handleChange('width', parseFloat(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Room Depth <span className="value-display">{config.depth}m</span></label>
          <input type="range" min="3" max="6" step="0.1" value={config.depth} onChange={(e) => handleChange('depth', parseFloat(e.target.value))} />
        </div>

        <div className="section-title">Engraving Styles</div>
        <div className="control-group">
          <label>Mattress Pattern</label>
          <select value={config.mattressPattern} onChange={(e) => handleChange('mattressPattern', e.target.value)}>
            {patternOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Backrest Pattern</label>
          <select value={config.backrestPattern} onChange={(e) => handleChange('backrestPattern', e.target.value)}>
            {patternOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Armrest Pattern</label>
          <select value={config.armrestPattern} onChange={(e) => handleChange('armrestPattern', e.target.value)}>
            {patternOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div className="section-title">Colors</div>
        <div className="control-group">
          <label>Fabric Color (Base)</label>
          <input type="color" value={config.mattressColor} onChange={(e) => handleChange('mattressColor', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Pattern Embroidery Color</label>
          <input type="color" value={config.patternColor} onChange={(e) => handleChange('patternColor', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Floor Marble Tint</label>
          <input type="color" value={config.floorColor} onChange={(e) => handleChange('floorColor', e.target.value)} />
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [6, 5, 8], fov: 35, near: 0.1, far: 40 }}>
        <color attach="background" args={['#fdfcf5']} />
        
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <Environment preset="city" />
        <BakeShadows />

        <Bvh firstHitOnly>
          <group position={[0, -0.5, 0]}>
            <Scene config={config} />
            {/* Added shadow specifically for small objects, floor handles reflections */}
            <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.4} far={1.5} color="#000" />
          </group>
        </Bvh>

        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          maxDistance={20}
          minDistance={2}
          target={[0, 0.5, 0]}
          enableDamping={true}
        />

        <Effects />
      </Canvas>
    </>
  )
}

function Effects() {
  return (
    <EffectComposer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.5} intensity={1.5} />
      <Bloom luminanceThreshold={1.1} mipmapBlur intensity={0.4} radius={0.5} />
      <TiltShift2 samples={5} blur={0.03} />
      <ToneMapping />
      <Vignette eskil={false} offset={0.1} darkness={0.4} />
    </EffectComposer>
  )
}