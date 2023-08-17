// Compiled using apps-script-sheets 1.0.0 (TypeScript 4.9.5)
function modifyHeaderNames() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const idsDataSheet = spreadsheet.getSheetByName("IDS Data");
  const semanticDomainsSheet = spreadsheet.getSheetByName("semantic domains");
  const sheets = spreadsheet.getSheets();
  sheets.forEach((sheet) => {
    if (isTSVFile(sheet)) {
      // copyGlossToTSV({ idsDataSheet, tsvSheet: sheet }, { idsGlossColumn: "H", glossName: "es_gloss" });
      // copyGlossToTSV({ idsDataSheet, tsvSheet: sheet }, { idsGlossColumn: "I", glossName: "fr_gloss" });
      // copyGlossToTSV({ idsDataSheet, tsvSheet: sheet }, { idsGlossColumn: "J", glossName: "po_gloss" });
      // copyGlossToTSV({ idsDataSheet, tsvSheet: sheet }, { idsGlossColumn: "K", glossName: "ru_gloss" });
      copySemanticDomainsToTSV({ tsvSheet: sheet, semanticDomainsSheet });
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

function copyGlossToTSV(sheet_info: GlossesSheetData, gloss_data: GlossData): void {
  const { idsGlossColumn, glossName } = gloss_data;
  const { idsDataSheet, tsvSheet } = sheet_info;
  const ids_id_column = idsDataSheet.getRange("C2:C").getValues();
  const ids_gloss_values = idsDataSheet.getRange(`${idsGlossColumn}2:${idsGlossColumn}`).getValues();
  const header_values = get_header_values(tsvSheet);
  const chapter_id_header = header_values.indexOf("chapter_id");
  const entry_id_header = header_values.indexOf("entry_id");
  const chapter_id_values = tsvSheet.getRange(2, chapter_id_header + 1, tsvSheet.getLastRow() - 1, 1).getValues();
  const entry_id_values = tsvSheet.getRange(2, entry_id_header + 1, tsvSheet.getLastRow() - 1, 1).getValues();
  const first_empty_column = get_first_empty_column(header_values);
  const first_empty_column_range = tsvSheet.getRange(2, first_empty_column, tsvSheet.getLastRow() - 1, 1);
  chapter_id_values.forEach((row, i) => {
    const lookupValue = `${row[0]}-${entry_id_values[i][0]}`;
    const match_index = ids_id_column.findIndex((value) => value[0] === lookupValue);
    if (match_index !== -1) {
      first_empty_column_range.getCell(i + 1, 1).setValue(ids_gloss_values[match_index][0]);
    }
  });
  tsvSheet.getRange(1, first_empty_column, 1, 1).setValue(glossName);
}

function copySemanticDomainsToTSV(sheet_info: SemanticDomainsSheetData): void {
  const { semanticDomainsSheet, tsvSheet } = sheet_info;
  const semantic_domains_range = semanticDomainsSheet.getRange("A2:A");
  const semantic_domains_tag_values = semantic_domains_range.getValues();
  const ids_semantic_domains_equivalent_values = semanticDomainsSheet.getRange("C2:C").getValues();
  const header_values = get_header_values(tsvSheet);
  const semantic_domain_tag_header = header_values.indexOf("Semantic Domains");
  const chapter_id_column = header_values.indexOf("chapter_id");
  const first_empty_column = get_first_empty_column(header_values);
  const chapter_id_values = tsvSheet.getRange(2, chapter_id_column + 1, tsvSheet.getLastRow() - 1, 1).getValues();
  tsvSheet.getRange(1, first_empty_column, 1, 2).setValue("semanticDomains").mergeAcross(); // Merge with the next column
  const first_empty_column_range = tsvSheet.getRange(2, first_empty_column, tsvSheet.getLastRow() - 1, 1);
  const second_empty_column_range = tsvSheet.getRange(2, first_empty_column + 1, tsvSheet.getLastRow() - 1, 1);
  const dropdown_rule = SpreadsheetApp.newDataValidation().requireValueInRange(semantic_domains_range).build();
  second_empty_column_range.setDataValidation(dropdown_rule);
  chapter_id_values.forEach((row, i) => {
    const match_index = ids_semantic_domains_equivalent_values.findIndex((value) => value[0] == row);
    // Logger.log("IDS equivalent " + ids_semantic_domains_equivalent_values.some((value) => value[0] == row));
    // Logger.log("value " + row);
    if (match_index) {
      Logger.log(match_index);
      // const semantic_domain_tag = ids_semantic_domains_equivalent_values.findIndex(value => value )
      // second_empty_column_range.getCell(i + 1, 1).setValue(match_index);
    }
    first_empty_column_range.getCell(i + 1, 1).setValue("1");
  });
}
