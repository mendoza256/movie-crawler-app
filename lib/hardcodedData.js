const listOfCinemas = [
  {
    urlString:
      "https://www.yorck.de/en/films?sort=Popularity&date=2021-09-17&tab=daily&sessionsExpanded",
    name: "Yorck Kinos",
    titleFieldEl: "h3.whatson-film-title",
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

exports.listOfCinemas = listOfCinemas;
