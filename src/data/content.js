export const PERSONAL = {
  name: "Moosa Khan",
  email: "contact.moosakhan@gmail.com",
  linkedin: "https://www.linkedin.com/in/moosa-khan-91488b25b/",
  github: "https://github.com/moosakhan2",
  program: "UWaterloo SE '30",
};

export const ABOUT = [
  "Software Engineering student at the University of Waterloo,",
  "building things that actually work — and occasionally things that",
  "just look cool.",
  "",
  "I've done AI research, embedded systems, full-stack web dev, and",
  "a brief but distinguished career teaching Python to confused students.",
  "Currently hunting for a Summer 2026 internship where I can",
  "ship real code and break things responsibly.",
  "",
  "Off the keyboard: you'll find me losing sleep over basketball,",
  "getting destroyed at chess (it's called 'learning'),",
  "strip-mining Minecraft worlds at 2am, and eating my way through",
  "every cuisine known to humanity. If you know a good spot,",
  "I'm already on my way.",
];

export const SKILLS = {
  Languages: ["Python", "C/C++", "Ruby", "JavaScript", "HTML & CSS", "SQL"],
  "Frameworks & Libraries": [
    "PyTorch",
    "NumPy",
    "React.js",
    "Tailwind CSS",
    "Flask",
    "Node.js",
    "PyTest",
    "Google Test",
  ],
  "Developer Tools": ["Unix", "Bash", "Git/GitHub", "Figma", "VS Code"],
};

export const EXPERIENCE = [
  {
    title: "Research Assistant",
    company: "Dr. Freda Shi, University of Waterloo",
    period: "June 2024 – September 2024",
    links: [
      { label: "Live Demo", url: "https://language-gender-experiment.web.app/consent-page" },
      { label: "GitHub Repo", url: "https://github.com/moosakhan2/language-gender-experiment" },
    ],
    bullets: [
      "Developed a scalable web application to collect grammatical gender data from up to 1K participants, enabling multilingual dataset creation across 8 languages.",
      "Used Convolutional Neural Networks (CNNs) to extract visual features including edge sharpness, curvature, and color composition, contributing to cross-linguistic A.I. research.",
      "Developed using HTML & CSS, JavaScript library jsPsych, with Firebase and Node.js for backend infrastructure, integrating with Prolific for participant recruitment and data collection.",
    ],
  },
  {
    title: "Embedded Systems Intern",
    company: "National University of Science and Technology",
    period: "July 2023 – September 2023",
    bullets: [
      "Designed an ESP32-based water monitoring system in C/C++ with an ultrasonic sensor to track irrigation canal water levels in areas lacking traditional infrastructure, integrating Blynk for real-time mobile alerts.",
      "Maintained a weekly progress journal shared with supervisors, and iterated through 3 sensor models achieving a 50% improvement in distance sensor accuracy.",
    ],
  },
  {
    title: "Tech Support and Legal Assistant",
    company: "Salus Legal, part-time",
    period: "July 2025 – February 2026",
    bullets: [
      "Designed and deployed a multilingual intake form for up to 100 clients, automating real-time notifications via Google Apps Script (JavaScript) and reducing manual processing time by 30% per case.",
    ],
  },
  {
    title: "Programming Tutor",
    company: "101Python",
    period: "October 2023 – January 2025",
    bullets: [
      "Taught 6-week Python courses to 20+ students, covering OOP and programming fundamentals from beginner to intermediate level with a 100% completion rate.",
    ],
  },
  {
    title: "Web Developer",
    company: "Flingerz Dog Toys, subcontract",
    period: "March 2024 – May 2024",
    bullets: [
      "Built and customized a WordPress-based retail store locator showcasing 1,200+ locations, expanding the company's reach and enabling retail partnerships.",
    ],
  },
];

export const PROJECTS = [
  {
    name: "GooseMarket",
    links: [{ label: "View Live", url: "https://goosemarket.vercel.app/" }],
    bullets: [
      "Collaborated on a UWaterloo prediction market platform using React (Vite), Flask, and Supabase, allowing students to create and predict outcomes on campus events using fake currency (Goose Dollars), hosted on Vercel.",
      "Developed frontend, backend API endpoints, and PyTest suite while following proper software engineering practices including sprint planning, project charters, domain models, and task documentation.",
    ],
  },
  {
    name: "CoinUp",
    links: [{ label: "View Live", url: "https://www.coinup.ca" }],
    bullets: [
      "Built CoinUp, a payment platform that digitizes loose change by allowing merchants to credit spare change directly to consumers' digital wallets.",
      "Designed and implemented using React (Vite), Node.js, deployed on Firebase with Firestore for scalable data storage, integrating Stripe API and SendGrid API, supporting up to 1K active users.",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "Bachelor of Software Engineering",
    school: "University of Waterloo",
    period: "Sep 2025 – Present",
    location: "Waterloo, ON",
    note: "Expected graduation: 2030",
    bullets: [
      "Awards: University of Waterloo President's Scholarship valued at $2000",
      "Leadership: Elected as Class Representative for the Waterloo Engineering Endowment Foundation (WEEF) helping allocate funds",
    ],
  },
];
