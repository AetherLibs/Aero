const ansi = {
	GRAY: '30',
	RED: '31',
	GREEN: '32',
	YELLOW: '33',
	BLUE: '34',
	PINK: '35',
	CYAN: '36',
	WHITE: '37',
	BG_BLUE: '40',
	BG_ORANGE: '41',
	BG_DARKGRAY: '42',
	BG_GRUE: '43',
	BG_LIGHTGRAY: '44',
	BG_INDIGO: '45',
	BG_MOREGRAY: '46',
	BG_WHITE: '47',
	NORMAL: '0',
	BOLD: '1'
};
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

class AnsiColor {

	constructor() {
		this._format = ansi.NORMAL;
		this._color = null;
		this._bgColor = null;
	}

	color(name) {
		this._color = ansi[name.toUpperCase()];
		return this;
	}

	bgColor(name) {
		this._bgColor = ansi[`BG_${name.toUpperCase()}`];
		return this;
	}

	bold() {
		this._format = ansi.BOLD;
		return this;
	}

	toString() {
		return `[${[this._format, this._color, this._bgColor].filter(item => !!item).join(';')}m`;
	}

}

module.exports = {
	get ansi() {
		return new AnsiColor();
	}
};


module.exports.trimString = (str, max = 30) => {
	if (str.length > max) return `${str.substr(0, max)}...`;
	return str;
};

module.exports.random = (n1, n2) => Math.floor(Math.random() * (n2 - n1)) + n1;

module.exports.randomArray = array => array[this.random(0, array.length)];

module.exports.objectIsEmpty = obj => Object.entries(obj).length === 0;

module.exports.base32 = int => {
	if (int === 0)
		return alphabet[0];


	let res = '';
	while (int > 0) {
		res = alphabet[int % 32] + res;
		int = Math.floor(int / 32);
	}
	return res;
};

// https://stackoverflow.com/a/23013726/16411978
module.exports.objectFlip = (obj) => {
	const ret = {};
	Object.keys(obj).forEach(key => {
		ret[obj[key]] = key;
	});
	return ret;
};

// https://stackoverflow.com/a/11252167/16411978
function treatAsUTC(date) {
	const result = new Date(date);
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	return result;
}

module.exports.dateDiffDays = (date1, date2) => {
	const millisecondsPerDay = 24 * 60 * 60 * 1000;
	return Math.abs(treatAsUTC(date2).getTime() - treatAsUTC(date1).getTime()) / millisecondsPerDay;
};
