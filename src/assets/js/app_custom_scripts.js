 $(function () { ReadyLogin.init(); });

String.prototype.toNormalText = function() {
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

// String.prototype.padZero = function (this : string, length: number) {
//     var s = this;
//     while (s.length < length) {
//       s = '0' + s;
//     }
//     return s;
// };