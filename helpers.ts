function get_header_values(sheet: GoogleAppsScript.Spreadsheet.Sheet): string[] {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function isTSVFile(sheet: GoogleAppsScript.Spreadsheet.Sheet): boolean {
  const sheetName = sheet.getName();
  return sheetName.endsWith("_tsv");
}

function get_first_empty_column(header_values: string[]): number {
  const reversed_header_values = header_values.slice().reverse();
  return (
    header_values.length -
    reversed_header_values.findIndex(function (value) {
      return value === "";
    })
  );
}
