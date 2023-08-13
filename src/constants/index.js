import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  github,
  mysql,
  redis,
  materialui,
  php,
  express,
  chakra,
  clinicProject,
  shirtaiProejct,
  moviedbProject,
  rentRoomProject,
  neoEnergyProject,
  calendarAppProject,
  countrySearcherProject,
  monstruocreativo,
  monstruocreativoacademy,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    id: 1,
    name: "FrontEnd",
    items: [
      {
        name: "HTML 5",
        type: "front",
        icon: html,
      },
      {
        name: "CSS",
        type: "front",

        icon: css,
      },
      {
        name: "JavaScript (ES6+)",
        type: "front",

        icon: javascript,
      },
      {
        name: "TypeScript",
        type: "front",

        icon: typescript,
      },
      {
        name: "React JS",
        type: "front",
        icon: reactjs,
      },
      {
        name: "React Native",
        type: "front",
        icon: reactjs,
      },
      {
        name: "Redux ",
        type: "front",
        icon: "/images/icons/redux.png",
      },
    ],
  },
  {
    id: 2,
    name: "Style and Design",
    items: [
      {
        name: "Tailwind CSS",
        type: "style",

        icon: tailwind,
      },
      {
        name: "Material UI",
        type: "style",

        icon: materialui,
      },
      {
        name: "Chackra UI",
        type: "style",
        icon: chakra,
      },
      {
        name: "figma",
        icon: figma,
      },
    ],
  },
  {
    id: 3,
    name: "Backend",
    items: [
      {
        name: "Node JS",
        type: "backend",
        icon: nodejs,
      },
      {
        name: "MongoDB",
        type: "backend",

        icon: mongodb,
      },
      {
        name: "MYSQL",
        type: "backend",
        icon: mysql,
      },
      {
        name: "Redis",
        type: "backend",
        icon: redis,
      },
      {
        name: "Express JS",
        type: "backend",
        icon: express,
      },
    ],
  },
  {
    id: 4,
    name: "Headless CMS",
    items: [
      {
        name: "PayloadCMS",
        type: "headless",
        icon: "/images/icons/payload.webp",
      },
      {
        name: "Sanity",
        type: "headless",
        icon: "/images/icons/sanity.webp",
      },
    ],
  },
  {
    id: 5,
    name: "Source Control",
    items: [
      {
        name: "Git",
        type: "sourcecontrol",
        icon: git,
      },

      {
        name: "GitHub",
        type: "sourcecontrol",
        icon: github,
      },
    ],
  },
  {
    id: 6,
    name: "Deployment",
    items: [
      {
        name: "AWS",
        type: "deployment",
        icon: "/images/icons/aws.png",
      },
      {
        name: "Digital Ocean",
        type: "deployment",
        icon: "/images/icons/digitalocean.png",
      },
      {
        name: "Heroku",
        type: "deployment",
        icon: "/images/icons/heroku.png",
      },
    ],
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: starbucks,
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: shopify,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  // {
  //   key: 11,
  //   name: "Monstruo Creativo Academy",
  //   description:
  //     "NextJS project intranet for learners, robust system to approach thousands of students ",
  //   tags: [
  //     {
  //       name: "Nextjs",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "Tailwindcss",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "Node JS",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "PayloadCMS",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "DigitalOcean",
  //       color: "green-text-gradient",
  //     },
  //   ],
  //   viewDemo: true,
  //   workingOn: false,
  //   bigProject: true,
  //   image: monstruocreativoacademy,
  //   demoLink: "https://monstruocreativo.academy",
  //   gitHubLink: "",
  // },
  // {
  //   key: 12,
  //   name: "Monstruo Creativo Marketing Website",
  //   description:
  //     "Web 3D WEBGL based project  and stunning user interface for a marketing company",
  //   tags: [
  //     {
  //       name: "Nextjs",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "Tailwindcss",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "Three.js",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "Framer Motion",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "Digital Ocean",
  //       color: "green-text-gradient",
  //     },
  //   ],
  //   viewDemo: true,
  //   workingOn: false,
  //   bigProject: true,
  //   image: monstruocreativo,
  //   demoLink: "https://monstruocreativo.com",
  //   gitHubLink: "",
  // },
  {
    key: 11,
    name: "Pasco Jobs Android",
    description:
      "A Mobile App Platform for Seamless Job Search and Company Branding. Seek new jobs, apply easily, discover new companies around your city and promote your professional profile to get hired. ",
    tags: [
      {
        name: "React Native ",
        color: "blue-text-gradient",
      },
      {
        name: "Redux Toolkit ",
        color: "blue-text-gradient",
      },
      {
        name: "Expo",
        color: "green-text-gradient",
      },
      {
        name: "GraphQL",
        color: "green-text-gradient",
      },
      {
        name: "Axios",
        color: "green-text-gradient",
      },
      {
        name: "React Native Paper",
        color: "blue-text-gradient",
      },
      {
        name: "NodeJS",
        color: "green-text-gradient",
      },
      {
        name: "MongoDB",
        color: "green-text-gradient",
      },
      {
        name: "PayloadCMS",
        color: "green-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: true,
    image: "/images/work/pascojobs.png",
    demoLink: "https://pascojobsperu.com",
    playstoreLink:
      "https://play.google.com/store/apps/details?id=com.godoyliam.pascojobs",
    gitHubLink: "https://github.com/GodoyMS/pasco-jobs-react-native",
    gitHubLinkBackend: "https://github.com/GodoyMS/Pascojobs-backend",
    featured: true,
    other:false

  },
  {
    key: 12,
    name: "Clinics CRM",
    description:
      "Customer relationship management system designed specifically for clinics and healthcare organizations. It allows clinics to manage their patient information, appointments, and billing in one centralized location  ",
    tags: [
      {
        name: "NextJS ",
        color: "blue-text-gradient",
      },
      {
        name: "Redux Toolkit ",
        color: "blue-text-gradient",
      },
      {
        name: "TailwindCSS",
        color: "green-text-gradient",
      },
      {
        name: "Material UI",
        color: "green-text-gradient",
      },
      {
        name: "Axios",
        color: "green-text-gradient",
      },
      {
        name: "Node JS",
        color: "blue-text-gradient",
      },
      {
        name: "Redis",
        color: "green-text-gradient",
      },
      {
        name: "MongoDB",
        color: "green-text-gradient",
      },
      {
        name: "Designs patterns",
        color: "green-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: true,
    image: "/images/work/alphafigma.png",
    demoLink: "https://alpha-clinicas.com/login",
    gitHubLink: "https://github.com/GodoyMS/clinic_crm_nextjs",
    gitHubLinkBackend: "https://github.com/GodoyMS/clinic_crm_backend_nodejs",
    demoLinkSecondVersion:
      "alpha-clinicas.000webhostapp.com/clinicas/index.php",
    gitHubSecondVersion: "https://github.com/GodoyMS/clinicas-software",
    featured: true,
    other:false

  },
  {
    key: 1,
    name: "3D shirt AI generator model",
    description:
      "Web 3D WEBGL based project that allows users to customize a 3D shirt model, powered by AI and Three.js",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Axios",
        color: "green-text-gradient",
      },

      {
        name: "NodeJS",
        color: "pink-text-gradient",
      },
      {
        name: "Three.js",
        color: "green-text-gradient",
      },
      {
        name: "Framer Motion",
        color: "green-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: true,
    image: shirtaiProejct,
    demoLink: "https://shirt-ai-generator.vercel.app/",
    gitHubLink: "https://github.com/GodoyMS/shirt-ai-generator",
    other:false
  },

  // {
  //   key: 3,
  //   name: "Alpha-clinicas",
  //   description:
  //     "Customer relationship management system designed specifically for clinics and healthcare organizations. It allows clinics to manage their patient information, appointments, and billing in one centralized location ",
  //   tags: [
  //     {
  //       name: "PHP, Javascript",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "MYSQL",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "TailwindCSS",
  //       color: "pink-text-gradient",
  //     },
  //   ],
  //   viewDemo: true,
  //   workingOn: false,
  //   bigProject: true,
  //   image: clinicProject,
  //   demoLink: "https://alpha-clinicas.000webhostapp.com/",
  //   gitHubLink: "https://github.com/GodoyMS/clinics_admin_crm",
  // },
  {
    key: 4,
    name: "Movie DB API",
    description:
      "It is designed to retrieve information about movies and suggestions based on what a user explores. It uses 'The movie DB' RESTFUL API for accessing movie data. ",
    tags: [
      {
        name: "ReactJS",
        color: "blue-text-gradient",
      },
      {
        name: "Axios",
        color: "green-text-gradient",
      },
      {
        name: "Styled Components",
        color: "pink-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: true,
    image: moviedbProject,
    demoLink: "https://api-movie-eta.vercel.app/",
    gitHubLink: "https://github.com/GodoyMS/apiMovie",
        other:false

  },
 
  {
    key: 2,
    name: "Iron Mongery Store",
    description:
      "An ecommerce Iron Mongery Store. It shows the products information details and services. It also allows the user to have a functional shopping cart to quote its prices.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "TailwindCSS",
        color: "green-text-gradient",
      },
      {
        name: "Redux",
        color: "pink-text-gradient",
      },
      {
        name: "HTML",
        color: "dsa",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: true,
    image: "/images/work/aceros.jpg",
    demoLink: "https://acerox-comax-cra.vercel.app",
    gitHubLink: "https://github.com/GodoyMS/acerox-comax-cra",
    other:false

  },


  {
    key: 5,
    name: "Rent a Room app",
    description:
      "A project designed to search for a rentroom in everycountry, users can publish a rentroom and be contacted. It uses high performance user information cache",
    tags: [
      {
        name: "ReactJS",
        color: "blue-text-gradient",
      },
      {
        name: "Material UI",
        color: "pink-text-gradient",
      },
      {
        name: "Context API",
        color: "blue-text-gradient",
      },
      {
        name: "NodeJS",
        color: "green-text-gradient",
      },
      {
        name: "MONGODB",
        color: "pink-text-gradient",
      },
      {
        name: "Redis",
        color: "pink-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: true,
    bigProject: true,
    image: rentRoomProject,
    gitHubLink: "https://github.com/GodoyMS/rentroom-app-mern",
    other:true

  },
  {
    key: 6,
    name: "Calendar app",
    description:
      "This project consumes  'Calendar.io' api and it allows user to create/delete events on a fully functional calendar ",
    tags: [
      {
        name: "ReactJS",
        color: "blue-text-gradient",
      },
      {
        name: "NodeJS",
        color: "green-text-gradient",
      },
      {
        name: "MONGODB",
        color: "pink-text-gradient",
      },
      {
        name: "Calendar.io",
        color: "pink-text-gradient",
      },
      {
        name: "Material UI",
        color: "pink-text-gradient",
      },
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: false,
    image: calendarAppProject,
    gitHubLink: "https://github.com/GodoyMS/calendarapp-client",
    other:true

  },
  {
    key: 7,
    name: "Country Searcher",
    description:
      "This is a  RESTful API consuming project to access  data of every country, it allows a user to search by contry name, region,capital and a continent filter ",
    tags: [
      {
        name: "HTML CSS",
        color: "blue-text-gradient",
      },
      {
        name: "Javascript vanilla",
        color: "green-text-gradient",
      },
      {
        name: "REST API",
        color: "green-text-gradient",
      },
      
    ],
    viewDemo: true,
    workingOn: false,
    bigProject: false,
    image: countrySearcherProject,
    demoLink: "https://godoyms.github.io/Country_searcher/#_home",
    gitHubLink: "https://github.com/GodoyMS/Country_searcher",
    other:true
  },
];

export { services, technologies, experiences, testimonials, projects };
