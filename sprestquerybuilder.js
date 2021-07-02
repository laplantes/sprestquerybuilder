'use strict';

let selects = {},
	selectCount = 0,
	filters = {},
	filterCount = 0,
	orderBy = {},
	topNumber=null;

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
					<div><b>${type}:</b> ${itemData.name} <b>{${itemData.operator}}</b> ${itemData.value} <b>{${itemData.option}}</b></div>
					<span id="close-filter-${itemData.id}">X</span>
				</div>				
			`;

		case 'orderby':
			return `
				<div  id="${type}" class="box-item">
					<div><b>${type}:</b> ${itemData.columnName} <b>{${itemData.operator}}</b></div>
					<span id="close-orderby">X</span>
				</div>
			`;

		case 'top':
			return `
				<div  id="${type}" class="box-item">
					<div><b>${type}:</b> ${itemData}</div>
					<span id="close-top">X</span>
				</div>
			`;

		default:
			console.log("error");
			break;
	}
};

//  TODO: make and / or available as a choice for multiple filters
const buildQueryString = (querystringSelects=``, querystringFilters=``, orderby={columnName: ``, operator: ``}, top=0) => {
	let fullQueryString = `?`,
		queryCount = 0;


	if (Object.keys(querystringSelects).length > 0) {
		let selectsArray = [];
		// Populate the contents of the selectsArray
		for (const item of Object.entries(querystringSelects)) {
			selectsArray.push(item[1].value)
		}
		const selectsString= selectsArray.join(',');
		fullQueryString += `$select=`;
		fullQueryString += `${selectsString}`;
		queryCount++;
	}

	if (Object.keys(querystringFilters).length > 0) {
		let filtersArray = [];
		// Populate the contents of the filterArray
		for (const item of Object.entries(querystringFilters)) {
			filtersArray.push(`${item[1].name} ${item[1].operator} ${item[1].value}`);
		}
		let filtersString = ``; 
		if (filtersArray.length === 1) {
			filtersString = `${filtersArray[0]}`;
		} else {
			for (let i=0; i < filtersArray.length; i++) {
				(i+1 === filtersArray.length) ? filtersString += `(${filtersArray[i]})`	: filtersString += `(${filtersArray[i]}) ${querystringFilters[i].option} `;
			}
		}
		console.log('The query string selects are', querystringSelects.length);
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$filter=`;
		fullQueryString += `(${filtersString})`;
		queryCount++;
	}

	if (orderby.columnName) {
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$orderby=${orderby.columnName} ${orderby.operator}`;
		queryCount++;
		
	}

	if (top > 0) {
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$top=${top}`;
		queryCount++;
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

	// get the select input value and convert any spaces to use the SharePoint format for spaces
	const selectValue = document.getElementById('select-column-name').value.replace(/ /g, '_x0020_');
	// Ensure there is content to add
	if (selectValue) {
		// Build the new object using the global selectCount and the functionally scoped selectValue
		const newSelect = {id: selectCount, value: selectValue};
		// Call the function to build out the required HTML to add the select to the page
		const newSelectHtml = buildItemHtml(`select`, newSelect);
		// Insert the newly created HTML
		document.getElementById('container-selects').insertAdjacentHTML('beforeend', newSelectHtml);
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
// document.getElementById('add-filter-item').addEventListener('click', () => {
// 	console.log('Add filter item clicked');
// 	// get the filter values
// 	const filterName = document.getElementById('filter-column-name').value.replace(/ /g, '_x0020_'),
// 		filterOperator = document.getElementById('filter-operator').value,
// 		filterValue = document.getElementById('filter-value').value,
// 		filterAddOr = document.getElementById('filter-item-and-or').value;
// 		if (filterName && filterOperator && filterValue) {
// 			// build the new object using the global filterCount and the functionally scoped filter values
// 			const newFilter = {id: filterCount, name: filterName, operator: filterOperator, value: `'${filterValue}'`, option: filterAddOr};
// 			// Call the function to build out the required HTML to add to the filter to the page
// 			const newFilterHtml = buildItemHtml(`filter`, newFilter);
// 			// Insert the newly created HTML
// 			document.getElementById('query-box-preview').insertAdjacentHTML('beforeend', newFilterHtml);
// 			// add the new filter into the filters object
// 			filters[`${filterCount}`] = newFilter;
// 			// Get the newly created HTML element
// 			const newFilterItem = document.getElementById(`filter-${filterCount}`);
// 			// Add an event listener to the newly created items remove button for removing the item from the page and from the selects object
// 			document.getElementById(`close-filter-${filterCount}`).addEventListener('click', () => { newFilterItem.remove(); delete filters[`${newFilter.id}`]; });
// 			// clear the inputs in the form in preparation for the next item to be added
// 			document.getElementById('filter-column-name').value = "";
// 			document.getElementById('filter-operator').value = "";
// 			document.getElementById('filter-value').value = "";
// 			// Increment the select counter		
// 			filterCount++;
// 		} else {
// 		showToast(`Attention`, `Please ensure all fields contain entries to add to the filter query`);
// 		}
// });

// Click event for filter date button
document.getElementById('add-date-filter-item').addEventListener('click', () => {
	console.log('Add filter date item clicked');
});

// Click event for orderby button TODO: add comments
document.getElementById('add-orderby-item').addEventListener('click', () => {
	const orderByValue = document.getElementById('orderby-column-name').value.replace(/ /g, '_x0020_'),
		orderByOperator = document.getElementById('orderby-operator').value;
	if (orderBy.columnName ? true : false) {
		showToast(`Attention`, `OrderBy has already been assigned. Remove existing entry before reassigning.`);
	} else {
		if (orderByValue && orderByOperator) {
			console.log(`The value of orderBy is: ${orderByValue}`);
			orderBy.columnName = orderByValue;
			orderBy.operator = orderByOperator;
			const newOrderbyHtml = buildItemHtml(`orderby`, orderBy);
			document.getElementById('container-orderby').insertAdjacentHTML('beforeend', newOrderbyHtml);
			const newOrderbyItem = document.getElementById('orderby');
			document.getElementById(`close-orderby`).addEventListener('click', () => { newOrderbyItem.remove(); orderBy = {}; });
			document.getElementById('orderby-column-name').value = ``;
			document.getElementById('orderby-operator').value = ``;
		} else {
			showToast(`Attention`, `Please ensure all fields contain entries to add orderby to the query`);
		}
	}
});

// Click event for add top button
document.getElementById('add-top-item').addEventListener('click', () => {
	console.log('Add top item clicked');
	const topValue = document.getElementById('top-number').value;
	if (topNumber === null && topValue > 0) {
		topNumber = topValue;
		const topHtml = buildItemHtml(`top`, topNumber);
		document.getElementById('container-top').insertAdjacentHTML('afterbegin', topHtml);
		const newTopItem = document.getElementById('top');
		document.getElementById(`close-top`).addEventListener('click', () => { newTopItem.remove(); topNumber = null; });
		document.getElementById('top-number').value = 100;
	} else if (topNumber < 1) {
		showToast(`Attention`, `Value cannot be less than 1`);
	} else {
		showToast(`Attention`, `A top value has already been assigned. Remove the current top before adding a new value.`);
	}
});

// Click event for generate query button
document.getElementById('generate-query').addEventListener('click', () => {
	console.log('Generate Query clicked');
	const queryContainer = document.getElementById('query'),
		queryCompleteString = buildQueryString(selects, filters, orderBy, topNumber);
	(queryContainer.innerText !== '') ? queryContainer.innerText = '' : false;
	queryContainer.innerText = queryCompleteString;
});

// Click event for test url button
document.getElementById('test-url').addEventListener('click', () => {
	console.log('Test URL clicked');
});

//  click event for copy to clipboard
document.getElementById('copy-query').addEventListener('click', () => {
	const areaToCopy = async () => {return document.getElementById('query').innerText;};
	areaToCopy().then(async (copied) => {
		try {
			await navigator.clipboard.writeText(copied);
			showToast(`Success`, `Query copied to the clipboard`);
		}
		catch (error) {
			showToast(`Oh no`, `Query failed to copy to the clipboard`);
		}
	})
});