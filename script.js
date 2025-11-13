let editingMode = false;
let editingIndex = null;
const editToggle = document.getElementById("editToggle");
const editorModal = document.getElementById("editorModal");

const articles = JSON.parse(localStorage.getItem("articles")) || {
  featured: [],
  football: [],
  basketball: [],
  soccer: []
};

function saveArticles() {
  localStorage.setItem("articles", JSON.stringify(articles));
  renderArticles();
}

function renderArticles() {
  ["featured", "football", "basketball", "soccer"].forEach(cat => {
    const container = document.getElementById(`${cat}Articles`);
    container.innerHTML = "";
    articles[cat].forEach((a, index) => {
      const article = document.createElement("article");
      if (a.image) {
        article.innerHTML = `<img src="${a.image}" alt="${a.title}" />`;
      }
      article.innerHTML += `
        <h3>${a.title}</h3>
        <p>${a.content}</p>
        <div class="article-actions">
          <button onclick="editArticle('${cat}', ${index})">✏️</button>
          <button onclick="deleteArticle('${cat}', ${index})">🗑️</button>
        </div>
      `;
      container.appendChild(article);
    });
  });
}

function toggleEditMode() {
  editingMode = !editingMode;
  document.body.classList.toggle("editing", editingMode);
  editToggle.textContent = editingMode ? "✅ Done Editing" : "✏️ Edit Site";
  if (editingMode) openEditor();
}

function openEditor() {
  editorModal.classList.remove("hidden");
}

function closeEditor() {
  editorModal.classList.add("hidden");
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("image").value = "";
  editingIndex = null;
}

function editArticle(cat, index) {
  const a = articles[cat][index];
  document.getElementById("category").value = cat;
  document.getElementById("title").value = a.title;
  document.getElementById("content").value = a.content;
  document.getElementById("image").value = a.image || "";
  editingIndex = { cat, index };
  openEditor();
}

function deleteArticle(cat, index) {
  if (confirm("Delete this article?")) {
    articles[cat].splice(index, 1);
    saveArticles();
  }
}

document.getElementById("saveArticle").addEventListener("click", () => {
  const cat = document.getElementById("category").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const image = document.getElementById("image").value;

  if (editingIndex) {
    articles[editingIndex.cat][editingIndex.index] = { title, content, image };
  } else {
    articles[cat].push({ title, content, image });
  }

  saveArticles();
  closeEditor();
});

document.getElementById("cancelEdit").addEventListener("click", closeEditor);
editToggle.addEventListener("click", toggleEditMode);

// Initial render
renderArticles();
