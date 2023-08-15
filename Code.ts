// Compiled using apps-script-sheets 1.0.0 (TypeScript 4.9.5)
function modifyHeaderNames() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet.getName().endsWith("_tsv")) {
    return;
  }
  const header_row = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const modified_rows = header_row.map(function (hr) {
    if (hr === "comment") hr = "notes";
    // Add all other glosses
    else if (hr === "meaning") hr = "en_gloss";
    else if (hr.endsWith("_Phonemic")) hr = "lexeme";
    return hr;
  });
  sheet.getRange(1, 1, 1, modified_rows.length).setValues([modified_rows]);
  applyIDSGlosses();
}
// function create_column_in_first_empty_header() { //Not in use
//   const header_range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
//   const header_values = header_range.getValues()[0];
//   const reversed_header_values = header_values.slice().reverse(); //This is because I want the first empty column on the right side.
//   const first_empty_column = header_values.length - 1 - reversed_header_values.findIndex(value => value === "");
//   const first_empty_column_values = sheet.getRange(2, first_empty_column + 1, sheet.getLastRow() - 1, 1).getValues();
//   return first_empty_column_values;
// }
function get_header_values(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}
function get_first_empty_column(header_values) {
  const reversed_header_values = header_values.slice().reverse();
  return (
    header_values.length -
    reversed_header_values.findIndex(function (value) {
      return value === "";
    })
  );
}
function isTSVFile(sheet) {
  const sheetName = sheet.getName();
  return sheetName.endsWith("_tsv");
}
function copyValuesToTSV(ids_gloss_column: string, gloss_name: string) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  sheets.forEach(function (sheet) {
    const idsDataSheet = spreadsheet.getSheetByName("IDS Data");
    const idsColumnC = idsDataSheet.getRange("C2:C").getValues();
    const idsColumnK = idsDataSheet.getRange(`${ids_gloss_column}2:${ids_gloss_column}`).getValues();
    if (isTSVFile(sheet)) {
      const header_values = get_header_values(sheet);
      const chapter_id_column = header_values.indexOf("chapter_id");
      const entry_id_column = header_values.indexOf("entry_id");
      const chapter_id_values = sheet.getRange(2, chapter_id_column + 1, sheet.getLastRow() - 1, 1).getValues();
      const entry_id_values = sheet.getRange(2, entry_id_column + 1, sheet.getLastRow() - 1, 1).getValues();
      const first_empty_column = get_first_empty_column(header_values);
      const first_empty_column_range = sheet.getRange(2, first_empty_column, sheet.getLastRow() - 1, 1);
      const first_empty_header = sheet.getRange(1, first_empty_column, 1, 1);
      chapter_id_values.forEach((row, i) => {
        const lookupValue = `${row[0]}-${entry_id_values[i][0]}`;
        const matchIndex = idsColumnC.findIndex((value) => value[0] === lookupValue);
        if (matchIndex !== -1) {
          first_empty_column_range.getCell(i + 1, 1).setValue(idsColumnK[matchIndex][0]);
        }
      });
      first_empty_header.setValue(gloss_name);
    }
    copySemanticDomainsToTSV(sheet);
  });
}
function copySemanticDomainsToTSV(sheet) {
  if (isTSVFile(sheet)) {
    const header_values = get_header_values(sheet);
    const first_empty_column = get_first_empty_column(header_values);
    const first_empty_header_range = sheet.getRange(1, first_empty_column, 1, 2); // Merge with the next column
    first_empty_header_range.setValue("semanticDomains").mergeAcross();
  }
}
function applyIDSGlosses() {
  copyValuesToTSV("H", "es_gloss");
  // copyValuesToTSV("I", "fr_gloss");
  // copyValuesToTSV("J", "po_gloss");
  // copyValuesToTSV("K", "ru_gloss");
}
