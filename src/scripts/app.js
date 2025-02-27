export default class Glossary {
  constructor() {
    this.entries = [];
  }

  async fetchEntries() {
    for (let i = 1; i <= 389; i++) {
      const response = await fetch(
        `https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${i}`
      );
      const data = await response.json();
      const entry = new Entry({
        id: data.data.id,
        name: data.data.name,
        category: data.data.category,
        image: data.data.image,
        description: data.data.description,
        common_locations: data.data.common_locations,
      });
      this.entries.push(entry);
    }
  }

  renderMaster() {
    const masterDiv = document.querySelector("#master");
    masterDiv.innerHTML = "";

    this.entries.forEach((entry) => {
      const entryPreview = entry.renderPreview();
      masterDiv.appendChild(entryPreview);
    });
  }
}
