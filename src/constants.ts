// Common file extensions
const commonExtensions: string[] = [
    "txt", "doc", "pdf", "jpg", "jpeg","mpeg", "png", "mp3", "mp4", "xlsx", "pptx", "docx",
    "xls", "ppt", "gif", "zip", "rar", "html", "css", "js", "json", "xml",
    "java", "py", "cpp", "c", "h", "php", "sql", "csv", "tsv", "bmp", "svg",
    "wav", "ogg", "flac", "avi", "mov", "wmv", "mkv", "exe", "bat", "sh",
    "ico", "dll", "ini", "log", "dat", "yaml", "md", "conf", "bak", "tmp", 'mdj',
];

// Generate random hex colors for each extension
const COLOR_EXTENSION_MAP: Record<string, string> = {};
commonExtensions.forEach(ext => {
    COLOR_EXTENSION_MAP[ext] = `#${Math.floor(Math.random()*16777215).toString(16)}`;
});

 
const SORT_BY = [
    {
      name: "Newest",
      value:"desc",
    },
    {
      name: "Oldest",
      value:"asc",
    },
    {
      name: "Name",
      value:"filename",
    },
  ]
export {COLOR_EXTENSION_MAP, SORT_BY};

