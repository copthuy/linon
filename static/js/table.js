import { fixstr, getLines } from "./common.js";

export function convertTable(content, start_pattern, end_pattern) {
    content = content.replace(/\t/g, '      ');
    const lines = getLines(content, start_pattern, end_pattern);

    // Extract the header row and split it based on tabs or multiple spaces
    const headerLine = lines[0];
    const headers = headerLine.split(/\s{2,}/);
    
    // Determine column start positions based on the indexOf headers
    const headerPositions = headers.map(header => headerLine.indexOf(header));

    // Extract rows
    const rows = lines.map(line => {
        const row = [];
        headerPositions.forEach((start, i) => {
            const end = i + 1 < headerPositions.length ? headerPositions[i + 1] : line.length;
            row.push(fixstr(line.substring(start, end)));
        });
        return row;
    });

    return rows.filter(row => row.join('').trim() !== '');
}

export function getColumnByName(table, regex) {
    let columnIndex = -1;
    for (let i = 0; i < table[0].length; i++) {
        if (regex.test(table[0][i])) {
            columnIndex = i;
            break;
        }
    }

    if (columnIndex < 0) {
        return [];
    }

    return table.map(row => row[columnIndex]);
}