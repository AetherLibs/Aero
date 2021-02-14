const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const { kaomoji } = require('./constants');

exports.trimString = (str, max = 30) => {
	if (str.length > max) return `${str.substr(0, max)}...`;
	return str;
};

exports.random = (n1, n2) => Math.floor(Math.random() * (n2 - n1)) + n1;

exports.randomArray = array => array[this.random(0, array.length)];

exports.objectIsEmpty = obj => Object.entries(obj).length === 0;

exports.base32 = int => {
	if (int === 0) {
		return alphabet[0];
	}

	let res = '';
	while (int > 0) {
		res = alphabet[int % 32] + res;
		int = Math.floor(int / 32);
	}
	return res;
};

/*
 * Authored-By: newtykins
 * Source: https://github.com/newtykins/owoifyx/blob/master/index.js
 * License: MIT License
 */

exports.owoify = str => {
	str = str.replace(/(?:l|r)/g, 'w');
	str = str.replace(/(?:L|R)/g, 'W');
	str = str.replace(/n([aeiou])/g, 'ny$1');
	str = str.replace(/N([aeiou])|N([AEIOU])/g, 'Ny$1');
	str = str.replace(/ove/g, 'uv');
	str = str.replace(/nd(?= |$)/g, 'ndo');
	str = str.replace(
		/!+/g,
		` ${kaomoji[Math.floor(Math.random() * kaomoji.length)]}`
	);

	return str;
};
