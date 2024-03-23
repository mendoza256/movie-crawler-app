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
    name: "Babylon Kino",
    urlString: "https://babylonberlin.eu/programm/demnaechst",
    titleFieldEl: "h3",
  },
  // {
  //   urlString: "https://zoopalast.premiumkino.de/filmvorschau",
  //   name: "Zoopalast",
  //   titleFieldEl: "title-with-link__headline",
  // },
];

const cinemaSeriesNames = [
  "Kinderwagenkino:",
  "CinemAperitivo:",
  "Truffaut:",
  "Live mit Babylon Orchester Berlin",
  "LIVE mit Babylon Orchester Berlin",
  "Karl Bartos -",
  "Greek Film Festival:",
  "Greek Film Festival in Berlin:",
  "Cicle Gaudí:",
  "live mit Babylon Orchester Berlin",
  "Bob Fosse:",
  "live mit Orchester",
  "LIVE Babylon Orchester Berlin",
  "Live Shadow Cast",
  "- 25th anniversary!",
  " - mit Gästen und Prosecco!",
  " - 22.3. at midnight FREE FRIDAY",
];

module.exports = { listOfCinemas, cinemaSeriesNames };
