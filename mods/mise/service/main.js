// src/service/main.ts
import http from "node:http";
import { homedir } from "node:os";
// node_modules/@openchamber/sdk/dist/scrollbar-style.js
var GUEST_SCROLLING_ATTRIBUTE = "data-oc-scrolling";
var GUEST_SCROLLBAR_CSS = `
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${GUEST_SCROLLING_ATTRIBUTE}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${GUEST_SCROLLING_ATTRIBUTE}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;
function installGuestScrollbarActivity(doc) {
  const root = doc.documentElement;
  if (root.hasAttribute("data-oc-scrollbar-activity"))
    return;
  root.setAttribute("data-oc-scrollbar-activity", "");
  const timers = new WeakMap;
  doc.addEventListener("scroll", (event) => {
    const target = event.target === doc ? root : event.target;
    if (!(target instanceof Element))
      return;
    if (!target.hasAttribute("data-oc-scrolling"))
      target.setAttribute("data-oc-scrolling", "");
    const pending = timers.get(target);
    if (pending !== undefined)
      clearTimeout(pending);
    timers.set(target, setTimeout(() => {
      timers.delete(target);
      target.removeAttribute("data-oc-scrolling");
    }, 1000));
  }, { capture: true, passive: true });
}
var GUEST_SCROLLBAR_SCRIPT = `(${installGuestScrollbarActivity.toString()})(document);`;
// node_modules/@openchamber/sdk/dist/manifest.js
var GUEST_PROVIDER_LOGO_BYTES_MAX = 1024 * 1024;
var TRACKER_URL_TOKENS = ["{id}", "{segment}", "{segments+}"];
var TRACKER_URL_TOKEN_SET = new Set(TRACKER_URL_TOKENS);
// node_modules/@openchamber/sdk/dist/session-events.js
var GUEST_SESSION_EVENT_TYPES = [
  "turn-finished",
  "turn-failed",
  "permission-asked",
  "question-asked",
  "turn-started",
  "session-created",
  "session-archived",
  "session-deleted"
];
var SESSION_EVENTS_IDLE_MS = 10 * 60000;
var EVENT_TYPES = new Set(GUEST_SESSION_EVENT_TYPES);
// node_modules/@openchamber/sdk/dist/service-host.js
var SERVICE_HOST_PATH = "/service/call";
var OPENCHAMBER_HOST_CALLBACK_URL_ENV = "OPENCHAMBER_HOST_CALLBACK_URL";
var SERVICE_HOST_TIMEOUT_MS = 30000;
var SERVICE_SCHEDULE_IDLE_MS = 10 * 60000;
var MENTIONS_IDLE_MS = 10 * 60000;
class ServiceHostError extends Error {
  code;
  status;
  constructor(message, code, status) {
    super(message);
    this.name = "ServiceHostError";
    this.code = code;
    this.status = status;
  }
}
var createServiceHost = ({ env }) => {
  const call = async (method, input) => {
    const base = env[OPENCHAMBER_HOST_CALLBACK_URL_ENV];
    const token = env.OPENCHAMBER_SERVICE_TOKEN;
    if (!base || !token)
      throw new ServiceHostError("This service was not started by OpenChamber.", "HOST_UNAVAILABLE", 0);
    let response;
    try {
      response = await fetch(`${base.replace(/\/+$/, "")}${SERVICE_HOST_PATH}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ method, input }),
        signal: AbortSignal.timeout(SERVICE_HOST_TIMEOUT_MS)
      });
    } catch {
      throw new ServiceHostError("OpenChamber did not answer.", "HOST_UNAVAILABLE", 0);
    }
    const body = await response.json().catch(() => null);
    if (response.ok && body?.result !== undefined)
      return body.result;
    throw new ServiceHostError(body?.error?.message ?? `OpenChamber answered HTTP ${response.status}.`, body?.error?.code ?? "HOST_UNAVAILABLE", response.status);
  };
  return {
    sessions: {
      start: (input) => call("sessions.start", input),
      send: (sessionId, prompt) => call("sessions.send", { sessionId, prompt }),
      retry: (sessionId) => call("sessions.retry", { sessionId }),
      status: (sessionId) => call("sessions.status", { sessionId }),
      lastReply: (sessionId) => call("sessions.lastReply", { sessionId }),
      stop: (sessionId) => call("sessions.stop", { sessionId }),
      answerPermission: (sessionId, requestId, answer) => call("sessions.answerPermission", { sessionId, requestId, ...answer }),
      answerForm: (sessionId, formId, values, message) => call("sessions.answerForm", { sessionId, formId, values, ...message === undefined ? {} : { message } })
    },
    setInstructions: (directory, text) => call("instructions.set", { directory, text }),
    emit: (topic, data) => call("panels.emit", { topic, data }),
    readSettings: () => call("settings.read", {}).then(({ settings }) => settings),
    needsConfiguration: (message) => call("status.set", { needsConfiguration: message }),
    setMark: (target, mark) => call("marks.set", { target, mark })
  };
};
// node_modules/@openchamber/sdk/dist/file-editor.js
var patternExpressions = new Map;
// node_modules/@openchamber/sdk/dist/contract.js
var GUEST_FILE_STAT_KINDS = ["file", "directory", "other", "missing"];
var GUEST_GENERATE_LATE_KEEP_MS = 60 * 60000;
var HOST_REQUEST_ERROR_CODES = [
  "HOST_UNAVAILABLE",
  "HOST_TIMEOUT",
  "HOST_REJECTED",
  "DISCONNECTED",
  "DISABLED",
  "BAD_PATH",
  "NO_INTEGRATION",
  "NO_SERVICE",
  "SERVICE_FAILED",
  "REQUEST_FAILED",
  "RESPONSE_TOO_LARGE",
  "NO_SESSION",
  "SESSION_BUSY",
  "NOT_GRANTED",
  "NO_DIRECTORY",
  "NOT_FOUND",
  "FILE_TOO_LARGE",
  "DENIED",
  "NO_MODEL",
  "MODEL_FAILED",
  "UNSUPPORTED"
];
var SERVICE_STATUS_VALUES = ["stopped", "starting", "ready", "failed"];
var hostRequestErrorCodeSet = new Set(HOST_REQUEST_ERROR_CODES);
var serviceStatusSet = new Set(SERVICE_STATUS_VALUES);
var fileStatKindSet = new Set(GUEST_FILE_STAT_KINDS);
var HOST_PUSH_TYPES = new Set([
  "workspace",
  "shells",
  "ready",
  "directory",
  "session",
  "connection",
  "settings",
  "session-lifecycle",
  "item",
  "resolve",
  "action",
  "service-event",
  "status-control-event",
  "popover-closed",
  "file-open",
  "file-snapshot",
  "file-saved",
  "generate-late",
  "microphone-audio",
  "microphone-ended"
]);
// node_modules/@openchamber/sdk/dist/service-providers.js
var BROWSER_CONTROL_ACTIONS = [
  "browser.open",
  "browser.snapshot",
  "browser.click",
  "browser.type",
  "browser.select",
  "browser.scroll",
  "browser.back",
  "browser.forward",
  "browser.inspect",
  "browser.capture",
  "browser.resize",
  "browser.close"
];
var BROWSER_PROVIDER_IDLE_MS = 10 * 60000;
var CONTROL_ACTIONS = new Set(BROWSER_CONTROL_ACTIONS);
var SOURCE_CONTROL_PROVIDER_IDLE_MS = 10 * 60000;
var NOTIFICATIONS_PROVIDER_IDLE_MS = 10 * 60000;
var TRACKER_PROVIDER_IDLE_MS = 10 * 60000;
var QUOTA_PROVIDER_IDLE_MS = 10 * 60000;
// node_modules/@openchamber/sdk/dist/service-surface.js
var SURFACE_CONTROLLERS = ["none", "agent", "user"];
var CONTROLLERS = new Set(SURFACE_CONTROLLERS);
// src/shared/types.ts
var PARTS = ["tasks", "tools", "configs"];

// src/service/discover.ts
import { accessSync, constants, statSync } from "node:fs";
import { delimiter, isAbsolute, join } from "node:path";
var executable = (file) => {
  try {
    if (!statSync(file).isFile())
      return false;
    accessSync(file, constants.X_OK);
    return true;
  } catch {
    return false;
  }
};
var pathEntries = (env) => (env.PATH ?? "").split(delimiter).filter((entry) => entry !== "" && isAbsolute(entry));
var fallbackCandidates = (home) => [
  "/opt/homebrew/bin/mise",
  "/usr/local/bin/mise",
  join(home, ".local/bin/mise"),
  join(home, ".local/share/mise/bin/mise"),
  join(home, ".cargo/bin/mise"),
  "/usr/bin/mise"
];
var findProgram = (name, env, fallbacks = []) => {
  const searched = [];
  for (const dir of pathEntries(env)) {
    const candidate = join(dir, name);
    searched.push(candidate);
    if (executable(candidate))
      return { found: { path: candidate, via: "PATH" }, searched };
  }
  for (const candidate of fallbacks) {
    if (searched.includes(candidate))
      continue;
    searched.push(candidate);
    if (executable(candidate))
      return { found: { path: candidate, via: "fallback" }, searched };
  }
  return { found: null, searched };
};

// src/service/normalize.ts
import { join as join3, relative, sep as sep2 } from "node:path";

// src/service/scope.ts
import { realpath, stat } from "node:fs/promises";
import { basename, dirname, isAbsolute as isAbsolute2, join as join2, sep } from "node:path";

// src/service/run.ts
import { spawn } from "node:child_process";
var run = (file, args, options) => new Promise((resolve) => {
  let stdout = "";
  let stderr = "";
  let bytes = 0;
  let timedOut = false;
  let overflow = false;
  let settled = false;
  let child;
  try {
    child = spawn(file, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: false,
      windowsHide: true
    });
  } catch (error) {
    resolve({ code: null, stdout: "", stderr: "", timedOut: false, overflow: false, spawnError: String(error.message ?? error) });
    return;
  }
  const finish = (result) => {
    if (settled)
      return;
    settled = true;
    clearTimeout(timer);
    resolve({ ...result, stdout, stderr });
  };
  const kill = () => {
    child.kill("SIGTERM");
    setTimeout(() => {
      if (child.exitCode === null)
        child.kill("SIGKILL");
    }, 500).unref();
  };
  const timer = setTimeout(() => {
    timedOut = true;
    kill();
  }, options.timeoutMs);
  const take = (chunk, into) => {
    bytes += chunk.length;
    if (bytes > options.maxBytes) {
      if (!overflow) {
        overflow = true;
        kill();
      }
      return;
    }
    if (into === "stdout")
      stdout += chunk.toString("utf8");
    else
      stderr += chunk.toString("utf8");
  };
  child.stdout?.on("data", (chunk) => take(chunk, "stdout"));
  child.stderr?.on("data", (chunk) => take(chunk, "stderr"));
  child.on("error", (error) => finish({ code: null, timedOut, overflow, spawnError: error.message }));
  child.on("close", (code) => finish({ code, timedOut, overflow, spawnError: null }));
});
var ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]/g;
var stderrTail = (stderr, lines = 4) => {
  const kept = stderr.replace(ANSI, "").split(`
`).map((line) => line.trimEnd()).filter((line) => line.trim() !== "").filter((line) => !/^\s*(\||-->|\d+\s*\|)/.test(line)).filter((line) => !/mise (ERROR|WARN) (Version:|Run with --verbose)/.test(line)).filter((line) => !/mise WARN\s+(mise version .* available|self-update is disabled)/.test(line)).map((line) => line.replace(/^mise (ERROR|WARN)\s+/, ""));
  if (!kept.length)
    return null;
  return kept.slice(-lines).join(`
`).slice(0, 1200);
};

// src/service/scope.ts
var under = (path, dir) => path === dir || path.startsWith(dir.endsWith(sep) ? dir : dir + sep);
var tilde = (path, home) => home && under(path, home) ? "~" + path.slice(home.length) : path;
var MISE_CONFIG_FILES = [
  "mise.toml",
  ".mise.toml",
  "mise.local.toml",
  ".mise.local.toml",
  "mise/config.toml",
  ".mise/config.toml",
  ".config/mise.toml",
  ".config/mise/config.toml"
];
var hasMiseConfig = async (dir) => {
  for (const name of MISE_CONFIG_FILES) {
    try {
      if ((await stat(join2(dir, name))).isFile())
        return true;
    } catch {}
  }
  return false;
};
var findMiseProject = async (directory, home) => {
  if (!home || directory === home || !under(directory, home))
    return null;
  if (under(directory, join2(home, ".config")) || under(directory, join2(home, "Library")))
    return null;
  let found = null;
  for (let dir = directory;dir !== home && under(dir, home); dir = dirname(dir)) {
    if (await hasMiseConfig(dir))
      found = dir;
  }
  return found;
};
var fail = (code, message) => ({ ok: false, failure: { error: { code, message } } });
var resolveScope = async (input, ctx) => {
  if (typeof input !== "string" || input.length === 0 || input.length > 4096 || input.includes("\x00")) {
    return fail("bad-request", "No directory was given.");
  }
  if (!isAbsolute2(input))
    return fail("invalid-scope", "The directory must be an absolute path.");
  let directory;
  try {
    directory = await realpath(input);
    if (!(await stat(directory)).isDirectory())
      return fail("invalid-scope", "That path is not a directory.");
  } catch {
    return fail("invalid-scope", "That directory does not exist on the OpenChamber server.");
  }
  if (directory.split(sep).includes(".git"))
    return fail("invalid-scope", "That directory is inside a .git folder.");
  const gitOptions = { cwd: directory, env: ctx.env, timeoutMs: 5000, maxBytes: 64 * 1024 };
  const parsed = await run(ctx.git, ["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-dir", "--git-common-dir"], gitOptions);
  if (parsed.spawnError)
    return fail("no-git", `git could not be started: ${parsed.spawnError}`);
  if (parsed.timedOut)
    return fail("invalid-scope", "git did not answer in time for this directory.");
  if (parsed.code !== 0) {
    const tail = stderrTail(parsed.stderr) ?? "";
    if (!/not a git repository/i.test(tail))
      return fail("invalid-scope", `git could not read this directory: ${tail || `exit ${parsed.code}`}`);
    const project = await findMiseProject(directory, ctx.home);
    if (!project) {
      return fail("invalid-scope", "This directory is not in a git checkout and no folder above it (inside your home folder) has its own mise config, so mise inspection is off here.");
    }
    return {
      ok: true,
      scope: { kind: "mise", directory, root: project, name: basename(project) || project, branch: null, linkedWorktree: false, label: tilde(directory, ctx.home) }
    };
  }
  const [top = "", gitDir = "", commonDir = ""] = parsed.stdout.split(`
`).map((line) => line.trim());
  if (!top)
    return fail("invalid-scope", "This directory is a bare repository or has no working tree.");
  const root = await realpath(top).catch(() => top);
  if (!under(directory, root))
    return fail("invalid-scope", "The directory resolves outside its git checkout.");
  const [gitReal, commonReal] = await Promise.all([realpath(gitDir).catch(() => gitDir), realpath(commonDir).catch(() => commonDir)]);
  let branch = null;
  const head = await run(ctx.git, ["symbolic-ref", "--short", "-q", "HEAD"], gitOptions);
  if (head.code === 0 && head.stdout.trim())
    branch = head.stdout.trim();
  else {
    const sha = await run(ctx.git, ["rev-parse", "--short", "HEAD"], gitOptions);
    if (sha.code === 0 && sha.stdout.trim())
      branch = `detached @ ${sha.stdout.trim()}`;
  }
  return {
    ok: true,
    scope: {
      kind: "git",
      directory,
      root,
      name: basename(root) || root,
      branch,
      linkedWorktree: gitReal !== commonReal,
      label: tilde(directory, ctx.home)
    }
  };
};

// src/service/normalize.ts
var CONFIG_PARTS = new Set([".config", "mise", ".mise", "conf.d", "tasks"]);
var RUN_LINES_MAX = 40;
var RUN_LINE_CHARS = 400;
var TEXT_MAX = 600;
var text = (value, max = TEXT_MAX) => typeof value === "string" ? value.slice(0, max) : "";
var strings = (value, max = 50) => (Array.isArray(value) ? value : []).map((item) => typeof item === "string" ? item : JSON.stringify(item)).filter((item) => typeof item === "string" && item !== "").slice(0, max).map((item) => item.slice(0, 200));
var configDir = (path) => {
  const parts = path.split(sep2);
  parts.pop();
  while (parts.length > 1 && CONFIG_PARTS.has(parts[parts.length - 1] ?? ""))
    parts.pop();
  return parts.join(sep2) || sep2;
};
var kindOf = (path, where) => {
  if (!path)
    return "computed";
  const dir = configDir(path);
  if (under(path, join3(where.home, ".config", "mise")) || under(path, "/etc/mise") || dir === where.home)
    return "global";
  if (dir === where.root)
    return "root";
  if (under(dir, where.root))
    return "local";
  if (under(where.root, dir))
    return "parent";
  return "other";
};
var sourceOf = (path, where) => {
  const value = typeof path === "string" && path !== "" ? path : null;
  if (!value)
    return { kind: "computed", path: null, label: null };
  const label = under(value, where.root) && value !== where.root ? relative(where.root, value) : tilde(value, where.home);
  return { kind: kindOf(value, where), path: value, label };
};
var KIND_ORDER = { global: 0, parent: 1, other: 2, root: 3, local: 4, computed: 5 };
var runLines = (value) => {
  const entries = (Array.isArray(value) ? value : []).slice(0, 200).map((item) => typeof item === "string" ? item.slice(0, 64000) : JSON.stringify(item) ?? "");
  const lines = entries.flatMap((entry) => entry.split(`
`));
  const run = lines.slice(0, RUN_LINES_MAX).map((line) => line.slice(0, RUN_LINE_CHARS));
  const truncated = lines.length > RUN_LINES_MAX || lines.some((line) => line.length > RUN_LINE_CHARS);
  return { run, truncated };
};
var normalizeTasks = (raw, where) => {
  if (!Array.isArray(raw))
    throw new Error("mise tasks ls did not return a list");
  return raw.filter((task) => typeof task === "object" && task !== null && typeof task.name === "string").slice(0, 500).map((task) => {
    const { run, truncated } = runLines(task.run);
    const dir = typeof task.dir === "string" && task.dir !== "" ? task.dir : null;
    return {
      name: text(task.name, 200),
      aliases: strings(task.aliases, 20),
      description: text(task.description),
      source: sourceOf(task.source, where),
      dir: dir ? under(dir, where.root) ? relative(where.root, dir) || "." : tilde(dir, where.home) : null,
      run,
      runTruncated: truncated,
      depends: strings(task.depends, 30),
      hidden: task.hide === true,
      file: typeof task.file === "string" && task.file !== ""
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};
var normalizeTools = (raw, where) => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    throw new Error("mise ls did not return an object");
  const tools = [];
  for (const [name, list] of Object.entries(raw)) {
    if (!Array.isArray(list))
      continue;
    for (const entry of list.slice(0, 20)) {
      if (typeof entry !== "object" || entry === null)
        continue;
      const item = entry;
      const source = item.source;
      tools.push({
        name: name.slice(0, 200),
        version: text(item.version, 100) || "?",
        requested: typeof item.requested_version === "string" ? item.requested_version.slice(0, 100) : null,
        installed: item.installed === true,
        active: item.active === true,
        source: sourceOf(source?.path, where)
      });
    }
  }
  return tools.slice(0, 300).sort((a, b) => a.name.localeCompare(b.name));
};
var parseTrust = (stdout, home) => {
  const states = new Map;
  for (const line of stdout.split(`
`)) {
    const match = /^(.*):\s+(trusted|untrusted|ignored)\s*$/.exec(line.trim());
    if (!match?.[1] || !match[2])
      continue;
    const dir = match[1] === "~" ? home : match[1].startsWith("~/") ? join3(home, match[1].slice(2)) : match[1];
    states.set(dir, match[2]);
  }
  return states;
};
var normalizeConfigs = (raw, trust, where) => {
  if (!Array.isArray(raw))
    throw new Error("mise config ls did not return a list");
  return raw.filter((entry) => typeof entry === "object" && entry !== null && typeof entry.path === "string").slice(0, 100).map((entry, index) => {
    const source = sourceOf(entry.path, where);
    let state = "unknown";
    if (source.kind === "global")
      state = "trusted";
    else if (trust && source.path)
      state = trust.get(configDir(source.path)) ?? "unknown";
    return { file: { source, tools: strings(entry.tools, 50), trust: state }, index };
  }).sort((a, b) => KIND_ORDER[a.file.source.kind] - KIND_ORDER[b.file.source.kind] || b.index - a.index).map(({ file }) => file);
};

// src/service/inspect.ts
var MISE_TIMEOUT_MS = 8000;
var MISE_MAX_BYTES = 4 * 1024 * 1024;
var OPERATIONS = {
  tasks: ["tasks", "ls", "--json"],
  tools: ["ls", "--current", "--json"],
  configs: ["config", "ls", "--json"],
  trust: ["trust", "--show"]
};
var miseEnv = (base) => {
  const env = {};
  for (const key of ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "LC_ALL", "LC_CTYPE", "USER", "LOGNAME"]) {
    const value = base[key];
    if (typeof value === "string" && value !== "")
      env[key] = value;
  }
  return {
    ...env,
    MISE_SAFE: "1",
    MISE_AUTO_INSTALL: "0",
    MISE_NOT_FOUND_AUTO_INSTALL: "0",
    MISE_EXEC_AUTO_INSTALL: "0",
    MISE_TASK_RUN_AUTO_INSTALL: "0",
    MISE_YES: "0",
    NO_COLOR: "1"
  };
};

class Limiter {
  max;
  maxQueue;
  active = 0;
  queue = [];
  constructor(max, maxQueue) {
    this.max = max;
    this.maxQueue = maxQueue;
  }
  get saturated() {
    return this.queue.length >= this.maxQueue;
  }
  async use(task) {
    if (this.active >= this.max)
      await new Promise((resolve) => this.queue.push(resolve));
    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
      this.queue.shift()?.();
    }
  }
}
var sectionError = (code, message, result) => ({
  code,
  message,
  detail: result ? stderrTail(result.stderr) : null
});
var classify = (result) => {
  if (result.timedOut)
    return sectionError("timeout", `mise did not finish within ${MISE_TIMEOUT_MS / 1000}s and was stopped.`, result);
  if (result.overflow)
    return sectionError("output-too-large", `mise printed more than ${MISE_MAX_BYTES / 1024 / 1024} MB and was stopped.`, result);
  if (result.spawnError)
    return sectionError("mise-failed", `mise could not be started: ${result.spawnError}`);
  if (result.code === 0)
    return null;
  const err = result.stderr;
  if (/disabled in safe mode/i.test(err)) {
    return sectionError("safe-mode-refused", "Safe mode refused part of this config (a template calls exec() or reads files), so mise stopped. Nothing was run, and the inspector does not retry outside safe mode.", result);
  }
  if (/are not trusted/i.test(err))
    return sectionError("untrusted", "mise refused an untrusted config even in safe mode.", result);
  if (/error parsing config file/i.test(err))
    return sectionError("parse-error", "mise could not parse a config file.", result);
  return sectionError("mise-failed", `mise exited with code ${result.code}.`, result);
};
var parse = (result, map) => {
  const failure = classify(result);
  if (failure)
    return { ok: false, error: failure };
  let raw;
  try {
    raw = JSON.parse(result.stdout || "null");
  } catch {
    return { ok: false, error: sectionError("bad-json", "mise answered with output that is not JSON.", result) };
  }
  try {
    return { ok: true, data: map(raw) };
  } catch (error) {
    return { ok: false, error: sectionError("bad-json", String(error.message ?? error), result) };
  }
};
var inspect = async (scope, parts, ctx) => {
  const started = performance.now();
  const options = { cwd: scope.directory, env: ctx.env, timeoutMs: MISE_TIMEOUT_MS, maxBytes: MISE_MAX_BYTES };
  const call = (args) => ctx.limiter.use(() => run(ctx.mise.path, [...args], options));
  const where = { home: ctx.home, root: scope.root, directory: scope.directory };
  const want = new Set(parts);
  const [tasks, tools, configs, trust] = await Promise.all([
    want.has("tasks") ? call(OPERATIONS.tasks) : null,
    want.has("tools") ? call(OPERATIONS.tools) : null,
    want.has("configs") ? call(OPERATIONS.configs) : null,
    want.has("configs") ? call(OPERATIONS.trust) : null
  ]);
  const trustMap = trust && trust.code === 0 && !trust.timedOut && !trust.overflow ? parseTrust(trust.stdout, ctx.home) : null;
  const inspection = { scope, mise: ctx.mise, elapsedMs: 0 };
  if (tasks)
    inspection.tasks = parse(tasks, (raw) => normalizeTasks(raw, where));
  if (tools)
    inspection.tools = parse(tools, (raw) => normalizeTools(raw, where));
  if (configs)
    inspection.configs = parse(configs, (raw) => normalizeConfigs(raw, trustMap, where));
  inspection.elapsedMs = Math.round(performance.now() - started);
  return inspection;
};
var readVersion = async (path, env, home) => {
  const result = await run(path, ["--version"], { cwd: home || "/", env, timeoutMs: 4000, maxBytes: 64 * 1024 });
  if (result.code !== 0)
    return null;
  return /\d{4}\.\d+\.\d+/.exec(result.stdout)?.[0] ?? (result.stdout.trim().split(/\s+/)[0] || null);
};

// src/service/main.ts
var port = Number(process.env.OPENCHAMBER_SERVICE_PORT);
var token = process.env.OPENCHAMBER_SERVICE_TOKEN ?? "";
if (!port || !token) {
  console.error("OPENCHAMBER_SERVICE_PORT and OPENCHAMBER_SERVICE_TOKEN are required");
  process.exit(1);
}
var home = process.env.HOME || homedir();
var env = miseEnv(process.env);
var gitEnv = {
  PATH: env.PATH ?? "/usr/bin:/bin",
  HOME: home,
  GIT_OPTIONAL_LOCKS: "0",
  GIT_TERMINAL_PROMPT: "0",
  LC_ALL: "C"
};
var limiter = new Limiter(4, 24);
var versions = new Map;
var host = createServiceHost({ env: process.env });
var send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
};
var failure = (res, status, code, message, extra = {}) => {
  send(res, status, { error: { code, message, ...extra } });
};
var findMise = async () => {
  const { found, searched } = findProgram("mise", process.env, fallbackCandidates(home));
  if (!found)
    return { mise: null, searched };
  if (!versions.has(found.path))
    versions.set(found.path, readVersion(found.path, env, home));
  return { mise: { path: found.path, via: found.via, version: await versions.get(found.path) }, searched };
};
var findGit = () => findProgram("git", process.env, ["/usr/bin/git", "/opt/homebrew/bin/git", "/usr/local/bin/git"]).found;
var readBody = (req, max = 16 * 1024) => new Promise((resolve) => {
  let body = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > max) {
      resolve(null);
      req.destroy();
    }
  });
  req.on("end", () => resolve(body));
  req.on("error", () => resolve(null));
});
var parseParts = (value) => {
  if (!value)
    return [...PARTS];
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.length || parts.some((part) => !PARTS.includes(part)))
    return null;
  return [...new Set(parts)];
};
var handle = async (req, res) => {
  if (req.headers.authorization !== `Bearer ${token}`)
    return failure(res, 401, "unauthorized", "Unauthorized.");
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/health")
    return send(res, 200, { ok: true });
  if (req.method === "GET" && url.pathname === "/doctor") {
    const { mise, searched } = await findMise();
    return send(res, 200, { mise, git: findGit()?.path ?? null, path: pathEntries(process.env), searched, safe: true });
  }
  if (req.method === "GET" && url.pathname === "/inspect") {
    const parts = parseParts(url.searchParams.get("parts"));
    if (!parts)
      return failure(res, 400, "bad-request", "Unknown part requested.");
    const git = findGit();
    if (!git)
      return failure(res, 503, "no-git", "git was not found on the OpenChamber server, so the checkout cannot be identified.");
    const scope = await resolveScope(url.searchParams.get("directory"), { git: git.path, env: gitEnv, home });
    if (!scope.ok)
      return send(res, scope.failure.error.code === "bad-request" ? 400 : 422, scope.failure);
    const { mise, searched } = await findMise();
    if (!mise) {
      return failure(res, 503, "no-mise", "mise was not found by the OpenChamber service. Install it, or make sure it is on the PATH OpenChamber starts with.", { searched });
    }
    if (limiter.saturated)
      return failure(res, 503, "busy", "Too many mise reads are queued. Try again in a moment.");
    return send(res, 200, await inspect(scope.scope, parts, { mise, env, home, limiter }));
  }
  if (req.method === "POST" && url.pathname === "/pins-changed") {
    const raw = await readBody(req);
    let directory = null;
    try {
      directory = raw ? JSON.parse(raw).directory : null;
    } catch {}
    if (typeof directory !== "string" || directory.length === 0 || directory.length > 4096) {
      return failure(res, 400, "bad-request", "directory is required.");
    }
    try {
      await host.emit("pins", { directory });
      return send(res, 200, { ok: true });
    } catch {
      return send(res, 200, { ok: false });
    }
  }
  return failure(res, 404, "not-found", "Not found.");
};
http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    if (!res.headersSent)
      failure(res, 500, "bad-request", "The mise service failed unexpectedly.");
  });
}).listen(port, "127.0.0.1");
