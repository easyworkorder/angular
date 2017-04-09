export class Csv {
  static format(value) {
    if (value == '') { // weak
      return undefined;
    }

    if (value == 'null') {
      return null;
    }

    if (value.toLowerCase() == 'false') {
      return false;
    }

    if (value.toLowerCase() == 'true') {
      return true;
    }

    if (!isNaN(value)) {
      return value % 1 === 0 ? parseInt(value) : parseFloat(value);
    }

    return value;
  }

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument. */
  static toArray(strData: string, strDelimiter: string = ',') {

    // Create a regular expression to parse the CSV values.
    let objPattern = new RegExp(
      (
        // Delimiters.
        '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

        // Quoted fields.
        '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +

        // Standard fields.
        '([^\"\\' + strDelimiter + '\\r\\n]*))'
      ),
      'gi'
    );

    let arrData = [[]], // Create an array to hold our data. Give the array a default empty first row.
      arrMatches; // Create an array to hold our individual pattern matching groups.

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
      let strMatchedDelimiter = arrMatches[1], // Get the delimiter that was found.
        strMatchedValue;

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter) {

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      // Else we found a non-quoted value.
      strMatchedValue = arrMatches[2] ? arrMatches[2].replace(new RegExp( '\"\"', 'g' ), '\"') : arrMatches[3];

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
  }

  static toJson(strData: string, strDelimiter: string = ',', header: boolean = true) {
    let parsed = Csv.toArray(strData, strDelimiter);
    let parsedHeader = header ? parsed[0] : [];
    let parsedBody = header ? parsed.slice(1) : parsed;

    return parsedBody.map(item =>
        item.reduce((output, prop, index) => {
          output[parsedHeader[index] || index] = Csv.format(item[index]);
          return output;
        }, {})
      );
  }
}
