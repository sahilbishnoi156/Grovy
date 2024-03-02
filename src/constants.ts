const COLOR_EXTENSION_MAP = [ { txt: "#3f51b5" }, { log: "#00bcd4" }, { ini: "#263238" }, { conf: "#e0e0e0" }, { cfg: "#90a4ae" }, { properties: "#bdbdbd" }, { xml: "#757575" }, { xsl: "#616161" }, { xsd: "#424242" }, { json: "#212121" }, { csv: "#f5f5f5" }, { tsv: "#d50000" }, { html: "#121212" }, { htm: "#2196f3" }, { css: "#4caf50" }, { less: "#ffeb3b" }, { scss: "#ff9800" }, { sass: "#f44336" }, { js: "#9c27b0" }, { jsx: "#607d8b" }, { mjs: "#e91e63" }, { cjs: "#795548" }, { coffee: "#9e9e9e" }, { litcoffee: "#ffc107" }, { cs: "#ff5722" }, { pl: "#ffeb3b" }, { pm: "#cddc39" }, { py: "#ffeb3b" }, { rs: "#ffc107" }, { rsx: "#ff9800" }, { png: "#ff5722" }, { jpg: "#795548" }, { jpeg: "#607d8b" }, { bmp: "#e0e0e0" }, { gif: "#9e9e9e" }, { tif: "#607d8b" }, { tiff: "#795548" }, { ico: "#f44336" }, { svg: "#e91e63" }, { webp: "#9c27b0" }, { mp3: "#2196f3" }, { wav: "#4caf50" }, { ogg: "#ffeb3b" }, { aac: "#ffc107" }, { flac: "#ff9800" }, { m4a: "#ff5722" }, { mp4: "#563d7c" }, { webm: "#9e9e9e" }, { avi: "#607d8b" }, { mov: "#795548" }, { mkv: "#e0e0e0" }, { zip: "#9e9e9e" }, { rar: "#607d8b" }, { "7z": "#ffeb3b" }, { gz: "#ffc107" }, { gzip: "#ff9800" }, { tar: "#ff5722" }, { bz2: "#f44336" }, { xz: "#9c27b0" }, { iso: "#2196f3" }, { dmg: "#4caf50" }, { deb: "#ffeb3b" }, { rpm: "#ffc107" }, { jar: "#ff9800" }, { war: "#ff5722" }, { ear: "#f44336" }, { apk: "#9e9e9e" }, { doc: "#607d8b" }, { docx: "#795548" }, { dot: "#e91e63" }, { dotx: "#9c27b0" }, { odt: "#2196f3" }, { ott: "#4caf50" }, { rtf: "#ffeb3b" }, { tex: "#ffc107" }, { pdf: "#ff9800" }, { ps: "#ff5722" }, { eps: "#f44336" }, { ttf: "#9e9e9e" }, { otf: "#607d8b" }, { woff: "#795548" }, { woff2: "#e0e0e0" }, { eot: "#9e9e9e" }, { svg: "#607d8b" }, { exe: "#ffeb3b" }, { dmg: "#ffc107" }, { deb: "#ff9800" }, { rpm: "#ff5722" }, { msi: "#f44336" }, { apk: "#9c27b0" }, { ipa: "#2196f3" },{ mdj: "#ffeb3b" }
];

const SORT_BY = [
  {
    name: "Newest",
    value: "desc",
  },
  {
    name: "Oldest",
    value: "asc",
  },
  {
    name: "Name",
    value: "filename",
  },
];

const DEFAULT_CARDS: any = [
  // 1
  {
    description: "Look into render bug in dashboard",
    id: "1",
    categoryId: "I3DRAIBSvEUt7diy1ARa",
  },
  {
    description: "SOX compliance checklist",
    id: "2",
    categoryId: "I3DRAIBSvEUt7diy1ARa",
  },
  {
    description: "[SPIKE] Migrate to Azure",
    id: "3",
    categoryId: "I3DRAIBSvEUt7diy1ARa",
  },
  {
    description: "Document Notifications service",
    id: "4",
    categoryId: "I3DRAIBSvEUt7diy1ARa",
  },
  // TODO
  {
    description: "Research DB options for new microservice",
    id: "5",
    categoryId: "M2HRR47cuXODlB1Fzytp",
  },
  {
    description: "Postmortem for outage",
    id: "6",
    categoryId: "M2HRR47cuXODlB1Fzytp",
  },
  {
    description: "Sync with product on Q3 roadmap",
    id: "7",
    categoryId: "M2HRR47cuXODlB1Fzytp",
  },

  // DOING
  {
    description: "Refactor context providers to use Zustand",
    id: "8",
    categoryId: "Xjn3qszpd6tWxYCpk71j",
  },
  {
    description: "Add logging to daily CRON",
    id: "9",
    categoryId: "Xjn3qszpd6tWxYCpk71j",
  },
  // DONE
  {
    description: "Set up DD dashboards for Lambda listener",
    id: "10",
    categoryId: "Xjn3qszpd6tWxYCpk71j",
  },
];

const CATEGORY_COLOR = [
  {
    text: "text-neutral-400",
    backgroundColor: "bg-neutral-400",
  },
  {
    text: "text-blue-500",
    backgroundColor: "bg-blue-500",
  },
  {
    text: "text-green-500",
    backgroundColor: "bg-green-500",
  },
  {
    text: "text-yellow-500",
    backgroundColor: "bg-yellow-500",
  },
  {
    text: "text-red-500",
    backgroundColor: "bg-red-500",
  },
];

export { COLOR_EXTENSION_MAP, SORT_BY, DEFAULT_CARDS, CATEGORY_COLOR };
