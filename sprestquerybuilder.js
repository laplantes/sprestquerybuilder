'use strict';

const filterStringContainer = document.getElementById('filter-string');

let selects = {},
	selectCount = 0,
	orderBy = {},
	topNumber = null,
	expands = {},
	expandCount = 0,
	filter = '',
	filterCount = 0;

const clearValues = () => {
	selects = {},
	selectCount = 0,
	orderBy = {},
	topNumber = null,
	expands = {},
	expandCount = 0,
	filter = '',
	filterCount = 0;
};

/**
 * Function for clearing the lists contents before displaying new contents
 * @param  {object} containerToClear [the variable that represents the container to clean out]
 * @return {none}             [none]
 */
const clearContainer = (containerToClear) => {
	while (containerToClear.firstChild) {
		containerToClear.removeChild(containerToClear.firstChild);
	}
};

/**
 * Function for displaying a toast message
 * @param {string} title the title of the toast message
 * @param {string} message the message content
 */
const showToast = (title=`Enter a title`, message=`Enter a message, even a short one, but a long one is ok as well.`) => {
	document.getElementById('toast-title').innerText = title;
	document.getElementById('toast-message').innerText = message;
    const element = document.getElementById('toast')
    element.classList.add('show');
    setTimeout(() => { element.classList.remove('show'); }, 5000);
}

/**
 * 	Function takes in a type and an object with data, based on type the HTML string is built for the item and is returned
 * @param {string} type defines the type of action requested
 * @param {object} itemData data used to build the items HTML
 * @returns {string}
 */
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
				<div  id="${type}" class="box-item">
					<div><b>${type}:</b> ${itemData.filter} </div>
					<span id="close-filter">X</span>
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
					<div><b>${type}:</b> ${itemData.topNumber}</div>
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

	if (orderby.columnName) {
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$orderby=${orderby.columnName} ${orderby.operator}`;
		queryCount++;
		
	}

	if (filter.length > 0) {
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$filter=${filter}`;
		queryCount++;
	}

	if (top > 0) {
		(queryCount > 0) ? fullQueryString += `&` : false;
		fullQueryString += `$top=${top}`;
		queryCount++;
	}
	

	return fullQueryString;
};


// ################################
// Clear the info bar message body
//  TODO: add this to the docs for the info bar
// document.getElementById('close-notice').addEventListener('click', clearInfoBar);

const testUrl = (queryString) => {
	const testListName = document.getElementById('test-list-name').value,
	testUrl = document.getElementById('test-url').value;
	if (testListName && testUrl) {
		window.open(`${testUrl}/_api/web/lists/getByTitle('${testListName}')/items/${queryString}`);
	} else {
		showToast('Attention', 'Ensure all fields contain entries before attempting to test the query');
	}
};


const clearQueryContainers = (containers) => {
	containers.forEach(container => {
		clearContainer(container);
	});
}

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
		showToast(`Attention`, `Enter a column name to add to the select query`);
	}
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
			showToast(`Attention`, `Ensure all fields contain entries to add orderby to the query`);
		}
	}
});

// Click event for add top button
document.getElementById('add-top-item').addEventListener('click', () => {
	console.log('Add top item clicked');
	const topValue = document.getElementById('top-number').value;
	if ((topNumber === null) && (topValue > 0)) {
		topNumber = topValue;
		const topHtml = buildItemHtml(`top`, {topNumber});
		document.getElementById('container-top').insertAdjacentHTML('afterbegin', topHtml);
		const newTopItem = document.getElementById('top');
		document.getElementById(`close-top`).addEventListener('click', () => { newTopItem.remove(); topNumber = null; });
		document.getElementById('top-number').value = 100;
	} else if (topNumber < 1) {
		showToast(`Attention`, `Value cannot be less than 1`);
	} else {
		showToast(`Attention`, `A Row Limit value has already been assigned. Remove the current Row Limit before adding a new value.`);
	}
});

// Click event for generate query button
document.getElementById('generate-query').addEventListener('click', () => {
	console.log('Generate Query clicked');
	const queryContainer = document.getElementById('query'),
	queryCompleteString = buildQueryString(selects, filter, orderBy, topNumber);
	(queryContainer.innerText !== '') ? queryContainer.innerText = '' : false;
	queryContainer.innerText = queryCompleteString;
});

// insert text into the specified location, or currently active location
const insertText = (text, insertLocation) => {
	insertLocation.focus();
	const start = insertLocation.selectionStart,
		end = insertLocation.selectionEnd;
	insertLocation.setRangeText(text, start, end)
	// use the three lines below to insert text and leave cursor at end of inserted area
	insertLocation.focus();
	insertLocation.selectionStart = end + text.length;
	insertLocation.selectionEnd = end + text.length;
};

//  Click event for 'open selection'
document.getElementById('button-filter-open').addEventListener('click', () => {
	insertText('(', filterStringContainer);
});

//  Click event for filter add 'and'
document.getElementById('button-filter-and').addEventListener('click', () => {
	insertText('and', filterStringContainer);
});

//  Click event for add 'or'
document.getElementById('button-filter-or').addEventListener('click', () => {
	insertText('or', filterStringContainer);
});

//  Click event for 'close selection'
document.getElementById('button-filter-close').addEventListener('click', () => {
	insertText(')', filterStringContainer);
});

// Click event for add to filter button
document.getElementById('add-filter-query-item').addEventListener('click', () => {
	let columnName = document.getElementById('filter-column-name').value,
		operator = document.getElementById('filter-operator').value,
		value = document.getElementById('filter-value').value,
		date = document.getElementById('filter-date-value').value,
		time = document.getElementById('filter-time-value').value;
		if (value && (date || time)) {
			showToast('Attention', 'Choose either a value -OR- a date and time')
		} else if (columnName && operator && ( value && !(time || date) ) ) {
			// validation passes for all required fields and the value field
			insertText(`${columnName} ${operator} ${value}`, filterStringContainer);
			document.getElementById('filter-column-name').value = '';
			document.getElementById('filter-operator').value = '';
			document.getElementById('filter-value').value = ';'
		} else if (columnName && operator && ( !value && (time && date) ) ) {
			// validation passes for all required fields and the value field
			insertText(`${columnName} ${operator} '${date}T${time}:00Z'`, filterStringContainer);
			document.getElementById('filter-column-name').value = '';
			document.getElementById('filter-operator').value = '';
			document.getElementById('filter-date-value').value = '';
			document.getElementById('filter-time-value').value = '';
		} else {
			// Oh no, something isn't correct with the inputs
			showToast('Attention', 'Ensure filter inputs has data entered correctly');
		}

});

// Click event for adding filter to the query items
document.getElementById('add-filter-item').addEventListener('click', () => {
	if (filterCount === 0) {
		filter = document.getElementById('filter-string').value;
		if (filter.length > 0) {
			const filterHtml = buildItemHtml(`filter`, {filter});
			document.getElementById('container-filter').insertAdjacentHTML('afterbegin', filterHtml);
			const newFilterItem = document.getElementById('filter');
			document.getElementById(`close-filter`).addEventListener('click', () => { newFilterItem.remove(); filter = ''; filterCount = 0 });
			filterCount++
			document.getElementById('filter-string').value = '';
		} else {
			showToast('Attention', 'Filter cannot be empty');
		}
	}

	
});

//  Click event for filter clear all button
document.getElementById('filter-clear-all').addEventListener('click', () => {
	const clearConfirm = confirm('Are you sure you want to clear the contents of filter and start completely over?');
	if (clearConfirm) {
		document.getElementById('filter-string').value = ``;
	} else {
		showToast('Info', 'Canceled');
	}
});

// click event for Remove all query items button
document.getElementById('query-clear').addEventListener('click', () => {
	const clearConfirm = confirm('Are you sure you want to remove all the query items and start over?');
	if (clearConfirm) {
		let containersToClear = Array.from(document.getElementById('query-box-preview').children);
		clearQueryContainers(containersToClear);
		document.getElementById('query').innerText = '';
		clearValues();
	} else {
		showToast('Info', 'Canceled');
	}
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
	});
});

// Click event for test url button
document.getElementById('test-url-button').addEventListener('click', () => {
	console.log('Test URL clicked');
	const generatedQueryString = document.getElementById('query').innerText;
	if (generatedQueryString.length > 0) {
		testUrl(generatedQueryString);
	} else {
		showToast('Attention', 'Generate a query before attempting to test it');
	}
});
