import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  AudioLines,
  BatteryMedium,
  Camera,
  CircuitBoard,
  Copy,
  Cpu,
  Download,
  Layers,
  Monitor,
  RefreshCw,
  Shield,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pip } from "@/components/pip";
import { SensorLive } from "@/components/sensor-live";
import { LabList, LabTest } from "@/components/lab-panel";
import {
  CATEGORY_META,
  benchCpu,
  collectProbe,
  flatFacts,
  formatOps,
  gradeFps,
  healthScore,
  loadLabs,
  readWebGpu,
  reportText,
  sampleFps,
  saveLabs,
  tally,
  worst,
  type CategoryId,
  type Fact,
  type LabResult,
  type Report,
  type Status,
} from "@/lib/probe";

const ICONS: Record<CategoryId, LucideIcon> = {
  sistem: Cpu,
  layar: Monitor,
  sensor: Activity,
  audio: AudioLines,
  kamera: Camera,
  daya: BatteryMedium,
  jaringan: Wifi,
  gpu: CircuitBoard,
  izin: Shield,
  akar: Layers,
};

type View =
  | { kind: "home" }
  | { kind: "cat"; id: CategoryId }
  | { kind: "lab" }
  | { kind: "test"; id: string };

function catLine(facts: Fact[] | undefined, scanning: boolean): string {
  if (!facts) return scanning ? "memindai" : "—";
  const counts = tally(facts);
  if (counts.fail) return `${counts.fail} gagal`;
  if (counts.warn) return `${counts.warn} lemah`;
  if (counts.blocked && counts.ok === 0) return "perlu izin";
  return `${counts.ok} baik`;
}

export function AkarApp() {
  const [report, setReport] = useState<Report | null>(null);
  const [scanning, setScanning] = useState(true);
  const [view, setView] = useState<View>({ kind: "home" });
  const [labs, setLabs] = useState<Record<string, LabResult>>({});
  const [copied, setCopied] = useState(false);
  const [copyFail, setCopyFail] = useState(false);
  const [issuesOpen, setIssuesOpen] = useState(false);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [gpuNote, setGpuNote] = useState<string | null>(null);
  const [gpuBusy, setGpuBusy] = useState(false);
  const [quick, setQuick] = useState(false);
  const gen = useRef(0);

  useEffect(() => {
    setLabs(loadLabs());
    void scan();
  }, []);

  async function scan() {
    const id = ++gen.current;
    setScanning(true);
    const next = await collectProbe();
    if (gen.current !== id) return;
    setReport(next);
    setScanning(false);
  }

  function writeLab(id: string, result: LabResult) {
    setLabs((current) => {
      const next = { ...current, [id]: result };
      saveLabs(next);
      return next;
    });
    setView({ kind: "lab" });
  }

  async function quickBench() {
    setQuick(true);
    const fps = gradeFps(await sampleFps(1200));
    const fpsStatus = fps.status === "fail" || fps.status === "warn" || fps.status === "ok" ? fps.status : "blocked";
    writeLabSilent("fps", { status: fpsStatus, note: fps.value, at: new Date().toISOString() });
    const note = formatOps(benchCpu(140));
    writeLabSilent("cpu", { status: "ok", note, at: new Date().toISOString() });
    setQuick(false);
  }

  function writeLabSilent(id: string, result: LabResult) {
    setLabs((current) => {
      const next = { ...current, [id]: result };
      saveLabs(next);
      return next;
    });
  }

  const facts = report ? flatFacts(report) : [];
  const score = facts.length ? healthScore(facts) : 0;
  const graded = facts.filter((fact) => fact.grade && fact.status !== "unknown" && fact.status !== "blocked").length;
  const read = facts.filter((fact) => fact.status !== "unknown").length;
  const issues = facts.filter((fact) => fact.status === "fail" || fact.status === "warn");
  const model = report?.categories.find((category) => category.id === "sistem")?.facts.find((fact) => fact.id === "model")?.value;

  const when = useMemo(
    () => (report ? new Date(report.at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : ""),
    [report],
  );

  async function copyReport() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(reportText(report, labs));
      setCopied(true);
      setCopyFail(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopyFail(true);
    }
  }

  function downloadReport() {
    if (!report) return;
    const blob = new Blob([JSON.stringify({ report, labs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `akar-${report.at.slice(0, 19).replace(/[:T]/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="safe-b mx-auto min-h-dvh w-full max-w-5xl px-5 py-6 md:px-8">
      {view.kind === "home" ? (
        <div className="md:flex md:items-start md:gap-10">
          <header className="md:sticky md:top-6 md:w-72 md:shrink-0 md:self-start">
            <p className="font-mono text-xs tracking-widest text-primary">DIAGNOSTIK</p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight">AKAR</h1>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Hardware, software, dan fungsi perangkat ini — sampai ke sinyal yang situs benar-benar boleh baca.
            </p>
            <div className="akar-ticks mt-4" aria-hidden="true" />
            <section className="mt-5 border border-border bg-surface p-5" aria-busy={scanning} aria-live="polite">
              <div className="flex items-end justify-between gap-3">
                <p className="font-mono text-6xl leading-none tabular-nums">{report ? score : "—"}</p>
                <p className="pb-1 text-right text-sm text-muted">
                  kesehatan
                  <span className="mt-1 block font-mono text-xs tabular-nums">
                    {graded} metrik · {read} sinyal
                  </span>
                </p>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden bg-bg">
                {scanning ? (
                  <div className="akar-scan h-full w-1/3 bg-primary" />
                ) : (
                  <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${score}%` }} />
                )}
              </div>
              <p className="mt-3 font-mono text-sm break-words">{model ?? (scanning ? "Memindai perangkat…" : "Siap")}</p>
              <p className="mt-1 text-xs text-muted">{when || "Skor hanya dari yang terukur, bukan dari daftar API."}</p>
            </section>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button className="col-span-2" onClick={() => setView({ kind: "lab" })}>
                Tes fungsi
              </Button>
              <Button variant="outline" disabled={!report} onClick={() => void copyReport()}>
                <Copy className="size-4" />
                {copied ? "Tersalin" : copyFail ? "Gagal salin" : "Salin"}
              </Button>
              <Button variant="outline" disabled={!report} onClick={downloadReport}>
                <Download className="size-4" />
                JSON
              </Button>
            </div>
            <Button variant="ghost" className="mt-2 w-full" disabled={scanning} onClick={() => void scan()}>
              <RefreshCw className="size-4" />
              {scanning ? "Memindai…" : "Pindai ulang"}
            </Button>
          </header>

          <div className="mt-8 md:mt-0">
            {issues.length ? (
              <section className="mb-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-base font-semibold">Perlu dilihat</h2>
                  {issues.length > 4 ? (
                    <button type="button" className="min-h-11 text-sm text-muted" onClick={() => setIssuesOpen((open) => !open)}>
                      {issuesOpen ? "Sedikit" : `Semua ${issues.length}`}
                    </button>
                  ) : null}
                </div>
                <ul className="mt-1">
                  {(issuesOpen ? issues : issues.slice(0, 4)).map((fact) => (
                    <li key={fact.id + fact.label} className="flex items-start gap-3 border-b border-border py-3">
                      <Pip status={fact.status} className="mt-1.5" />
                      <span className="min-w-0 flex-1 text-sm">{fact.label}</span>
                      <span className="w-1/2 text-right font-mono text-sm break-all">{fact.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : report ? (
              <p className="mb-6 text-sm text-muted">Tidak ada sinyal lemah pada yang terbaca. Lanjut ke tes fungsi untuk kamera, mic, dan layar.</p>
            ) : null}

            <ul className="border-t border-border">
              {CATEGORY_META.map((meta) => {
                const Icon = ICONS[meta.id];
                const category = report?.categories.find((item) => item.id === meta.id);
                const status: Status = category ? worst(category.facts) : "unknown";
                return (
                  <li key={meta.id}>
                    <button
                      type="button"
                      onClick={() => setView({ kind: "cat", id: meta.id })}
                      className="flex min-h-16 w-full items-center gap-3 border-b border-border py-3 text-left transition-colors duration-200 hover:bg-raised"
                    >
                      <Icon className="size-5 shrink-0 text-muted" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{meta.title}</span>
                        <span className="block truncate text-sm text-muted">{meta.hint}</span>
                      </span>
                      <span className="font-mono text-xs text-muted">{catLine(category?.facts, scanning)}</span>
                      <Pip status={status} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Bukan APK root. Situs tidak bisa membuka IMEI, nomor seri pabrik, daftar aplikasi, atau folder sistem. Yang ada di sini adalah yang perangkat laporkan ke browser, plus tes yang kamu jalankan sendiri.
            </p>
          </div>
        </div>
      ) : null}

      {view.kind === "cat" ? (
        report ? (
          <CategoryView
            id={view.id}
            report={report}
            onlyIssues={onlyIssues}
            gpuNote={gpuNote}
            gpuBusy={gpuBusy}
            onToggleIssues={() => setOnlyIssues((value) => !value)}
            onBack={() => setView({ kind: "home" })}
            onOpenTest={(id) => setView({ kind: "test", id })}
            onGpu={async () => {
              setGpuBusy(true);
              setGpuNote(await readWebGpu());
              setGpuBusy(false);
            }}
          />
        ) : (
          <p className="text-sm text-muted">Masih memindai…</p>
        )
      ) : null}

      {view.kind === "lab" ? (
        <LabList
          results={labs}
          busy={quick}
          onOpen={(id) => setView({ kind: "test", id })}
          onBack={() => setView({ kind: "home" })}
          onQuick={() => void quickBench()}
        />
      ) : null}

      {view.kind === "test" ? <LabTest id={view.id} onBack={() => setView({ kind: "lab" })} onSave={writeLab} /> : null}
    </main>
  );
}

function CategoryView({
  id,
  report,
  onlyIssues,
  gpuNote,
  gpuBusy,
  onToggleIssues,
  onBack,
  onOpenTest,
  onGpu,
}: {
  id: CategoryId;
  report: Report;
  onlyIssues: boolean;
  gpuNote: string | null;
  gpuBusy: boolean;
  onToggleIssues: () => void;
  onBack: () => void;
  onOpenTest: (id: string) => void;
  onGpu: () => void;
}) {
  const category = report.categories.find((item) => item.id === id);
  const facts = (category?.facts ?? []).filter((fact) => !onlyIssues || fact.status === "fail" || fact.status === "warn");
  return (
    <div>
      <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowLeft className="size-4" />
        Ringkasan
      </button>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{category?.title}</h1>
          <p className="mt-2 text-sm text-muted">{category?.hint}</p>
        </div>
        <button
          type="button"
          aria-pressed={onlyIssues}
          onClick={onToggleIssues}
          className="min-h-11 shrink-0 text-sm text-muted"
        >
          {onlyIssues ? "Semua sinyal" : "Hanya masalah"}
        </button>
      </div>
      <ul className="mt-4 border-t border-border">
        {facts.length === 0 ? <li className="py-6 text-sm text-muted">Tidak ada masalah di bagian ini.</li> : null}
        {facts.map((fact) => (
          <li key={fact.id} className="flex items-start gap-3 border-b border-border py-3">
            <Pip status={fact.status} className="mt-1.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">{fact.label}</p>
              {fact.detail ? <p className="text-xs text-muted">{fact.detail}</p> : null}
            </div>
            <p className="w-1/2 text-right font-mono text-sm break-all tabular-nums">{fact.value}</p>
          </li>
        ))}
      </ul>
      {id === "sensor" ? <SensorLive /> : null}
      {id === "layar" ? (
        <Button className="mt-6 w-full" onClick={() => onOpenTest("layar")}>
          Tes piksel mati
        </Button>
      ) : null}
      {id === "gpu" ? (
        <div className="mt-6">
          <Button variant="outline" className="w-full" disabled={gpuBusy} onClick={onGpu}>
            {gpuBusy ? "Meminta adaptor…" : "Baca adaptor WebGPU"}
          </Button>
          {gpuNote ? <p className="mt-3 font-mono text-sm break-all text-muted">{gpuNote}</p> : null}
        </div>
      ) : null}
      {id === "audio" ? (
        <Button className="mt-6 w-full" onClick={() => onOpenTest("speaker")}>
          Tes speaker
        </Button>
      ) : null}
      {id === "kamera" ? (
        <Button className="mt-6 w-full" onClick={() => onOpenTest("kamera")}>
          Buka kamera
        </Button>
      ) : null}
      {id === "daya" ? (
        <Button className="mt-6 w-full" onClick={() => onOpenTest("getar")}>
          Tes getar
        </Button>
      ) : null}
    </div>
  );
}
