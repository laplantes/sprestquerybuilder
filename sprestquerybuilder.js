'use strict';

let selects = {},
	selectCount = 0,
	filters = {},
	filtersCount = 0,
	orderBy = ``,
	topNumber;

const clearInfoBar = () => {
	document.getElementById('info-bar-body').innerText='';
};

/**
 * function for clearing the lists contents before displaying new contents
 * @param  {object} listToClear [the variable that represents the container to clean out]
 * @return {none}             [none]
 */
const clearList = (listToClear) => {
	while (listToClear.firstChild) {
		listToClear.removeChild(listToClear.firstChild);
	}
};

const showToast = (title=`Enter a title`, message=`Enter a message, even a short one, but a long one is ok as well.`) => {
	document.getElementById('toast-title').innerText = title;
	document.getElementById('toast-message').innerText = message;
    const element = document.getElementById('toast')
    element.classList.add('show');
    setTimeout(() => { element.classList.remove('show'); }, 5000);
}

const displayMessage = (message) => {
	let content = document.getElementById('info-bar-body').innerText='';
	if (content) {
		clearInfoBar();
		document.getElementById('info-bar-body').innerText=`${message}`
	} else {
		document.getElementById('info-bar-body').innerText=`${message}`
	}
};

const buildItemHtml = (type, itemData) => {
	switch(type) {
		case 'select':
			return `
				<div  id="${type}-${itemData.id}" class="box-item">
					<div><b>${type}:</b> ${itemData.value}</div>
					<span>X</span>
				</div>
			`;
		default:
		console.log("error");
		break;
	}
};

const buildQueryString = (querystringSelects='', querystringFilters=``, listLibrayyName) => {
	let filtersArray = [],
		fullQueryString = `?`;

	if (querystringSelects) {
		let selectsArray = [];
		// Populate the contents of the selectsArray
		for (const item of Object.entries(querystringSelects)) {
		selectsArray.push(item[1].value)
		}
		const selectsString= selectsArray.join(',');
		fullQueryString +=`select=`;
		fullQueryString += `${selectsString}`;

	}

	return fullQueryString;
};

// add event listeners for buttons
// ################################
// Clear the info bar message body
document.getElementById('close-notice').addEventListener('click', clearInfoBar);

// Click event for select button
document.getElementById('add-select-item').addEventListener('click', () => {
	// addSelect();

	// Clear the info bar if there is a current message
	(document.getElementById('info-bar-body').innerText='') ? clearInfoBar() : false;
	// get the select input value
	const selectValue = document.getElementById('select-column-name').value;
	// Ensure there is content to add
	if (selectValue) {
		// Build the new object using the global selectCount and the functionally scoped selectValue
		const newSelect = {id: selectCount, value: selectValue};
		// Call the function to build out the required HTML to add the select to the page
		const newSelectHtml = buildItemHtml(`select`, newSelect);
		// Insert the newly created HTML
		document.getElementById('query-box-preview').insertAdjacentHTML('beforeend', newSelectHtml);
		// add the new select into the selects object
		selects[`${selectCount}`] = newSelect;
		// Get the newly created HTML element
		const newSelectItem = document.getElementById(`select-${selectCount}`);
		// Add an event listener to the newly created items remove button for removing the item from the page and from the selects object
		document.getElementById(`select-${selectCount}`).childNodes[3].addEventListener('click', () => { newSelectItem.remove(); delete selects[`${newSelect.id}`]; });
		// clear the input in the form in preperation for the next item to be added
		document.getElementById('select-column-name').value="";
		// Increment the select counter		
		selectCount++;
	} else {
		displayMessage(`Please enter a column name to add to the select query`);
		showToast(`Attention`, `Please enter a column name to add to the select query`);
	}
});

// Click event for filter button
document.getElementById('add-filter-item').addEventListener('click', () => {
	console.log('Add filter item clicked');
});

// Click event for filter date button
document.getElementById('add-date-filter-item').addEventListener('click', () => {
	console.log('Add filter date item clicked');
});

// Click event for orderby button
document.getElementById('add-orderby-item').addEventListener('click', () => {
	console.log('Add oderby item clicked');
});

// Click event for add top button
document.getElementById('add-top-item').addEventListener('click', () => {
	console.log('Add top item clicked');
});

// Click event for generate query button
document.getElementById('generate-query').addEventListener('click', () => {
	console.log('Generate Query clicked');
	const queryContainer = document.getElementById('query');
	(queryContainer.childElementCount > 0) ? clearList(queryContainer) : false;
	const queryHtml = buildQueryString(selects, filters);
	queryContainer.insertAdjacentHTML('afterbegin', queryHtml);
});

// Click event for test url button
document.getElementById('test-url').addEventListener('click', () => {
	console.log('Test URL clicked');
});

document.getElementById('copy-query').addEventListener('click', () => {
	const areaToCopy = document.getElementById('query-string');
	areaToCopy.select();
	areaToCopy.setSelectionRange(0, 99999);
	document.execCommand("copy");
	console.log('The copied text value is: ', areaToCopy.value);
});