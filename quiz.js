const questionEl = document.querySelector(".front .card-title");
const answerEl = document.querySelector("#answer-text");
const flipBtn = document.querySelector(".flipBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("prevBtn");
const counterEl = document.getElementById("progress");
const cardInner = document.querySelector(".card-inner");
const titleEl = document.getElementById("card-lesson-title");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const optionsContainer = document.getElementById("options");
const submitBtn = document.getElementById("submitBtn");

let cards = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

fetch("quiz-data.json")
  .then(res => res.json())
  .then(data => {
    cards = data.cards;
    showCard();
  })
  .catch(() => {
    questionEl.textContent = "⚠️ Failed to load quiz data.";
  });

function showCard() {
  const card = cards[currentIndex];
  questionEl.textContent = card.question;
  answerEl.textContent = card.answer;
  cardInner.classList.remove("flipped");
  counterEl.textContent = `${currentIndex + 1}/${cards.length}`;
  titleEl.textContent = `HTML Quiz - Question ${currentIndex + 1}`;
  feedbackEl.textContent = "";
  selectedAnswer = null;

  optionsContainer.innerHTML = "";
  if (card.options) {
    card.options.forEach(optionText => {
      const btn = document.createElement("button");
      btn.className = "btn btn-light text-dark option-btn";
      btn.textContent = optionText;
      btn.addEventListener("click", () => {
        selectedAnswer = optionText;
        document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
      optionsContainer.appendChild(btn);
    });
  } else {
    optionsContainer.innerHTML = `<input type="text" id="textAnswer" class="form-control mb-3" placeholder="Type your answer...">`;
  }
}

flipBtn.addEventListener("click", () => {
  cardInner.classList.toggle("flipped");
});

submitBtn.addEventListener("click", () => {
  const card = cards[currentIndex];

  let userAnswer = selectedAnswer;
  if (!userAnswer) {
    const textInput = document.getElementById("textAnswer");
    if (textInput) userAnswer = textInput.value;
  }

  if (!userAnswer) {
    feedbackEl.textContent = "⚠️ Please select or enter an answer.";
    return;
  }

  if (userAnswer.trim().toLowerCase() === card.answer.trim().toLowerCase()) {
    feedbackEl.textContent = "✅ Correct!";
    score++;
  } else {
    feedbackEl.textContent = `❌ Incorrect. Correct answer: ${card.answer}`;
  }

  scoreEl.textContent = `Score: ${score}/${cards.length}`;
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    showCard();
  } else {
    alert(`Quiz completed! Final score: ${score}/${cards.length}`);
    const bestScores = JSON.parse(localStorage.getItem("best_scores") || "{}");
    const quizKey = "HTML Quiz";

    if (!bestScores[quizKey] || score > bestScores[quizKey]) {
      bestScores[quizKey] = score;
      localStorage.setItem("best_scores", JSON.stringify(bestScores));
      alert(`🎉 New high score: ${score}!`);
    }
  }
});

backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showCard();
  }
});
