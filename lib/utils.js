const months = [
  "januar",
  "februar",
  "märz",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "dezember",
];

const nextSevenDays = Array.from({ length: 3 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date.toISOString().split("T")[0];
});

function checkIfUrlHasDate(url) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return dateRegex.test(url);
}

function splitUrlByDate(url) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return url.split(dateRegex);
}

function returnUrlForCurrentProgramme(url, date) {
  const splitUrl = splitUrlByDate(url);
  if (checkIfUrlHasDate(url) && date) {
    return `${splitUrl[0]}${date}${splitUrl[1]}`;
  } else {
    return url;
  }
}

module.exports = {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
};
