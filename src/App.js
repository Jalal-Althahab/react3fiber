import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Bvh, OrbitControls, ContactShadows, BakeShadows, SoftShadows } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, ToneMapping, Bloom, Vignette, Noise } from "@react-three/postprocessing"
import { Scene } from "./Scene"

export const App = () => {
  const [config, setConfig] = useState({
    // Dimensions
    width: 4.5,
    depth: 4.0,
    
    // Patterns (Tattoos)
    mattressPattern: "Royal", 
    backrestPattern: "Sadu", 
    armrestPattern: "Minimal",
    
    // Colors
    mattressColor: "#1c2e4a", // Royal Blue
    backrestColor: "#16253b", // Dark Blue
    armrestColor: "#111b2b",  // Darkest Blue
    embroideryColor: "#d4af37", // Gold
    woodColor: "#2c1a1a",     // Dark Wood base
    
    // Environment Colors
    floorColor: "#f5f5f5",
    wallColor: "#222222",
    clockColor: "#d4af37"
  });

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const patterns = [
    { value: "Sadu", label: "Sadu (Heritage Diamond)" },
    { value: "Royal", label: "Royal (Islamic Octagon)" },
    { value: "Greek", label: "Versace (Greek Key)" },
    { value: "Floral", label: "Damascus (Floral)" },
    { value: "Minimal", label: "Modern (Linear)" },
    { value: "None", label: "No Pattern (Solid)" },
  ];

  return (
    <>
      <div className="controls">
        <h3>MAJLIS CONFIGURATOR</h3>
        
        <div className="section-title">Room Size</div>
        <div className="control-group">
          <label>Width <span className="value-display">{config.width}m</span></label>
          <input type="range" min="3" max="7" step="0.1" value={config.width} onChange={(e) => handleChange('width', parseFloat(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Depth <span className="value-display">{config.depth}m</span></label>
          <input type="range" min="3" max="7" step="0.1" value={config.depth} onChange={(e) => handleChange('depth', parseFloat(e.target.value))} />
        </div>

        <div className="section-title">Embroidery Patterns</div>
        <div className="control-group">
          <label>Seat Pattern</label>
          <select value={config.mattressPattern} onChange={(e) => handleChange('mattressPattern', e.target.value)}>
            {patterns.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Backrest Pattern</label>
          <select value={config.backrestPattern} onChange={(e) => handleChange('backrestPattern', e.target.value)}>
            {patterns.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Armrest Detail</label>
          <select value={config.armrestPattern} onChange={(e) => handleChange('armrestPattern', e.target.value)}>
            {patterns.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div className="section-title">Fabric Colors</div>
        <div className="control-group">
          <label>Main Seat (Mattress)</label>
          <div className="color-wrapper">
            <input type="color" value={config.mattressColor} onChange={(e) => handleChange('mattressColor', e.target.value)} />
            <span className="color-label">{config.mattressColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Backrest Cushion</label>
          <div className="color-wrapper">
            <input type="color" value={config.backrestColor} onChange={(e) => handleChange('backrestColor', e.target.value)} />
            <span className="color-label">{config.backrestColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Armrest (Mada'a)</label>
          <div className="color-wrapper">
            <input type="color" value={config.armrestColor} onChange={(e) => handleChange('armrestColor', e.target.value)} />
            <span className="color-label">{config.armrestColor}</span>
          </div>
        </div>

        <div className="section-title">Details & Decor</div>
        <div className="control-group">
          <label>Embroidery / Gold</label>
          <div className="color-wrapper">
            <input type="color" value={config.embroideryColor} onChange={(e) => handleChange('embroideryColor', e.target.value)} />
            <span className="color-label">{config.embroideryColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Wood Base</label>
          <div className="color-wrapper">
            <input type="color" value={config.woodColor} onChange={(e) => handleChange('woodColor', e.target.value)} />
            <span className="color-label">{config.woodColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Wall Color</label>
          <div className="color-wrapper">
            <input type="color" value={config.wallColor} onChange={(e) => handleChange('wallColor', e.target.value)} />
            <span className="color-label">{config.wallColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Clock & Table Metal</label>
          <div className="color-wrapper">
            <input type="color" value={config.clockColor} onChange={(e) => handleChange('clockColor', e.target.value)} />
            <span className="color-label">{config.clockColor}</span>
          </div>
        </div>
        <div className="control-group">
          <label>Marble Floor</label>
          <div className="color-wrapper">
            <input type="color" value={config.floorColor} onChange={(e) => handleChange('floorColor', e.target.value)} />
            <span className="color-label">{config.floorColor}</span>
          </div>
        </div>
      </div>

      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, toneMappingExposure: 1.1 }} camera={{ position: [6, 4, 7], fov: 35 }}>
        <color attach="background" args={['#111']} />
        
        {/* Studio Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.5} intensity={1.5} castShadow shadow-bias={-0.0001} />
        <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={0.5} intensity={0.5} color="#ffdcb4" />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="white" />
        
        <Environment preset="lobby" />
        <SoftShadows size={10} samples={16} />

        <Bvh firstHitOnly>
          <group position={[0, -0.5, 0]}>
            <Scene config={config} />
            <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={2} color="#000" />
          </group>
        </Bvh>

        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          maxDistance={18}
          minDistance={3}
          target={[0, 0.8, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <Effects />
      </Canvas>
    </>
  )
}

function Effects() {
  return (
    <EffectComposer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.2} distanceFalloff={0.5} intensity={2.0} color="black" />
      <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.6} radius={0.4} />
      <TiltShift2 samples={5} blur={0.05} />
      <ToneMapping />
      <Vignette eskil={false} offset={0.05} darkness={0.6} />
      <Noise opacity={0.02} />
    </EffectComposer>
  )
}