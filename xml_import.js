const fs = require('fs');
const path = './XML_files/20190911_175/425466_2019.xml';
const DOMParser = require('xmldom').DOMParser;

let xml = fs.readFileSync(path, 'utf8');

xml2 = xml.replace(/xmlns=\"(.*?)\"/g, '');

var xpath = require('xpath'),
  dom = require('xmldom').DOMParser;
var doc = new dom().parseFromString(xml2);

//get the main CPVCODE;

function getMainCPVCode(doc) {
  var cpvCodeValue;
  try {
    var cpvcode = xpath.select1(
      '/TED_EXPORT/CODED_DATA_SECTION/NOTICE_DATA/ORIGINAL_CPV/@CODE',
      doc
    ).value;
    cpvCodeValue = cpvcode;
  } catch (err) {}
  return cpvCodeValue;
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

//get all cpv-codes
//fungerar på alla utom oth(?);
function getALLCPVCODES(doc) {
  let arrayOfCPVCODES = [];
  try {
    var allCPVCODES = xpath.select('//*[CPV_CODE]', doc);
    for (let a = 0; a < allCPVCODES.length; a++) {
      arrayOfCPVCODES.push(allCPVCODES[a].firstChild.attributes[0].nodeValue);
    }
    const uniqueValues = new Set(arrayOfCPVCODES);
    arrayOfCPVCODES = [...uniqueValues];
  } catch (err) {}
  return arrayOfCPVCODES;
}

function getCountry(doc) {
  let countryToReturn;
  try {
    var country = xpath.select(
      '/TED_EXPORT[1]/CODED_DATA_SECTION[1]/NOTICE_DATA[1]/ISO_COUNTRY[1]',
      doc
    );

    countryToReturn = country[0].attributes[0].nodeValue;
  } catch (err) {}
  return countryToReturn;
}

function getNutsCode(doc) {
  var arrayOfNuts = [];
  try {
    var allNutsCode = xpath.select(
      "//NOTICE_DATA//*[contains(local-name(), 'NUTS')]",
      doc
    );

    for (let a = 0; a < allNutsCode.length; a++) {
      arrayOfNuts.push(allNutsCode[a].attributes[0].nodeValue);
    }

    const uniqueValues = new Set(arrayOfNuts);
    arrayOfNuts = [...uniqueValues];
  } catch (err) {
    console.log('fel' + err);
  }

  return arrayOfNuts;
}

console.log('Nuts_CODES: ' + getNutsCode(doc));
console.log('Country: ' + getCountry(doc));
console.log('PUBLICATION_DATE: ' + getPublicationDate(doc));
console.log('FORM_TYPE: ' + getFormType(doc));
console.log('MAIN_CPV_CODE: ' + getMainCPVCode(doc));
console.log('ALL_CPV_CODES; ' + getALLCPVCODES(doc));
console.log('Language: ' + getLanguages(doc));
