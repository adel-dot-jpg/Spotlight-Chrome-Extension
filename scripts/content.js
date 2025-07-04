function createGridElement() {
  // Create a wrapper to hold both the title and button container
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.backgroundColor = "#daf7fe";
  wrapper.style.borderTop = "1px solid #337a8a";
  wrapper.style.padding = "10px";
  wrapper.style.marginTop = "10px";

  const button = document.getElementsByClassName("UhIuC")[0];
  const buttontext = normalizeText(button.innerText);
  if (button && (buttontext != "Aboutthisdata")) { //if there's other buttons... idk maybe just look for A button?
    //console.warn("Button: ", button, " with text content: ", buttontext);
    wrapper.style.marginBottom = "40px";
  }



  // Title element
  const title = document.createElement("div");
  title.textContent = "Explore this location on these platforms";
  title.style.color = "#337a8a";
  title.style.fontSize = "14px";
  title.style.marginTop = "5px";
  title.style.marginBottom = "10px";
  title.style.border = "0px solid red";


  // Add title to wrapper
  wrapper.appendChild(title);

  // button container
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.backgroundColor = "#daf7fe";
  container.style.gap = "20px";
  container.style.padding = "8px 7px"; //top right bottom left  // x y

  // buttons to add
  const platforms = [
    { name: "TikTok", icon: "images/button-icons/tiktok-64x64.png" },
    { name: "Instagram", icon: "images/button-icons/instagram-64x64.png" },
    { name: "YT Shorts", icon: "images/button-icons/youtube-64x64.png" }
  ];

  // add buttons to button container
  platforms.forEach(({ name, icon }) => {
    const button = document.createElement("button");
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.gap = "8px";
    button.style.backgroundColor = "white";
    button.style.color = "#454545";
    button.style.fontWeight = "bold";
    button.style.borderRadius = "5px";
    button.style.border = "none";
    button.style.padding = "8px 15px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
    button.style.transition = "transform 0.1s ease";
    button.style.fontSize = "13px";

    const img = document.createElement("img");
    img.src = chrome.runtime.getURL(icon);
    img.alt = `${name} icon`;
    img.style.width = "20px";
    img.style.height = "20px";

    const span = document.createElement("span");
    span.textContent = name;

    button.addEventListener("click", () => {
      const location = getLocationName();
      if (!location) {
        alert("Could not determine location name.");
        return;
      }
      const searchUrl = getSearchURL(name, location);
      window.open(searchUrl, "_blank");
    });

    button.addEventListener("mouseover", () => {
      button.style.transform = "scale(1.04)";
      button.style.filter = "brightness(95%)";
    });

    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.96)";
      button.style.filter = "brightness(90%)";
    });

    button.addEventListener("mouseup", () => {
      button.style.transform = "scale(1.04)";
      button.style.filter = "brightness(100%)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.filter = "brightness(100%)";
    });

    button.appendChild(img);
    button.appendChild(span);
    container.appendChild(button);
  });

  // Add the container to the wrapper
  wrapper.appendChild(container);

  return wrapper;
}



/*
function addUIElement() {
  const targetElement = document.getElementsByClassName("tLjsW");
  console.warn("why are you here");
  const target = targetElement[0];
  const arrow = document.getElementById("Arrow");
  console.warn("arrow nocked, looking for target");

  if (!target) {
    console.warn("no target element"); // always procs when going from "google.com/maps/*" to "google.com/maps/place/*" cuz google procs twice on url change
    return;
  } else if (arrow) {
    console.warn("arrow element exists");
    return;
  } else {
    console.warn("arrow hit: ", target.innerText);
    const arrow = document.createElement("div");
    arrow.id = "Arrow";
    arrow.appendChild(createGridElement());

    target.insertAdjacentElement("afterend", arrow);
  }
}
*/


// Also handle initial page load/refresh
function waitForTargetAndAddUI() {
  const targetElement = document.getElementsByClassName("Pf6ghf"); // m6QErb Pf6ghf XiKgde ecceSd tLjsW
  let target = null;
  for (let element of targetElement) {
    if (element.getAttribute("role") === "region") {
      target = element;
      break;
    }
  }
  //console.warn(targetElement.length, " elements found");
  const arrow = document.getElementById("Arrow");

  if (target && !arrow) {  // empty target found, fire the arrow
    //console.warn("Target element found, injecting UI...");
    const arrow = document.createElement("div");
    arrow.id = "Arrow";
    arrow.appendChild(createGridElement());
    target.insertAdjacentElement("afterend", arrow);
    return;
  } else if (!arrow) {  // target hasn't loaded yet, keep the arrow nocked
    //console.warn("didn't find a target...");
    setTimeout(waitForTargetAndAddUI, 250); // retry after 250ms
    return;
  } else {  // target already hit
    return
  }
}



// On initial load
window.addEventListener("load", () => {
  if (location.href.startsWith("https://www.google.com/maps/place/")) {
    waitForTargetAndAddUI();
  }
});

// Handle messages from background on url change
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "add-ui-element") {
    //console.warn("message received");
    waitForTargetAndAddUI();
  }
});




// button link functionality

// title element is class a5H0ec
function getLocationName() {
  const locName = document.getElementsByClassName("lfPIob")[0];
  const cityElement = document.getElementsByClassName("rogA2c")[0]?.innerText.split(", ");
  let city = null;
  if (cityElement?.length > 2) { // XBOX LIVE
    city = cityElement[1].trim();
  } else if (cityElement?.length === 2) {
    city = cityElement[0].trim();
  }
  //console.warn("object: ", locName, " and it's text: ", locName?.innerText.trim(), "in the city: ", city);

  return (locName && city) ? [(locName?.innerText ).trim(), city]: null;
}

function getSearchURL(platform, location) {
  const [locationName, city] = location;
  const locAndCity = encodeURIComponent(`${locationName + " " + city}`);
  switch (platform) {
    case "TikTok":
      return `https://www.tiktok.com/search?q=${locAndCity}`;
    case "Instagram":
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(normalizeText(locationName))}`;  // better w/o city
    case "YT Shorts":
      return `https://www.youtube.com/results?search_query=${locAndCity}+shorts`;
    default:
      return "#";
  }
}

function normalizeText(name) { //ts is actually crazy
  if (!name || typeof name !== "string") return "";

  return name
    .normalize("NFD")                    // Decompose accented letters
    .replace(/[\u0300-\u036f]/g, "")     // Remove diacritics (accent, umlaut)
    .replace(/[^a-zA-Z]/g, "")           // Remove non-letter characters (including spaces)
    .trim();                             // Clean up leading/trailing whitespace (redundant here)
}