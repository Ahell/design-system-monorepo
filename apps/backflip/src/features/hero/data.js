// Feature Data: hero
// Hero section configuration and content data

export const HERO_CONFIG = {
  title: "Backflip",
  subtitle: "Creating Premium<br>Documentaries for<br>a Global Audience.",
};

export function getHeroConfig() {
  return HERO_CONFIG;
}

export function getHeroContent() {
  return {
    title: HERO_CONFIG.title,
    subtitle: HERO_CONFIG.subtitle,
  };
}
