"use client";

import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
import { useConfigurador } from "@/store/configuradorStore";
import { getGeometria, getMaterial, type Color } from "@/data/configurador";

/** Pixel transparente usado como textura "vacía" (cuando el color no tiene foto). */
const PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const mmM = (v?: number) => (v && v > 0 ? v / 1000 : 0);

/** Material del sobre: foto del acabado (si existe) o color, con brillo/mate. */
function useSobreMaterial(imagen: string | undefined, swatch: string | undefined, brillo: boolean) {
  const tex = useTexture(imagen || PX);
  return useMemo(() => {
    const m = new THREE.MeshStandardMaterial();
    if (imagen) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      m.map = tex;
    } else {
      m.color = new THREE.Color(swatch || "#cccccc");
    }
    m.roughness = brillo ? 0.12 : 0.8;
    m.metalness = 0;
    return m;
  }, [tex, imagen, swatch, brillo]);
}

type Caja = { args: [number, number, number]; pos: [number, number, number] };

function Model({ material }: { material: THREE.Material }) {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const mat = getMaterial(s.materialId);
  if (!geo) return null;

  const th = s.moldura ? (s.molduraGrosorCm ?? 3) / 100 : Math.max((mat?.espesorMm ?? 20) / 1000, 0.02);
  const cajas: Caja[] = [];

  if (geo.id === "l") {
    const aL = mmM(s.medidas.a?.largo);
    const bL = mmM(s.medidas.b?.largo);
    const an = mmM(s.medidas.a?.prof);
    cajas.push({ args: [aL, th, an], pos: [aL / 2, 0, an / 2] });
    cajas.push({ args: [an, th, bL], pos: [aL - an / 2, 0, an + bL / 2] });
  } else if (geo.id === "paralela") {
    const aL = mmM(s.medidas.a?.largo);
    const bL = mmM(s.medidas.b?.largo);
    const an = mmM(s.medidas.a?.prof);
    const gap = 0.4;
    cajas.push({ args: [aL, th, an], pos: [aL / 2, 0, an / 2] });
    cajas.push({ args: [bL, th, an], pos: [bL / 2, 0, an + gap + an / 2] });
  } else {
    const k = geo.tramos[0]?.key ?? "principal";
    const lg = mmM(s.medidas[k]?.largo);
    const an = mmM(s.medidas[k]?.prof);
    cajas.push({ args: [lg, th, an], pos: [lg / 2, 0, an / 2] });
  }

  // Salpicadero: lipa vertical al fondo de la pieza principal.
  if (s.salpicaderoTipo !== "no") {
    const hs = (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;
    if (hs > 0 && cajas[0]) {
      cajas.push({ args: [cajas[0].args[0], hs, 0.02], pos: [cajas[0].pos[0], th / 2 + hs / 2, 0.01] });
    }
  }

  return (
    <group>
      {cajas.map((c, i) => (
        <mesh key={i} material={material} position={c.pos} castShadow receiveShadow>
          <boxGeometry args={c.args} />
        </mesh>
      ))}
    </group>
  );
}

function ModelWrapper({ color, brillo }: { color: Color | undefined; brillo: boolean }) {
  const material = useSobreMaterial(color?.imagen, color?.swatch, brillo);
  return <Model material={material} />;
}

export function SobreViewer3D() {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const mat = getMaterial(s.materialId);
  const color = mat?.colores.find((c) => c.id === s.colorId);
  const k0 = geo?.tramos[0]?.key;
  const hasDims = !!k0 && (s.medidas[k0]?.largo ?? 0) > 0 && (s.medidas[k0]?.prof ?? 0) > 0;

  if (!hasDims) {
    return (
      <div className="flex h-[340px] w-full items-center justify-center rounded-sm border border-stone-beige bg-ivory/40 text-sm text-mineral">
        Ingresá las medidas para ver la vista 3D.
      </div>
    );
  }

  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-sm border border-stone-beige bg-[#f1efe9]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [1.6, 1.2, 1.8], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 7, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.25}>
            <Center>
              <ModelWrapper color={color} brillo={s.acabado === "brillo"} />
            </Center>
          </Bounds>
        </Suspense>
        <ContactShadows position={[0, -0.25, 0]} opacity={0.35} scale={8} blur={2.4} far={3} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={0.8}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
      <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-sm bg-black/40 px-2 py-1 text-[11px] text-white">
        Arrastrá para girar · rueda para acercar
      </span>
    </div>
  );
}
