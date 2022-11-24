let categories = [];
async function getCategoryIds() {
  const response = await axios.get(
    "https://jservice.io/api/categories?count=100"
  );
  const randomCategories = _.sampleSize(
    response.data.filter((value) => value.clues_count > 5),
    6
  );
  for (let item of randomCategories) {
    const category = await getCategory(item.id);
    categories.push(category);
  }
  return categories;
}

async function getCategory(catId) {
  const response = await axios.get(
    `https://jservice.io/api/category?id=${catId}`
  );
  let { title, clues } = response.data;
  cluesNew = clues.map((value) => {
    if (value.question !== "=") {
      return { question: value.question, answer: value.answer, showing: null };
    }
  });
  const obj = {
    title,
    cluesList: cluesNew.slice(0, 5),
  };
  return obj;
}

const $table = $("#jeopardy");

async function fillTable() {
  const thead = document.createElement("tr");
  const categories = await getCategoryIds();
  for (let category of categories) {
    const categoryColumn = document.createElement("td");
    categoryColumn.id = category.title;
    categoryColumn.innerText = category.title.toUpperCase();
    categoryColumn.style.textDecoration = "underline";
    categoryColumn.style.fontSize = "1.25rem";
    thead.insertAdjacentElement("beforeend", categoryColumn);
  }
  $table.append(thead);

  for (let category of categories) {
    for (let question of category.cluesList) {
      const rowIdx = category.cluesList.indexOf(question);
      let chosenRow = document.querySelector(`#row${rowIdx}`);
      if (!chosenRow) {
        chosenRow = document.createElement("tr");
        chosenRow.id = `row${rowIdx}`;
        $table.append(chosenRow);
      }
      const questionCell = document.createElement("td");
      questionCell.classList.add("question");
      questionCell.dataset.category = category.title;
      questionCell.dataset.index = rowIdx;
      questionCell.innerText = "?";
      chosenRow.insertAdjacentElement("beforeend", questionCell);
    }
  }
  document.querySelector("#spin-container").classList.toggle("hidden");
}

$table.on("click", "td.question", handleClick);

function handleClick(evt) {
  const idx = this.dataset.index;
  const [chosenCategory] = categories.filter(
    (value) => value.title === this.dataset.category
  );
  if (chosenCategory.cluesList[idx].showing === null) {
    this.innerText = chosenCategory.cluesList[idx].question;
    const mainIndex = categories.indexOf(chosenCategory);
    categories[mainIndex].cluesList[idx].showing = true;
  } else if (chosenCategory.cluesList[idx].showing === true) {
    this.innerText = chosenCategory.cluesList[idx].answer;
  }
}

const startButton = document.querySelector("#start");

startButton.addEventListener("click", function () {
  startButton.innerText = "restart";
  $table.empty();
  categories = [];
  fillTable();
  document.querySelector("#spin-container").classList.toggle("hidden");
});
