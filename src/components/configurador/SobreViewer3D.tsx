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

/** Altura del mueble bajo (m), inserción del mueble y espesor base de la losa. */
const CAB_H = 0.7;
const INSET = 0.05;
const BASE_TH = 0.015;

type StoneMats = { top: THREE.Material; edge: THREE.Material };

/** Materiales del sobre: cara superior (foto/color) y canto (más oscuro, para que se note). */
function useSobreMaterials(imagen: string | undefined, swatch: string | undefined, brillo: boolean): StoneMats {
  const tex = useTexture(imagen || PX);
  return useMemo(() => {
    const make = (darken: number) => {
      const m = new THREE.MeshStandardMaterial();
      if (imagen) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        m.map = tex;
        m.color = new THREE.Color(darken, darken, darken);
      } else {
        m.color = new THREE.Color(swatch || "#cccccc").multiplyScalar(darken);
      }
      m.roughness = brillo ? 0.12 : 0.8;
      m.metalness = 0;
      return m;
    };
    return { top: make(1), edge: make(0.68) };
  }, [tex, imagen, swatch, brillo]);
}

/** Losa (sobre): cara superior con el material y canto más oscuro. Base en position[1]. */
function Losa({
  args,
  position,
  mats,
}: {
  args: [number, number, number];
  position: [number, number, number];
  mats: StoneMats;
}) {
  // Orden de caras del box: [+x, -x, +y(top), -y(bottom), +z, -z]
  const faces = [mats.edge, mats.edge, mats.top, mats.top, mats.edge, mats.edge];
  return (
    <mesh position={[position[0], position[1] + args[1] / 2, position[2]]} material={faces} castShadow receiveShadow>
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

/** Salpicadero: pieza vertical, apoyada sobre el sobre (base en position[1]+th). */
function Salpicadero({
  w,
  d,
  altura,
  th,
  position,
  material,
}: {
  w: number;
  d: number;
  altura: number;
  th: number;
  position: [number, number, number];
  material: THREE.Material;
}) {
  if (altura <= 0) return null;
  return (
    <mesh position={[position[0], position[1] + th + altura / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={[w, altura, d]} />
    </mesh>
  );
}

type Mats = { mats: StoneMats; mueble: THREE.Material };

/**
 * Grosor del canto de la losa. Sin moldura queda un canto fino; con moldura el
 * canto crece notoriamente (se exagera x2.5 respecto al grosor real sólo para
 * que la moldura se aprecie bien en la vista previa).
 */
const MOLDURA_VIS = 2.5;
function useThickness() {
  const moldura = useConfigurador((s) => s.moldura);
  const grosor = useConfigurador((s) => s.molduraGrosorCm);
  return BASE_TH + (moldura ? ((grosor ?? 0) / 100) * MOLDURA_VIS : 0);
}

/** Sobre en L: dos losas perpendiculares (el brazo corto siempre sobresale). */
function LModel({ mats, mueble }: Mats) {
  const s = useConfigurador();
  const th = useThickness();
  const aL = mmM(s.medidas.a?.largo);
  const bL = mmM(s.medidas.b?.largo);
  const an = mmM(s.medidas.a?.prof);
  const hs = s.salpicaderoTipo === "no" ? 0 : (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;

  return (
    <group>
      {/* Mueble en L continuo */}
      <Mueble w={aL} d={an} position={[aL / 2, 0, an / 2]} material={mueble} />
      <Mueble w={an} d={an + bL} position={[an / 2, 0, (an + bL) / 2]} material={mueble} />
      {/* Sobres */}
      <Losa args={[aL, th, an]} position={[aL / 2, CAB_H, an / 2]} mats={mats} />
      <Losa args={[an, th, bL]} position={[an / 2, CAB_H, an + bL / 2]} mats={mats} />
      {/* Salpicadero en L: fondo (brazo largo) + lateral exterior */}
      <Salpicadero w={aL} d={0.02} altura={hs} th={th} position={[aL / 2, CAB_H, 0.01]} material={mats.top} />
      <Salpicadero w={0.02} d={an + bL} altura={hs} th={th} position={[0.01, CAB_H, (an + bL) / 2]} material={mats.top} />
    </group>
  );
}

/** Rectos / barra / isla / paralela: losas rectangulares con su mueble. */
function BoxModel({ mats, mueble }: Mats) {
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
        <Losa args={[aL, th, an]} position={[aL / 2, CAB_H, an / 2]} mats={mats} />
        <Losa args={[bL, th, an]} position={[bL / 2, CAB_H, an + gap + an / 2]} mats={mats} />
        <Salpicadero w={aL} d={0.02} altura={hs} th={th} position={[aL / 2, CAB_H, 0.01]} material={mats.top} />
        <Salpicadero w={bL} d={0.02} altura={hs} th={th} position={[bL / 2, CAB_H, an + gap + 0.01]} material={mats.top} />
      </group>
    );
  }

  const k = geo.tramos[0]?.key ?? "principal";
  const lg = mmM(s.medidas[k]?.largo);
  const an = mmM(s.medidas[k]?.prof);
  return (
    <group>
      <Mueble w={lg} d={an} position={[lg / 2, 0, an / 2]} material={mueble} />
      <Losa args={[lg, th, an]} position={[lg / 2, CAB_H, an / 2]} mats={mats} />
      <Salpicadero w={lg} d={0.02} altura={hs} th={th} position={[lg / 2, CAB_H, 0.01]} material={mats.top} />
    </group>
  );
}

function ModelWrapper({ color, brillo }: { color: Color | undefined; brillo: boolean }) {
  const mats = useSobreMaterials(color?.imagen, color?.swatch, brillo);
  const mueble = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color("#cfc7b6"), roughness: 0.95, metalness: 0 }),
    [],
  );
  const geometriaId = useConfigurador((s) => s.geometriaId);
  const props = { mats, mueble };
  return getGeometria(geometriaId)?.id === "l" ? <LModel {...props} /> : <BoxModel {...props} />;
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
      <div className="flex h-[360px] w-full items-center justify-center rounded-sm border border-stone-beige bg-ivory/40 text-sm text-mineral">
        Ingresá las medidas para ver la vista 3D.
      </div>
    );
  }

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-sm border border-stone-beige bg-[#f1efe9]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2.3, 1.05, 2.7], fov: 44 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 4, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
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
