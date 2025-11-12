// Feature Data: single-movie
// Single movie page configuration and content data

export const SINGLE_MOVIE_CONFIG = {
  media: {
    creator: "Dylan Williams",
    imageUrl: "./images/born_to_fly.png",
    title: "Armand Duplantis\nBorn to Fly",
    description:
      "A close-up portrayal of Armand 'Mondo' Duplantis'\njourney to the stars - the prodigy who becomes the greatest pole vaulter of all time. With unique footage from Mondo's childhood and teenage years, we follow the boy who has been clearing the bar since he learned to walk. Struggling with setbacks, he decides early on to become the best in the world. A coming-of-age story and a father-son drama about personal doubts, challenges, and fame. At 21 years old, he breaks world records, wins Olympic gold, and fulfills his dream. Red Bull / SVT / Amazon / SF Bio.",
    buttonLabel: "LINK",
    videoUrl: "./videos/born_to_fly.mp4",
  },
};

export function getSingleMovieConfig() {
  return SINGLE_MOVIE_CONFIG;
}

export function getSingleMovieContent() {
  return {
    title: SINGLE_MOVIE_CONFIG.title,
    media: SINGLE_MOVIE_CONFIG.media,
  };
}
