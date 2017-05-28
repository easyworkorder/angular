export { }

if (!String.prototype.hasOwnProperty('extractIdFromURL')) {
    String.prototype.extractIdFromURL = function () {
        var split_data = this.split('/');
        return split_data[split_data.length - 2];
    }
}

if (!String.prototype.hasOwnProperty('toNormalText')) {
    String.prototype.toNormalText = function () {
        return this.replace(/[\(\||,-\s\)]/g, '');
    }
}

if (!String.prototype.hasOwnProperty('isNullOrEmpty')) {
    String.prototype.isNullOrEmpty = function () {
        return !!this.str;
    }
}

if (!String.prototype.hasOwnProperty('trim')) {

    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
}

if (!String.prototype.hasOwnProperty('upper')) {
    String.prototype.upper = function () {
        return this.toUpperCase();
    };
}

if (!String.prototype.hasOwnProperty('convertToISOString')) {
    String.prototype.convertToISOString = function () {
        if (!!this) {
            const inscertDate = new Date(this);
            return inscertDate.toISOString();
        }
        return new Date().toISOString();
    }
}

if (!String.prototype.hasOwnProperty('toDate')) {
    String.prototype.toDate = function () {
        if (!!this) {
            const CON_DATE = new Date(this);
            return CON_DATE;
        }
        return new Date();
    }
}

if (!Date.prototype.hasOwnProperty('toDate')) {
    Date.prototype.toDate = function () {
        return !!this && new Date(this);
    }
}