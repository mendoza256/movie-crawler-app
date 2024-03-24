const listOfCinemas = [
  // {
  //   urlString:
  //     "https://www.yorck.de/en/films?sort=Popularity&date=2024-02-09&tab=comingSoon&sessionsExpanded=false&film=",
  //   name: "Yorck Kinos",
  //   titleFieldEl: "h4",
  //   dateEl: "strong",
  // },
  // {
  //   urlString: "https://www.hoefekino.de/programm-tickets/vorschau/",
  //   name: "Hackesche Höfe Kino",
  //   parentEl: ".frame",
  //   titleFieldEl: "h2",
  //   dateFieldEl: ".ce-bodytext strong",
  //   dateRegex: "[0-9]+. [A-Z,a-zä]+",
  // },
  // {
  //   name: "Babylon Kino",
  //   urlString: "https://babylonberlin.eu/programm/demnaechst",
  //   parentEl: ".inner-mix.right-mix",
  //   titleFieldEl: "h3",
  //   dateFieldEl: ".mix-date",
  //   dateRegex: "[A-Z,a-z]+, [0-9]+.[0-9]+. [0-9]+:[0-9][0-9]",
  // },
  {
    urlString: "https://zoopalast.premiumkino.de/filmvorschau",
    name: "Zoopalast",
    parentEl: ".movie-display-holder__content",
    titleFieldEl: "h2",
    dateFieldEl: false,
    dateRegex: "",
  },
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
