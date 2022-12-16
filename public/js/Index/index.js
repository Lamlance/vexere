function searchOn(words, find, limit) {
	if (words == undefined || !Array.isArray(words)) {
		return [];
	}

	if (find == undefined || String(find).length <= 0) {
		return [];
	}

	if (limit == undefined || isNaN(limit)) {
		limit = null;
	}

	let matches = [];
	words.forEach((word) => {
		if (limit == 0) {
			return matches;
		}

		if (word.toLowerCase() != find.toLowerCase()) {
			if (
				word.toLowerCase().substr(0, find.length) == find.toLowerCase()
			) {
				matches.push(word);

				if (limit !== null) {
					limit--;
				}
			}
		}
	});

	return matches;
}

const searchTable = document.querySelector(".search_bar");

const searchStartInput = searchTable.querySelector("#start-place");
const autoCompleteFrom = searchTable.querySelector("#auto-complete-start");


const startSuggestUl = document.querySelector(".start-locations-list");
const startListLi = startSuggestUl.querySelectorAll("li");
const startLocations = [];

startListLi.forEach((li) => {
	startLocations.push(li.innerText);
	// li.addEventListener("click", (event) => {
	// 	event.target.value = inputValue;
	// 	// autoCompleteEnd.replaceChildren();
	// });

	li.addEventListener("click", (event) => {
		searchStartInput.value = event.target.innerText;
		startListLi.forEach((item) => {
			item.style.display = "none";
		});
	});
});

const searchEndInput = searchTable.querySelector("#end-place");
const autoCompleteEnd = searchTable.querySelector("#auto-complete-end");

const endSuggestUl = document.querySelector(".end-locations-list");
const endListLi = endSuggestUl.querySelectorAll("li");
const endLocations = [];

endListLi.forEach((li) => {
	endLocations.push(li.innerText);
	li.addEventListener("click", (event) => {
		searchEndInput.value = event.target.value;
		endListLi.forEach((item) => {
			item.style.display = "none";
		});
	});
});

// function createAutoCompleteLi(inputField, divContainer,inputValue=""){
//   const liElement = document.createElement("li");
//   liElement.innerText = inputValue;
//   liElement.addEventListener("click",(event)=>{
//     inputField.value = inputValue;
//     divContainer.replaceChildren();
//   });
//   return liElement;
// }

searchStartInput.addEventListener("input", (event) => {
	const value = event.target.value;

	console.log("Start");
	const matches = searchOn(startLocations, value, startLocations.length);
	console.log(matches);

	autoCompleteFrom.style.display = "block";
	const suggestUl = document.querySelector(".start-locations-list");
	const listLi = suggestUl.querySelectorAll("li");
	suggestUl.style.display = "";


	listLi.forEach((li) => {
		if (matches.includes(li.innerText)) {
			li.style.display = "";
		} else {
			li.style.display = "none";
		}
	});

});

searchEndInput.addEventListener("input", (event) => {
	const value = event.target.value;

	console.log("End");
	const matches = searchOn(endLocations, value, endLocations.length);
	console.log(matches);

	autoCompleteFrom.style.display = "block";
	const suggestUl = document.querySelector(".end-locations-list");
	const listLi = suggestUl.querySelectorAll("li");
	suggestUl.style.display = "";

	listLi.forEach((li) => {
		if (matches.includes(li.innerText)) {
			li.style.display = "";
		} else {
			li.style.display = "none";
		}
	});
});
