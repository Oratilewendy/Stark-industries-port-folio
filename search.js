const sitePages = [
  { title: "Home", page: "index.html", description: "Starck Industries supplies cars, commercial trucks, vehicle parts and accessories.", keywords: "home starck industries automotive cars trucks vehicles parts accessories fleet transport" },
  { title: "Vehicles", page: "vehicles.html", description: "Passenger cars and commercial trucks for everyday travel, deliveries and transport.", keywords: "vehicles vehicle cars passenger car trucks truck commercial heavy duty transport deliveries logistics" },
  { title: "Parts & Accessories", page: "parts.html", description: "Spare parts including diesel engine, axle, suspension, air brake, gearbox, electrical and brake parts.", keywords: "parts accessories spare genuine replacement diesel engine axle suspension air brake gearbox electrical brakes repair components" },
  { title: "Services", page: "services.html", description: "Vehicle sales, parts supply, fleet support and customer assistance.", keywords: "services vehicle sales cars trucks parts fleet business support enquiries availability pricing" },
  { title: "Projects", page: "projects.html", description: "Vehicle and fleet support, business transport solutions and parts supply.", keywords: "projects vehicle fleet support business transport parts supply passenger commercial logistics" },
  { title: "About Us", page: "about.html", description: "Learn about Starck Industries and the vehicles, parts and support it offers.", keywords: "about us who we are what we offer company transport solutions" },
  { title: "Contact", page: "contact.html", description: "Contact Starck Industries about vehicles, spare parts, availability and pricing.", keywords: "contact phone email location Tlokweng Road Gaborone enquiry message vehicles parts availability pricing" }
];

function normalizeSearch(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-site-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const query = (input?.value || "").trim();
      if (!query) {
        input?.focus();
        return;
      }

      const terms = normalizeSearch(query).split(" ").filter(Boolean);
      const matches = sitePages.map((page) => {
        const title = normalizeSearch(page.title);
        const searchable = normalizeSearch(`${page.title} ${page.description} ${page.keywords}`);
        let score = 0;
        terms.forEach((term) => {
          if (title.includes(term)) score += 5;
          if (searchable.includes(term)) score += 2;
        });
        return { ...page, score };
      }).filter((page) => page.score > 0).sort((a, b) => b.score - a.score);

      let panel = document.getElementById("site-search-results");
      if (!panel) {
        panel = document.createElement("section");
        panel.id = "site-search-results";
        panel.className = "site-search-results";
        panel.setAttribute("aria-live", "polite");
        const main = document.querySelector("main") || document.body;
        main.prepend(panel);
      }

      const heading = document.createElement("h2");
      heading.textContent = `Search results for “${query}”`;
      panel.replaceChildren(heading);

      if (!matches.length) {
        const message = document.createElement("p");
        message.textContent = "No matching pages found. Try searching for vehicles, parts, services, projects, about or contact.";
        panel.append(message);
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const list = document.createElement("ul");
      matches.forEach((match) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = match.page;
        link.textContent = match.title;
        const description = document.createElement("p");
        description.textContent = match.description;
        item.append(link, description);
        list.append(item);
      });
      panel.append(list);
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
