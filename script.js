const collectionTitleInput = document.getElementById("collection-name");
const collectionSubmitBtn = document.getElementById("collection-submit");
const collectionListSelect = document.getElementById("collection-list");
const questionInput = document.getElementById("Question-input");
const answerInput = document.getElementById("Answer-input");
const addCardBtn = document.getElementById("card-add");
const divRes = document.getElementById("div-res");
const collectionHeader = document
  .querySelector("#div-res")
  .closest(".card")
  .querySelector(".card-header h5");

let collections = [];
let currentCollection = null;
let currentIndex = 0;

function loadFromLocalStorage() {
  const saved = localStorage.getItem("collections");
  if (saved) {
    try {
      collections = JSON.parse(saved);
    } catch (e) {
      console.error("Erreur lors du chargement depuis LocalStorage");
      collections = [];
    }
  }
}

function saveToLocalStorage() {
  localStorage.setItem("collections", JSON.stringify(collections));
}

function updateCollectionsUI() {
  divRes.innerHTML = "";
  collectionListSelect.innerHTML = '<option selected>Select a collection</option>';

  collections.forEach((col) => {
    const opt = document.createElement("option");
    opt.value = col.title;
    opt.textContent = col.title;
    collectionListSelect.appendChild(opt);

    const divChild = document.createElement("div");
    divChild.className =
      "d-flex justify-content-between align-items-center bg-secondary rounded p-3 mb-2";

    const titleNew = document.createElement("h6");
    titleNew.className = "mb-0 text-decoration-underline";
    titleNew.style.cursor = "pointer";
    titleNew.textContent = col.title;

    titleNew.addEventListener("click", () => {
      if (col.cards.length === 0) {
        alert("No cards in this collection.");
        return;
      }
      currentCollection = col;
      currentIndex = 0;
      collectionHeader.textContent = col.title;
      showCurrentCard();
    });

    const smallNumber = document.createElement("small");
    smallNumber.textContent = col.cards.length + " Cards";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = collections.indexOf(col);
      if (idx > -1) {
        collections.splice(idx, 1);
        saveToLocalStorage();
        updateCollectionsUI();
        currentCollection = null;
        collectionHeader.textContent = "Your Collections";
      }
    });

    divChild.appendChild(titleNew);
    divChild.appendChild(smallNumber);
    divChild.appendChild(deleteBtn);
    divRes.appendChild(divChild);
  });
}

collectionSubmitBtn.addEventListener("click", () => {
  const titre = collectionTitleInput.value.trim();
  if (!titre) return alert("Please enter a collection name.");
  if (collections.find((c) => c.title === titre))
    return alert("This collection already exists.");

  collections.push({ title: titre, cards: [] });
  collectionTitleInput.value = "";
  saveToLocalStorage();
  updateCollectionsUI();
});

addCardBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const selectedTitle = collectionListSelect.value;

  if (!question || !answer)
    return alert("Please fill in both question and answer.");

  const selectedCollection = collections.find((c) => c.title === selectedTitle);
  if (!selectedCollection) return alert("Please select a valid collection.");

  selectedCollection.cards.push({ question, answer });
  questionInput.value = "";
  answerInput.value = "";
  saveToLocalStorage();
  updateCollectionsUI();
});

function showCurrentCard() {
  divRes.innerHTML = "";
  if (!currentCollection || currentCollection.cards.length === 0) return;

  const card = currentCollection.cards[currentIndex];
  const divCard = document.createElement("div");
  divCard.className = "card-parent mb-3";

  divCard.innerHTML = `
    <div class="card-inner">
      <div class="front card bg-primary text-white">
        <div class="card-body d-flex justify-content-center align-items-center" style="min-height:200px">
          <h5>${card.question}</h5>
        </div>
      </div>
      <div class="back card bg-success text-white">
        <div class="card-body d-flex justify-content-center align-items-center" style="min-height:200px">
          <h5>${card.answer}</h5>
        </div>
      </div>
    </div>
    <div class="mt-2 d-flex justify-content-between">
      <button id="prev" class="btn btn-light">Back</button>
      <button class="btn btn-outline-light flipBtn">🔄 Flip</button>
      <button id="next" class="btn btn-light">Next</button>
      <button id="return" class="btn btn-danger">Return</button>
    </div>
  `;

  divRes.appendChild(divCard);

  divCard
    .querySelector(".flipBtn")
    .addEventListener("click", () => {
      divCard.querySelector(".card-inner").classList.toggle("flipped");
    });

  divCard.querySelector("#prev").addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    showCurrentCard();
  });

  divCard.querySelector("#next").addEventListener("click", () => {
    if (currentIndex < currentCollection.cards.length - 1) currentIndex++;
    showCurrentCard();
  });

  divCard.querySelector("#return").addEventListener("click", () => {
    currentCollection = null;
    currentIndex = 0;
    collectionHeader.textContent = "Your Collections";
    updateCollectionsUI();
  });
}

loadFromLocalStorage();
updateCollectionsUI();
