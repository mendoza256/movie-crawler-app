const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date.toISOString().split("T")[0];
});

function splitCinemaNameAtDate(url) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return url.split(dateRegex);
}

module.exports = {
  nextSevenDays,
  splitCinemaNameAtDate,
};
