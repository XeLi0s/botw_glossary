class Entry {
  constructor({ id, name, category, image }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.image = image;
    this.details = null;
  }

  renderPreview() {
    const listItem = document.createElement("div");
    listItem.className = "entry-preview";

    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.name;
    img.loading = "lazy";

    const name = document.createElement("h3");
    name.textContent = this.name;

    listItem.appendChild(img);
    listItem.appendChild(name);

    listItem.addEventListener("click", async () => {
      await this.loadAndShowDetails();
    });

    return listItem;
  }

  async loadAndShowDetails() {
    try {
      if (!this.details) {
        const response = await fetch(
          `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${this.id}`
        );
        const data = await response.json();
        this.details = {
          description: data.data.description,
          common_locations: data.data.common_locations,
        };
      }
      this.showDetails();
    } catch (error) {
      console.error("Error loading details:", error);
    }
  }

  showDetails() {
    const modalDetails = document.querySelector("#modal-details");
    const modalContent = modalDetails.querySelector(".popup-content");

    modalContent.innerHTML = `
      <h2>${this.name}</h2>
      <img src="${this.image}" alt="${this.name}">
      <p>${this.details.description}</p>
      <p>${
        this.details.common_locations
          ? `Found in: ${this.details.common_locations.join(", ")}`
          : "Location unknown"
      }</p>
      <button id="close-modal" class="popup-close">Close</button>
    `;

    modalDetails.classList.add("active");

    const closeModal = () => {
      modalDetails.classList.remove("active");
    };

    document
      .querySelector("#close-modal")
      .addEventListener("click", closeModal);

    modalDetails.addEventListener("click", (e) => {
      if (e.target === modalDetails) {
        closeModal();
      }
    });

    const escapeListener = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", escapeListener);

    modalDetails.addEventListener("transitionend", () => {
      if (!modalDetails.classList.contains("active")) {
        document.removeEventListener("keydown", escapeListener);
      }
    });
  }
}

export class Glossary {
  constructor() {
    this.entries = [];
  }

  async fetchEntries() {
    try {
      const response = await fetch(
        "https://botw-compendium.herokuapp.com/api/v3/compendium/all"
      );
      const data = await response.json();
      this.entries = data.data.map(
        (entry) =>
          new Entry({
            id: entry.id,
            name: entry.name,
            category: entry.category,
            image: entry.image,
          })
      );
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  }

  renderHome() {
    const masterDiv = document.querySelector("#master");
    masterDiv.innerHTML =
      masterDiv.innerHTML = `<div id="home"><h2>Bienvenue dans le Glossaire de Zelda: Breath of the Wild</h2>
    <img src="https://e-writers.fr/wp-content/uploads/2022/03/zelda-botw-artwork-link-chateau-et-plaine-hyrule-945x640.jpg" alt="Zelda Artwork" style="width:100%; max-width:600px; display:block; margin:auto;"></div>`;
  }

  renderCategory(category) {
    const masterDiv = document.querySelector("#master");
    masterDiv.innerHTML = "";

    const filteredEntries = this.entries.filter(
      (entry) => entry.category === category
    );

    if (filteredEntries.length === 0) {
      masterDiv.innerHTML = "<p>No entries found for this category.</p>";
    } else {
      filteredEntries.forEach((entry) => {
        masterDiv.appendChild(entry.renderPreview());
      });
    }
  }
}
