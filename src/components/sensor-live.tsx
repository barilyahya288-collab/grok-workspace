import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { requestMotionAccess } from "@/lib/probe";

type Snap = {
  ax: number | null;
  ay: number | null;
  az: number | null;
  rx: number | null;
  ry: number | null;
  rz: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  heading: number | null;
};

const empty: Snap = {
  ax: null,
  ay: null,
  az: null,
  rx: null,
  ry: null,
  rz: null,
  alpha: null,
  beta: null,
  gamma: null,
  heading: null,
};

function fmt(value: number | null, unit: string): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2)} ${unit}`;
}

export function SensorLive() {
  const [ios, setIos] = useState(false);
  const [armed, setArmed] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [snap, setSnap] = useState<Snap>(empty);
  const [samples, setSamples] = useState(0);
  const latest = useRef<Snap>(empty);
  const count = useRef(0);

  useEffect(() => {
    const ctor = DeviceMotionEvent as unknown as { requestPermission?: unknown };
    if (typeof ctor.requestPermission === "function") setIos(true);
    else setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const onMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      const rot = event.rotationRate;
      latest.current = {
        ...latest.current,
        ax: accel?.x ?? null,
        ay: accel?.y ?? null,
        az: accel?.z ?? null,
        rx: rot?.alpha ?? null,
        ry: rot?.beta ?? null,
        rz: rot?.gamma ?? null,
      };
      count.current += 1;
    };
    const onOrient = (event: DeviceOrientationEvent) => {
      const heading =
        (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
        (event.alpha == null ? null : (360 - event.alpha + 360) % 360);
      latest.current = {
        ...latest.current,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        heading,
      };
      count.current += 1;
    };
    window.addEventListener("devicemotion", onMotion);
    window.addEventListener("deviceorientation", onOrient);
    const timer = window.setInterval(() => {
      setSnap({ ...latest.current });
      setSamples(count.current);
    }, 125);
    return () => {
      window.removeEventListener("devicemotion", onMotion);
      window.removeEventListener("deviceorientation", onOrient);
      window.clearInterval(timer);
    };
  }, [armed]);

  async function allow() {
    const result = await requestMotionAccess();
    if (result === "denied") {
      setNote("Izin sensor ditolak.");
      return;
    }
    setNote(null);
    setArmed(true);
  }

  const cells: { label: string; value: string }[] = [
    { label: "Aksel X", value: fmt(snap.ax, "m/s²") },
    { label: "Aksel Y", value: fmt(snap.ay, "m/s²") },
    { label: "Aksel Z", value: fmt(snap.az, "m/s²") },
    { label: "Putar α", value: fmt(snap.rx, "°/s") },
    { label: "Putar β", value: fmt(snap.ry, "°/s") },
    { label: "Putar γ", value: fmt(snap.rz, "°/s") },
    { label: "Kemiringan β", value: fmt(snap.beta, "°") },
    { label: "Gulung γ", value: fmt(snap.gamma, "°") },
    { label: "Arah", value: fmt(snap.heading, "°") },
  ];

  return (
    <section className="mt-6 border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">Pembacaan langsung</h2>
        <p className="font-mono text-xs text-muted tabular-nums">{samples} sampel</p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Angka mentah dari gerak dan orientasi. Goyang perangkat kalau nilainya diam.
      </p>
      {ios && !armed ? (
        <Button className="mt-4 w-full" onClick={() => void allow()}>
          Izinkan sensor
        </Button>
      ) : null}
      {note ? <p className="mt-3 text-sm text-danger">{note}</p> : null}
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {cells.map((cell) => (
          <div key={cell.label} className="bg-bg px-2 py-2">
            <dt className="text-xs text-muted">{cell.label}</dt>
            <dd className="mt-1 font-mono text-xs tabular-nums">{cell.value}</dd>
          </div>
        ))}
      </dl>
      {armed && samples === 0 ? (
        <p className="mt-3 text-sm text-muted">Belum ada sampel. Browser ini mungkin menutup sensor.</p>
      ) : null}
    </section>
  );
}
