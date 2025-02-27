import "./stylesheets/styles.scss";
import { Glossary } from "./scripts/glossary.js";

let navbar = document.querySelector(".navbar");
if (!navbar) {
  navbar = document.createElement("div");
  navbar.className = "navbar";

  const links = [
    { name: "Home", page: "home" },
    { name: "Creatures", page: "creatures" },
    { name: "Equipment", page: "equipment" },
    { name: "Materials", page: "materials" },
    { name: "Monsters", page: "monsters" },
    { name: "Treasure", page: "treasure" },
  ];

  links.forEach((link) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = link.name;
    a.setAttribute("data-page", link.page);
    navbar.appendChild(a);
  });

  const appDiv = document.querySelector("#app");
  appDiv.appendChild(navbar);
}

const contentDiv = document.createElement("div");
contentDiv.id = "content";

const masterDiv = document.createElement("div");
masterDiv.id = "master";
contentDiv.appendChild(masterDiv);

const detailsDiv = document.createElement("div");
detailsDiv.id = "details";
contentDiv.appendChild(detailsDiv);

const appDiv = document.querySelector("#app");
appDiv.appendChild(contentDiv);

const glossary = new Glossary();
glossary.fetchEntries().then(() => {
  glossary.renderHome();
});

document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const page = e.target.getAttribute("data-page");

    if (page === "home") {
      glossary.renderHome();
    } else {
      glossary.renderCategory(page);
    }
  });
});
