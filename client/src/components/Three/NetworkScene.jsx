import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Sphere,
  Line,
  Points,
  Html,
  Instances,
  Instance,
} from "@react-three/drei";
import * as THREE from "three";
import { authAPI } from "shared/axios/axiosInstance";
import "./NetworkScene.scss";
import { jwtDecode } from "jwt-decode";

// Network Node Component with enhanced interactivity
const NetworkNode = ({
  position,
  type = "alumni",
  size = 1,
  color,
  onClick,
  label,
  data,
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Gentle floating animation with type-specific patterns
    const floatOffset = type === "sarc" ? 0.15 : 0.08;
    const floatSpeed = type === "sarc" ? 1.2 : 0.8;
    meshRef.current.position.y =
      position[1] +
      Math.sin(state.clock.elapsedTime * floatSpeed + position[0]) *
        floatOffset;

    // Rotation based on type
    if (type === "sarc") {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    } else {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }

    // Dynamic scaling
    const targetScale = clicked ? size * 1.4 : hovered ? size * 1.2 : size;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.15
    );
  });

  const nodeColor = useMemo(() => {
    if (type === "alumni") return color || "#2f295f";
    if (type === "student") return color || "#4285f4";
    if (type === "professor") return color || "#34a853";
    if (type === "sarc") return color || "#ea4335";
    return color || "#6b7280";
  }, [type, color]);

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(!clicked);
    if (onClick) onClick(data);
  };

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={nodeColor}
          metalness={type === "sarc" ? 0.9 : 0.7}
          roughness={type === "sarc" ? 0.1 : 0.3}
          emissive={hovered || clicked ? nodeColor : "#000000"}
          emissiveIntensity={
            hovered || clicked ? (type === "sarc" ? 0.4 : 0.2) : 0
          }
        />
      </Sphere>

      {/* Enhanced glowing effects */}
      {(hovered || clicked) && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.7, 32]} />
            <meshBasicMaterial
              color={nodeColor}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.8, size * 2.1, 32]} />
            <meshBasicMaterial
              color={nodeColor}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Label for SARC hub */}
      {type === "sarc" && (
        <Html distanceFactor={8} position={[0, -size * 2, 0]}>
          <div className="node-label sarc-label">
            <div className="label-text">SARC Hub</div>
            <div className="label-subtitle">Alumni Network</div>
          </div>
        </Html>
      )}

      {/* Interactive tooltips */}
      {hovered && type !== "sarc" && (
        <Html distanceFactor={10} position={[0, size + 0.5, 0]}>
          <div className="node-tooltip">
            <div className="tooltip-type">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            {data?.name && <div className="tooltip-name">{data.name}</div>}
            {data?.department && (
              <div className="tooltip-dept">{data.department}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// Enhanced Connection Line with data flow animation
const ConnectionLine = ({ start, end, animated = true, strength = 1 }) => {
  const lineRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (!lineRef.current || !animated) return;

    // Animated line with strength-based opacity
    const baseOpacity = 0.2 + strength * 0.3;
    const material = lineRef.current.material;
    material.opacity =
      baseOpacity + Math.sin(state.clock.elapsedTime * 2 + start[0]) * 0.1;
  });

  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  );

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#4285f4"
      lineWidth={1 + strength}
      transparent
      opacity={0.3}
    />
  );
};

// Enhanced Particle System
const ParticleField = () => {
  const pointsRef = useRef();
  const particlesCount = 300;

  const particles = useMemo(() => {
    const temp = [];
    const colors = [];
    for (let i = 0; i < particlesCount; i++) {
      // Position
      temp.push(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );

      // Colors
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors.push(0.18, 0.16, 0.37); // SARC purple
      } else if (colorChoice < 0.6) {
        colors.push(0.26, 0.52, 0.96); // Blue
      } else {
        colors.push(0.2, 0.66, 0.33); // Green
      }
    }
    return {
      positions: new Float32Array(temp),
      colors: new Float32Array(colors),
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] +=
        Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.002;
      positions[i3 + 1] +=
        Math.cos(state.clock.elapsedTime * 0.3 + i * 0.05) * 0.002;
      positions[i3 + 2] +=
        Math.sin(state.clock.elapsedTime * 0.4 + i * 0.08) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
      />
    </Points>
  );
};

// Instanced renderer for scalable nodes (excluding SARC hub)
const InstancedNodes = React.memo(({ nodes, onClick }) => {
  const alumni = nodes.filter((n) => n.type === "alumni");
  const student = nodes.filter((n) => n.type === "student");
  const professor = nodes.filter((n) => n.type === "professor");
  const [hoverInfo, setHoverInfo] = useState(null);

  const materials = useMemo(
    () => ({
      alumni: new THREE.MeshStandardMaterial({
        color: "#2f295f",
        metalness: 0.7,
        roughness: 0.3,
      }),
      student: new THREE.MeshStandardMaterial({
        color: "#4285f4",
        metalness: 0.7,
        roughness: 0.3,
      }),
      professor: new THREE.MeshStandardMaterial({
        color: "#34a853",
        metalness: 0.7,
        roughness: 0.3,
      }),
      other: new THREE.MeshStandardMaterial({
        color: "#6b7280",
        metalness: 0.7,
        roughness: 0.3,
      }),
    }),
    []
  );
  const materialFor = (type) => materials[type] || materials.other;

  // Render a group of instances for one type
  const InstancesGroup = ({ data, type }) => (
    <Instances limit={data.length} material={materialFor(type)}>
      <sphereGeometry args={[1, 16, 16]} />
      {data.map((n) => (
        <Instance
          key={n.id}
          position={n.position}
          scale={n.size}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(n.data);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoverInfo({ position: n.position, data: n.data, type });
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHoverInfo(null);
            document.body.style.cursor = "default";
          }}
        />
      ))}
    </Instances>
  );

  return (
    <group>
      {alumni.length > 0 && <InstancesGroup data={alumni} type="alumni" />}
      {student.length > 0 && <InstancesGroup data={student} type="student" />}
      {professor.length > 0 && (
        <InstancesGroup data={professor} type="professor" />
      )}

      {hoverInfo && (
        <Html
          distanceFactor={10}
          position={[
            hoverInfo.position[0],
            hoverInfo.position[1] + 1.2,
            hoverInfo.position[2],
          ]}
        >
          <div className="node-tooltip">
            <div className="tooltip-type">
              {hoverInfo.type.charAt(0).toUpperCase() + hoverInfo.type.slice(1)}
            </div>
            {hoverInfo.data?.name && (
              <div className="tooltip-name">{hoverInfo.data.name}</div>
            )}
            {hoverInfo.data?.department && (
              <div className="tooltip-dept">{hoverInfo.data.department}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}, (prev, next) => prev.nodes === next.nodes && prev.onClick === next.onClick);

// Main Network Scene
const NetworkScene = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [users, setUsers] = useState([]);
  const [countsByType, setCountsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stopwatch game state
  const [gameStatus, setGameStatus] = useState("idle"); // idle | running | finished
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState(null);
  const [bestMs, setBestMs] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const gameStatusRef = useRef("idle");
  const handleNodeClickRef = useRef(null);

  // Load best time from localStorage on mount
  useEffect(() => {
    const savedBest = localStorage.getItem("networkGameBestMs");
    if (savedBest) {
      const n = parseInt(savedBest, 10);
      if (!isNaN(n)) setBestMs(n);
    }
  }, []);

  // Timer ticker
  useEffect(() => {
    if (gameStatus === "running") {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 50);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [gameStatus]);

  const startGame = () => {
    setSelectedNode(null);
    setFinalTimeMs(null);
    setElapsedMs(0);
    startTimeRef.current = Date.now();
    setGameStatus("running");
  };

  const stopGame = (finishNow = true) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (finishNow) {
      const total = Date.now() - startTimeRef.current;
      setFinalTimeMs(total);
      setElapsedMs(total);
      // Save best
      if (bestMs == null || total < bestMs) {
        setBestMs(total);
        localStorage.setItem("networkGameBestMs", String(total));
      }
    }
    setGameStatus("finished");
  };

  const formatTime = (ms) => {
    if (ms == null) return "00:00.00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const cc = String(centis).padStart(2, "0");
    return `${mm}:${ss}.${cc}`;
  };

  // Fetch users from Auth service using shared axios
  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Request up to 5000 users, projection handled on server
        const { data } = await authAPI.post("auth-system/v0/user/all", {
          page: 1,
          limit: 100,
          fields: [
            "name",
            "username",
            "userType",
            "email",
            "studentDetails.gradYear",
            "studentDetails.admissionNumber",
            "alumniDetails.gradYear",
            "professorDetails.position",
            "profilePicture.url",
          ],
          sortBy: "updatedAt",
          sortOrder: "desc",
        });
        if (!cancelled && data?.success) {
          setUsers(Array.isArray(data.users) ? data.users : []);
          setCountsByType(data.countsByType || {});
        }
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.error || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  // True 3D spherical layout with multiple distribution layers
  const layout = useMemo(() => {
    // Center plus radius scaling with N
    const N = users.length;
    const baseRadius = Math.min(18, 6 + Math.log2(Math.max(1, N)) * 3);
    const positions = [];
    const nodes = [];

    // Add central SARC hub
    nodes.push({
      id: "sarc-hub",
      position: [0, 0, 0],
      type: "sarc",
      size: 1.6,
      data: {
        name: "SARC Network",
        description: "Student Alumni Relations Cell",
      },
    });

    // Create true 3D spherical distribution with multiple layers
    const layers = 5; // More layers for better 3D distribution
    users.forEach((u, i) => {
      // Distribute across spherical layers
      const layer = (i % layers) + 1;
      const layerRadius = (baseRadius * layer) / layers + 2;

      // Use Fibonacci sphere distribution for even 3D spacing
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
      const theta = goldenAngle * i; // Azimuthal angle
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N); // Polar angle for even distribution

      // Add some controlled randomness based on user type and index
      const typeOffset =
        u.userType === "professor" ? 0.2 : u.userType === "student" ? -0.15 : 0;
      const radiusVariation =
        layerRadius + Math.sin(i * 0.618) * 1.5 + typeOffset * layerRadius;

      // Convert spherical to Cartesian coordinates
      const x = radiusVariation * Math.sin(phi) * Math.cos(theta);
      const y = radiusVariation * Math.cos(phi) + Math.sin(i * 0.37) * 0.8; // Add subtle vertical variation
      const z = radiusVariation * Math.sin(phi) * Math.sin(theta);

      const pos = [x, y, z];
      positions.push(pos);

      const size =
        u.userType === "professor"
          ? 1.1
          : u.userType === "student"
          ? 0.85
          : 1.0;
      nodes.push({
        id: u.id || i + 1,
        position: pos,
        type: u.userType?.toLowerCase?.() || "alumni",
        size,
        data: {
          name: u.name,
          department: u.professorDetails?.position, // closest available field
          batch: u.alumniDetails?.gradYear || u.studentDetails?.gradYear,
          username: u.username,
          email: u.email,
        },
      });
    });

    // Sparse connections: from hub to a sample and between neighbors
    const connections = [];
    // Hub spokes: connect to roughly sqrt(N) nodes capped at 80
    const spokeCount = Math.min(
      80,
      Math.max(12, Math.floor(Math.sqrt(nodes.length)))
    );
    const step = Math.max(1, Math.floor((nodes.length - 1) / spokeCount));
    for (
      let i = 1;
      i < nodes.length && connections.length < spokeCount;
      i += step
    ) {
      connections.push({ from: 0, to: i, strength: 0.6 + (i % 5) * 0.08 });
    }
    // Neighbor ring: every k-th node only
    const neighborStride = Math.max(20, Math.floor(nodes.length / 200)); // about 200 neighbor links max
    for (let i = 1; i < nodes.length - 1; i += neighborStride) {
      connections.push({ from: i, to: i + 1, strength: 0.25 });
    }

    return { nodes, connections };
  }, [users]);

  // Keep a stable click handler using a ref so Instanced components don't need rerenders
  const handleNodeClick = async (nodeData) => {
    setSelectedNode(nodeData);
    console.log("Selected node:", nodeData);
    // Quick local check using decoded token (no network latency)
    const storedToken = localStorage.getItem("token");
    let decoded = null;
    try {
      if (storedToken) decoded = jwtDecode(storedToken);
    } catch (_) {}

    const myEmail = decoded?.email || decoded?.user?.email;
    const myUsername = decoded?.username || decoded?.user?.username;

    const isOwnNodeQuick =
      (myEmail && nodeData?.email && nodeData.email === myEmail) ||
      (myUsername && nodeData?.username && nodeData.username === myUsername);

    if (isOwnNodeQuick) {
      console.log("YAYYYYYYY! Clicked on own node:", nodeData);
      if (gameStatus === "running") stopGame(true);
      return;
    }

    // Fallback to server verification if needed
    try {
      if (storedToken) {
        const response = await authAPI.get("/auth-system/v0/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response?.data?.success) {
          const current_user = response.data.user;
          if (
            (current_user?.email && nodeData?.email === current_user.email) ||
            (current_user?.username &&
              nodeData?.username === current_user.username)
          ) {
            console.log("YAYYYYYYY! Clicked on own node:", nodeData);
            if (gameStatus === "running") stopGame(true);
          }
        } else {
          // If token is invalid, clear it
          localStorage.removeItem("token");
        }
      }
    } catch (err) {
      // ignore network errors for the game logic
    }
  };

  // Update latest game status in a ref so the handler can read fresh value
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  // Keep the latest implementation in a ref, but expose a stable function to children
  useEffect(() => {
    handleNodeClickRef.current = handleNodeClick;
  });

  const handleNodeClickStable = useCallback((nodeData) => {
    if (handleNodeClickRef.current) {
      handleNodeClickRef.current(nodeData);
    }
  }, []);

  const networkData = layout;
  // Ensure stable reference for instanced nodes to preserve raycasting handlers while timer re-renders
  const instancedNodes = useMemo(() => networkData.nodes.slice(1), [networkData]);

  const resetMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <div className="network-scene">
      {error && <div className="network-error">{String(error)}</div>}
      {/* Stopwatch Overlay */}
      <div
        className="stopwatch-overlay"
        style={{
          position: "absolute",
          top: 12,
          right: "40%",
          zIndex: 20,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 10,
          padding: "10px 12px",
          boxShadow: "0 6px 18px rgba(27,31,35,0.08)",
          color: "#111827",
          minWidth: 180,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontVariantNumeric: "tabular-nums",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: 18,
              fontWeight: 700,
              color: gameStatus === "finished" ? "#059669" : "#1f2937",
            }}
            title={
              bestMs != null ? `Best: ${formatTime(bestMs)}` : "No best time yet"
            }
          >
            {formatTime(gameStatus === "running" ? elapsedMs : finalTimeMs ?? elapsedMs)}
          </span>
          {bestMs != null && (
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
              Best: {formatTime(bestMs)}
            </span>
          )}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          {gameStatus !== "running" ? (
            <button
              onClick={startGame}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              title="Start the timer and find your node"
            >
              {gameStatus === "finished" ? "Restart" : "Start"}
            </button>
          ) : (
            <button
              onClick={() => stopGame(false)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f59e0b",
                color: "#111827",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              title="Stop the timer without finishing"
            >
              Stop
            </button>
          )}
          {gameStatus === "running" && (
            <span style={{ fontSize: 12, color: "#6b7280", alignSelf: "center" }}>
              Click your own node to finish
            </span>
          )}
          {gameStatus === "finished" && (
            <span style={{ fontSize: 12, color: "#059669", alignSelf: "center" }}>
              Finished!
            </span>
          )}
        </div>
      </div>
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ background: "transparent" }}
      >
        {/* Enhanced Lighting Setup for better 3D depth perception */}
        <ambientLight intensity={0.4} />
        <pointLight position={[12, 15, 12]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-12, -8, -12]} intensity={1.0} color="#4285f4" />
        <pointLight position={[0, 20, 8]} intensity={0.8} color="#34a853" />
        <pointLight position={[8, -5, 15]} intensity={0.7} color="#ea4335" />
        <spotLight
          position={[0, 25, 0]}
          angle={0.4}
          penumbra={0.6}
          intensity={0.6}
          color="#2f295f"
          castShadow
        />

        {/* Volumetric fog for depth enhancement */}
        <fog attach="fog" args={["#f8fafc", 25, 45]} />

        {/* Background particles */}
        {!resetMotion && <ParticleField />}

        {/* SARC hub as single mesh */}
        {networkData.nodes.slice(0, 1).map((node) => (
          <NetworkNode
            key={node.id}
            position={node.position}
            type={node.type}
            size={node.size}
            data={node.data}
            onClick={handleNodeClickStable}
          />
        ))}

        {/* Instanced nodes for scalability */}
        <InstancedNodes nodes={instancedNodes} onClick={handleNodeClickStable} />

        {/* Network connections */}
        {networkData.connections.map(({ from, to, strength }, index) => {
          // Connections store indices; access nodes by index and guard against undefined
          const startNode = networkData.nodes[from];
          const endNode = networkData.nodes[to];
          if (!startNode || !endNode) return null;

          return (
            <ConnectionLine
              key={index}
              start={startNode.position}
              end={endNode.position}
              strength={strength}
              animated={!resetMotion}
            />
          );
        })}

        {/* Interactive Controls with enhanced 3D navigation */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={!isPaused && !resetMotion}
          autoRotateSpeed={0.4}
          maxDistance={35}
          minDistance={10}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.15}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Enhanced Legend with interaction info */}
      <div className="network-legend">
        <div className="legend-header">
          <h4>SARC Network</h4>
          <button
            className={`pause-btn ${isPaused ? "paused" : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume animation" : "Pause animation"}
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>

        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color sarc"></div>
            <span>SARC Hub</span>
          </div>
          <div className="legend-item">
            <div className="legend-color alumni"></div>
            <span>
              Alumni (
              {countsByType?.ALUMNI ||
                networkData.nodes.filter((n) => n.type === "alumni").length}
              )
            </span>
          </div>
          <div className="legend-item">
            <div className="legend-color professor"></div>
            <span>
              Professors (
              {countsByType?.PROFESSOR ||
                networkData.nodes.filter((n) => n.type === "professor").length}
              )
            </span>
          </div>
          <div className="legend-item">
            <div className="legend-color student"></div>
            <span>
              Students (
              {countsByType?.STUDENT ||
                networkData.nodes.filter((n) => n.type === "student").length}
              )
            </span>
          </div>
        </div>

        <div className="interaction-help">
          <small>Click nodes • Drag to rotate • Scroll to zoom</small>
        </div>
      </div>

      {/* Selected Node Info Panel */}
      {selectedNode && (
        <div className="selected-node-info">
          <div className="info-header">
            <h4>{selectedNode.name}</h4>
            <button onClick={() => setSelectedNode(null)}>×</button>
          </div>
          <div className="info-content">
            {selectedNode.department && (
              <p>
                <strong>Department:</strong> {selectedNode.department}
              </p>
            )}
            {selectedNode.batch && (
              <p>
                <strong>Batch:</strong> {selectedNode.batch}
              </p>
            )}
            {selectedNode.year && (
              <p>
                <strong>Year:</strong> {selectedNode.year}
              </p>
            )}
            {selectedNode.description && (
              <p>
                <strong>About:</strong> {selectedNode.description}
              </p>
            )}
            {selectedNode.email && (
              <p>
                <strong>Email:</strong> {selectedNode.email}
              </p>
            )}
            {selectedNode.username && (
              <p>
                <strong>Username:</strong> {selectedNode.username}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkScene;
