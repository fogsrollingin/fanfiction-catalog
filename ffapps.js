async function loadBooks() {
  const results = document.getElementById("results");
  const search = document.getElementById("search");

  try {
    const response = await fetch("book.json");

    if (!response.ok) {
      throw new Error(`Could not load book.json: ${response.status}`);
    }

    const books = await response.json();

    // Expected: "tags": ["Found Family", "Slow Burn"]
    // Also accepts a single tag stored as a string.
    function getTags(book) {
      if (Array.isArray(book.tags)) {
        return book.tags.filter(tag => typeof tag === "string");
      }

      if (typeof book.tags === "string" && book.tags.trim()) {
        return [book.tags.trim()];
      }

      return [];
    }

    function render(term = "", exactTag = false) {
      results.replaceChildren();

      const query = term.trim().toLowerCase();

      const filtered = books.filter(book => {
        if (exactTag) {
          return getTags(book).some(
            tag => tag.toLowerCase() === query
          );
        }

        return JSON.stringify(book).toLowerCase().includes(query);
      });

      if (filtered.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No stories found.";
        results.appendChild(message);
        return;
      }

      filtered.forEach(book => {
        const card = document.createElement("article");
        card.className = "book";

        const titleRow = document.createElement("div");
titleRow.className = "title-row";

const title = document.createElement("h2");
title.textContent = book.title || "Untitled story";
card.appendChild(title);
        
        const author = document.createElement("p");
        author.className = "book-author";
        author.textContent = book.authors ? `By ${book.authors}` : "";
        card.appendChild(author);
const downloadUrl =
  `https://www.ia2.neocities.org/fanfiction/${
    encodeURIComponent(book.authors || "Unknown")
  }/${
    encodeURIComponent(book.title || "Untitled story")
  } (${
    book.id
  })/${
    encodeURIComponent(book.title || "Untitled story")
  } - ${
    encodeURIComponent(book.authors || "Unknown")
  }.epub`;

const downloadButton = document.createElement("a");

downloadButton.href = downloadUrl;
downloadButton.className = "request-button";
downloadButton.textContent = "Download EPUB";

downloadButton.target = "_blank";

card.appendChild(downloadButton);
        const summary = document.createElement("p");
summary.className = "book-summary";

const summaryDocument = new DOMParser().parseFromString(
  book.comments || "",
  "text/html"
);

// Preserve paragraph breaks when converting the summary to plain text.
summaryDocument.querySelectorAll("p").forEach(paragraph => {
  paragraph.append("\n\n");
});

summaryDocument.querySelectorAll("br").forEach(lineBreak => {
  lineBreak.replaceWith("\n");
});

summary.textContent =
  summaryDocument.body.textContent.trim() || "No summary available.";

card.appendChild(summary);        const tags = document.createElement("div");
        tags.className = "book-tags";
        tags.setAttribute("aria-label", "Story tags");

        getTags(book).forEach(tag => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "tag";
          button.textContent = tag;
          button.setAttribute("aria-label", `Filter by tag: ${tag}`);

          button.addEventListener("click", () => {
            search.value = tag;
            render(tag, true);
          });

          tags.appendChild(button);
        });

        card.appendChild(tags);
        results.appendChild(card);
      });
    }

    search.addEventListener("input", event => {
      render(event.target.value);
    });

    render();
  } catch (error) {
    console.error(error);
    results.textContent =
      "Unable to load the catalog. Check book.json and try again.";
  }
}

loadBooks();


