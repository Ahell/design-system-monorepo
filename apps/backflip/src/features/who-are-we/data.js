// Feature Data: who-are-we
// Who are we page configuration and content data

export const WHO_ARE_WE_CONFIG = {
  title: "Who are we.",
  description: "We are a team of passionate storytellers dedicated to creating compelling narratives that inspire and connect with audiences worldwide. Our diverse backgrounds in film, design, and technology allow us to approach each project with fresh perspectives and innovative solutions.",
  imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center",
};

export function getWhoAreWeConfig() {
  return WHO_ARE_WE_CONFIG;
}

export function getWhoAreWeContent() {
  return {
    title: WHO_ARE_WE_CONFIG.title,
    description: WHO_ARE_WE_CONFIG.description,
    imageUrl: WHO_ARE_WE_CONFIG.imageUrl,
  };
}