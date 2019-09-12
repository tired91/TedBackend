const fs = require('fs');
const path = './XML_files/20190911_175/425416_2019.xml';
const DOMParser = require('xmldom').DOMParser;

let xml = fs.readFileSync(path, 'utf8');

let parser = new DOMParser(),
  xmlDoc = parser.parseFromString(xml, 'text/xml');

let tedExport = xmlDoc.getElementsByTagName('TED_EXPORT')[0];

console.log(tedExport.firstChild.firstChild.textContent);
console.log(tedExport.firstChild.lastChild.textContent);
