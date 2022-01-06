const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

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

// https://stackoverflow.com/a/23013726/16411978
exports.objectFlip = (obj) => {
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

exports.dateDiffDays = (date1, date2) => {
	const millisecondsPerDay = 24 * 60 * 60 * 1000;
	return Math.abs(treatAsUTC(date2).getTime() - treatAsUTC(date1).getTime()) / millisecondsPerDay;
};
