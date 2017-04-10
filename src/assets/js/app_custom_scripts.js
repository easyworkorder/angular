$(function () { ReadyLogin.init(); });

String.prototype.toNormalText = function () {
    return this.replace(/[\(\||,-\s\)]/g, '');
}

String.prototype.isNullOrEmpty = function () {
    return !!this.str;
}

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

String.prototype.upper = function () {
    return this.toUpperCase();
};

String.prototype.convertToISOString = function () {
    if (!!this) {
        const inscertDate = new Date(this);
        return inscertDate.toISOString();
    }
    return new Date().toISOString();
}

String.prototype.toDate = function () {
    if (!!this) {
        const CON_DATE = new Date(this);
        return CON_DATE;
    }
    return new Date();
}

Date.prototype.toDate = function() {
    return !!this && new Date(this);
}

// String.prototype.padZero = function (this : string, length: number) {
//     var s = this;
//     while (s.length < length) {
//       s = '0' + s;
//     }
//     return s;
// };