const fs = require('fs');
const path = './XML_files/20190911_175/427452_2019.xml';
const DOMParser = require('xmldom').DOMParser;

let xml = fs.readFileSync(path, 'utf8');
let xml2 = xml.replace(
  'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication" xmlns:n2016="http://publications.europa.eu/resource/schema/ted/2016/nuts" xsi:schemaLocation="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication TED_EXPORT.xsd"',
  ''
);

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;

//var xml = '<book><title>Harry Potter</title></book>';
var doc = new dom().parseFromString(xml2);

var pubdate = xpath.select(
  '/TED_EXPORT/CODED_DATA_SECTION/REF_OJS/DATE_PUB',
  doc
);

console.log(pubdate[0].firstChild.data);

try {
  var cpvcode = xpath.select1(
    '/TED_EXPORT/CODED_DATA_SECTION/NOTICE_DATA/ORIGINAL_CPV/@CODE',
    doc
  ).value;
  console.log(cpvcode);
} catch (err) {
  console.log('finns ej med');
}
