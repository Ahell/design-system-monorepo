// Feature Data: who-are-we
// Who are we page configuration and content data

export const WHO_ARE_WE_CONFIG = {
  sections: [
    {
      title: "Our Vision.",
      description:
        "We envision a world where stories transcend boundaries, connecting hearts and minds across cultures through the power of visual storytelling.",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Our Team.",
      description:
        "A diverse group of filmmakers, designers, and technologists united by passion for crafting compelling narratives that inspire and entertain.",
      imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
    },
    {
      title: "Our Impact.",
      description:
        "Through innovative approaches and creative excellence, we create documentaries that spark conversations and drive meaningful change.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center",
    },
  ],
};

export function getWhoAreWeConfig() {
  return WHO_ARE_WE_CONFIG;
}

export function getWhoAreWeContent() {
  return {
    sections: WHO_ARE_WE_CONFIG.sections,
  };
}
