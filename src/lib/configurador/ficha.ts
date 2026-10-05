import {
  MM_POR_UNIDAD,
  PLAZO_DIAS_HABILES,
  getGeometria,
  getMaterial,
  type Unidad,
} from "@/data/configurador";
import { calcularPrecio, type ConfigInput } from "@/lib/configurador/pricing";

export type FichaCliente = {
  nombre: string;
  telefono: string;
  correo: string;
  provincia: string;
  canton: string;
  direccion: string;
  retiro: boolean;
};

export type FichaInput = ConfigInput & {
  unidad: Unidad;
  /** true cuando el proyecto se derivó a cotización personalizada. */
  derivar?: boolean;
  cliente?: FichaCliente;
  folio?: string;
  fecha?: string;
};

export type FichaFila = { label: string; value: string };
export type FichaSeccion = { titulo: string; filas: FichaFila[] };

function fmtCRC(n: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(n);
}

function enUnidad(mm: number, u: Unidad): string {
  const v = (mm ?? 0) / MM_POR_UNIDAD[u];
  return String(parseFloat(v.toFixed(3))).replace(".", ",");
}

/**
 * Construye la ficha técnica del pedido: secciones legibles que sirven como
 * respaldo para el cliente y como paquete para los equipos internos (Dibujo /
 * Logística). Isomórfica: se usa en el servidor (correo) y en el cliente.
 */
export function buildFicha(input: FichaInput): {
  secciones: FichaSeccion[];
  esPersonalizado: boolean;
  entregaDomicilio: boolean;
} {
  const geo = getGeometria(input.geometriaId);
  const material = getMaterial(input.materialId);
  const color = material?.colores.find((c) => c.id === input.colorId);
  const price = calcularPrecio(input);
  const u = input.unidad;
  const esPersonalizado = geo?.autoPrecio === false || !!input.derivar;

  const secciones: FichaSeccion[] = [];

  // Pedido
  const pedido: FichaFila[] = [];
  if (input.folio) pedido.push({ label: "N.º de solicitud", value: input.folio });
  pedido.push({ label: "Fecha", value: input.fecha ?? new Date().toLocaleString("es-CR") });
  pedido.push({
    label: "Tipo de solicitud",
    value: esPersonalizado ? "Cotización personalizada (con asesor)" : "Pedido estándar",
  });
  secciones.push({ titulo: "Solicitud", filas: pedido });

  // Configuración
  const config: FichaFila[] = [{ label: "Tipo de proyecto", value: geo?.nombre ?? "—" }];
  if (!esPersonalizado || material) {
    config.push({ label: "Material", value: material ? material.nombre : "—" });
    config.push({ label: "Color", value: color?.nombre ?? "—" });
    config.push({ label: "Espesor", value: material ? `${material.espesorMm} mm` : "—" });
  }
  secciones.push({ titulo: "Configuración", filas: config });

  // Medidas
  if (geo && geo.tramos.length > 0) {
    const medidasFilas: FichaFila[] = geo.tramos.map((t) => {
      const m = input.medidas[t.key];
      return {
        label: t.label,
        value: m ? `${enUnidad(m.largo, u)} × ${enUnidad(m.prof, u)} ${u}` : "—",
      };
    });
    medidasFilas.push({ label: "Área total", value: `${price.areaTotal.toFixed(2)} m²` });
    secciones.push({ titulo: "Medidas", filas: medidasFilas });
  }

  // Acabados
  const acabados: FichaFila[] = [
    { label: "Moldura", value: input.moldura ? "Con moldura básica" : "Sin moldura" },
  ];
  if (price.molduraMl > 0) acabados.push({ label: "Moldura (frente)", value: `${price.molduraMl.toFixed(2)} m` });
  const salpTxt =
    input.salpicaderoTipo === "no"
      ? "Sin salpicadero"
      : input.salpicaderoTipo === "10"
        ? "10 cm"
        : `${input.salpicaderoAlturaCm} cm`;
  acabados.push({ label: "Salpicadero", value: salpTxt });
  if (price.areaSalpicadero > 0)
    acabados.push({ label: "Área salpicadero", value: `${price.areaSalpicadero.toFixed(2)} m²` });
  if (!esPersonalizado) secciones.push({ titulo: "Acabados", filas: acabados });

  // Precio
  const precio: FichaFila[] = [];
  if (esPersonalizado) {
    precio.push({ label: "Precio", value: "A confirmar por un asesor" });
  } else if (price.agotado) {
    precio.push({ label: "Disponibilidad", value: "Material agotado — validar con asesor" });
    precio.push({ label: "Precio", value: "A confirmar (según disponibilidad)" });
  } else if (price.tienePrecio) {
    precio.push({ label: "Subtotal", value: fmtCRC(price.subtotal) });
    precio.push({ label: "IVA (13%)", value: fmtCRC(price.iva) });
    precio.push({ label: "Costo final", value: fmtCRC(price.total) });
  } else {
    precio.push({ label: "Precio", value: "A confirmar" });
  }
  precio.push({ label: "Plazo de producción", value: `${PLAZO_DIAS_HABILES} días hábiles` });
  secciones.push({ titulo: "Precio y plazo", filas: precio });

  // Entrega y cliente
  const entregaDomicilio = !!input.cliente && !input.cliente.retiro;
  if (input.cliente) {
    const c = input.cliente;
    secciones.push({
      titulo: "Entrega",
      filas: [
        { label: "Modalidad", value: c.retiro ? "Retiro en tienda" : "Entrega a domicilio" },
        { label: "Provincia / cantón", value: `${c.provincia}${c.canton ? " / " + c.canton : ""}` },
        ...(c.retiro ? [] : [{ label: "Dirección", value: c.direccion || "—" }]),
      ],
    });
    secciones.push({
      titulo: "Cliente",
      filas: [
        { label: "Nombre", value: c.nombre },
        { label: "Teléfono", value: c.telefono },
        { label: "Correo", value: c.correo },
      ],
    });
  }

  return { secciones, esPersonalizado, entregaDomicilio };
}
