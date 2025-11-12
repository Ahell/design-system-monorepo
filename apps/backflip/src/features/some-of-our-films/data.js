// Feature Data: some-of-our-films
// Some of our films page configuration and content data

export const SOME_OF_OUR_FILMS_CONFIG = {
  title: "Some of our films.",
  gallery: [
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly", movieId: "men-who-sing" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing", movieId: "men-who-sing" },
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly", movieId: "men-who-sing" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing", movieId: "men-who-sing" },
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly", movieId: "men-who-sing" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing", movieId: "men-who-sing" },
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly", movieId: "men-who-sing" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing", movieId: "men-who-sing" },
    { imageUrl: "../../images/born_to_fly.png", alt: "Born to Fly", movieId: "men-who-sing" },
    { imageUrl: "../../images/men_who_sing.png", alt: "Men Who Sing", movieId: "men-who-sing" },
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
