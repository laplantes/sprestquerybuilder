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

const addSelect = () => {
	clearInfoBar();
	// get the select input value
	const selectValue = document.getElementById('select-column-name').value;
	if (selectValue) {
		const newSelect = {id: selectCount, value: selectValue};
		// clear the input in the form
		document.getElementById('select-column-name').value="";
		const newSelectHtml = buildItemHtml(`select`, newSelect);
		document.getElementById('query-box-preview').insertAdjacentHTML('beforeend', newSelectHtml);
		// add the new select into the selects object
		selects[`${selectCount}`] = newSelect;
		const newSelectItem = document.getElementById(`select-${selectCount}`);
		document.getElementById(`select-${selectCount}`).childNodes[3].addEventListener('click', () => { newSelectItem.remove(); delete selects[`${newSelect.id}`]; });
		selectCount++;
	} else {
		displayMessage(`Please enter a column name to add to the select query`);
	}
};

// add event listeners for buttons
// ################################
// Clear the info bar message body
document.getElementById('close-notice').addEventListener('click', clearInfoBar);

// Click event for select button
document.getElementById('add-select-item').addEventListener('click', () => {
	addSelect();
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
});

// Click event for test url button
document.getElementById('test-url').addEventListener('click', () => {
	console.log('Test URL clicked');
});