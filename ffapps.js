async function loadBooks() {
  const response = await fetch("book.json");
  const books = await response.json();

  const results = document.getElementById("results");
  const search = document.getElementById("search");

  function render(term = "") {
    results.innerHTML = "";

    const filtered = books.filter(book =>
      JSON.stringify(book)
        .toLowerCase()
        .includes(term.toLowerCase())
    );

    filtered.forEach(book => {
      const div = document.createElement("div");
      div.className = "book";

      div.innerHTML = `
        <h2>${book.title}</h2>
        <p>${book.author || ""}</p>
        <p>${book.summary || ""}</p>
      `;

      results.appendChild(div);
    });
  }

  search.addEventListener("input", e =>
    render(e.target.value)
  );

  render();
}

loadBooks();
