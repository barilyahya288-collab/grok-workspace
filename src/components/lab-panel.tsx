import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pip } from "@/components/pip";
import {
  LAB_TESTS,
  benchCpu,
  formatOps,
  gradeFps,
  sampleFps,
  type LabResult,
  type LabStatus,
} from "@/lib/probe";

function stamp(status: LabStatus, note: string): LabResult {
  return { status, note, at: new Date().toISOString() };
}

export function LabList({
  results,
  busy,
  onOpen,
  onBack,
  onQuick,
}: {
  results: Record<string, LabResult>;
  busy: boolean;
  onOpen: (id: string) => void;
  onBack: () => void;
  onQuick: () => void;
}) {
  const done = LAB_TESTS.filter((test) => results[test.id]).length;
  return (
    <div>
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowLeft className="size-4" />
        Ringkasan
      </button>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Lab fungsi</h1>
      <p className="mt-2 text-sm text-muted">
        {done} dari {LAB_TESTS.length} tes punya hasil. Yang butuh kamera, mic, atau lokasi baru minta izin saat kamu mulai.
      </p>
      <Button className="mt-5 w-full" disabled={busy} onClick={onQuick}>
        {busy ? "Mengukur…" : "Ukur FPS dan CPU"}
      </Button>
      <ul className="mt-6 border-t border-border">
        {LAB_TESTS.map((test, index) => {
          const result = results[test.id];
          return (
            <li key={test.id}>
              <button
                type="button"
                onClick={() => onOpen(test.id)}
                className="flex min-h-16 w-full items-center gap-3 border-b border-border py-3 text-left transition-colors duration-200 hover:bg-raised"
              >
                <span className="w-8 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{test.title}</span>
                  <span className="block text-sm text-muted">{result ? result.note : test.hint}</span>
                </span>
                {result ? <Pip status={result.status} /> : null}
                <ChevronRight className="size-4 text-muted" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LabTest({
  id,
  onBack,
  onSave,
}: {
  id: string;
  onBack: () => void;
  onSave: (id: string, result: LabResult) => void;
}) {
  const test = LAB_TESTS.find((item) => item.id === id);
  return (
    <div>
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowLeft className="size-4" />
        Lab
      </button>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{test?.title ?? "Tes"}</h1>
      <p className="mt-2 text-sm text-muted">{test?.hint}</p>
      <div className="mt-6">
        {id === "layar" ? <ScreenTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "sentuh" ? <TouchTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "speaker" ? <SpeakerTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "mic" ? <MicTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "kamera" ? <CameraTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "getar" ? <VibrateTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "lokasi" ? <GeoTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "fps" ? <FpsTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "cpu" ? <CpuTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "simpan" ? <StoreTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "klip" ? <ClipTest onSave={(result) => onSave(id, result)} /> : null}
        {id === "bluetooth" ? <BtTest onSave={(result) => onSave(id, result)} /> : null}
      </div>
    </div>
  );
}

function Verdict({
  onPass,
  onFail,
  passLabel = "Berfungsi",
  failLabel = "Bermasalah",
}: {
  onPass: () => void;
  onFail: () => void;
  passLabel?: string;
  failLabel?: string;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Button onClick={onPass}>{passLabel}</Button>
      <Button variant="outline" onClick={onFail}>
        {failLabel}
      </Button>
    </div>
  );
}

const SCREEN_STEPS = [
  { color: "#ffffff", light: true, name: "Putih" },
  { color: "#000000", light: false, name: "Hitam" },
  { color: "#ff0000", light: false, name: "Merah" },
  { color: "#00ff00", light: true, name: "Hijau" },
  { color: "#0000ff", light: false, name: "Biru" },
  { color: "#808080", light: true, name: "Abu" },
];

function ScreenTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    };
  }, [open]);

  if (!open) {
    return (
      <Button
        className="w-full"
        onClick={() => {
          setOpen(true);
          void document.documentElement.requestFullscreen?.().catch(() => undefined);
        }}
      >
        Mulai sapuan warna
      </Button>
    );
  }

  const current = SCREEN_STEPS[step];
  const done = step >= SCREEN_STEPS.length;
  return (
    <div className="fixed inset-0 z-40 flex flex-col" style={{ background: done ? "#10120e" : current.color }}>
      <div className="flex items-center justify-between p-4" style={{ color: done || !current.light ? "#e8eadf" : "#14160f" }}>
        <p className="font-mono text-sm">{done ? "Putusan" : `${current.name} · ${step + 1}/${SCREEN_STEPS.length}`}</p>
        <button type="button" className="min-h-11 px-3 text-sm font-medium" onClick={() => setOpen(false)}>
          Tutup
        </button>
      </div>
      {done ? (
        <div className="flex flex-1 flex-col justify-end p-5 text-fg">
          <p className="text-lg font-medium">Ada titik mati, garis, atau warna belang?</p>
          <Verdict
            passLabel="Layar bersih"
            failLabel="Ada cacat"
            onPass={() => {
              onSave(stamp("ok", "sapuan warna bersih"));
              setOpen(false);
            }}
            onFail={() => {
              onSave(stamp("fail", "ada cacat pada sapuan warna"));
              setOpen(false);
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          className="flex-1 text-sm"
          style={{ color: current.light ? "#14160f" : "#e8eadf" }}
          onClick={() => setStep((value) => value + 1)}
        >
          Ketuk untuk warna berikutnya
        </button>
      )}
    </div>
  );
}

function TouchTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [points, setPoints] = useState<Map<number, { x: number; y: number }>>(new Map());
  const [max, setMax] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  function update(event: PointerEvent<HTMLDivElement>) {
    box.current?.setPointerCapture(event.pointerId);
    setPoints((current) => {
      const next = new Map(current);
      if (event.type === "pointerup" || event.type === "pointercancel") next.delete(event.pointerId);
      else next.set(event.pointerId, { x: event.clientX, y: event.clientY });
      return next;
    });
  }

  useEffect(() => {
    setMax((value) => Math.max(value, points.size));
  }, [points]);

  return (
    <div>
      <div
        ref={box}
        onPointerDown={update}
        onPointerMove={update}
        onPointerUp={update}
        onPointerCancel={update}
        className="relative h-80 touch-none border border-border bg-bg"
      >
        <p className="pointer-events-none p-4 text-sm text-muted">
          Sentuh dan geser di sini. Maksimum {max} titik.
        </p>
        {[...points.entries()].map(([id, point]) => (
          <span
            key={id}
            className="pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
            style={{ left: point.x - (box.current?.getBoundingClientRect().left ?? 0), top: point.y - (box.current?.getBoundingClientRect().top ?? 0) }}
          />
        ))}
      </div>
      <Verdict
        passLabel="Sentuhan oke"
        failLabel="Ada zona mati"
        onPass={() => onSave(stamp(max >= 2 ? "ok" : "warn", `maks ${max} titik`))}
        onFail={() => onSave(stamp("fail", `zona mati, maks ${max} titik`))}
      />
    </div>
  );
}

function SpeakerTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const ctx = useRef<AudioContext | null>(null);
  const [heard, setHeard] = useState({ left: false, right: false, both: false });

  useEffect(() => () => void ctx.current?.close(), []);

  async function play(pan: number) {
    try {
      const audio = ctx.current ?? new AudioContext();
      ctx.current = audio;
      if (audio.state === "suspended") await audio.resume();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const stereo = audio.createStereoPanner();
      osc.type = "sine";
      osc.frequency.value = pan < 0 ? 440 : pan > 0 ? 880 : 523;
      stereo.pan.value = pan;
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.7);
      osc.connect(stereo).connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.75);
    } catch {
      /* browser menolak audio */
    }
  }

  const all = heard.left && heard.right && heard.both;
  return (
    <div className="grid gap-2">
      <Button variant="outline" onClick={() => void play(-1).then(() => setHeard((h) => ({ ...h, left: true })))}>
        Nada kiri · 440 Hz
      </Button>
      <Button variant="outline" onClick={() => void play(1).then(() => setHeard((h) => ({ ...h, right: true })))}>
        Nada kanan · 880 Hz
      </Button>
      <Button variant="outline" onClick={() => void play(0).then(() => setHeard((h) => ({ ...h, both: true })))}>
        Stereo tengah
      </Button>
      <Verdict
        passLabel="Terdengar"
        failLabel="Tidak terdengar"
        onPass={() => onSave(stamp(all ? "ok" : "warn", all ? "kiri, kanan, tengah" : "sebagian kanal"))}
        onFail={() => onSave(stamp("fail", "speaker tidak terdengar"))}
      />
    </div>
  );
}

function MicTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const peakRef = useRef(0);

  useEffect(() => {
    let dead = false;
    let stream: MediaStream | null = null;
    let audio: AudioContext | null = null;
    let handle = 0;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (dead) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        audio = new AudioContext();
        const source = audio.createMediaStreamSource(stream);
        const analyser = audio.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          if (dead) return;
          analyser.getByteTimeDomainData(data);
          let max = 0;
          for (const value of data) max = Math.max(max, Math.abs(value - 128));
          const next = max / 128;
          peakRef.current = Math.max(peakRef.current, next);
          setLevel(next);
          setPeak(peakRef.current);
          handle = requestAnimationFrame(tick);
        };
        tick();
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "Mikrofon ditolak");
      }
    })();
    return () => {
      dead = true;
      cancelAnimationFrame(handle);
      stream?.getTracks().forEach((track) => track.stop());
      void audio?.close();
    };
  }, []);

  return (
    <div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="h-3 bg-bg">
        <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.round(level * 100))}%` }} />
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-muted">puncak {Math.round(peak * 100)}%</p>
      <Verdict
        onPass={() => onSave(stamp(peak > 0.08 ? "ok" : "warn", `puncak ${Math.round(peak * 100)}%`))}
        onFail={() => onSave(stamp(error ? "blocked" : "fail", error ?? "tidak menangkap suara"))}
        passLabel="Mic hidup"
        failLabel="Tidak masuk"
      />
    </div>
  );
}

function CameraTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const track = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    let dead = false;
    let stream: MediaStream | null = null;
    setError(null);
    setTorch(false);
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
        if (dead) {
          stream.getTracks().forEach((item) => item.stop());
          return;
        }
        const next = stream.getVideoTracks()[0] ?? null;
        track.current = next;
        const caps = next?.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
        setTorch(Boolean(caps && "torch" in caps && caps.torch));
        if (video.current) {
          video.current.srcObject = stream;
          await video.current.play();
        }
      } catch (err) {
        if (!dead) setError(err instanceof Error ? err.message : "Kamera ditolak");
      }
    })();
    return () => {
      dead = true;
      stream?.getTracks().forEach((item) => item.stop());
      track.current = null;
    };
  }, [facing]);

  async function toggleTorch() {
    const current = track.current;
    if (!current) return;
    const next = !torchOn;
    try {
      await current.applyConstraints({ advanced: [{ torch: next }] } as unknown as MediaTrackConstraints);
      setTorchOn(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lampu gagal");
    }
  }

  return (
    <div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      <video ref={video} className="aspect-3/4 w-full bg-bg object-cover" playsInline muted autoPlay />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setFacing((value) => (value === "user" ? "environment" : "user"))}>
          {facing === "user" ? "Ke belakang" : "Ke depan"}
        </Button>
        <Button variant="outline" disabled={!torch} onClick={() => void toggleTorch()}>
          {torch ? (torchOn ? "Matikan lampu" : "Nyalakan lampu") : "Lampu tidak ada"}
        </Button>
      </div>
      <Verdict
        passLabel="Gambar jelas"
        failLabel="Gambar gagal"
        onPass={() => onSave(stamp("ok", `kamera ${facing}${torchOn ? ", lampu nyala" : ""}`))}
        onFail={() => onSave(stamp(error ? "blocked" : "fail", error ?? "gambar tidak layak"))}
      />
    </div>
  );
}

function VibrateTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => () => void navigator.vibrate?.(0), []);

  function pulse() {
    if (typeof navigator.vibrate !== "function") {
      setNote("Browser ini tidak membuka motor getar.");
      return;
    }
    const ok = navigator.vibrate([45, 40, 45, 40, 180, 70, 280]);
    setNote(ok ? "Pola terkirim. Rasakan di tangan." : "Perangkat menolak getar.");
  }

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={pulse}>
        Kirim pola getar
      </Button>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      <Verdict
        passLabel="Terasa"
        failLabel="Tidak terasa"
        onPass={() => onSave(stamp("ok", "pola getar terasa"))}
        onFail={() => onSave(stamp(typeof navigator.vibrate === "function" ? "fail" : "blocked", note ?? "tidak terasa"))}
      />
    </div>
  );
}

function GeoTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Belum diminta.");
  const [link, setLink] = useState<string | null>(null);

  function locate() {
    if (!navigator.geolocation) {
      setText("Geolokasi tidak ada.");
      return;
    }
    setText("Mencari satelit…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
        setLink(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`);
        setText(
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)} · ±${Math.round(accuracy)} m` +
            (altitude != null ? ` · tinggi ${Math.round(altitude)} m` : "") +
            (speed != null ? ` · ${speed.toFixed(1)} m/s` : ""),
        );
      },
      (err) => setText(err.message || "Lokasi ditolak"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={locate}>
        Baca lokasi
      </Button>
      <p className="mt-3 font-mono text-sm break-all text-muted">{text}</p>
      {link ? (
        <a className="mt-2 inline-flex min-h-11 items-center text-sm text-primary" href={link} target="_blank" rel="noreferrer">
          Buka di peta
        </a>
      ) : null}
      <Verdict
        passLabel="Akurat"
        failLabel="Gagal"
        onPass={() => onSave(stamp(link ? "ok" : "warn", text))}
        onFail={() => onSave(stamp(link ? "fail" : "blocked", text))}
      />
    </div>
  );
}

function FpsTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Belum diukur.");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setText("Mengukur 1,5 detik…");
    const fps = await sampleFps(1500);
    const graded = gradeFps(fps);
    setText(graded.value);
    setBusy(false);
    const status: LabStatus = graded.status === "unknown" ? "blocked" : graded.status;
    onSave(stamp(status, graded.value));
  }

  return (
    <div>
      <p className="font-mono text-3xl tabular-nums">{text}</p>
      <Button className="mt-4 w-full" disabled={busy} onClick={() => void run()}>
        {busy ? "Mengukur…" : "Ukur lagi"}
      </Button>
    </div>
  );
}

function CpuTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Belum diukur.");

  function run() {
    const ops = benchCpu(160);
    const note = formatOps(ops);
    setText(note);
    onSave(stamp("ok", note));
  }

  return (
    <div>
      <p className="font-mono text-3xl tabular-nums">{text}</p>
      <Button className="mt-4 w-full" onClick={run}>
        Ukur lagi
      </Button>
    </div>
  );
}

function StoreTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Menulis 64 KB ke penyimpanan lokal perangkat ini.");

  function run() {
    const key = "akar.bench";
    try {
      const payload = "x".repeat(64 * 1024);
      const start = performance.now();
      localStorage.setItem(key, payload);
      const back = localStorage.getItem(key);
      localStorage.removeItem(key);
      const ms = Math.max(1, Math.round(performance.now() - start));
      if (back?.length !== payload.length) {
        setText("Baca kembali tidak utuh.");
        onSave(stamp("fail", "baca tidak utuh"));
        return;
      }
      setText(`Utuh dalam ${ms} ms.`);
      onSave(stamp("ok", `${ms} ms, 64 KB`));
    } catch (error) {
      localStorage.removeItem(key);
      const message = error instanceof Error ? error.message : "ditolak";
      setText(message);
      onSave(stamp("fail", message));
    }
  }

  return (
    <div>
      <p className="text-sm text-muted">{text}</p>
      <Button className="mt-4 w-full" onClick={run}>
        Tulis dan baca
      </Button>
    </div>
  );
}

function ClipTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Tes ini menimpa isi papan klip.");

  async function run() {
    const token = `AKAR ${Date.now().toString(36)}`;
    try {
      await navigator.clipboard.writeText(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : "tulis ditolak";
      setText(message);
      onSave(stamp("blocked", message));
      return;
    }
    try {
      const back = await navigator.clipboard.readText();
      if (back === token) {
        setText("Tulis dan baca cocok.");
        onSave(stamp("ok", "tulis dan baca"));
      } else {
        setText("Tulis berhasil, baca mengembalikan teks lain.");
        onSave(stamp("warn", "baca tidak cocok"));
      }
    } catch {
      setText("Tulis berhasil. Browser menolak pembacaan.");
      onSave(stamp("warn", "tulis saja, baca diblokir"));
    }
  }

  return (
    <div>
      <p className="text-sm text-muted">{text}</p>
      <Button className="mt-4 w-full" onClick={() => void run()}>
        Tes papan klip
      </Button>
    </div>
  );
}

function BtTest({ onSave }: { onSave: (result: LabResult) => void }) {
  const [text, setText] = useState("Akan membuka pemilih Bluetooth sistem.");
  const bluetooth = (navigator as Navigator & {
    bluetooth?: { requestDevice: (opts: { acceptAllDevices: boolean }) => Promise<{ name?: string; id: string }> };
  }).bluetooth;

  async function run() {
    if (!bluetooth?.requestDevice) {
      setText("Web Bluetooth tidak ada.");
      onSave(stamp("blocked", "API tidak ada"));
      return;
    }
    try {
      const device = await bluetooth.requestDevice({ acceptAllDevices: true });
      const note = device.name || device.id || "perangkat tanpa nama";
      setText(note);
      onSave(stamp("ok", note));
    } catch (error) {
      const message = error instanceof Error ? error.message : "dibatalkan";
      setText(message);
      onSave(stamp(/cancel/i.test(message) ? "blocked" : "fail", message));
    }
  }

  return (
    <div>
      <p className="text-sm text-muted">{text}</p>
      <Button className="mt-4 w-full" onClick={() => void run()}>
        Cari perangkat
      </Button>
    </div>
  );
}
