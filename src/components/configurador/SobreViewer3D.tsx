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

/** Reasigna UVs por proyección superior (para que la textura mapee una vez sobre la cara). */
function remapUVPlanar(g: THREE.BufferGeometry) {
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  const sx = bb.max.x - bb.min.x || 1;
  const sz = bb.max.z - bb.min.z || 1;
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - bb.min.x) / sx, (pos.getZ(i) - bb.min.z) / sz);
  }
  uv.needsUpdate = true;
}

/** Caja (losa) con grosor th, centrada en su base. */
function Losa({
  args,
  position,
  material,
}: {
  args: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
}) {
  // La base de la losa queda en position[1] (grosor hacia arriba).
  return (
    <mesh position={[position[0], position[1] + args[1] / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  );
}

/** Salpicadero: lipa vertical de 2 cm de espesor. */
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
  // Se apoya sobre la losa (base de la losa en y=0, tope en y=th).
  return (
    <mesh position={[position[0], th + altura / 2, position[2]]} material={material} castShadow receiveShadow>
      <boxGeometry args={[largo, altura, 0.02]} />
    </mesh>
  );
}

/** Sobre en L: una sola pieza extruida (fiel a largo, corto y ancho). */
function LModel({ material }: { material: THREE.Material }) {
  const s = useConfigurador();
  const mat = getMaterial(s.materialId);
  const th = s.moldura ? (s.molduraGrosorCm ?? 3) / 100 : Math.max((mat?.espesorMm ?? 20) / 1000, 0.02);
  const aL = mmM(s.medidas.a?.largo); // parte larga
  const bL = mmM(s.medidas.b?.largo); // parte corta
  const an = mmM(s.medidas.a?.prof); // ancho común
  const hs = s.salpicaderoTipo === "no" ? 0 : (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;

  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    // L: pierna larga (vertical, ancho=an, alto=aL) + pie corto (horizontal, largo=bL, alto=an)
    shape.moveTo(0, 0);
    shape.lineTo(bL, 0);
    shape.lineTo(bL, an);
    shape.lineTo(an, an);
    shape.lineTo(an, aL);
    shape.lineTo(0, aL);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: th, bevelEnabled: false });
    g.rotateX(-Math.PI / 2); // acostar la pieza: la base queda en y=0 y el grosor sube a y=th
    remapUVPlanar(g);
    return g;
  }, [aL, bL, an, th]);

  return (
    <group>
      <mesh geometry={geom} material={material} castShadow receiveShadow />
      {/* Salpicadero a lo largo de la pierna larga (borde exterior x=0, z de 0 a -aL) */}
      <Salpicadero largo={aL} altura={hs} th={th} position={[0.01, 0, -aL / 2]} material={material} />
    </group>
  );
}

/** Sobres rectos / barra / isla / paralela: losas rectangulares. */
function BoxModel({ material }: { material: THREE.Material }) {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const mat = getMaterial(s.materialId);
  const th = s.moldura ? (s.molduraGrosorCm ?? 3) / 100 : Math.max((mat?.espesorMm ?? 20) / 1000, 0.02);
  const hs = s.salpicaderoTipo === "no" ? 0 : (s.salpicaderoTipo === "10" ? 10 : s.salpicaderoAlturaCm) / 100;
  if (!geo) return null;

  if (geo.id === "paralela") {
    const aL = mmM(s.medidas.a?.largo);
    const bL = mmM(s.medidas.b?.largo);
    const an = mmM(s.medidas.a?.prof);
    const gap = 0.45;
    return (
      <group>
        <Losa args={[aL, th, an]} position={[aL / 2, 0, an / 2]} material={material} />
        <Losa args={[bL, th, an]} position={[bL / 2, 0, an + gap + an / 2]} material={material} />
        <Salpicadero largo={aL} altura={hs} th={th} position={[aL / 2, 0, 0.01]} material={material} />
      </group>
    );
  }

  const k = geo.tramos[0]?.key ?? "principal";
  const lg = mmM(s.medidas[k]?.largo);
  const an = mmM(s.medidas[k]?.prof);
  return (
    <group>
      <Losa args={[lg, th, an]} position={[lg / 2, 0, an / 2]} material={material} />
      <Salpicadero largo={lg} altura={hs} th={th} position={[lg / 2, 0, 0.01]} material={material} />
    </group>
  );
}

function ModelWrapper({ color, brillo }: { color: Color | undefined; brillo: boolean }) {
  const material = useSobreMaterial(color?.imagen, color?.swatch, brillo);
  const geometriaId = useConfigurador((s) => s.geometriaId);
  return getGeometria(geometriaId)?.id === "l" ? <LModel material={material} /> : <BoxModel material={material} />;
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
      <Canvas shadows dpr={[1, 2]} camera={{ position: [1.6, 1.3, 1.9], fov: 42 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 7, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.25}>
            <Center disableY key={`${s.geometriaId}-${JSON.stringify(s.medidas)}`}>
              <ModelWrapper color={color} brillo={s.acabado === "brillo"} />
            </Center>
          </Bounds>
        </Suspense>
        <ContactShadows position={[0, 0, 0]} opacity={0.33} scale={8} blur={2.4} far={3} />
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
