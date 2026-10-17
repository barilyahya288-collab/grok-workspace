import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Monitor, c as Cpu, d as ChevronRight, f as Camera, g as Activity, h as ArrowLeft, i as RefreshCw, l as Copy, m as AudioLines, o as Layers, p as BatteryMedium, r as Shield, s as Download, t as Wifi, u as CircuitBoard } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-1loPO7pn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200 disabled:opacity-50", {
	variants: { variant: {
		primary: "bg-primary text-ink hover:bg-primary/90",
		outline: "border border-border bg-surface text-fg hover:bg-raised",
		ghost: "bg-transparent text-fg hover:bg-raised",
		danger: "bg-danger text-ink hover:bg-danger/90"
	} },
	defaultVariants: { variant: "primary" }
});
function Button({ className, variant, asChild, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({ variant }), className),
		type: asChild ? void 0 : type ?? "button",
		...props
	});
}
var styles = {
	ok: "bg-primary",
	warn: "bg-primary/50",
	fail: "bg-danger",
	blocked: "bg-muted",
	unknown: "bg-border"
};
function Pip({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("size-2 shrink-0 rounded-full", styles[status], className),
		"aria-hidden": "true"
	});
}
var CATEGORY_META = [
	{
		id: "sistem",
		title: "Sistem",
		hint: "Model, OS, inti, memori"
	},
	{
		id: "layar",
		title: "Layar",
		hint: "Resolusi, warna, sentuhan, Hz"
	},
	{
		id: "sensor",
		title: "Sensor",
		hint: "Gerak, arah, giro, cahaya"
	},
	{
		id: "audio",
		title: "Audio",
		hint: "Speaker, mic, suara sistem"
	},
	{
		id: "kamera",
		title: "Kamera",
		hint: "Lensa, lampu, kendali"
	},
	{
		id: "daya",
		title: "Daya",
		hint: "Baterai, getar, layar nyala"
	},
	{
		id: "jaringan",
		title: "Jaringan",
		hint: "Sinyal, latency, penyimpanan"
	},
	{
		id: "gpu",
		title: "Grafis",
		hint: "GPU, WebGL, tekstur"
	},
	{
		id: "izin",
		title: "Izin",
		hint: "Apa yang situs boleh sentuh"
	},
	{
		id: "akar",
		title: "Akar",
		hint: "API dalam, isolasi, identitas"
	}
];
var LAB_TESTS = [
	{
		id: "layar",
		title: "Layar & piksel mati",
		hint: "Sapu warna penuh, cari titik cacat"
	},
	{
		id: "sentuh",
		title: "Multi-sentuh",
		hint: "Beberapa jari sekaligus"
	},
	{
		id: "speaker",
		title: "Speaker",
		hint: "Nada kiri, kanan, dan stereo"
	},
	{
		id: "mic",
		title: "Mikrofon",
		hint: "Meter tingkat suara langsung"
	},
	{
		id: "kamera",
		title: "Kamera & lampu",
		hint: "Depan, belakang, senter"
	},
	{
		id: "getar",
		title: "Getar",
		hint: "Pola getar motor"
	},
	{
		id: "lokasi",
		title: "Lokasi",
		hint: "GPS, akurasi, ketinggian"
	},
	{
		id: "fps",
		title: "Kelancaran",
		hint: "Sampel frame layar"
	},
	{
		id: "cpu",
		title: "Prosesor",
		hint: "Throughput singkat"
	},
	{
		id: "simpan",
		title: "Penyimpanan lokal",
		hint: "Tulis lalu baca 64 KB"
	},
	{
		id: "klip",
		title: "Papan klip",
		hint: "Tulis lalu baca kembali"
	},
	{
		id: "bluetooth",
		title: "Bluetooth",
		hint: "Minta satu perangkat terdekat"
	}
];
var LAB_KEY = "akar.lab.v1";
function within(promise, ms, fallback) {
	return new Promise((resolve) => {
		const timer = window.setTimeout(() => resolve(fallback), ms);
		promise.then((value) => {
			window.clearTimeout(timer);
			resolve(value);
		}, () => {
			window.clearTimeout(timer);
			resolve(fallback);
		});
	});
}
function row(id, label, value, status, extra) {
	return {
		id,
		label,
		value,
		status,
		detail: extra?.detail,
		grade: extra?.grade
	};
}
function tally(facts) {
	const t = {
		ok: 0,
		warn: 0,
		fail: 0,
		blocked: 0,
		unknown: 0
	};
	for (const fact of facts) t[fact.status] += 1;
	return t;
}
function flatFacts(report) {
	return report.categories.flatMap((category) => category.facts);
}
function healthScore(facts) {
	const graded = facts.filter((fact) => fact.grade && fact.status !== "unknown" && fact.status !== "blocked");
	if (!graded.length) return 0;
	const points = graded.reduce((sum, fact) => {
		if (fact.status === "ok") return sum + 1;
		if (fact.status === "warn") return sum + .5;
		return sum;
	}, 0);
	return Math.round(points / graded.length * 100);
}
function worst(facts) {
	if (facts.some((fact) => fact.status === "fail")) return "fail";
	if (facts.some((fact) => fact.status === "warn")) return "warn";
	if (facts.some((fact) => fact.status === "blocked")) return "blocked";
	if (facts.some((fact) => fact.status === "ok")) return "ok";
	return "unknown";
}
function bytes(n) {
	if (!Number.isFinite(n) || n < 0) return "—";
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	];
	let value = n;
	let index = 0;
	while (value >= 1024 && index < units.length - 1) {
		value /= 1024;
		index += 1;
	}
	const digits = value >= 10 || index === 0 ? 0 : 1;
	return `${value.toFixed(digits)} ${units[index]}`;
}
function duration(sec) {
	if (!Number.isFinite(sec) || sec < 0) return "—";
	const hours = Math.floor(sec / 3600);
	const mins = Math.floor(sec % 3600 / 60);
	if (hours > 48) return `${Math.round(hours)} jam`;
	if (hours > 0) return `${hours} jam ${mins} mnt`;
	return `${mins} mnt`;
}
function tzOffset(date = /* @__PURE__ */ new Date()) {
	const minutes = -date.getTimezoneOffset();
	const sign = minutes >= 0 ? "+" : "-";
	const abs = Math.abs(minutes);
	const hours = Math.floor(abs / 60);
	const mins = abs % 60;
	return `UTC${sign}${hours}${mins ? `:${String(mins).padStart(2, "0")}` : ""}`;
}
function formatOps(opsPerSec) {
	if (opsPerSec >= 1e6) return `${(opsPerSec / 1e6).toFixed(1)} juta op/dtk`;
	if (opsPerSec >= 1e3) return `${Math.round(opsPerSec / 1e3)} ribu op/dtk`;
	return `${Math.round(opsPerSec)} op/dtk`;
}
function sampleFps(ms) {
	return new Promise((resolve) => {
		let frames = 0;
		const start = performance.now();
		let handle = 0;
		const timer = window.setTimeout(() => {
			cancelAnimationFrame(handle);
			resolve(null);
		}, ms + 900);
		const loop = (now) => {
			frames += 1;
			if (now - start >= ms) {
				window.clearTimeout(timer);
				resolve(Math.round(frames * 1e3 / (now - start)));
			} else handle = requestAnimationFrame(loop);
		};
		handle = requestAnimationFrame(loop);
	});
}
function benchCpu(ms) {
	const start = performance.now();
	let x = 305419896;
	let count = 0;
	while (performance.now() - start < ms) {
		x = Math.imul(x ^ x >>> 13, 1540483477);
		count += 1;
	}
	const elapsed = Math.max(1, performance.now() - start);
	return count / (elapsed / 1e3);
}
function gradeFps(fps) {
	if (fps == null) return {
		status: "unknown",
		value: "tidak terukur"
	};
	if (fps < 30) return {
		status: "fail",
		value: `${fps} Hz`
	};
	if (fps < 50) return {
		status: "warn",
		value: `${fps} Hz`
	};
	return {
		status: "ok",
		value: `${fps} Hz`
	};
}
function brandLine(list) {
	if (!list?.length) return "";
	const cleaned = list.filter((item) => !/not.?a.?brand/i.test(item.brand));
	return (cleaned.length ? cleaned : list).map((item) => `${item.brand} ${item.version}`.trim()).join(" · ");
}
async function readEntropy() {
	const ua = navigator.userAgentData;
	if (!ua) return {};
	const base = {
		mobile: ua.mobile,
		platform: ua.platform,
		fullVersionList: ua.brands
	};
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
			"formFactors"
		]);
		const brands = Array.isArray(raw.fullVersionList) ? raw.fullVersionList.flatMap((item) => {
			if (!item || typeof item !== "object") return [];
			const entry = item;
			if (typeof entry.brand !== "string") return [];
			return [{
				brand: entry.brand,
				version: typeof entry.version === "string" ? entry.version : ""
			}];
		}) : base.fullVersionList;
		return {
			...base,
			architecture: typeof raw.architecture === "string" ? raw.architecture : void 0,
			bitness: typeof raw.bitness === "string" ? raw.bitness : void 0,
			model: typeof raw.model === "string" && raw.model ? raw.model : void 0,
			platform: typeof raw.platform === "string" ? raw.platform : base.platform,
			platformVersion: typeof raw.platformVersion === "string" ? raw.platformVersion : void 0,
			uaFullVersion: typeof raw.uaFullVersion === "string" ? raw.uaFullVersion : void 0,
			wow64: typeof raw.wow64 === "boolean" ? raw.wow64 : void 0,
			formFactors: Array.isArray(raw.formFactors) ? raw.formFactors.map(String) : void 0,
			fullVersionList: brands
		};
	} catch {
		return base;
	}
}
async function readBattery() {
	const nav = navigator;
	if (!nav.getBattery) return null;
	try {
		return await nav.getBattery();
	} catch {
		return null;
	}
}
async function readPerm(name) {
	try {
		if (!navigator.permissions?.query) return "absent";
		return (await navigator.permissions.query({ name })).state;
	} catch {
		return "absent";
	}
}
function permFact(id, label, state) {
	if (state === "granted") return row(id, label, "diizinkan", "ok");
	if (state === "prompt") return row(id, label, "menunggu izin", "blocked");
	if (state === "denied") return row(id, label, "ditolak", "warn");
	return row(id, label, "tidak didukung", "unknown");
}
function readGpu() {
	const empty = {
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
		soft: false
	};
	try {
		const canvas = document.createElement("canvas");
		const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
		if (!gl) return empty;
		const debug = gl.getExtension("WEBGL_debug_renderer_info");
		const vendor = debug ? String(gl.getParameter(debug.UNMASKED_VENDOR_WEBGL)) : String(gl.getParameter(gl.VENDOR));
		const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
		const anisoExt = gl.getExtension("EXT_texture_filter_anisotropic");
		const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
		const webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
		const samples = webgl2 ? String(gl.getParameter(gl.MAX_SAMPLES)) : "—";
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
			soft: /swiftshader|llvmpipe|softpipe|software/i.test(renderer)
		};
	} catch {
		return empty;
	}
}
async function voiceSummary() {
	if (typeof speechSynthesis === "undefined") return {
		count: 0,
		sample: "tidak ada"
	};
	const read = () => speechSynthesis.getVoices();
	if (!read().length) await new Promise((resolve) => {
		const timer = window.setTimeout(resolve, 200);
		speechSynthesis.onvoiceschanged = () => {
			window.clearTimeout(timer);
			resolve();
		};
	});
	const list = read();
	const picked = list.find((voice) => voice.default) ?? list[0];
	return {
		count: list.length,
		sample: picked ? `${picked.name} (${picked.lang})` : "belum dimuat"
	};
}
function present(name, host) {
	return name in host;
}
async function readWebGpu() {
	const gpu = navigator.gpu;
	if (!gpu) return "WebGPU tidak ada di browser ini.";
	try {
		const adapter = await Promise.race([gpu.requestAdapter(), new Promise((resolve) => window.setTimeout(() => resolve(null), 2e3))]);
		if (!adapter) return "Adaptor tidak diberikan.";
		const info = adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : adapter.info;
		return [
			info?.vendor,
			info?.architecture,
			info?.device,
			info?.description
		].filter(Boolean).join(" · ") || "Adaptor ada, identitas disembunyikan.";
	} catch (error) {
		return error instanceof Error ? error.message : "WebGPU gagal.";
	}
}
async function requestMotionAccess() {
	const events = [DeviceMotionEvent, DeviceOrientationEvent];
	let needed = false;
	try {
		for (const event of events) {
			if (typeof event.requestPermission !== "function") continue;
			needed = true;
			if (await event.requestPermission() !== "granted") return "denied";
		}
	} catch {
		return "denied";
	}
	return needed ? "granted" : "tidak-perlu";
}
function loadLabs() {
	try {
		const raw = localStorage.getItem(LAB_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		return parsed;
	} catch {
		return {};
	}
}
function saveLabs(labs) {
	localStorage.setItem(LAB_KEY, JSON.stringify(labs));
}
function reportText(report, labs) {
	const facts = flatFacts(report);
	const lines = [
		"AKAR · laporan perangkat",
		new Date(report.at).toLocaleString("id-ID"),
		`Skor kesehatan: ${healthScore(facts)}`,
		""
	];
	for (const category of report.categories) {
		lines.push(`# ${category.title}`);
		for (const fact of category.facts) lines.push(`- ${fact.label}: ${fact.value}${fact.detail ? ` (${fact.detail})` : ""} [${fact.status}]`);
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
async function collectProbe() {
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
					labels
				};
			} catch {
				return null;
			}
		})(),
		(async () => {
			try {
				return await navigator.storage?.estimate() ?? null;
			} catch {
				return null;
			}
		})(),
		(async () => {
			try {
				return await navigator.storage?.persisted?.() ?? null;
			} catch {
				return null;
			}
		})(),
		Promise.all([
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
			["local-fonts", "Font lokal"]
		].map(async ([name, label]) => permFact(name, label, await readPerm(name))))
	]);
	const nav = navigator;
	const bluetoothP = nav.bluetooth?.getAvailability ? within(nav.bluetooth.getAvailability().then((ready) => ready ? "radio siap" : "radio mati atau tidak ada"), 500, "tidak menjawab") : Promise.resolve("API tidak ada");
	const authP = (async () => {
		if (typeof PublicKeyCredential === "undefined") return "tidak ada";
		try {
			return await within(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(), 500, false) ? "autentikator perangkat siap" : "API ada, perangkat tidak menawarkan";
		} catch {
			return "API ada";
		}
	})();
	const [pack, bluetooth, platformAuth, fpsRaw] = await Promise.all([
		pending,
		bluetoothP,
		authP,
		sampleFps(280)
	]);
	const [battery, voices, devices, estimate, persisted, perms] = pack;
	const fpsRead = gradeFps(fpsRaw);
	const cpu = benchCpu(40);
	const gpu = readGpu();
	const connection = nav.connection;
	const memory = performance.memory;
	const timing = performance.getEntriesByType("navigation")[0];
	const coarse = window.matchMedia("(pointer: coarse)").matches;
	const cores = navigator.hardwareConcurrency || 0;
	const model = entropy.model || entropy.platform || navigator.platform || "Perangkat ini";
	const brands = brandLine(entropy.fullVersionList);
	const gamut = window.matchMedia("(color-gamut: rec2020)").matches ? "rec2020" : window.matchMedia("(color-gamut: p3)").matches ? "display-p3" : window.matchMedia("(color-gamut: srgb)").matches ? "srgb" : "tidak diketahui";
	const hdr = window.matchMedia("(dynamic-range: high)").matches;
	const displayMode = [
		"fullscreen",
		"standalone",
		"minimal-ui",
		"browser"
	].find((mode) => window.matchMedia(`(display-mode: ${mode})`).matches) ?? "browser";
	const constraints = navigator.mediaDevices?.getSupportedConstraints?.() ?? {};
	const picked = (keys) => keys.filter((key) => constraints[key]);
	const quota = estimate?.quota ?? 0;
	const usage = estimate?.usage ?? 0;
	const storageRatio = quota > 0 ? usage / quota : 0;
	const heapRatio = memory && memory.jsHeapSizeLimit > 0 ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;
	const link = connection?.effectiveType;
	const ttfb = timing ? timing.responseStart - timing.requestStart : null;
	const sistem = [
		row("model", "Model", model, "ok", { detail: entropy.model ? "UA Client Hints" : "platform, model disembunyikan" }),
		row("os", "Sistem", [entropy.platform, entropy.platformVersion].filter(Boolean).join(" ") || navigator.platform || "—", "ok"),
		row("arch", "Arsitektur", [entropy.architecture, entropy.bitness ? `${entropy.bitness}-bit` : ""].filter(Boolean).join(" · ") || "tidak dilaporkan", entropy.architecture ? "ok" : "unknown"),
		row("browser", "Peramban", brands || "lihat agen di Akar", brands ? "ok" : "unknown"),
		row("full", "Versi penuh", entropy.uaFullVersion || "tidak dilaporkan", entropy.uaFullVersion ? "ok" : "unknown"),
		row("mobile", "Genggam", entropy.mobile == null ? coarse ? "sepertinya" : "tidak" : entropy.mobile ? "ya" : "tidak", "ok"),
		row("cores", "Inti logis", cores ? String(cores) : "—", cores >= 4 ? "ok" : cores >= 2 ? "warn" : "fail", { grade: true }),
		row("ram", "Memori perangkat", nav.deviceMemory ? `${nav.deviceMemory} GB` : "disembunyikan", nav.deviceMemory ? nav.deviceMemory < 2 ? "warn" : "ok" : "unknown", {
			grade: Boolean(nav.deviceMemory),
			detail: "Perkiraan browser, sering dibulatkan"
		}),
		row("cpu", "Throughput", formatOps(cpu), "ok", { detail: "ukur singkat di utas halaman" }),
		row("lang", "Bahasa", navigator.languages.join(", ") || navigator.language, "ok"),
		row("tz", "Zona waktu", `${Intl.DateTimeFormat().resolvedOptions().timeZone} · ${tzOffset()}`, "ok"),
		row("factors", "Faktor bentuk", entropy.formFactors?.join(", ") || "tidak dilaporkan", entropy.formFactors?.length ? "ok" : "unknown")
	];
	const layar = [
		row("screen", "Layar", `${screen.width}×${screen.height}`, "ok", { detail: `area ${screen.availWidth}×${screen.availHeight}` }),
		row("viewport", "Viewport", `${window.innerWidth}×${window.innerHeight}`, "ok"),
		row("dpr", "Rasio piksel", `${window.devicePixelRatio || 1}×`, "ok"),
		row("depth", "Kedalaman warna", `${screen.colorDepth} bit`, screen.colorDepth >= 24 ? "ok" : "warn", { grade: true }),
		row("gamut", "Gamut", gamut, "ok"),
		row("hdr", "HDR", hdr ? "ya" : "tidak", hdr ? "ok" : "unknown"),
		row("orient", "Orientasi", screen.orientation ? `${screen.orientation.type} · ${screen.orientation.angle}°` : "tidak dilaporkan", "ok"),
		row("touch", "Titik sentuh", String(navigator.maxTouchPoints), coarse && navigator.maxTouchPoints < 2 ? "warn" : "ok", {
			grade: coarse,
			detail: coarse ? "pointer kasar" : "pointer halus"
		}),
		row("pointer", "Hover", window.matchMedia("(hover: hover)").matches ? "ada" : "tidak", "ok"),
		row("mode", "Mode tampilan", displayMode, "ok"),
		row("fps", "Frame sampel", fpsRead.value, fpsRead.status, {
			grade: fpsRead.status !== "unknown",
			detail: "sampel singkat, tab harus di depan"
		}),
		row("vv", "Skala visual", window.visualViewport ? `${window.visualViewport.scale.toFixed(2)}×` : "—", "ok"),
		row("scheme", "Skema", window.matchMedia("(prefers-color-scheme: dark)").matches ? "gelap" : "terang", "ok"),
		row("motion", "Kurangi gerak", window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "ya" : "tidak", "ok")
	];
	const sensor = [
		row("motion", "Device Motion", "DeviceMotionEvent" in window ? "ada" : "tidak ada", "DeviceMotionEvent" in window ? "ok" : "unknown"),
		row("orient", "Device Orientation", "DeviceOrientationEvent" in window ? "ada" : "tidak ada", "DeviceOrientationEvent" in window ? "ok" : "unknown"),
		row("ios", "Izin gerakan iOS", typeof DeviceMotionEvent.requestPermission === "function" ? "perlu ketukan" : "tidak perlu", "ok"),
		...[
			"Accelerometer",
			"Gyroscope",
			"LinearAccelerationSensor",
			"GravitySensor",
			"Magnetometer",
			"AbsoluteOrientationSensor",
			"RelativeOrientationSensor",
			"AmbientLightSensor"
		].map((name) => row(name, name, name in window ? "ada" : "tidak ada", name in window ? "ok" : "unknown"))
	];
	const audio = [
		row("mics", "Mikrofon", devices ? String(devices.mics) : "tidak terbaca", devices ? devices.mics > 0 ? "ok" : "warn" : "unknown", {
			grade: Boolean(devices),
			detail: "jumlah, nama butuh izin"
		}),
		row("outs", "Keluaran audio", devices ? String(devices.outs) : "tidak terbaca", devices ? devices.outs > 0 ? "ok" : "unknown" : "unknown"),
		row("webaudio", "Web Audio", typeof AudioContext !== "undefined" ? "ada" : "tidak ada", typeof AudioContext !== "undefined" ? "ok" : "fail", { grade: true }),
		row("voices", "Suara ucapan", String(voices.count), voices.count > 0 ? "ok" : "unknown", { detail: voices.sample }),
		row("aopts", "Kendali audio", picked([
			"echoCancellation",
			"noiseSuppression",
			"autoGainControl",
			"sampleRate"
		]).join(", ") || "tidak dilaporkan", "ok")
	];
	const kamera = [
		row("cams", "Kamera", devices ? String(devices.cams) : "tidak terbaca", devices ? devices.cams > 0 ? "ok" : "warn" : "unknown", { grade: Boolean(devices) }),
		row("labels", "Label perangkat", devices?.labels.length ? devices.labels.join(" · ") : "tersembunyi sampai izin", devices?.labels.length ? "ok" : "blocked"),
		row("vopts", "Kendali video", picked([
			"torch",
			"zoom",
			"focusMode",
			"exposureMode",
			"whiteBalanceMode",
			"facingMode",
			"frameRate"
		]).join(", ") || "tidak dilaporkan", "ok"),
		row("barcode", "Barcode", "BarcodeDetector" in window ? "ada" : "tidak ada", "BarcodeDetector" in window ? "ok" : "unknown"),
		row("pip", "Picture in picture", document.pictureInPictureEnabled ? "ada" : "tidak", document.pictureInPictureEnabled ? "ok" : "unknown"),
		row("capture", "ImageCapture", "ImageCapture" in window ? "ada" : "tidak ada", "ImageCapture" in window ? "ok" : "unknown"),
		row("gum", "getUserMedia", typeof navigator.mediaDevices?.getUserMedia === "function" ? "ada" : "tidak ada", typeof navigator.mediaDevices?.getUserMedia === "function" ? "ok" : "fail", { grade: true })
	];
	const daya = battery ? [
		row("level", "Level", `${Math.round(battery.level * 100)}%`, !battery.charging && battery.level < .15 ? "fail" : !battery.charging && battery.level < .3 ? "warn" : "ok", { grade: true }),
		row("charge", "Mengisi", battery.charging ? "ya" : "tidak", "ok"),
		row("ctime", "Waktu sampai penuh", duration(battery.chargingTime), "ok"),
		row("dtime", "Sisa perkiraan", duration(battery.dischargingTime), "ok")
	] : [row("level", "Baterai", "API disembunyikan", "unknown", { detail: "Chrome sering mematikan Battery Status" })];
	daya.push(row("vib", "Motor getar", typeof navigator.vibrate === "function" ? "ada" : "tidak ada", typeof navigator.vibrate === "function" ? "ok" : "unknown"), row("wake", "Wake Lock", present("wakeLock", navigator) ? "ada" : "tidak ada", present("wakeLock", navigator) ? "ok" : "unknown"));
	const linkStatus = link == null ? "unknown" : link === "slow-2g" ? "fail" : link === "2g" || link === "3g" ? "warn" : "ok";
	const jaringan = [
		row("online", "Daring", navigator.onLine ? "ya" : "tidak", navigator.onLine ? "ok" : "fail", { grade: true }),
		row("type", "Jenis", connection?.type || "tidak dilaporkan", connection?.type ? "ok" : "unknown"),
		row("eff", "Efektif", link || "tidak dilaporkan", linkStatus, { grade: link != null }),
		row("down", "Unduh", connection?.downlink != null ? `${connection.downlink} Mbps` : "—", connection?.downlink != null && connection.downlink < .5 ? "warn" : "ok", { grade: connection?.downlink != null }),
		row("rtt", "RTT jaringan", connection?.rtt != null ? `${connection.rtt} ms` : "—", "ok"),
		row("save", "Hemat data", connection?.saveData ? "aktif" : "tidak", "ok"),
		row("quota", "Kuota penyimpanan", quota ? `${bytes(usage)} / ${bytes(quota)}` : "tidak dilaporkan", storageRatio > .98 ? "fail" : storageRatio > .9 ? "warn" : quota ? "ok" : "unknown", { grade: quota > 0 }),
		row("persist", "Penyimpanan tetap", persisted == null ? "tidak diketahui" : persisted ? "ya" : "belum", persisted ? "ok" : "unknown")
	];
	if (timing) {
		const dns = Math.max(0, timing.domainLookupEnd - timing.domainLookupStart);
		const tcp = Math.max(0, timing.connectEnd - timing.connectStart);
		jaringan.push(row("dns", "DNS", `${Math.round(dns)} ms`, "ok"), row("tcp", "TCP", `${Math.round(tcp)} ms`, "ok"), row("ttfb", "TTFB", ttfb != null ? `${Math.round(ttfb)} ms` : "—", ttfb != null && ttfb > 4e3 ? "fail" : ttfb != null && ttfb > 1500 ? "warn" : "ok", { grade: ttfb != null && ttfb >= 0 }), row("proto", "Protokol", timing.nextHopProtocol || "—", "ok"), row("xfer", "Transfer dokumen", bytes(timing.transferSize), "ok"));
	}
	const gpuFacts = gpu.ok ? [
		row("renderer", "Renderer", gpu.renderer || "—", gpu.soft ? "warn" : "ok", {
			grade: true,
			detail: gpu.soft ? "renderer perangkat lunak" : gpu.vendor
		}),
		row("vendor", "Vendor", gpu.vendor || "—", "ok"),
		row("gl", "WebGL", gpu.webgl2 ? "WebGL 2" : "WebGL 1", "ok"),
		row("version", "Versi", gpu.version, "ok"),
		row("shading", "Shading", gpu.shading, "ok"),
		row("tex", "Tekstur maks", gpu.maxTexture ? `${gpu.maxTexture}px` : "—", "ok"),
		row("view", "Viewport maks", gpu.viewport, "ok"),
		row("aniso", "Anisotropi", gpu.aniso, "ok"),
		row("msaa", "Sampel MSAA", gpu.samples, "ok"),
		row("webgpu", "WebGPU", present("gpu", navigator) ? "ada, belum diminta" : "tidak ada", present("gpu", navigator) ? "ok" : "unknown")
	] : [row("renderer", "WebGL", "konteks gagal", "fail", { grade: true }), row("webgpu", "WebGPU", present("gpu", navigator) ? "ada" : "tidak ada", "unknown")];
	const secure = window.isSecureContext;
	const byId = {
		sistem,
		layar,
		sensor,
		audio,
		kamera,
		daya,
		jaringan,
		gpu: gpuFacts,
		izin: perms,
		akar: [
			row("secure", "Konteks aman", secure ? "ya" : "tidak", secure ? "ok" : "warn", {
				grade: true,
				detail: "HTTPS atau localhost. Banyak sensor mati tanpanya"
			}),
			row("origin", "Asal", location.origin, "ok"),
			row("iso", "Isolasi lintas-asal", window.crossOriginIsolated ? "ya" : "tidak", "unknown", { detail: "SharedArrayBuffer butuh ini" }),
			row("sab", "SharedArrayBuffer", typeof SharedArrayBuffer !== "undefined" ? "ada" : "tidak", "unknown"),
			row("wasm", "WebAssembly", typeof WebAssembly !== "undefined" ? "ada" : "tidak", typeof WebAssembly !== "undefined" ? "ok" : "fail", { grade: true }),
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
			row("heap", "Heap JS", memory ? `${bytes(memory.usedJSHeapSize)} / ${bytes(memory.jsHeapSizeLimit)}` : "disembunyikan", heapRatio > .9 ? "warn" : memory ? "ok" : "unknown", { grade: Boolean(memory) }),
			row("ua", "Agen", navigator.userAgent, "ok"),
			row("vendor", "Vendor", navigator.vendor || "—", "ok"),
			row("posture", "Postur", nav.devicePosture?.type || "tidak dilaporkan", nav.devicePosture?.type ? "ok" : "unknown"),
			row("fscreen", "Fullscreen", document.fullscreenEnabled ? "ada" : "tidak", "ok"),
			row("vis", "Visibilitas", document.visibilityState, "ok")
		]
	};
	return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		categories: CATEGORY_META.map((meta) => ({
			...meta,
			facts: byId[meta.id]
		}))
	};
}
var empty = {
	ax: null,
	ay: null,
	az: null,
	rx: null,
	ry: null,
	rz: null,
	alpha: null,
	beta: null,
	gamma: null,
	heading: null
};
function fmt(value, unit) {
	if (value == null || !Number.isFinite(value)) return "—";
	return `${value.toFixed(2)} ${unit}`;
}
function SensorLive() {
	const [ios, setIos] = (0, import_react.useState)(false);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const [snap, setSnap] = (0, import_react.useState)(empty);
	const [samples, setSamples] = (0, import_react.useState)(0);
	const latest = (0, import_react.useRef)(empty);
	const count = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (typeof DeviceMotionEvent.requestPermission === "function") setIos(true);
		else setArmed(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!armed) return;
		const onMotion = (event) => {
			const accel = event.accelerationIncludingGravity;
			const rot = event.rotationRate;
			latest.current = {
				...latest.current,
				ax: accel?.x ?? null,
				ay: accel?.y ?? null,
				az: accel?.z ?? null,
				rx: rot?.alpha ?? null,
				ry: rot?.beta ?? null,
				rz: rot?.gamma ?? null
			};
			count.current += 1;
		};
		const onOrient = (event) => {
			const heading = event.webkitCompassHeading ?? (event.alpha == null ? null : (360 - event.alpha + 360) % 360);
			latest.current = {
				...latest.current,
				alpha: event.alpha,
				beta: event.beta,
				gamma: event.gamma,
				heading
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
		if (await requestMotionAccess() === "denied") {
			setNote("Izin sensor ditolak.");
			return;
		}
		setNote(null);
		setArmed(true);
	}
	const cells = [
		{
			label: "Aksel X",
			value: fmt(snap.ax, "m/s²")
		},
		{
			label: "Aksel Y",
			value: fmt(snap.ay, "m/s²")
		},
		{
			label: "Aksel Z",
			value: fmt(snap.az, "m/s²")
		},
		{
			label: "Putar α",
			value: fmt(snap.rx, "°/s")
		},
		{
			label: "Putar β",
			value: fmt(snap.ry, "°/s")
		},
		{
			label: "Putar γ",
			value: fmt(snap.rz, "°/s")
		},
		{
			label: "Kemiringan β",
			value: fmt(snap.beta, "°")
		},
		{
			label: "Gulung γ",
			value: fmt(snap.gamma, "°")
		},
		{
			label: "Arah",
			value: fmt(snap.heading, "°")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Pembacaan langsung"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-muted tabular-nums",
					children: [samples, " sampel"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Angka mentah dari gerak dan orientasi. Goyang perangkat kalau nilainya diam."
			}),
			ios && !armed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: () => void allow(),
				children: "Izinkan sensor"
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-3 gap-2",
				children: cells.map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg px-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted",
						children: cell.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-mono text-xs tabular-nums",
						children: cell.value
					})]
				}, cell.label))
			}),
			armed && samples === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Belum ada sampel. Browser ini mungkin menutup sensor."
			}) : null
		]
	});
}
function stamp(status, note) {
	return {
		status,
		note,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function LabList({ results, busy, onOpen, onBack, onQuick }) {
	const done = LAB_TESTS.filter((test) => results[test.id]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onBack,
			className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Ringkasan"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 text-3xl font-semibold tracking-tight",
			children: "Lab fungsi"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				done,
				" dari ",
				LAB_TESTS.length,
				" tes punya hasil. Yang butuh kamera, mic, atau lokasi baru minta izin saat kamu mulai."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-5 w-full",
			disabled: busy,
			onClick: onQuick,
			children: busy ? "Mengukur…" : "Ukur FPS dan CPU"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 border-t border-border",
			children: LAB_TESTS.map((test, index) => {
				const result = results[test.id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(test.id),
					className: "flex min-h-16 w-full items-center gap-3 border-b border-border py-3 text-left transition-colors duration-200 hover:bg-raised",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 font-mono text-xs text-muted",
							children: String(index + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: test.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: result ? result.note : test.hint
							})]
						}),
						result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pip, { status: result.status }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted" })
					]
				}) }, test.id);
			})
		})
	] });
}
function LabTest({ id, onBack, onSave }) {
	const test = LAB_TESTS.find((item) => item.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onBack,
			className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Lab"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 text-3xl font-semibold tracking-tight",
			children: test?.title ?? "Tes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: test?.hint
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [
				id === "layar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "sentuh" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "speaker" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeakerTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "mic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "kamera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "getar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VibrateTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "lokasi" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeoTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "fps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FpsTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "cpu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CpuTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "simpan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "klip" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipTest, { onSave: (result) => onSave(id, result) }) : null,
				id === "bluetooth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtTest, { onSave: (result) => onSave(id, result) }) : null
			]
		})
	] });
}
function Verdict({ onPass, onFail, passLabel = "Berfungsi", failLabel = "Bermasalah" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid grid-cols-2 gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: onPass,
			children: passLabel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: onFail,
			children: failLabel
		})]
	});
}
var SCREEN_STEPS = [
	{
		color: "#ffffff",
		light: true,
		name: "Putih"
	},
	{
		color: "#000000",
		light: false,
		name: "Hitam"
	},
	{
		color: "#ff0000",
		light: false,
		name: "Merah"
	},
	{
		color: "#00ff00",
		light: true,
		name: "Hijau"
	},
	{
		color: "#0000ff",
		light: false,
		name: "Biru"
	},
	{
		color: "#808080",
		light: true,
		name: "Abu"
	}
];
function ScreenTest({ onSave }) {
	const [step, setStep] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
			if (document.fullscreenElement) document.exitFullscreen().catch(() => void 0);
		};
	}, [open]);
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "w-full",
		onClick: () => {
			setOpen(true);
			document.documentElement.requestFullscreen?.().catch(() => void 0);
		},
		children: "Mulai sapuan warna"
	});
	const current = SCREEN_STEPS[step];
	const done = step >= SCREEN_STEPS.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex flex-col",
		style: { background: done ? "#10120e" : current.color },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between p-4",
			style: { color: done || !current.light ? "#e8eadf" : "#14160f" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm",
				children: done ? "Putusan" : `${current.name} · ${step + 1}/${SCREEN_STEPS.length}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 px-3 text-sm font-medium",
				onClick: () => setOpen(false),
				children: "Tutup"
			})]
		}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-end p-5 text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-medium",
				children: "Ada titik mati, garis, atau warna belang?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
				passLabel: "Layar bersih",
				failLabel: "Ada cacat",
				onPass: () => {
					onSave(stamp("ok", "sapuan warna bersih"));
					setOpen(false);
				},
				onFail: () => {
					onSave(stamp("fail", "ada cacat pada sapuan warna"));
					setOpen(false);
				}
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "flex-1 text-sm",
			style: { color: current.light ? "#14160f" : "#e8eadf" },
			onClick: () => setStep((value) => value + 1),
			children: "Ketuk untuk warna berikutnya"
		})]
	});
}
function TouchTest({ onSave }) {
	const [points, setPoints] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [max, setMax] = (0, import_react.useState)(0);
	const box = (0, import_react.useRef)(null);
	function update(event) {
		box.current?.setPointerCapture(event.pointerId);
		setPoints((current) => {
			const next = new Map(current);
			if (event.type === "pointerup" || event.type === "pointercancel") next.delete(event.pointerId);
			else next.set(event.pointerId, {
				x: event.clientX,
				y: event.clientY
			});
			return next;
		});
	}
	(0, import_react.useEffect)(() => {
		setMax((value) => Math.max(value, points.size));
	}, [points]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: box,
		onPointerDown: update,
		onPointerMove: update,
		onPointerUp: update,
		onPointerCancel: update,
		className: "relative h-80 touch-none border border-border bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "pointer-events-none p-4 text-sm text-muted",
			children: [
				"Sentuh dan geser di sini. Maksimum ",
				max,
				" titik."
			]
		}), [...points.entries()].map(([id, point]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary",
			style: {
				left: point.x - (box.current?.getBoundingClientRect().left ?? 0),
				top: point.y - (box.current?.getBoundingClientRect().top ?? 0)
			}
		}, id))]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
		passLabel: "Sentuhan oke",
		failLabel: "Ada zona mati",
		onPass: () => onSave(stamp(max >= 2 ? "ok" : "warn", `maks ${max} titik`)),
		onFail: () => onSave(stamp("fail", `zona mati, maks ${max} titik`))
	})] });
}
function SpeakerTest({ onSave }) {
	const ctx = (0, import_react.useRef)(null);
	const [heard, setHeard] = (0, import_react.useState)({
		left: false,
		right: false,
		both: false
	});
	(0, import_react.useEffect)(() => () => void ctx.current?.close(), []);
	async function play(pan) {
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
			gain.gain.setValueAtTime(1e-4, audio.currentTime);
			gain.gain.exponentialRampToValueAtTime(.18, audio.currentTime + .03);
			gain.gain.exponentialRampToValueAtTime(1e-4, audio.currentTime + .7);
			osc.connect(stereo).connect(gain).connect(audio.destination);
			osc.start();
			osc.stop(audio.currentTime + .75);
		} catch {}
	}
	const all = heard.left && heard.right && heard.both;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void play(-1).then(() => setHeard((h) => ({
					...h,
					left: true
				}))),
				children: "Nada kiri · 440 Hz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void play(1).then(() => setHeard((h) => ({
					...h,
					right: true
				}))),
				children: "Nada kanan · 880 Hz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void play(0).then(() => setHeard((h) => ({
					...h,
					both: true
				}))),
				children: "Stereo tengah"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
				passLabel: "Terdengar",
				failLabel: "Tidak terdengar",
				onPass: () => onSave(stamp(all ? "ok" : "warn", all ? "kiri, kanan, tengah" : "sebagian kanal")),
				onFail: () => onSave(stamp("fail", "speaker tidak terdengar"))
			})
		]
	});
}
function MicTest({ onSave }) {
	const [level, setLevel] = (0, import_react.useState)(0);
	const [peak, setPeak] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const peakRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		let dead = false;
		let stream = null;
		let audio = null;
		let handle = 0;
		(async () => {
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false
				});
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
			audio?.close();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-3 bg-bg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-primary",
				style: { width: `${Math.min(100, Math.round(level * 100))}%` }
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 font-mono text-sm tabular-nums text-muted",
			children: [
				"puncak ",
				Math.round(peak * 100),
				"%"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
			onPass: () => onSave(stamp(peak > .08 ? "ok" : "warn", `puncak ${Math.round(peak * 100)}%`)),
			onFail: () => onSave(stamp(error ? "blocked" : "fail", error ?? "tidak menangkap suara")),
			passLabel: "Mic hidup",
			failLabel: "Tidak masuk"
		})
	] });
}
function CameraTest({ onSave }) {
	const video = (0, import_react.useRef)(null);
	const [facing, setFacing] = (0, import_react.useState)("environment");
	const [error, setError] = (0, import_react.useState)(null);
	const [torch, setTorch] = (0, import_react.useState)(false);
	const [torchOn, setTorchOn] = (0, import_react.useState)(false);
	const track = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let dead = false;
		let stream = null;
		setError(null);
		setTorch(false);
		(async () => {
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: facing },
					audio: false
				});
				if (dead) {
					stream.getTracks().forEach((item) => item.stop());
					return;
				}
				const next = stream.getVideoTracks()[0] ?? null;
				track.current = next;
				const caps = next?.getCapabilities?.();
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
			await current.applyConstraints({ advanced: [{ torch: next }] });
			setTorchOn(next);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Lampu gagal");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-danger",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: video,
			className: "aspect-3/4 w-full bg-bg object-cover",
			playsInline: true,
			muted: true,
			autoPlay: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setFacing((value) => value === "user" ? "environment" : "user"),
				children: facing === "user" ? "Ke belakang" : "Ke depan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: !torch,
				onClick: () => void toggleTorch(),
				children: torch ? torchOn ? "Matikan lampu" : "Nyalakan lampu" : "Lampu tidak ada"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
			passLabel: "Gambar jelas",
			failLabel: "Gambar gagal",
			onPass: () => onSave(stamp("ok", `kamera ${facing}${torchOn ? ", lampu nyala" : ""}`)),
			onFail: () => onSave(stamp(error ? "blocked" : "fail", error ?? "gambar tidak layak"))
		})
	] });
}
function VibrateTest({ onSave }) {
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => () => void navigator.vibrate?.(0), []);
	function pulse() {
		if (typeof navigator.vibrate !== "function") {
			setNote("Browser ini tidak membuka motor getar.");
			return;
		}
		const ok = navigator.vibrate([
			45,
			40,
			45,
			40,
			180,
			70,
			280
		]);
		setNote(ok ? "Pola terkirim. Rasakan di tangan." : "Perangkat menolak getar.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "w-full",
			onClick: pulse,
			children: "Kirim pola getar"
		}),
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
			passLabel: "Terasa",
			failLabel: "Tidak terasa",
			onPass: () => onSave(stamp("ok", "pola getar terasa")),
			onFail: () => onSave(stamp(typeof navigator.vibrate === "function" ? "fail" : "blocked", note ?? "tidak terasa"))
		})
	] });
}
function GeoTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Belum diminta.");
	const [link, setLink] = (0, import_react.useState)(null);
	function locate() {
		if (!navigator.geolocation) {
			setText("Geolokasi tidak ada.");
			return;
		}
		setText("Mencari satelit…");
		navigator.geolocation.getCurrentPosition((pos) => {
			const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
			setLink(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`);
			setText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)} · ±${Math.round(accuracy)} m` + (altitude != null ? ` · tinggi ${Math.round(altitude)} m` : "") + (speed != null ? ` · ${speed.toFixed(1)} m/s` : ""));
		}, (err) => setText(err.message || "Lokasi ditolak"), {
			enableHighAccuracy: true,
			timeout: 12e3,
			maximumAge: 0
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			className: "w-full",
			onClick: locate,
			children: "Baca lokasi"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 font-mono text-sm break-all text-muted",
			children: text
		}),
		link ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			className: "mt-2 inline-flex min-h-11 items-center text-sm text-primary",
			href: link,
			target: "_blank",
			rel: "noreferrer",
			children: "Buka di peta"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Verdict, {
			passLabel: "Akurat",
			failLabel: "Gagal",
			onPass: () => onSave(stamp(link ? "ok" : "warn", text)),
			onFail: () => onSave(stamp(link ? "fail" : "blocked", text))
		})
	] });
}
function FpsTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Belum diukur.");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run() {
		setBusy(true);
		setText("Mengukur 1,5 detik…");
		const graded = gradeFps(await sampleFps(1500));
		setText(graded.value);
		setBusy(false);
		onSave(stamp(graded.status === "unknown" ? "blocked" : graded.status, graded.value));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-3xl tabular-nums",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4 w-full",
		disabled: busy,
		onClick: () => void run(),
		children: busy ? "Mengukur…" : "Ukur lagi"
	})] });
}
function CpuTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Belum diukur.");
	function run() {
		const note = formatOps(benchCpu(160));
		setText(note);
		onSave(stamp("ok", note));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-mono text-3xl tabular-nums",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4 w-full",
		onClick: run,
		children: "Ukur lagi"
	})] });
}
function StoreTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Menulis 64 KB ke penyimpanan lokal perangkat ini.");
	function run() {
		const key = "akar.bench";
		try {
			const payload = "x".repeat(65536);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4 w-full",
		onClick: run,
		children: "Tulis dan baca"
	})] });
}
function ClipTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Tes ini menimpa isi papan klip.");
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
			if (await navigator.clipboard.readText() === token) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4 w-full",
		onClick: () => void run(),
		children: "Tes papan klip"
	})] });
}
function BtTest({ onSave }) {
	const [text, setText] = (0, import_react.useState)("Akan membuka pemilih Bluetooth sistem.");
	const bluetooth = navigator.bluetooth;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: text
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		className: "mt-4 w-full",
		onClick: () => void run(),
		children: "Cari perangkat"
	})] });
}
var ICONS = {
	sistem: Cpu,
	layar: Monitor,
	sensor: Activity,
	audio: AudioLines,
	kamera: Camera,
	daya: BatteryMedium,
	jaringan: Wifi,
	gpu: CircuitBoard,
	izin: Shield,
	akar: Layers
};
function catLine(facts, scanning) {
	if (!facts) return scanning ? "memindai" : "—";
	const counts = tally(facts);
	if (counts.fail) return `${counts.fail} gagal`;
	if (counts.warn) return `${counts.warn} lemah`;
	if (counts.blocked && counts.ok === 0) return "perlu izin";
	return `${counts.ok} baik`;
}
function AkarApp() {
	const [report, setReport] = (0, import_react.useState)(null);
	const [scanning, setScanning] = (0, import_react.useState)(true);
	const [view, setView] = (0, import_react.useState)({ kind: "home" });
	const [labs, setLabs] = (0, import_react.useState)({});
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [copyFail, setCopyFail] = (0, import_react.useState)(false);
	const [issuesOpen, setIssuesOpen] = (0, import_react.useState)(false);
	const [onlyIssues, setOnlyIssues] = (0, import_react.useState)(false);
	const [gpuNote, setGpuNote] = (0, import_react.useState)(null);
	const [gpuBusy, setGpuBusy] = (0, import_react.useState)(false);
	const [quick, setQuick] = (0, import_react.useState)(false);
	const gen = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setLabs(loadLabs());
		scan();
	}, []);
	async function scan() {
		const id = ++gen.current;
		setScanning(true);
		const next = await collectProbe();
		if (gen.current !== id) return;
		setReport(next);
		setScanning(false);
	}
	function writeLab(id, result) {
		setLabs((current) => {
			const next = {
				...current,
				[id]: result
			};
			saveLabs(next);
			return next;
		});
		setView({ kind: "lab" });
	}
	async function quickBench() {
		setQuick(true);
		const fps = gradeFps(await sampleFps(1200));
		writeLabSilent("fps", {
			status: fps.status === "fail" || fps.status === "warn" || fps.status === "ok" ? fps.status : "blocked",
			note: fps.value,
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
		writeLabSilent("cpu", {
			status: "ok",
			note: formatOps(benchCpu(140)),
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
		setQuick(false);
	}
	function writeLabSilent(id, result) {
		setLabs((current) => {
			const next = {
				...current,
				[id]: result
			};
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
	const when = (0, import_react.useMemo)(() => report ? new Date(report.at).toLocaleString("id-ID", {
		dateStyle: "medium",
		timeStyle: "short"
	}) : "", [report]);
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
		const blob = new Blob([JSON.stringify({
			report,
			labs
		}, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `akar-${report.at.slice(0, 19).replace(/[:T]/g, "-")}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-b mx-auto min-h-dvh w-full max-w-5xl px-5 py-6 md:px-8",
		children: [
			view.kind === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:flex md:items-start md:gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "md:sticky md:top-6 md:w-72 md:shrink-0 md:self-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-primary",
							children: "DIAGNOSTIK"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-4xl font-semibold tracking-tight",
							children: "AKAR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-sm text-sm text-muted",
							children: "Hardware, software, dan fungsi perangkat ini — sampai ke sinyal yang situs benar-benar boleh baca."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "akar-ticks mt-4",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-5 border border-border bg-surface p-5",
							"aria-busy": scanning,
							"aria-live": "polite",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-6xl leading-none tabular-nums",
										children: report ? score : "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "pb-1 text-right text-sm text-muted",
										children: ["kesehatan", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 block font-mono text-xs tabular-nums",
											children: [
												graded,
												" metrik · ",
												read,
												" sinyal"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 h-1.5 overflow-hidden bg-bg",
									children: scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "akar-scan h-full w-1/3 bg-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-primary transition-all duration-500 ease-out",
										style: { width: `${score}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-mono text-sm break-words",
									children: model ?? (scanning ? "Memindai perangkat…" : "Siap")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: when || "Skor hanya dari yang terukur, bukan dari daftar API."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "col-span-2",
									onClick: () => setView({ kind: "lab" }),
									children: "Tes fungsi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									disabled: !report,
									onClick: () => void copyReport(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Tersalin" : copyFail ? "Gagal salin" : "Salin"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									disabled: !report,
									onClick: downloadReport,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "JSON"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "mt-2 w-full",
							disabled: scanning,
							onClick: () => void scan(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), scanning ? "Memindai…" : "Pindai ulang"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 md:mt-0",
					children: [
						issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold",
									children: "Perlu dilihat"
								}), issues.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "min-h-11 text-sm text-muted",
									onClick: () => setIssuesOpen((open) => !open),
									children: issuesOpen ? "Sedikit" : `Semua ${issues.length}`
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-1",
								children: (issuesOpen ? issues : issues.slice(0, 4)).map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 border-b border-border py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pip, {
											status: fact.status,
											className: "mt-1.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 text-sm",
											children: fact.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-1/2 text-right font-mono text-sm break-all",
											children: fact.value
										})
									]
								}, fact.id + fact.label))
							})]
						}) : report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-6 text-sm text-muted",
							children: "Tidak ada sinyal lemah pada yang terbaca. Lanjut ke tes fungsi untuk kamera, mic, dan layar."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "border-t border-border",
							children: CATEGORY_META.map((meta) => {
								const Icon = ICONS[meta.id];
								const category = report?.categories.find((item) => item.id === meta.id);
								const status = category ? worst(category.facts) : "unknown";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setView({
										kind: "cat",
										id: meta.id
									}),
									className: "flex min-h-16 w-full items-center gap-3 border-b border-border py-3 text-left transition-colors duration-200 hover:bg-raised",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											className: "size-5 shrink-0 text-muted",
											strokeWidth: 1.75
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-medium",
												children: meta.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-sm text-muted",
												children: meta.hint
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-muted",
											children: catLine(category?.facts, scanning)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pip, { status })
									]
								}) }, meta.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted",
							children: "Bukan APK root. Situs tidak bisa membuka IMEI, nomor seri pabrik, daftar aplikasi, atau folder sistem. Yang ada di sini adalah yang perangkat laporkan ke browser, plus tes yang kamu jalankan sendiri."
						})
					]
				})]
			}) : null,
			view.kind === "cat" ? report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryView, {
				id: view.id,
				report,
				onlyIssues,
				gpuNote,
				gpuBusy,
				onToggleIssues: () => setOnlyIssues((value) => !value),
				onBack: () => setView({ kind: "home" }),
				onOpenTest: (id) => setView({
					kind: "test",
					id
				}),
				onGpu: async () => {
					setGpuBusy(true);
					setGpuNote(await readWebGpu());
					setGpuBusy(false);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Masih memindai…"
			}) : null,
			view.kind === "lab" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabList, {
				results: labs,
				busy: quick,
				onOpen: (id) => setView({
					kind: "test",
					id
				}),
				onBack: () => setView({ kind: "home" }),
				onQuick: () => void quickBench()
			}) : null,
			view.kind === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabTest, {
				id: view.id,
				onBack: () => setView({ kind: "lab" }),
				onSave: writeLab
			}) : null
		]
	});
}
function CategoryView({ id, report, onlyIssues, gpuNote, gpuBusy, onToggleIssues, onBack, onOpenTest, onGpu }) {
	const category = report.categories.find((item) => item.id === id);
	const facts = (category?.facts ?? []).filter((fact) => !onlyIssues || fact.status === "fail" || fact.status === "warn");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onBack,
			className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Ringkasan"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-semibold tracking-tight",
				children: category?.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: category?.hint
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": onlyIssues,
				onClick: onToggleIssues,
				className: "min-h-11 shrink-0 text-sm text-muted",
				children: onlyIssues ? "Semua sinyal" : "Hanya masalah"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-4 border-t border-border",
			children: [facts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "py-6 text-sm text-muted",
				children: "Tidak ada masalah di bagian ini."
			}) : null, facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 border-b border-border py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pip, {
						status: fact.status,
						className: "mt-1.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: fact.label
						}), fact.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: fact.detail
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "w-1/2 text-right font-mono text-sm break-all tabular-nums",
						children: fact.value
					})
				]
			}, fact.id))]
		}),
		id === "sensor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorLive, {}) : null,
		id === "layar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6 w-full",
			onClick: () => onOpenTest("layar"),
			children: "Tes piksel mati"
		}) : null,
		id === "gpu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "w-full",
				disabled: gpuBusy,
				onClick: onGpu,
				children: gpuBusy ? "Meminta adaptor…" : "Baca adaptor WebGPU"
			}), gpuNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-mono text-sm break-all text-muted",
				children: gpuNote
			}) : null]
		}) : null,
		id === "audio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6 w-full",
			onClick: () => onOpenTest("speaker"),
			children: "Tes speaker"
		}) : null,
		id === "kamera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6 w-full",
			onClick: () => onOpenTest("kamera"),
			children: "Buka kamera"
		}) : null,
		id === "daya" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6 w-full",
			onClick: () => onOpenTest("getar"),
			children: "Tes getar"
		}) : null
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkarApp, {});
}
//#endregion
export { Home as component };
