if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
    function(s) {
        let matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
        } while ((i < 0) && (el = el.parentElement));
        return el;
    };
}



// (function () {
//     if ( typeof NodeList.prototype.forEach === "function" ) return false;
//     NodeList.prototype.forEach = Array.prototype.forEach;
// })();
