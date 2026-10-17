export type Status = "ok" | "warn" | "fail" | "blocked" | "unknown";

export type Fact = {
  id: string;
  label: string;
  value: string;
  detail?: string;
  status: Status;
  /** Included in the health score. Inventory rows stay out. */
  grade?: boolean;
};

export type CategoryId =
  | "sistem"
  | "layar"
  | "sensor"
  | "audio"
  | "kamera"
  | "daya"
  | "jaringan"
  | "gpu"
  | "izin"
  | "akar";

export type Category = {
  id: CategoryId;
  title: string;
  hint: string;
  facts: Fact[];
};

export type Report = {
  at: string;
  categories: Category[];
};

export type LabStatus = "ok" | "warn" | "fail" | "blocked";

export type LabResult = {
  status: LabStatus;
  note: string;
  at: string;
};

export const CATEGORY_META: { id: CategoryId; title: string; hint: string }[] = [
  { id: "sistem", title: "Sistem", hint: "Model, OS, inti, memori" },
  { id: "layar", title: "Layar", hint: "Resolusi, warna, sentuhan, Hz" },
  { id: "sensor", title: "Sensor", hint: "Gerak, arah, giro, cahaya" },
  { id: "audio", title: "Audio", hint: "Speaker, mic, suara sistem" },
  { id: "kamera", title: "Kamera", hint: "Lensa, lampu, kendali" },
  { id: "daya", title: "Daya", hint: "Baterai, getar, layar nyala" },
  { id: "jaringan", title: "Jaringan", hint: "Sinyal, latency, penyimpanan" },
  { id: "gpu", title: "Grafis", hint: "GPU, WebGL, tekstur" },
  { id: "izin", title: "Izin", hint: "Apa yang situs boleh sentuh" },
  { id: "akar", title: "Akar", hint: "API dalam, isolasi, identitas" },
];

export const LAB_TESTS: { id: string; title: string; hint: string }[] = [
  { id: "layar", title: "Layar & piksel mati", hint: "Sapu warna penuh, cari titik cacat" },
  { id: "sentuh", title: "Multi-sentuh", hint: "Beberapa jari sekaligus" },
  { id: "speaker", title: "Speaker", hint: "Nada kiri, kanan, dan stereo" },
  { id: "mic", title: "Mikrofon", hint: "Meter tingkat suara langsung" },
  { id: "kamera", title: "Kamera & lampu", hint: "Depan, belakang, senter" },
  { id: "getar", title: "Getar", hint: "Pola getar motor" },
  { id: "lokasi", title: "Lokasi", hint: "GPS, akurasi, ketinggian" },
  { id: "fps", title: "Kelancaran", hint: "Sampel frame layar" },
  { id: "cpu", title: "Prosesor", hint: "Throughput singkat" },
  { id: "simpan", title: "Penyimpanan lokal", hint: "Tulis lalu baca 64 KB" },
  { id: "klip", title: "Papan klip", hint: "Tulis lalu baca kembali" },
  { id: "bluetooth", title: "Bluetooth", hint: "Minta satu perangkat terdekat" },
];

const LAB_KEY = "akar.lab.v1";

function within<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      () => {
        window.clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

function row(
  id: string,
  label: string,
  value: string,
  status: Status,
  extra?: { detail?: string; grade?: boolean },
): Fact {
  return { id, label, value, status, detail: extra?.detail, grade: extra?.grade };
}

export function tally(facts: Fact[]) {
  const t = { ok: 0, warn: 0, fail: 0, blocked: 0, unknown: 0 };
  for (const fact of facts) t[fact.status] += 1;
  return t;
}

export function flatFacts(report: Report): Fact[] {
  return report.categories.flatMap((category) => category.facts);
}

export function healthScore(facts: Fact[]): number {
  const graded = facts.filter((fact) => fact.grade && fact.status !== "unknown" && fact.status !== "blocked");
  if (!graded.length) return 0;
  const points = graded.reduce((sum, fact) => {
    if (fact.status === "ok") return sum + 1;
    if (fact.status === "warn") return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((points / graded.length) * 100);
}

export function worst(facts: Fact[]): Status {
  if (facts.some((fact) => fact.status === "fail")) return "fail";
  if (facts.some((fact) => fact.status === "warn")) return "warn";
  if (facts.some((fact) => fact.status === "blocked")) return "blocked";
  if (facts.some((fact) => fact.status === "ok")) return "ok";
  return "unknown";
}

function bytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = n;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const digits = value >= 10 || index === 0 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[index]}`;
}

function duration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const hours = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  if (hours > 48) return `${Math.round(hours)} jam`;
  if (hours > 0) return `${hours} jam ${mins} mnt`;
  return `${mins} mnt`;
}

function tzOffset(date = new Date()): string {
  const minutes = -date.getTimezoneOffset();
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return `UTC${sign}${hours}${mins ? `:${String(mins).padStart(2, "0")}` : ""}`;
}

export function formatOps(opsPerSec: number): string {
  if (opsPerSec >= 1_000_000) return `${(opsPerSec / 1_000_000).toFixed(1)} juta op/dtk`;
  if (opsPerSec >= 1_000) return `${Math.round(opsPerSec / 1_000)} ribu op/dtk`;
  return `${Math.round(opsPerSec)} op/dtk`;
}

export function sampleFps(ms: number): Promise<number | null> {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    let handle = 0;
    const timer = window.setTimeout(() => {
      cancelAnimationFrame(handle);
      resolve(null);
    }, ms + 900);
    const loop = (now: number) => {
      frames += 1;
      if (now - start >= ms) {
        window.clearTimeout(timer);
        resolve(Math.round((frames * 1000) / (now - start)));
      } else {
        handle = requestAnimationFrame(loop);
      }
    };
    handle = requestAnimationFrame(loop);
  });
}

export function benchCpu(ms: number): number {
  const start = performance.now();
  let x = 0x12345678;
  let count = 0;
  while (performance.now() - start < ms) {
    x = Math.imul(x ^ (x >>> 13), 0x5bd1e995);
    count += 1;
  }
  const elapsed = Math.max(1, performance.now() - start);
  return count / (elapsed / 1000);
}

export function gradeFps(fps: number | null): { status: Status; value: string } {
  if (fps == null) return { status: "unknown", value: "tidak terukur" };
  if (fps < 30) return { status: "fail", value: `${fps} Hz` };
  if (fps < 50) return { status: "warn", value: `${fps} Hz` };
  return { status: "ok", value: `${fps} Hz` };
}

type Entropy = {
  architecture?: string;
  bitness?: string;
  model?: string;
  platform?: string;
  platformVersion?: string;
  uaFullVersion?: string;
  fullVersionList?: { brand: string; version: string }[];
  wow64?: boolean;
  formFactors?: string[];
  mobile?: boolean;
};

function brandLine(list?: { brand: string; version: string }[]): string {
  if (!list?.length) return "";
  const cleaned = list.filter((item) => !/not.?a.?brand/i.test(item.brand));
  const source = cleaned.length ? cleaned : list;
  return source.map((item) => `${item.brand} ${item.version}`.trim()).join(" · ");
}

async function readEntropy(): Promise<Entropy> {
  const ua = (
    navigator as Navigator & {
      userAgentData?: {
        mobile?: boolean;
        platform?: string;
        brands?: { brand: string; version: string }[];
        getHighEntropyValues?: (hints: string[]) => Promise<Record<string, unknown>>;
      };
    }
  ).userAgentData;
  if (!ua) return {};
  const base: Entropy = { mobile: ua.mobile, platform: ua.platform, fullVersionList: ua.brands };
  if (!ua.getHighEntropyValues) return base;
  try {
    const raw = await ua.getHighEntropyValues([
      "architecture",
      "bitness",
      "model",
      "platform",
      "platformVersion",
      "uaFullVersion",
      "fullVersionList",
      "wow64",
      "formFactors",
    ]);
    const brands = Array.isArray(raw.fullVersionList)
      ? raw.fullVersionList.flatMap((item) => {
          if (!item || typeof item !== "object") return [];
          const entry = item as { brand?: unknown; version?: unknown };
          if (typeof entry.brand !== "string") return [];
          return [{ brand: entry.brand, version: typeof entry.version === "string" ? entry.version : "" }];
        })
      : base.fullVersionList;
    return {
      ...base,
      architecture: typeof raw.architecture === "string" ? raw.architecture : undefined,
      bitness: typeof raw.bitness === "string" ? raw.bitness : undefined,
      model: typeof raw.model === "string" && raw.model ? raw.model : undefined,
      platform: typeof raw.platform === "string" ? raw.platform : base.platform,
      platformVersion: typeof raw.platformVersion === "string" ? raw.platformVersion : undefined,
      uaFullVersion: typeof raw.uaFullVersion === "string" ? raw.uaFullVersion : undefined,
      wow64: typeof raw.wow64 === "boolean" ? raw.wow64 : undefined,
      formFactors: Array.isArray(raw.formFactors) ? raw.formFactors.map(String) : undefined,
      fullVersionList: brands,
    };
  } catch {
    return base;
  }
}

type Battery = { charging: boolean; chargingTime: number; dischargingTime: number; level: number };

async function readBattery(): Promise<Battery | null> {
  const nav = navigator as Navigator & { getBattery?: () => Promise<Battery> };
  if (!nav.getBattery) return null;
  try {
    return await nav.getBattery();
  } catch {
    return null;
  }
}

async function readPerm(name: string): Promise<PermissionState | "absent"> {
  try {
    if (!navigator.permissions?.query) return "absent";
    const status = await navigator.permissions.query({ name: name as PermissionName });
    return status.state;
  } catch {
    return "absent";
  }
}

function permFact(id: string, label: string, state: PermissionState | "absent"): Fact {
  if (state === "granted") return row(id, label, "diizinkan", "ok");
  if (state === "prompt") return row(id, label, "menunggu izin", "blocked");
  if (state === "denied") return row(id, label, "ditolak", "warn");
  return row(id, label, "tidak didukung", "unknown");
}

type GpuRead = {
  ok: boolean;
  webgl2: boolean;
  vendor: string;
  renderer: string;
  version: string;
  shading: string;
  maxTexture: number;
  viewport: string;
  aniso: string;
  samples: string;
  soft: boolean;
};

function readGpu(): GpuRead {
  const empty: GpuRead = {
    ok: false,
    webgl2: false,
    vendor: "",
    renderer: "",
    version: "",
    shading: "",
    maxTexture: 0,
    viewport: "—",
    aniso: "—",
    samples: "—",
    soft: false,
  };
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return empty;
    const debug = gl.getExtension("WEBGL_debug_renderer_info") as {
      UNMASKED_VENDOR_WEBGL: number;
      UNMASKED_RENDERER_WEBGL: number;
    } | null;
    const vendor = debug ? String(gl.getParameter(debug.UNMASKED_VENDOR_WEBGL)) : String(gl.getParameter(gl.VENDOR));
    const renderer = debug
      ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    const anisoExt = gl.getExtension("EXT_texture_filter_anisotropic") as {
      MAX_TEXTURE_MAX_ANISOTROPY_EXT: number;
    } | null;
    const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array | null;
    const webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    const samples = webgl2 ? String((gl as WebGL2RenderingContext).getParameter((gl as WebGL2RenderingContext).MAX_SAMPLES)) : "—";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return {
      ok: true,
      webgl2,
      vendor,
      renderer,
      version: String(gl.getParameter(gl.VERSION)),
      shading: String(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)),
      maxTexture: Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 0,
      viewport: dims ? `${dims[0]}×${dims[1]}` : "—",
      aniso: anisoExt ? `${gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}×` : "tidak ada",
      samples,
      soft: /swiftshader|llvmpipe|softpipe|software/i.test(renderer),
    };
  } catch {
    return empty;
  }
}

async function voiceSummary(): Promise<{ count: number; sample: string }> {
  if (typeof speechSynthesis === "undefined") return { count: 0, sample: "tidak ada" };
  const read = () => speechSynthesis.getVoices();
  if (!read().length) {
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 200);
      speechSynthesis.onvoiceschanged = () => {
        window.clearTimeout(timer);
        resolve();
      };
    });
  }
  const list = read();
  const picked = list.find((voice) => voice.default) ?? list[0];
  return { count: list.length, sample: picked ? `${picked.name} (${picked.lang})` : "belum dimuat" };
}

function present(name: string, host: object): boolean {
  return name in host;
}

export async function readWebGpu(): Promise<string> {
  const gpu = (navigator as Navigator & {
    gpu?: {
      requestAdapter: () => Promise<{
        info?: { vendor?: string; architecture?: string; device?: string; description?: string };
        requestAdapterInfo?: () => Promise<{ vendor?: string; architecture?: string; device?: string; description?: string }>;
      } | null>;
    };
  }).gpu;
  if (!gpu) return "WebGPU tidak ada di browser ini.";
  try {
    const adapter = await Promise.race([
      gpu.requestAdapter(),
      new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 2000)),
    ]);
    if (!adapter) return "Adaptor tidak diberikan.";
    const info = adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : adapter.info;
    const parts = [info?.vendor, info?.architecture, info?.device, info?.description].filter(Boolean);
    return parts.join(" · ") || "Adaptor ada, identitas disembunyikan.";
  } catch (error) {
    return error instanceof Error ? error.message : "WebGPU gagal.";
  }
}

export async function requestMotionAccess(): Promise<"granted" | "denied" | "tidak-perlu"> {
  const events = [DeviceMotionEvent, DeviceOrientationEvent] as unknown as {
    requestPermission?: () => Promise<string>;
  }[];
  let needed = false;
  try {
    for (const event of events) {
      if (typeof event.requestPermission !== "function") continue;
      needed = true;
      const result = await event.requestPermission();
      if (result !== "granted") return "denied";
    }
  } catch {
    return "denied";
  }
  return needed ? "granted" : "tidak-perlu";
}

export function loadLabs(): Record<string, LabResult> {
  try {
    const raw = localStorage.getItem(LAB_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, LabResult>;
  } catch {
    return {};
  }
}

export function saveLabs(labs: Record<string, LabResult>) {
  localStorage.setItem(LAB_KEY, JSON.stringify(labs));
}

export function reportText(report: Report, labs: Record<string, LabResult>): string {
  const facts = flatFacts(report);
  const lines = [
    "AKAR · laporan perangkat",
    new Date(report.at).toLocaleString("id-ID"),
    `Skor kesehatan: ${healthScore(facts)}`,
    "",
  ];
  for (const category of report.categories) {
    lines.push(`# ${category.title}`);
    for (const fact of category.facts) {
      lines.push(`- ${fact.label}: ${fact.value}${fact.detail ? ` (${fact.detail})` : ""} [${fact.status}]`);
    }
    lines.push("");
  }
  lines.push("# Lab");
  if (!Object.keys(labs).length) lines.push("- belum dijalankan");
  for (const test of LAB_TESTS) {
    const result = labs[test.id];
    lines.push(`- ${test.title}: ${result ? `${result.note} [${result.status}]` : "belum"}`);
  }
  lines.push("");
  lines.push("Catatan: situs tidak bisa membaca IMEI, nomor seri pabrik, daftar aplikasi, atau folder root.");
  return lines.join("\n");
}

export async function collectProbe(): Promise<Report> {
  const entropy = await readEntropy();
  const pending = Promise.all([
    readBattery(),
    voiceSummary(),
    (async () => {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) return null;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const labels = devices.map((device) => device.label).filter(Boolean).slice(0, 6);
        return {
          cams: devices.filter((device) => device.kind === "videoinput").length,
          mics: devices.filter((device) => device.kind === "audioinput").length,
          outs: devices.filter((device) => device.kind === "audiooutput").length,
          labels,
        };
      } catch {
        return null;
      }
    })(),
    (async () => {
      try {
        return (await navigator.storage?.estimate()) ?? null;
      } catch {
        return null;
      }
    })(),
    (async () => {
      try {
        return (await navigator.storage?.persisted?.()) ?? null;
      } catch {
        return null;
      }
    })(),
    Promise.all(
      [
        ["geolocation", "Lokasi"],
        ["notifications", "Notifikasi"],
        ["camera", "Kamera"],
        ["microphone", "Mikrofon"],
        ["accelerometer", "Akselerometer"],
        ["gyroscope", "Giroskop"],
        ["magnetometer", "Magnetometer"],
        ["ambient-light-sensor", "Cahaya sekitar"],
        ["clipboard-read", "Baca papan klip"],
        ["clipboard-write", "Tulis papan klip"],
        ["persistent-storage", "Penyimpanan tetap"],
        ["screen-wake-lock", "Layar tetap nyala"],
        ["background-sync", "Sinkron latar"],
        ["midi", "MIDI"],
        ["nfc", "NFC"],
        ["local-fonts", "Font lokal"],
      ].map(async ([name, label]) => permFact(name, label, await readPerm(name))),
    ),
  ] as const);

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
      type?: string;
    };
    gpu?: unknown;
    usb?: unknown;
    hid?: unknown;
    serial?: unknown;
    bluetooth?: { getAvailability?: () => Promise<boolean> };
    wakeLock?: unknown;
    keyboard?: unknown;
    pdfViewerEnabled?: boolean;
    devicePosture?: { type?: string };
    windowControlsOverlay?: { visible?: boolean };
  };

  const bluetoothP = nav.bluetooth?.getAvailability
    ? within(
        nav.bluetooth.getAvailability().then((ready) => (ready ? "radio siap" : "radio mati atau tidak ada")),
        500,
        "tidak menjawab",
      )
    : Promise.resolve("API tidak ada");

  const authP = (async () => {
    if (typeof PublicKeyCredential === "undefined") return "tidak ada";
    try {
      const available = await within(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(), 500, false);
      return available ? "autentikator perangkat siap" : "API ada, perangkat tidak menawarkan";
    } catch {
      return "API ada";
    }
  })();

  const [pack, bluetooth, platformAuth, fpsRaw] = await Promise.all([pending, bluetoothP, authP, sampleFps(280)]);
  const [battery, voices, devices, estimate, persisted, perms] = pack;
  const fpsRead = gradeFps(fpsRaw);
  const cpu = benchCpu(40);
  const gpu = readGpu();
  const connection = nav.connection;
  const memory = (performance as Performance & {
    memory?: { jsHeapSizeLimit: number; totalJSHeapSize: number; usedJSHeapSize: number };
  }).memory;
  const timing = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 0;
  const model =
    entropy.model ||
    entropy.platform ||
    navigator.platform ||
    "Perangkat ini";
  const brands = brandLine(entropy.fullVersionList);
  const gamut = window.matchMedia("(color-gamut: rec2020)").matches
    ? "rec2020"
    : window.matchMedia("(color-gamut: p3)").matches
      ? "display-p3"
      : window.matchMedia("(color-gamut: srgb)").matches
        ? "srgb"
        : "tidak diketahui";
  const hdr = window.matchMedia("(dynamic-range: high)").matches;
  const displayMode =
    ["fullscreen", "standalone", "minimal-ui", "browser"].find((mode) =>
      window.matchMedia(`(display-mode: ${mode})`).matches,
    ) ?? "browser";
  const constraints = navigator.mediaDevices?.getSupportedConstraints?.() ?? {};
  const picked = (keys: string[]) => keys.filter((key) => constraints[key as keyof MediaTrackSupportedConstraints]);
  const quota = estimate?.quota ?? 0;
  const usage = estimate?.usage ?? 0;
  const storageRatio = quota > 0 ? usage / quota : 0;
  const heapRatio = memory && memory.jsHeapSizeLimit > 0 ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;
  const link = connection?.effectiveType;
  const ttfb = timing ? timing.responseStart - timing.requestStart : null;

  const sistem: Fact[] = [
    row("model", "Model", model, "ok", {
      detail: entropy.model ? "UA Client Hints" : "platform, model disembunyikan",
    }),
    row("os", "Sistem", [entropy.platform, entropy.platformVersion].filter(Boolean).join(" ") || navigator.platform || "—", "ok"),
    row("arch", "Arsitektur", [entropy.architecture, entropy.bitness ? `${entropy.bitness}-bit` : ""].filter(Boolean).join(" · ") || "tidak dilaporkan", entropy.architecture ? "ok" : "unknown"),
    row("browser", "Peramban", brands || "lihat agen di Akar", brands ? "ok" : "unknown"),
    row("full", "Versi penuh", entropy.uaFullVersion || "tidak dilaporkan", entropy.uaFullVersion ? "ok" : "unknown"),
    row("mobile", "Genggam", entropy.mobile == null ? (coarse ? "sepertinya" : "tidak") : entropy.mobile ? "ya" : "tidak", "ok"),
    row("cores", "Inti logis", cores ? String(cores) : "—", cores >= 4 ? "ok" : cores >= 2 ? "warn" : "fail", { grade: true }),
    row(
      "ram",
      "Memori perangkat",
      nav.deviceMemory ? `${nav.deviceMemory} GB` : "disembunyikan",
      nav.deviceMemory ? (nav.deviceMemory < 2 ? "warn" : "ok") : "unknown",
      { grade: Boolean(nav.deviceMemory), detail: "Perkiraan browser, sering dibulatkan" },
    ),
    row("cpu", "Throughput", formatOps(cpu), "ok", { detail: "ukur singkat di utas halaman" }),
    row("lang", "Bahasa", navigator.languages.join(", ") || navigator.language, "ok"),
    row("tz", "Zona waktu", `${Intl.DateTimeFormat().resolvedOptions().timeZone} · ${tzOffset()}`, "ok"),
    row(
      "factors",
      "Faktor bentuk",
      entropy.formFactors?.join(", ") || "tidak dilaporkan",
      entropy.formFactors?.length ? "ok" : "unknown",
    ),
  ];

  const layar: Fact[] = [
    row("screen", "Layar", `${screen.width}×${screen.height}`, "ok", { detail: `area ${screen.availWidth}×${screen.availHeight}` }),
    row("viewport", "Viewport", `${window.innerWidth}×${window.innerHeight}`, "ok"),
    row("dpr", "Rasio piksel", `${window.devicePixelRatio || 1}×`, "ok"),
    row(
      "depth",
      "Kedalaman warna",
      `${screen.colorDepth} bit`,
      screen.colorDepth >= 24 ? "ok" : "warn",
      { grade: true },
    ),
    row("gamut", "Gamut", gamut, "ok"),
    row("hdr", "HDR", hdr ? "ya" : "tidak", hdr ? "ok" : "unknown"),
    row(
      "orient",
      "Orientasi",
      screen.orientation ? `${screen.orientation.type} · ${screen.orientation.angle}°` : "tidak dilaporkan",
      "ok",
    ),
    row(
      "touch",
      "Titik sentuh",
      String(navigator.maxTouchPoints),
      coarse && navigator.maxTouchPoints < 2 ? "warn" : "ok",
      { grade: coarse, detail: coarse ? "pointer kasar" : "pointer halus" },
    ),
    row("pointer", "Hover", window.matchMedia("(hover: hover)").matches ? "ada" : "tidak", "ok"),
    row("mode", "Mode tampilan", displayMode, "ok"),
    row("fps", "Frame sampel", fpsRead.value, fpsRead.status, { grade: fpsRead.status !== "unknown", detail: "sampel singkat, tab harus di depan" }),
    row(
      "vv",
      "Skala visual",
      window.visualViewport ? `${window.visualViewport.scale.toFixed(2)}×` : "—",
      "ok",
    ),
    row("scheme", "Skema", window.matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang", "ok"),
    row(
      "motion",
      "Kurangi gerak",
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "ya" : "tidak",
      "ok",
    ),
  ];

  const sensorNames = [
    "Accelerometer",
    "Gyroscope",
    "LinearAccelerationSensor",
    "GravitySensor",
    "Magnetometer",
    "AbsoluteOrientationSensor",
    "RelativeOrientationSensor",
    "AmbientLightSensor",
  ];
  const sensor: Fact[] = [
    row("motion", "Device Motion", "DeviceMotionEvent" in window ? "ada" : "tidak ada", "DeviceMotionEvent" in window ? "ok" : "unknown"),
    row("orient", "Device Orientation", "DeviceOrientationEvent" in window ? "ada" : "tidak ada", "DeviceOrientationEvent" in window ? "ok" : "unknown"),
    row(
      "ios",
      "Izin gerakan iOS",
      typeof (DeviceMotionEvent as unknown as { requestPermission?: unknown }).requestPermission === "function"
        ? "perlu ketukan"
        : "tidak perlu",
      "ok",
    ),
    ...sensorNames.map((name) =>
      row(name, name, name in window ? "ada" : "tidak ada", name in window ? "ok" : "unknown"),
    ),
  ];

  const audio: Fact[] = [
    row(
      "mics",
      "Mikrofon",
      devices ? String(devices.mics) : "tidak terbaca",
      devices ? (devices.mics > 0 ? "ok" : "warn") : "unknown",
      { grade: Boolean(devices), detail: "jumlah, nama butuh izin" },
    ),
    row(
      "outs",
      "Keluaran audio",
      devices ? String(devices.outs) : "tidak terbaca",
      devices ? (devices.outs > 0 ? "ok" : "unknown") : "unknown",
    ),
    row("webaudio", "Web Audio", typeof AudioContext !== "undefined" ? "ada" : "tidak ada", typeof AudioContext !== "undefined" ? "ok" : "fail", {
      grade: true,
    }),
    row("voices", "Suara ucapan", String(voices.count), voices.count > 0 ? "ok" : "unknown", { detail: voices.sample }),
    row(
      "aopts",
      "Kendali audio",
      picked(["echoCancellation", "noiseSuppression", "autoGainControl", "sampleRate"]).join(", ") || "tidak dilaporkan",
      "ok",
    ),
  ];

  const kamera: Fact[] = [
    row(
      "cams",
      "Kamera",
      devices ? String(devices.cams) : "tidak terbaca",
      devices ? (devices.cams > 0 ? "ok" : "warn") : "unknown",
      { grade: Boolean(devices) },
    ),
    row("labels", "Label perangkat", devices?.labels.length ? devices.labels.join(" · ") : "tersembunyi sampai izin", devices?.labels.length ? "ok" : "blocked"),
    row(
      "vopts",
      "Kendali video",
      picked(["torch", "zoom", "focusMode", "exposureMode", "whiteBalanceMode", "facingMode", "frameRate"]).join(", ") || "tidak dilaporkan",
      "ok",
    ),
    row("barcode", "Barcode", "BarcodeDetector" in window ? "ada" : "tidak ada", "BarcodeDetector" in window ? "ok" : "unknown"),
    row("pip", "Picture in picture", document.pictureInPictureEnabled ? "ada" : "tidak", document.pictureInPictureEnabled ? "ok" : "unknown"),
    row("capture", "ImageCapture", "ImageCapture" in window ? "ada" : "tidak ada", "ImageCapture" in window ? "ok" : "unknown"),
    row("gum", "getUserMedia", typeof navigator.mediaDevices?.getUserMedia === "function" ? "ada" : "tidak ada", typeof navigator.mediaDevices?.getUserMedia === "function" ? "ok" : "fail", {
      grade: true,
    }),
  ];

  const daya: Fact[] = battery
    ? [
        row(
          "level",
          "Level",
          `${Math.round(battery.level * 100)}%`,
          !battery.charging && battery.level < 0.15 ? "fail" : !battery.charging && battery.level < 0.3 ? "warn" : "ok",
          { grade: true },
        ),
        row("charge", "Mengisi", battery.charging ? "ya" : "tidak", "ok"),
        row("ctime", "Waktu sampai penuh", duration(battery.chargingTime), "ok"),
        row("dtime", "Sisa perkiraan", duration(battery.dischargingTime), "ok"),
      ]
    : [row("level", "Baterai", "API disembunyikan", "unknown", { detail: "Chrome sering mematikan Battery Status" })];

  daya.push(
    row("vib", "Motor getar", typeof navigator.vibrate === "function" ? "ada" : "tidak ada", typeof navigator.vibrate === "function" ? "ok" : "unknown"),
    row("wake", "Wake Lock", present("wakeLock", navigator) ? "ada" : "tidak ada", present("wakeLock", navigator) ? "ok" : "unknown"),
  );

  const linkStatus: Status =
    link == null ? "unknown" : link === "slow-2g" ? "fail" : link === "2g" || link === "3g" ? "warn" : "ok";
  const jaringan: Fact[] = [
    row("online", "Daring", navigator.onLine ? "ya" : "tidak", navigator.onLine ? "ok" : "fail", { grade: true }),
    row("type", "Jenis", connection?.type || "tidak dilaporkan", connection?.type ? "ok" : "unknown"),
    row("eff", "Efektif", link || "tidak dilaporkan", linkStatus, { grade: link != null }),
    row(
      "down",
      "Unduh",
      connection?.downlink != null ? `${connection.downlink} Mbps` : "—",
      connection?.downlink != null && connection.downlink < 0.5 ? "warn" : "ok",
      { grade: connection?.downlink != null },
    ),
    row("rtt", "RTT jaringan", connection?.rtt != null ? `${connection.rtt} ms` : "—", "ok"),
    row("save", "Hemat data", connection?.saveData ? "aktif" : "tidak", "ok"),
    row(
      "quota",
      "Kuota penyimpanan",
      quota ? `${bytes(usage)} / ${bytes(quota)}` : "tidak dilaporkan",
      storageRatio > 0.98 ? "fail" : storageRatio > 0.9 ? "warn" : quota ? "ok" : "unknown",
      { grade: quota > 0 },
    ),
    row("persist", "Penyimpanan tetap", persisted == null ? "tidak diketahui" : persisted ? "ya" : "belum", persisted ? "ok" : "unknown"),
  ];
  if (timing) {
    const dns = Math.max(0, timing.domainLookupEnd - timing.domainLookupStart);
    const tcp = Math.max(0, timing.connectEnd - timing.connectStart);
    jaringan.push(
      row("dns", "DNS", `${Math.round(dns)} ms`, "ok"),
      row("tcp", "TCP", `${Math.round(tcp)} ms`, "ok"),
      row(
        "ttfb",
        "TTFB",
        ttfb != null ? `${Math.round(ttfb)} ms` : "—",
        ttfb != null && ttfb > 4000 ? "fail" : ttfb != null && ttfb > 1500 ? "warn" : "ok",
        { grade: ttfb != null && ttfb >= 0 },
      ),
      row("proto", "Protokol", timing.nextHopProtocol || "—", "ok"),
      row("xfer", "Transfer dokumen", bytes(timing.transferSize), "ok"),
    );
  }

  const gpuFacts: Fact[] = gpu.ok
    ? [
        row("renderer", "Renderer", gpu.renderer || "—", gpu.soft ? "warn" : "ok", {
          grade: true,
          detail: gpu.soft ? "renderer perangkat lunak" : gpu.vendor,
        }),
        row("vendor", "Vendor", gpu.vendor || "—", "ok"),
        row("gl", "WebGL", gpu.webgl2 ? "WebGL 2" : "WebGL 1", "ok"),
        row("version", "Versi", gpu.version, "ok"),
        row("shading", "Shading", gpu.shading, "ok"),
        row("tex", "Tekstur maks", gpu.maxTexture ? `${gpu.maxTexture}px` : "—", "ok"),
        row("view", "Viewport maks", gpu.viewport, "ok"),
        row("aniso", "Anisotropi", gpu.aniso, "ok"),
        row("msaa", "Sampel MSAA", gpu.samples, "ok"),
        row("webgpu", "WebGPU", present("gpu", navigator) ? "ada, belum diminta" : "tidak ada", present("gpu", navigator) ? "ok" : "unknown"),
      ]
    : [
        row("renderer", "WebGL", "konteks gagal", "fail", { grade: true }),
        row("webgpu", "WebGPU", present("gpu", navigator) ? "ada" : "tidak ada", "unknown"),
      ];

  const secure = window.isSecureContext;
  const akar: Fact[] = [
    row("secure", "Konteks aman", secure ? "ya" : "tidak", secure ? "ok" : "warn", {
      grade: true,
      detail: "HTTPS atau localhost. Banyak sensor mati tanpanya",
    }),
    row("origin", "Asal", location.origin, "ok"),
    row("iso", "Isolasi lintas-asal", window.crossOriginIsolated ? "ya" : "tidak", "unknown", {
      detail: "SharedArrayBuffer butuh ini",
    }),
    row("sab", "SharedArrayBuffer", typeof SharedArrayBuffer !== "undefined" ? "ada" : "tidak", "unknown"),
    row("wasm", "WebAssembly", typeof WebAssembly !== "undefined" ? "ada" : "tidak", typeof WebAssembly !== "undefined" ? "ok" : "fail", {
      grade: true,
    }),
    row("crypto", "crypto.subtle", crypto.subtle ? "ada" : "tidak", crypto.subtle ? "ok" : "warn", { grade: true }),
    row("idb", "IndexedDB", typeof indexedDB !== "undefined" ? "ada" : "tidak", typeof indexedDB !== "undefined" ? "ok" : "fail", { grade: true }),
    row("worker", "Worker", typeof Worker !== "undefined" ? "ada" : "tidak", "ok"),
    row("sw", "Service worker", present("serviceWorker", navigator) ? "ada" : "tidak", "ok"),
    row("cookie", "Cookie", navigator.cookieEnabled ? "aktif" : "mati", navigator.cookieEnabled ? "ok" : "warn", { grade: true }),
    row("dnt", "Do Not Track", navigator.doNotTrack || "tidak diset", "ok"),
    row("webdriver", "Otomasi", navigator.webdriver ? "terdeteksi" : "tidak", navigator.webdriver ? "warn" : "ok", { grade: true }),
    row("pdf", "Pembaca PDF", nav.pdfViewerEnabled ? "ada" : "tidak / disembunyikan", "unknown"),
    row("wow", "WoW64", entropy.wow64 == null ? "—" : entropy.wow64 ? "ya" : "tidak", "unknown"),
    row("bt", "Bluetooth", bluetooth, bluetooth === "radio siap" ? "ok" : "unknown"),
    row("usb", "USB", present("usb", navigator) ? "API ada" : "tidak ada", "unknown"),
    row("hid", "HID", present("hid", navigator) ? "API ada" : "tidak ada", "unknown"),
    row("serial", "Serial", present("serial", navigator) ? "API ada" : "tidak ada", "unknown"),
    row("nfc", "NFC", "NDEFReader" in window ? "API ada" : "tidak ada", "unknown"),
    row("webauthn", "WebAuthn", platformAuth, platformAuth.includes("siap") ? "ok" : "unknown"),
    row("fs", "File system", "showOpenFilePicker" in window ? "ada" : "tidak ada", "unknown"),
    row("contacts", "Kontak", present("contacts", navigator) ? "API ada" : "tidak ada", "unknown"),
    row("eye", "EyeDropper", "EyeDropper" in window ? "ada" : "tidak ada", "unknown"),
    row("idle", "IdleDetector", "IdleDetector" in window ? "ada" : "tidak ada", "unknown"),
    row("locks", "Web Locks", present("locks", navigator) ? "ada" : "tidak ada", "ok"),
    row("kbd", "Keyboard API", present("keyboard", navigator) ? "ada" : "tidak ada", "unknown"),
    row("offscreen", "OffscreenCanvas", typeof OffscreenCanvas !== "undefined" ? "ada" : "tidak", "ok"),
    row("share", "Bagikan", present("share", navigator) ? "ada" : "tidak ada", "unknown"),
    row(
      "heap",
      "Heap JS",
      memory ? `${bytes(memory.usedJSHeapSize)} / ${bytes(memory.jsHeapSizeLimit)}` : "disembunyikan",
      heapRatio > 0.9 ? "warn" : memory ? "ok" : "unknown",
      { grade: Boolean(memory) },
    ),
    row("ua", "Agen", navigator.userAgent, "ok"),
    row("vendor", "Vendor", navigator.vendor || "—", "ok"),
    row(
      "posture",
      "Postur",
      nav.devicePosture?.type || "tidak dilaporkan",
      nav.devicePosture?.type ? "ok" : "unknown",
    ),
    row("fscreen", "Fullscreen", document.fullscreenEnabled ? "ada" : "tidak", "ok"),
    row("vis", "Visibilitas", document.visibilityState, "ok"),
  ];

  const byId: Record<CategoryId, Fact[]> = {
    sistem,
    layar,
    sensor,
    audio,
    kamera,
    daya,
    jaringan,
    gpu: gpuFacts,
    izin: perms,
    akar,
  };

  return {
    at: new Date().toISOString(),
    categories: CATEGORY_META.map((meta) => ({ ...meta, facts: byId[meta.id] })),
  };
}
