import "./style.css";

// Components
const cardGoalComponent = (obj) => {
	return /*html*/ `
        <li class="card">
            <div class="card-content">
                <p class="card-body">${obj.body}</p>
                <input type="checkbox" class="card-check" data-id="${obj.id}" ${obj.status ? "checked" : ""}>
            </div>
            <div class="card-footer">
                <p class="card-date">${obj.day}/${obj.month}/${obj.year}</p>
                <button class="card-delete" data-id="${obj.id}">🗙</button>
            </div>
        </li>
    `;
};

const cardLinkComponent = (obj) => {
	return /*html*/ `
    <li class="card">
        <a href="${obj.url}" target="_blank" class="card-link">
            <span class="card-description">${obj.title}</span>
        </a>
        <button class="card-delete" data-id="${obj.id}">🗙</button>
    </li>
    `;
};

const goalsListComponent = (goals) => {
	let itemsFragment = "";

	for (const goal of goals) {
		itemsFragment += cardGoalComponent(goal);
	}

	return /*html*/ `
        <div class="goals-container" id="goals-container">
            <h3 class="goals-container-title">Goals</h3>
            <ul class="goals-container-list">
                ${goals.length ? itemsFragment : "<h3>Don't have goals<h3>"}
            </ul>
        </div>
    `;
};

const linksListComponent = (links) => {
	let itemsFragment = "";

	for (const link of links) {
		itemsFragment += cardLinkComponent(link);
	}

	return /*html*/ `
        <div class="links-container" id="links-container">
            <h3 class="links-container-title">Links</h3>
            <ul class="links-container-list">
                ${links.length ? itemsFragment : "<h3>Don't have links<h3>"}
            </ul>
        </div>
    `;
};

const goalsFormComponent = () => {
	return /*html*/ `
        <form class="form" id="goals-form" autocomplete="off">
            <h2 class="form-title">Add new Goal...</h2>
            <input type="text" class="form-field" id="goal-body" placeholder="Write a something goal">
            <div class="form-date">
                <input type="text" class="form-field" id="goal-day" placeholder="Day">
                <input type="text" class="form-field" id="goal-month" placeholder="Month">
                <input type="text" class="form-field" id="goal-year" placeholder="Year">
            </div>
            <button class="form-submit" id="goal-submit">Add</button>
        </form>
    `;
};

const linksFormComponent = () => {
	return /*html*/ `
        <form class="form" id="links-form" autocomplete="off">
            <h2 class="form-title">Add new Link...</h2>
            <input type="text" class="form-field" id="link-title" placeholder="Title link">
            <input type="text" class="form-field" id="link-url" placeholder="Url">
            <button class="form-submit" id="goal-submit">Add</button>
        </form>
    `;
};

const tabsComponent = (state) => {
	return /*html*/ `
        <div class="tab" id="tab">
            <input type="radio" id="tab-goals" name="tab" class="tab-radio" value="goals" ${state === "goals" ? "checked" : ""}>
            <label class="tab-label-btn" for="tab-goals">Goals</label>
            <input type="radio" id="tab-links" name="tab" class="tab-radio" value="links" ${state === "links" ? "checked" : ""}>
            <label class="tab-label-btn" for="tab-links">Links</label>
        </div>
    `;
};

const mainComponent = (tabState, goals, links) => {
	return /*html*/ `
        <div class="container">
            ${tabsComponent(tabState)}
            ${tabState === "goals" ? goalsFormComponent() : ""}
            ${tabState === "links" ? linksFormComponent() : ""}
            ${tabState === "goals" ? goalsListComponent(goals) : ""}
            ${tabState === "links" ? linksListComponent(links) : ""}
        </div>
    `;
};

const render = (tabState, goals, links) => {
	document.getElementById("app").innerHTML = mainComponent(
		tabState,
		goals,
		links,
	);
};

const main = () => {
	let tabState = localStorage.getItem("tabState");
	let goals = JSON.parse(localStorage.getItem("goals"));
	let links = JSON.parse(localStorage.getItem("links"));

	if (tabState === null) {
		tabState = "goals";
	}

	if (goals === null) {
		goals = [];
	}

	if (links === null) {
		links = [];
	}

	render(tabState, goals, links);

	const tabElement = document.getElementById("tab");

	tabElement?.addEventListener("click", (e) => {
		if (e.target.classList.contains("tab-radio")) {
			const newValue = e.target.value;
			localStorage.setItem("tabState", newValue);
			main();
		}
	});

	const goalFormElement = document.getElementById("goals-form");

	goalFormElement?.addEventListener("submit", (e) => {
		e.preventDefault();
		const body = e.target[0].value;
		const day = e.target[1].value;
		const month = e.target[2].value;
		const year = e.target[3].value;

		const newGoalsList = [...goals];
		newGoalsList.push({
			id: goals.length + 1,
			body,
			day,
			month,
			year,
			status: false,
		});

		localStorage.setItem("goals", JSON.stringify(newGoalsList));
		main();
	});

	const goalsListElement = document.getElementById("goals-container");

	goalsListElement?.addEventListener("click", (e) => {
		if (e.target.classList.contains("card-check")) {
			const newGoalsList = [...goals].map((goal) => {
				if (goal.id === Number(e.target.dataset.id)) {
					goal.status = !goal.status;
				}

				return goal;
			});

			localStorage.setItem("goals", JSON.stringify(newGoalsList));
			main();
		}

		if (e.target.classList.contains("card-delete")) {
			const newGoalsList = [...goals].filter((goal) => {
				return goal.id !== Number(e.target.dataset.id);
			});

			localStorage.setItem("goals", JSON.stringify(newGoalsList));
			main();
		}
	});

	const linksFormElement = document.getElementById("links-form");

	linksFormElement?.addEventListener("submit", (e) => {
		e.preventDefault();
		const title = e.target[0].value;
		const url = e.target[1].value;

		const newLinkslist = [...links];
		newLinkslist.push({
			id: links.length + 1,
			title,
			url,
		});

		localStorage.setItem("links", JSON.stringify(newLinkslist));
		main();
	});

	const linksListElement = document.getElementById("links-container");

	linksListElement?.addEventListener("click", (e) => {
		if (e.target.classList.contains("card-delete")) {
			const newLinkslist = [...links].filter((link) => {
				return link.id !== Number(e.target.dataset.id);
			});

			localStorage.setItem("links", JSON.stringify(newLinkslist));
			main();
		}
	});
};

document.addEventListener("DOMContentLoaded", () => main());
