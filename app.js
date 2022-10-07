// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
let categories = [];
async function getCategoryIds() {
  const response = await axios.get(
    "http://jservice.io/api/categories?count=100"
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

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  const response = await axios.get(
    `http://jservice.io/api/category?id=${catId}`
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

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
const $table = $("#jeopardy");

async function fillTable() {
  const thead = document.createElement("tr");
  const categories = await getCategoryIds();
  for (let category of categories) {
    const categoryColumn = document.createElement("td");
    categoryColumn.id = category.title;
    categoryColumn.innerText = category.title.toUpperCase();
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

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

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

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

const startButton = document.querySelector("#start");

startButton.addEventListener("click", function () {
  startButton.innerText = "restart";
  $table.empty();
  categories = [];
  fillTable();
  document.querySelector("#spin-container").classList.toggle("hidden");
});

const test = document.createElement("h1");

test.dataset = [{ hello: 1, test: 2 }];

console.log(test);
