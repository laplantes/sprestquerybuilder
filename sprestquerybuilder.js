'use strict';

let selects = [],
	filters = {},
	orderby = ``,
	top = ``;

// add event listeners for buttons

// Clear the info bar message body
document.getElementById('close-notice').addEventListener('click', () => {
	console.log('clicked');
	document.getElementById('info-bar-body').innerText='';
});

// Click event for select button
document.getElementById('add-select-item').addEventListener('click', () => {
	console.log('Add select item clicked');
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