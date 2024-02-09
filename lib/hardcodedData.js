const listOfCinemas = [
  {
    urlString:
      "https://www.yorck.de/en/films?sort=Popularity&date=2024-02-09&tab=comingSoon&sessionsExpanded=false&film=",
    name: "Yorck Kinos",
    titleFieldEl: "h4",
    dateEl: "strong",
  },
  {
    urlString: "https://www.hoefekino.de/programm-tickets/vorschau/",
    name: "Hackesche Höfe Kino",
    titleFieldEl: "h2",
    dateEl: "strong",
  },
  {
    urlString: "https://babylonberlin.eu/programm/demnaechst",
    name: "Babylon Kino",
    titleFieldEl: "h3",
  },
  {
    urlString: "https://zoopalast.premiumkino.de/filmvorschau",
    name: "Zoopalast",
    titleFieldEl: "title-with-link__headline",
  },
];

const cinemaSeries = [
  "Biff:",
  "BIFF:",
  "CinemAperitivo:",
  "BSFF:",
  "Kinderwagenkino:",
  "IndoGerman Film:",
  "New Hollywood:",
  "Best Of Sweden:",
];

exports.listOfCinemas = listOfCinemas;
exports.cinemaSeries = cinemaSeries;
