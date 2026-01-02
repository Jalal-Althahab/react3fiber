import { useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Bvh, OrbitControls, ContactShadows, BakeShadows, SoftShadows, Lightformer } from "@react-three/drei"
import { EffectComposer, N8AO, TiltShift2, ToneMapping, Bloom, Vignette, Noise } from "@react-three/postprocessing"
import { Scene } from "./Scene"

export const App = () => {
  // --- 1. CONFIGURATION STATE (Design) ---
  const [config, setConfig] = useState({
    width: 4.5,
    depth: 4.0,
    mattressPattern: "Royal", 
    backrestPattern: "Sadu", 
    armrestPattern: "Najdi",
    mattressColor: "#1c2e4a",
    backrestColor: "#16253b",
    armrestColor: "#111b2b",
    embroideryColor: "#d4af37",
    woodColor: "#2c1a1a",
    floorColor: "#f5f5f5",
    wallColor: "#222222",
    clockColor: "#d4af37"
  });

  // --- 2. ACCOUNTING STATE (Costs) ---
  const [costs, setCosts] = useState({
    fabricPrice: 25.00, // per meter
    threadPrice: 0.50,  // per meter
    foamPrice: 150.00,  // per cubic meter
    laborCost: 500.00,  // flat rate
    woodPrice: 40.00    // per linear meter
  });

  // --- 3. CALCULATION ENGINE ---
  const stats = useMemo(() => {
    // Linear Meters calculation
    const cornerWidth = 0.9;
    const linearMeters = config.width + (config.depth - cornerWidth) + (config.depth - cornerWidth);

    // Fabric Estimation (CM & Meters)
    const fabricMeters = linearMeters * 3.5;
    const fabricCM = fabricMeters * 100;

    // Thread Estimation based on Pattern Complexity
    const patternComplexity = {
      "None": 50, "Modern": 200, "Sadu": 450, 
      "Najdi": 400, "Royal": 500, "Greek": 350, 
      "Floral": 480, "Kufic": 420
    };
    const avgComplexity = (patternComplexity[config.mattressPattern] + patternComplexity[config.backrestPattern]) / 2;
    const threadMeters = linearMeters * avgComplexity;

    // Foam Volume
    const foamVolume = linearMeters * 0.4 * 0.85;

    // Financials
    const costFabric = fabricMeters * costs.fabricPrice;
    const costThread = threadMeters * costs.threadPrice;
    const costFoam = foamVolume * costs.foamPrice;
    const costWood = linearMeters * costs.woodPrice;
    const totalCost = costFabric + costThread + costFoam + costWood + costs.laborCost;

    return { linearMeters, fabricCM, fabricMeters, threadMeters, foamVolume, totalCost };
  }, [config, costs]);

  const handleChange = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  const handleCostChange = (key, value) => setCosts(prev => ({ ...prev, [key]: parseFloat(value) }));

  // --- EXPORT FUNCTIONALITY ---
  const handleExportJSON = () => {
    const dataToExport = {
      project: "Majlis Configuration",
      created: new Date().toLocaleString(),
      design: config,
      accounting: costs,
      metrics: stats
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `Majlis_Order_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const patterns = [
    { value: "Sadu", label: "Sadu (Heritage)" },
    { value: "Royal", label: "Royal (Islamic)" },
    { value: "Greek", label: "Greek Key" },
    { value: "Floral", label: "Damascus Floral" },
    { value: "Kufic", label: "Kufic Geo" },
    { value: "Modern", label: "Modern Lines" },
    { value: "None", label: "None" },
  ];

  return (
    <>
      {/* --- RIGHT PANEL: DESIGNER --- */}
      <div className="controls">
        <h3>DESIGN STUDIO</h3>
        
        <div className="section-title">Dimensions (Meters)</div>
        <div className="control-group">
          <label>Width <span>{config.width}m</span></label>
          <input type="range" min="3" max="7" step="0.1" value={config.width} onChange={(e) => handleChange('width', parseFloat(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Length (Depth) <span>{config.depth}m</span></label>
          <input type="range" min="3" max="7" step="0.1" value={config.depth} onChange={(e) => handleChange('depth', parseFloat(e.target.value))} />
        </div>

        <div className="section-title">Pattern Configuration</div>
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

        <div className="section-title">Material Colors</div>
        <div className="control-group">
          <label>Velvet Fabric</label>
          <div className="color-wrapper">
            <input type="color" value={config.mattressColor} onChange={(e) => handleChange('mattressColor', e.target.value)} />
          </div>
        </div>
        <div className="control-group">
          <label>Embroidery Thread</label>
          <div className="color-wrapper">
            <input type="color" value={config.embroideryColor} onChange={(e) => handleChange('embroideryColor', e.target.value)} />
          </div>
        </div>
        <div className="control-group">
          <label>Wood Base</label>
          <div className="color-wrapper">
            <input type="color" value={config.woodColor} onChange={(e) => handleChange('woodColor', e.target.value)} />
          </div>
        </div>
        <div className="control-group">
          <label>Back Wall</label>
          <div className="color-wrapper">
            <input type="color" value={config.wallColor} onChange={(e) => handleChange('wallColor', e.target.value)} />
          </div>
        </div>
        <div className="control-group">
          <label>Clock/Metal</label>
          <div className="color-wrapper">
            <input type="color" value={config.clockColor} onChange={(e) => handleChange('clockColor', e.target.value)} />
          </div>
        </div>
      </div>

      {/* --- LEFT PANEL: ACCOUNTING & FACTORY --- */}
      <div className="dashboard">
        <h3>FACTORY ESTIMATOR</h3>
        
        <div className="section-title">Production Metrics</div>
        <div className="data-row">
          <span className="data-label">Dimensions:</span>
          <span className="data-value">{config.width}m x {config.depth}m</span>
        </div>
        <div className="data-row">
          <span className="data-label">Total Seating Length:</span>
          <span className="data-value highlight">{stats.linearMeters.toFixed(2)} lm</span>
        </div>
        <div className="data-row">
          <span className="data-label">Fabric Required (cm):</span>
          <span className="data-value">{Math.ceil(stats.fabricCM).toLocaleString()} cm</span>
        </div>
        <div className="data-row">
          <span className="data-label">Fabric Required (m):</span>
          <span className="data-value">{stats.fabricMeters.toFixed(2)} m</span>
        </div>
        <div className="data-row">
          <span className="data-label">Embroidery Thread:</span>
          <span className="data-value highlight">{Math.ceil(stats.threadMeters).toLocaleString()} m</span>
        </div>
        <div className="data-row">
          <span className="data-label">Foam Volume:</span>
          <span className="data-value">{stats.foamVolume.toFixed(2)} m³</span>
        </div>

        <div className="section-title">Unit Cost Settings</div>
        <div className="control-group">
          <label>Fabric Price ($/m)</label>
          <input type="number" value={costs.fabricPrice} onChange={(e) => handleCostChange('fabricPrice', e.target.value)} />
        </div>
        <div className="control-group">
          <label>Labor (Flat Rate)</label>
          <input type="number" value={costs.laborCost} onChange={(e) => handleCostChange('laborCost', e.target.value)} />
        </div>

        <div className="total-box">
          <div className="total-row grand-total">
            <span>TOTAL ESTIMATE:</span>
            <span>${stats.totalCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="button-group">
          <button className="btn print-btn" onClick={() => window.print()}>Print BOM</button>
          <button className="btn export-btn" onClick={handleExportJSON}>Export JSON</button>
        </div>
      </div>

      {/* --- 3D SCENE --- */}
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, toneMappingExposure: 1.1 }} camera={{ position: [7, 5, 8], fov: 35 }}>
        <color attach="background" args={['#111']} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.5} intensity={1.5} castShadow shadow-bias={-0.0001} />
        <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={0.5} intensity={0.5} color="#ffdcb4" />
        <pointLight position={[0, 3, 0]} intensity={0.3} color="white" />
        
        <Environment resolution={512}>
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        </Environment>

        <SoftShadows size={15} samples={16} />

        <Bvh firstHitOnly>
          <group position={[0, -0.5, 0]}>
            <Scene config={config} />
            <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={2} color="#000" />
          </group>
        </Bvh>

        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          maxDistance={25}
          minDistance={3}
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
      <N8AO halfRes aoSamples={5} aoRadius={0.2} distanceFalloff={0.5} intensity={2.0} color="black" />
      <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.6} radius={0.4} />
      <TiltShift2 samples={5} blur={0.05} />
      <ToneMapping />
      <Vignette eskil={false} offset={0.05} darkness={0.6} />
      <Noise opacity={0.02} />
    </EffectComposer>
  )
}
