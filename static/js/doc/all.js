import { 
    fixstr,
    matchFirst,
    isValidDateString,
    getLines
} from '../common.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+of\s+lading\s+\#\s*:\s*.*?([^\n]+)/i
    ).
    replace(/\s*\w{2,}([\/-]\w{2,})+\s*/i, '').
    replace(/\s*invoice.*/i, '').
    replace(/\s*tcl.*/i, '').
    replace(/\s+/i, '');
}

export function invoice_number(content, regex = /\(\s*\d+\s*\)\s*no\s*\&\s*date\s*/i) {
    let lines = getLines(
        content, 
        /\(\s*1\s*\)/i, 
        /\(\s*2\s*\)/i
    );
    if (!lines.length) {
        return '';
    }
    const match = lines[0].match(regex);
    if (!match) {
        return '';
    }
    const index = match.index;
    lines = lines.
        map(el => el.
            substr(index).
            trim().
            replace(regex, '').
            replace(/\s*no\s*[\.:\s]+\s*/i, '').
            replace(/((of\s+)?invoice\s*)+/i, '').
            replace(/date.+/i, '').
            replace(/linon.+/i, '').
            replace(/\s{2,}.+/g, '').
            trim()
        ).
        filter(line => line);
    
    return fixstr(lines[0]);
}

export function vessel(content, regex = /\(\s*\d+\s*\)\s*carrier/i) {
    const lines = content.replace(/\r/g, "\n").split("\n");
    let groups = [];
    for (const row of lines) {
        if (groups.length > 0) {
            let str = row;
            str = str.replace(/\(\s*\d+\s*\)\s*etd.*/i, '');
            if (groups.length > 1) {
                str = str.substr(0, groups[1]);
            }
            str = str.trim().split(/\s{2,}/)[0].trim();
            if (str !== '') {
                return fixstr(str);
            }
        }
        const result = regex.exec(row);
        if (result) {
            groups = row.
                split(/\s{2,}/).
                map(str => row.indexOf(str) - result.index);
        }
    }
    return '';
}

export function cont_number(content) {
    const result = new Set([...content.matchAll(/\b[a-z]{4}\d{7}\b/gi)].map(item => item[0].toUpperCase()));
    return [...result];
}

function getDateFromLines(content, regex) {
    const dates = [];
    const today = new Date();
    const match = /\(\s*\d+\s*\)\s*port\s+of/i.exec(content);
    if (match) {
        content = content.slice(match.index);
    }

    const lines = content.replace(/\r/g, "\n").split("\n");
    let collecting = false;
    for (const row of lines) {
        if (regex.test(row)) {
            collecting = true;
        }
        if (collecting === true) {
            for (const cell of row.split(/\s{2,}/)) {
                const val = cell.trim().replace(/th|rd|nd|st/gi, '');
                if (isValidDateString(val)) {
                    const date = new Date(val);
                    if (date.getFullYear() < today.getFullYear()) {
                        date.setFullYear(today.getFullYear());
                    }
                    dates.push(date);
                }
            }
        }
        if (dates.length) {
            break;
        }
    }
    return dates;
}

export function etd(content, regex = /\betd\b/i) {
    const dates = getDateFromLines(content, regex);
    return new Date(Math.min(...dates));
}

export function eta(content, regex = /\beta\b/i) {
    const dates = getDateFromLines(content, regex);
    return new Date(Math.max(...dates));
}

export function total(content, regex = /(say|said|words).*?(thousand|hundred|dollar|cent)/i) {
    const lines = content.replace(/\r/g, "\n").split("\n");
    let amount = 0;
    for (const row of lines) {
        let matches = [...row.matchAll(/\d[\d,.]+/g)];
        if (matches.length > 0) {
            amount = matches.pop();
        }
        if (regex.test(row)) {
            return amount;
        }
    }

    return amount;
}
