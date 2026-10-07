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

/** Altura del mueble bajo (m) e inserción respecto al borde del sobre. */
const CAB_H = 0.7;
const INSET = 0.04;

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

/** Grosor del sobre: espesor base + la moldura elegida (para que se note en 3D). */
function useThickness() {
  const moldura = useConfigurador((s) => s.moldura);
  const grosor = useConfigurador((s) => s.molduraGrosorCm);
  const materialId = useConfigurador((s) => s.materialId);
  const base = Math.max((getMaterial(materialId)?.espesorMm ?? 20) / 1000, 0.02);
  return base + (moldura ? (grosor ?? 0) / 100 : 0);
}

/** Losa (sobre) con grosor th; la base queda en position[1]. */
function Losa({
  args,
  position,
  material,
}: {
  args: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <mesh position={[position[0], position[1] + args[1] / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  );
}

/** Mueble bajo (alusivo): caja bajo el sobre, apoyada en el piso (y=0). */
function Mueble({
  w,
  d,
  position,
  material,
}: {
  w: number;
  d: number;
  position: [number, number, number];
  material: THREE.Material;
}) {
  const iw = Math.max(w - 2 * INSET, 0.12);
  const id = Math.max(d - 2 * INSET, 0.12);
  return (
    <mesh position={[position[0], CAB_H / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={[iw, CAB_H, id]} />
    </mesh>
  );
}

/** Salpicadero: pieza vertical al fondo, apoyada sobre el sobre (base en position[1]+th). */
function Salpicadero({
  largo,
  altura,
  th,
  position,
  material,
}: {
  largo: number;
  altura: number;
  th: number;
  position: [number, number, number];
  material: THREE.Material;
}) {
  if (altura <= 0 || largo <= 0) return null;
  return (
    <mesh position={[position[0], position[1] + th + altura / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={[largo, altura, 0.02]} />
    </mesh>
  );
}

type Mats = { stone: THREE.Material; mueble: THREE.Material };

/** Sobre en L: dos losas perpendiculares (el brazo corto siempre sobresale). */
function LModel({ stone, mueble }: Mats) {
  const s = useConfigurador();
  const th = useThickness();
  const aL = mmM(s.medidas.a?.largo);
  const bL = mmM(s.medidas.b?.largo);
  const an = mmM(s.medidas.a?.prof);
  const hs = s.salpicaderoTipo === "no" ? 0 : (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;

  return (
    <group>
      {/* Muebles bajo cada brazo */}
      <Mueble w={aL} d={an} position={[aL / 2, 0, an / 2]} material={mueble} />
      <Mueble w={an} d={bL} position={[an / 2, 0, an + bL / 2]} material={mueble} />
      {/* Sobres */}
      <Losa args={[aL, th, an]} position={[aL / 2, CAB_H, an / 2]} material={stone} />
      <Losa args={[an, th, bL]} position={[an / 2, CAB_H, an + bL / 2]} material={stone} />
      {/* Salpicadero a lo largo del brazo largo */}
      <Salpicadero largo={aL} altura={hs} th={th} position={[aL / 2, CAB_H, 0.01]} material={stone} />
    </group>
  );
}

/** Rectos / barra / isla / paralela: losas rectangulares con su mueble. */
function BoxModel({ stone, mueble }: Mats) {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const th = useThickness();
  const hs = s.salpicaderoTipo === "no" ? 0 : (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;
  if (!geo) return null;

  if (geo.id === "paralela") {
    const aL = mmM(s.medidas.a?.largo);
    const bL = mmM(s.medidas.b?.largo);
    const an = mmM(s.medidas.a?.prof);
    const gap = 0.45;
    return (
      <group>
        <Mueble w={aL} d={an} position={[aL / 2, 0, an / 2]} material={mueble} />
        <Mueble w={bL} d={an} position={[bL / 2, 0, an + gap + an / 2]} material={mueble} />
        <Losa args={[aL, th, an]} position={[aL / 2, CAB_H, an / 2]} material={stone} />
        <Losa args={[bL, th, an]} position={[bL / 2, CAB_H, an + gap + an / 2]} material={stone} />
        <Salpicadero largo={aL} altura={hs} th={th} position={[aL / 2, CAB_H, 0.01]} material={stone} />
      </group>
    );
  }

  const k = geo.tramos[0]?.key ?? "principal";
  const lg = mmM(s.medidas[k]?.largo);
  const an = mmM(s.medidas[k]?.prof);
  return (
    <group>
      <Mueble w={lg} d={an} position={[lg / 2, 0, an / 2]} material={mueble} />
      <Losa args={[lg, th, an]} position={[lg / 2, CAB_H, an / 2]} material={stone} />
      <Salpicadero largo={lg} altura={hs} th={th} position={[lg / 2, CAB_H, 0.01]} material={stone} />
    </group>
  );
}

function ModelWrapper({ color, brillo }: { color: Color | undefined; brillo: boolean }) {
  const stone = useSobreMaterial(color?.imagen, color?.swatch, brillo);
  const mueble = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#cfc7b6"), roughness: 0.95, metalness: 0 }),
    [],
  );
  const geometriaId = useConfigurador((s) => s.geometriaId);
  const mats = { stone, mueble };
  return getGeometria(geometriaId)?.id === "l" ? <LModel {...mats} /> : <BoxModel {...mats} />;
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
    <div className="relative h-[360px] w-full overflow-hidden rounded-sm border border-stone-beige bg-[#f1efe9]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2.2, 1.7, 2.4], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 4, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center disableY key={`${s.geometriaId}-${JSON.stringify(s.medidas)}-${s.moldura}-${s.molduraGrosorCm}-${s.salpicaderoTipo}-${s.salpicaderoAlturaCm}`}>
              <ModelWrapper color={color} brillo={s.acabado === "brillo"} />
            </Center>
          </Bounds>
        </Suspense>
        <ContactShadows position={[0, 0, 0]} opacity={0.34} scale={10} blur={2.4} far={4} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={0.9}
          maxDistance={8}
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
