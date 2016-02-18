function getCookie(keyName) {
	var key = keyName + '=';
	var cookie = document.cookie.split(';');
	for (var i = 0; i < cookie.length; i++) {
		var current = cookie[i];
		while (current.charAt(0) == ' ') current = current.substring(1);
		var index = current.indexOf('=');
		var currentKey = current.slice(0, index);
		if (currentKey == keyName) {
			return current.slice(index + 1, current.length);
		}
	}
	return "";
}