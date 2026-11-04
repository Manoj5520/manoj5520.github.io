/* NASA Blue Marble — continuously rotating Three.js Earth for the Capability Snapshot hero. */
(() => {
  "use strict";

  const stage = document.querySelector(".snapshot-stage");
  const host = document.querySelector(".snapshot-globe");
  const canvas = document.querySelector(".snapshot-earth-webgl");
  if (!stage || !host || !canvas) return;

  const textureUrl = "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg";
  const status = document.querySelector(".snapshot-earth-status");
  const setStatus = (message) => { if (status) status.textContent = message; };

  const fallback = () => {
    host.classList.add("snapshot-earth-fallback");
    setStatus("NASA Earth texture · CSS fallback");
  };

  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js")
    .then((THREE) => {
      if (!host.isConnected || !canvas.isConnected) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0, 3.35);

      const earthGroup = new THREE.Group();
      scene.add(earthGroup);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(
        textureUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          const geometry = new THREE.SphereGeometry(1, 112, 80);
          const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 8,
            specular: new THREE.Color("#193955")
          });
          const earth = new THREE.Mesh(geometry, material);
          earth.rotation.y = -0.22;
          earthGroup.add(earth);

          // A faint night-side limb and blue atmospheric scattering shell.
          const atmosphereGeometry = new THREE.SphereGeometry(1.035, 96, 72);
          const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              varying vec3 vNormal;
              void main() {
                float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
                float glow = pow(rim, 2.65);
                gl_FragColor = vec4(0.24, 0.62, 0.91, glow * 0.46);
              }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
          });
          earthGroup.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

          // Two delicate tilted orbital paths give the Earth a NASA-visualisation feel.
          const makeOrbit = (radius, tilt, color, opacity) => {
            const points = [];
            const segments = 240;
            for (let i = 0; i <= segments; i += 1) {
              const a = (i / segments) * Math.PI * 2;
              points.push(new THREE.Vector3(
                Math.cos(a) * radius,
                Math.sin(a) * radius * 0.42,
                0
              ));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
              color,
              transparent: true,
              opacity,
              depthWrite: false
            });
            const orbit = new THREE.LineLoop(geometry, material);
            orbit.rotation.set(tilt, 0, tilt * 0.22);
            earthGroup.add(orbit);
            return orbit;
          };
          const orbitA = makeOrbit(1.26, 0.84, "#9fd9f5", 0.55);
          const orbitB = makeOrbit(1.34, -0.62, "#c5d9e8", 0.28);

          const ambient = new THREE.AmbientLight("#d5e5f1", 1.0);
          scene.add(ambient);
          const keyLight = new THREE.DirectionalLight("#ffffff", 2.25);
          keyLight.position.set(-3.5, 2.4, 4.5);
          scene.add(keyLight);
          const rimLight = new THREE.DirectionalLight("#75bce8", 0.72);
          rimLight.position.set(3.0, -1.2, -3.5);
          scene.add(rimLight);

          const resize = () => {
            const width = Math.max(1, host.clientWidth);
            const height = Math.max(1, host.clientHeight);
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          };
          const resizeObserver = new ResizeObserver(resize);
          resizeObserver.observe(host);
          resize();

          let frame = 0;
          let lastTime = 0;
          const animate = (time) => {
            frame = requestAnimationFrame(animate);
            const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
            lastTime = time;
            // One full revolution every 58 seconds; smooth, perpetual rotation.
            earth.rotation.y += dt * (Math.PI * 2 / 58);
            orbitA.rotation.z += dt * 0.018;
            orbitB.rotation.z -= dt * 0.012;
            renderer.render(scene, camera);
          };
          const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
              if (!frame) frame = requestAnimationFrame(animate);
            } else if (frame) {
              cancelAnimationFrame(frame);
              frame = 0;
            }
          }, { threshold: 0.01 });
          observer.observe(stage);

          host.classList.add("snapshot-earth-webgl-ready");
          setStatus("NASA Blue Marble · MODIS / Terra · 360° continuous rotation");
          window.addEventListener("pagehide", () => {
            if (frame) cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            renderer.dispose();
            texture.dispose();
            geometry.dispose();
            material.dispose();
            atmosphereGeometry.dispose();
            atmosphereMaterial.dispose();
            orbitA.geometry.dispose();
            orbitA.material.dispose();
            orbitB.geometry.dispose();
            orbitB.material.dispose();
          }, { once: true });
        },
        undefined,
        (error) => {
          console.error("[NASA Earth] Texture failed to load", error);
          fallback();
        }
      );
    })
    .catch((error) => {
      console.error("[NASA Earth] Three.js failed to load", error);
      fallback();
    });
})();
