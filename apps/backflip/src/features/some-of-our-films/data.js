// Feature Data: some-of-our-films
// Some of our films page configuration and content data

export const SOME_OF_OUR_FILMS_CONFIG = {
  title: "Some of our films.",
  gallery: [
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#FF6B6B" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#4ECDC4" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#45B7D1" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#96CEB4" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#FFEAA7" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#DDA0DD" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#98D8C8" },
    { imageUrl: "placeholder", alt: "Film Poster", bgColor: "#F7DC6F" },
  ],
};

export function getSomeOfOurFilmsConfig() {
  return SOME_OF_OUR_FILMS_CONFIG;
}

export function getSomeOfOurFilmsContent() {
  return {
    title: SOME_OF_OUR_FILMS_CONFIG.title,
    gallery: SOME_OF_OUR_FILMS_CONFIG.gallery,
  };
}
