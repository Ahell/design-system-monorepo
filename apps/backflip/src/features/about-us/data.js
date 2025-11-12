// Feature Data: about-us
// About us page configuration and content data

export const ABOUT_US_CONFIG = {
  title: "About us.",
  subtitle: "We create compelling<br>stories that inspire<br>and entertain.",
};

export function getAboutUsConfig() {
  return ABOUT_US_CONFIG;
}

export function getAboutUsContent() {
  return {
    title: ABOUT_US_CONFIG.title,
    subtitle: ABOUT_US_CONFIG.subtitle,
  };
}