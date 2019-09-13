const fs = require('fs');
const path = './XML_files/20190911_175/425416_2019.xml';
const DOMParser = require('xmldom').DOMParser;

let xml = fs.readFileSync(path, 'utf8');
let xml2 = xml.replace(
  'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication" xmlns:n2016="http://publications.europa.eu/resource/schema/ted/2016/nuts" xsi:schemaLocation="http://publications.europa.eu/resource/schema/ted/R2.0.9/publication TED_EXPORT.xsd"',
  ''
);

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;
var doc = new dom().parseFromString(xml2);

//get the main CPVCODE;

var cpvcode = xpath.select1(
  '/TED_EXPORT[1]/TRANSLATION_SECTION[1]/ML_TITLES[1]/ML_TI_DOC[11]/TI_CY[1]/node()[1]',
  doc
).value;
console.log(cpvcode);

//get the publication date
function getPublicationDate(doc) {
  try {
    var pubdate = xpath.select(
      '/TED_EXPORT/CODED_DATA_SECTION/REF_OJS/DATE_PUB',
      doc
    );
    var pubdateValue = pubdate[0].firstChild.data;
  } catch (err) {
    console.log('could find publicationdate with that xpath');
  }
  return pubdateValue;
}

//get the form type
function getFormType(doc) {
  try {
    var formType = xpath.select('/TED_EXPORT[1]/FORM_SECTION[1]', doc);
    var formTypeValue = formType[0].firstChild.localName;
  } catch (err) {
    console.log('Couldnt find formtype with that xpath');
  }
  return formTypeValue;
}

//get Languages
function getLanguages(doc) {

  try {
    var avalibleLanguages = xpath.select(
      '/TED_EXPORT/TECHNICAL_SECTION/FORM_LG_LIST',
      doc
    );
    var avalibleLanguagesValue = avalibleLanguages[0].firstChild.data;
    
  } catch (err) {
    console.log('could find avalible languages with that xpath');
  }
  return avalibleLanguagesValue;
}

console.log(getPublicationDate(doc));
console.log(getFormType(doc));
console.log(getLanguages(doc))
