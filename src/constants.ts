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

  const DEFAULT_CARDS: any= [
    // 1
    { description: "Look into render bug in dashboard", id: "1", categoryId: "I3DRAIBSvEUt7diy1ARa" },
    { description: "SOX compliance checklist", id: "2", categoryId: "I3DRAIBSvEUt7diy1ARa"},
    { description: "[SPIKE] Migrate to Azure", id: "3", categoryId: "I3DRAIBSvEUt7diy1ARa" },
    { description: "Document Notifications service", id: "4", categoryId: "I3DRAIBSvEUt7diy1ARa" },
    // TODO
    {
      description: "Research DB options for new microservice",
      id: "5",
      categoryId: "M2HRR47cuXODlB1Fzytp",
    },
    { description: "Postmortem for outage", id: "6", categoryId: "M2HRR47cuXODlB1Fzytp" },
    { description: "Sync with product on Q3 roadmap", id: "7", categoryId: "M2HRR47cuXODlB1Fzytp"},
  
    // DOING
    {
      description: "Refactor context providers to use Zustand",
      id: "8",
      categoryId: "Xjn3qszpd6tWxYCpk71j",
    },
    { description: "Add logging to daily CRON", id: "9", categoryId: "Xjn3qszpd6tWxYCpk71j" },
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

export {COLOR_EXTENSION_MAP, SORT_BY, DEFAULT_CARDS, CATEGORY_COLOR};

