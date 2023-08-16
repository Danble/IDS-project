// Compiled using apps-script-sheets 1.0.0 (TypeScript 4.9.5)
function modifyHeaderNames() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const idsDataSheet = spreadsheet.getSheetByName("IDS Data");
  const sheets = spreadsheet.getSheets();
  sheets.forEach((sheet) => {
    if (isTSVFile(sheet)) {
      copyGlossToTSV({ idsDataSheet, tsvSheet: sheet }, { ids_gloss_column: "H", gloss_name: "es_gloss" });
    }
  });
  // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // if (!sheet.getName().endsWith("_tsv")) {
  //   return;
  // }
  // const header_row = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  // const modified_rows = header_row.map((hr) => {
  //   if (hr === "comment") hr = "notes";
  //   // Add all other glosses
  //   else if (hr === "meaning") hr = "en_gloss";
  //   else if (hr.endsWith("_Phonemic")) hr = "lexeme";
  //   return hr;
  // });
  // sheet.getRange(1, 1, 1, modified_rows.length).setValues([modified_rows]);
}

interface GlossData {
  ids_gloss_column: string;
  gloss_name: string;
}

interface GlossesSheet {
  idsDataSheet: GoogleAppsScript.Spreadsheet.Sheet;
  tsvSheet: GoogleAppsScript.Spreadsheet.Sheet;
}

function copyGlossToTSV(sheet_info: GlossesSheet, gloss_data: GlossData): void {
  const { ids_gloss_column, gloss_name } = gloss_data;
  const { idsDataSheet, tsvSheet } = sheet_info;
  const idsIDColumn = idsDataSheet.getRange("C2:C").getValues();
  const idsGlossColumn = idsDataSheet.getRange(`${ids_gloss_column}2:${ids_gloss_column}`).getValues();
  const header_values = get_header_values(tsvSheet);
  const chapter_id_column = header_values.indexOf("chapter_id");
  const entry_id_column = header_values.indexOf("entry_id");
  const chapter_id_values = tsvSheet.getRange(2, chapter_id_column + 1, tsvSheet.getLastRow() - 1, 1).getValues();
  const entry_id_values = tsvSheet.getRange(2, entry_id_column + 1, tsvSheet.getLastRow() - 1, 1).getValues();
  const first_empty_column = get_first_empty_column(header_values);
  const first_empty_column_range = tsvSheet.getRange(2, first_empty_column, tsvSheet.getLastRow() - 1, 1);
  chapter_id_values.forEach((row, i) => {
    const lookupValue = `${row[0]}-${entry_id_values[i][0]}`;
    const matchIndex = idsIDColumn.findIndex((value) => value[0] === lookupValue);
    if (matchIndex !== -1) {
      first_empty_column_range.getCell(i + 1, 1).setValue(idsGlossColumn[matchIndex][0]);
    }
  });
  tsvSheet.getRange(1, first_empty_column, 1, 1).setValue(gloss_name);
}

// function copySemanticDomainsToTSV(): void {
//   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
//   const sheets = spreadsheet.getSheets();
//   sheets.forEach(sheet => {
//     const semantic_domains_sheet = spreadsheet.getSheetByName("semantic domains");
//     const semantic_domains_values = seman
//     if (isTSVFile(sheet)) {
//       const header_values = get_header_values(sheet);
//       const first_empty_column = get_first_empty_column(header_values);
//       sheet.getRange(1, first_empty_column, 1, 2).setValue("semanticDomains").mergeAcross(); // Merge with the next column
//       const second_empty_column_range = sheet.getRange(2, first_empty_column + 1, sheet.getLastRow() - 1, 1);

//     }
//   })
// }

// function applyIDSGlosses() {
//   copyGlossToTSV("H", "es_gloss");
//   copyGlossToTSV("I", "fr_gloss");
//   copyGlossToTSV("J", "po_gloss");
//   copyGlossToTSV("K", "ru_gloss");
// }
