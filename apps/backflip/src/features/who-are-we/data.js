// Feature Data: who-are-we
// Who are we page configuration and content data

export const WHO_ARE_WE_CONFIG = {
  sections: [
    {
      title: "Dylan Williams - Producer / Director",
      description:
        "Over the past 15 years, Dylan has produced and directed award-winning films for both cinema and television, telling intimate stories for international audiences. Films that have won awards include BAFTA Wales, Best Film Silverdocs FF, Goethe-Institute Film Prize in Leipzig, Best Film Art Doc Fest in Moscow, Winner Prix D'Italia, as well as at Tribeca, San Francisco, and Sheffield Doc Fest. He is also in pre-production of his first fiction film in collaboration with an Oscar winning producer and a Cannes-winning director.",
      imageUrl: "../../images/dylan.png",
    },
    {
      title: "Bosse Lindquist - Director / Journalist",
      description:
        "Bosse Lindquist is one of the Nordic countries most renowned investigative journalists and documentary filmmakers. He exposed the darker secrets of American Nobel Prize laureate Carleton Gajdusek. He uncovered medical fraud and deadly human experimentation by Paolo Macchiarini and investigated western complicity in denial of the Khmer Rouge killings in Cambodia. Among the many awards he's received, are the Prix Europa, the American Peabody and the AAAS Gold medal.",
      imageUrl: "../../images/bosse.png",
    },
    {
      title: "Emil Engerdahl - Showrunner",
      description:
        "Emil Engerdahl is an experienced Documentary Showrunner, Story Producer and Editor with a long list of documentary films and series on his resume. His work has received numerous prestigious awards such as The Swedish Grand Prize for Journalism, The Official Swedish Television Award – The Crystal, The golden shovel – Awarded by the Swedish Association of Investigative Journalism. As well as several nominations for Prix Europa. His work has been distributed in cinemas and amongst others been shown on AMAZON, BBC, SVT, NRK, DR, YLE, ZDF.",
      imageUrl: "../../images/emil.png",
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
