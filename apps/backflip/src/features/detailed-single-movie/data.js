// Feature Data: detailed-single-movie
// Detailed single movie page configuration and content data

export const DETAILED_SINGLE_MOVIE_CONFIG = {
  movies: {
    "men-who-sing": {
      title: "Men Who Sing",
      description:
        "And here is a simple film about my Dad. A very simple but heartfelt film about my father and his choir. This film was distributed via Curzon Cinemas in 40 towns and cities in the UK, BBC and SVT. It is now being made into a major Fiction Film in the UK with an Oscar winning actor in the main role. Cinema release in the UK and Sweden. Winner BAFTA, BIFFL Audience Award.",
      year: "2023",
      duration: "15 minutes",
      director: "Dylan Williams",
      producer: "Dylan Williams",
      editor: "Dylan Williams",
      music: "Traditional Choir Music",
      support: "BAFTA, Curzon Cinemas, BBC, SVT",
      imageUrl: "./images/men_who_sing.png",
      videoUrl: "./videos/men_who_sing.mp4",
    },
  },
};

export function getDetailedSingleMovieConfig() {
  return DETAILED_SINGLE_MOVIE_CONFIG;
}

export function getDetailedMovieData(movieId) {
  return DETAILED_SINGLE_MOVIE_CONFIG.movies[movieId] || null;
}
