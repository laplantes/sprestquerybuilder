'use strict';

let selects = {},
	selectCount = 0,
	filters = {},
	filterCount = 0,
	orderBy = ``,
	topNumber;

/**
 * function for clearing the lists contents before displaying new contents
 * @param  {object} listToClear [the variable that represents the container to clean out]
 * @return {none}             [none]
 */
// const clearList = (listToClear) => {
// 	while (listToClear.firstChild) {
// 		listToClear.removeChild(listToClear.firstChild);
// 	}
// };

const showToast = (title=`Enter a title`, message=`Enter a message, even a short one, but a long one is ok as well.`) => {
	document.getElementById('toast-title').innerText = title;
	document.getElementById('toast-message').innerText = message;
    const element = document.getElementById('toast')
    element.classList.add('show');
    setTimeout(() => { element.classList.remove('show'); }, 5000);
}

const buildItemHtml = (type, itemData) => {
	switch(type) {
		case 'select':
			return `
				<div  id="${type}-${itemData.id}" class="box-item">
					<div><b>${type}:</b> ${itemData.value}</div>
					<span id="close-select-${itemData.id}">X</span>
				</div>
			`;
			
		case 'filter':
			return `
			<div  id="${type}-${itemData.id}" class="box-item">
			<div><b>${type}:</b> ${itemData.name} <b>{${itemData.operator}}</b> ${itemData.value}</div>
			<span id="close-filter-${itemData.id}">X</span>
			</div>				
			`;
			
		default:
			console.log("error");
			break;
	}
};

//  TODO: make and or available as a choice for multiple filters
const buildQueryString = (querystringSelects=``, querystringFilters=``) => {
	let fullQueryString = `?`;


	if (Object.keys(querystringSelects).length > 0) {
		let selectsArray = [];
		// Populate the contents of the selectsArray
		for (const item of Object.entries(querystringSelects)) {
			selectsArray.push(item[1].value)
		}
		const selectsString= selectsArray.join(',');
		fullQueryString += `$select=`;
		fullQueryString += `${selectsString}`;
	}

	if (Object.keys(querystringFilters).length > 0) {
		let filtersArray = [];
		// Populate the contents of the filterArray
		for (const item of Object.entries(querystringFilters)) {
			filtersArray.push(`${item[1].name} ${item[1].operator} ${item[1].value}`)
		}
		let filtersString = ``; 
		if (filtersArray.length === 1) {
			filtersString = `${filtersArray[0]}`;
		} else {
			for (let i=0; i < filtersArray.length; i++) {
				(i+1 === filtersArray.length) ? filtersString += `(${filtersArray[i]})`	: filtersString += `(${filtersArray[i]}) and `;
			}
		}
		fullQueryString += `$filter=`;
		fullQueryString += `(${filtersString})`;
	}

	return fullQueryString;
};

// add event listeners for buttons
// ################################
// Clear the info bar message body
//  TODO: add this to the docs for the info bar
// document.getElementById('close-notice').addEventListener('click', clearInfoBar);

// Click event for select button
document.getElementById('add-select-item').addEventListener('click', () => {

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
		document.getElementById(`close-select-${selectCount}`).addEventListener('click', () => { newSelectItem.remove(); delete selects[`${newSelect.id}`]; });
		// clear the input in the form in preperation for the next item to be added
		document.getElementById('select-column-name').value = "";
		// Increment the select counter		
		selectCount++;
	} else {
		showToast(`Attention`, `Please enter a column name to add to the select query`);
	}
});

// Click event for filter button
document.getElementById('add-filter-item').addEventListener('click', () => {
	console.log('Add filter item clicked');
	// get the filter values
	const filterName = document.getElementById('filter-column-name').value,
		filterOperator = document.getElementById('filter-operator').value,
		filterValue = document.getElementById('filter-value').value;
		if (filterName && filterOperator && filterValue) {
			// build the new object using the global filterCount and the functionally scoped filter values
			const newFilter = {id: filterCount, name: filterName, operator: filterOperator, value: filterValue};
			// Call the function to build out the required HTML to add to the filter to the page
			const newFilterHtml = buildItemHtml(`filter`, newFilter);
			// Insert the newly created HTML
			document.getElementById('query-box-preview').insertAdjacentHTML('beforeend', newFilterHtml);
			// add the new filter into the filterss object
			filters[`${filterCount}`] = newFilter;
			// Get the newly created HTML element
			const newFilterItem = document.getElementById(`filter-${filterCount}`);
			// Add an event listener to the newly created items remove button for removing the item from the page and from the selects object
			document.getElementById(`close-filter-${filterCount}`).addEventListener('click', () => { newFilterItem.remove(); delete filters[`${newFilter.id}`]; });
			// clear the inputs in the form in preperation for the next item to be added
			document.getElementById('filter-column-name').value = "";
			document.getElementById('filter-operator').value = "";
			document.getElementById('filter-value').value = "";
			// Increment the select counter		
			filterCount++;
		} else {
		showToast(`Attention`, `Please ensure all fields contain entries to add to the filter query`);
		}

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
	const queryContainer = document.getElementById('query'),
		queryHtml = buildQueryString(selects, filters);
	(queryContainer.innerText.length > 0) ? queryContainer.innerText = '' : false;
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