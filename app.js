document.addEventListener("DOMContentLoaded", () => {
  const catElements = document.querySelectorAll(".cat");
  const last = parseInt(sessionStorage.getItem("lastCatIndex") ?? -1);

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * catElements.length);
  } while (randomIndex === last && catElements.length > 1);

  // Store current index for next load to avoid repeating cats
  sessionStorage.setItem("lastCatIndex", randomIndex);

  // Show the randoly selected cat
  catElements[randomIndex].style.display = "block";
});
