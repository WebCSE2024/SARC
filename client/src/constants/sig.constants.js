export const SIG_DOMAINS = {
  AI_ML: "ai",
  COMPUTING_SYSTEMS: "computing-systems",
  INFORMATION_SECURITY: "information-security",
  THEORETICAL_CS: "theoretical-cs",
};

export const SIG_CONFIG = [
  {
    id: SIG_DOMAINS.AI_ML,
    slug: SIG_DOMAINS.AI_ML,
    name: "ANVESH",
    shortName: "AI / ML",
    description:
      "'Exploring' intelligence through innovation—advancing ethical, human-centric AI and machine learning for global impact.",
    tags: [
      "Foundational AI",
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Human Centric AI",
      "AI For Scientific Impact",
    ],
    color: "#3B82F6",
    backgroundMedia: {
      type: "video",
      url: "https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4",
      poster:
        "https://images.pexels.com/videos/3130284/free-video-3130284.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      opacity: 0.25,
    },
  },
  {
    id: SIG_DOMAINS.COMPUTING_SYSTEMS,
    slug: SIG_DOMAINS.COMPUTING_SYSTEMS,
    name: "Computing Systems",
    shortName: "Computing Systems",
    description:
      "Cloud computing, IoT solutions for agriculture, distributed systems, and performance optimization",
    tags: [
      "Cloud Computing",
      "Internet of Things",
      "Distributed Systems",
      "Edge Computing",
      "Operating Systems",
    ],
    color: "#10B981",
    backgroundMedia: {
      type: "video",
      url: "https://videos.pexels.com/video-files/3141207/3141207-uhd_2560_1440_30fps.mp4",
      poster:
        "https://images.pexels.com/videos/3141207/pexels-photo-3141207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      opacity: 0.25,
    },
  },
  {
    id: SIG_DOMAINS.INFORMATION_SECURITY,
    slug: SIG_DOMAINS.INFORMATION_SECURITY,
    name: "Information Security",
    shortName: "Information Security",
    description:
      "Blockchain for e-governance, privacy-preserving systems, post-quantum cryptography, and network security",
    tags: [
      "Blockchain",
      "Cryptography",
      "Privacy Systems",
      "Post-Quantum Security",
      "Network Protection",
    ],
    color: "#EF4444",
    backgroundMedia: {
      type: "video",
      url: "https://videos.pexels.com/video-files/5711017/5711017-uhd_2560_1440_25fps.mp4",
      poster:
        "https://images.pexels.com/videos/5711017/pexels-photo-5711017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      opacity: 0.25,
    },
  },
  {
    id: SIG_DOMAINS.THEORETICAL_CS,
    slug: SIG_DOMAINS.THEORETICAL_CS,
    name: "Theoretical Computer Science",
    shortName: "Theoretical CS",
    description:
      "Exploring quantum algorithms, graph theory, and computational complexity for solving fundamental problems",
    tags: [
      "Quantum Algorithms",
      "Graph Theory",
      "Complexity Analysis",
      "Combinatorial Optimization",
      "Formal Verification",
    ],
    color: "#8B5CF6",
    backgroundMedia: {
      type: "video",
      url: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
      poster:
        "https://images.pexels.com/videos/3129671/pexels-photo-3129671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      opacity: 0.25,
    },
  },
];

export const getSIGBySlug = (slug) => {
  return SIG_CONFIG.find((sig) => sig.slug === slug);
};

export const getSIGById = (id) => {
  return SIG_CONFIG.find((sig) => sig.id === id);
};
