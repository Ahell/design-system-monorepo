// Feature Data: some-of-our-films
// Some of our films page configuration and content data

export const SOME_OF_OUR_FILMS_CONFIG = {
  title: "Some of our films.",
};

export function getSomeOfOurFilmsConfig() {
  return SOME_OF_OUR_FILMS_CONFIG;
}

export function getSomeOfOurFilmsContent() {
  return {
    title: SOME_OF_OUR_FILMS_CONFIG.title,
  };
}