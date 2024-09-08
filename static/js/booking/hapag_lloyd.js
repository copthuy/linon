import { 
    matchFirst
    , fixstr
    , fixPODStr
    , getDatePrefix
    , getBookingET
    , getPreviousDate 
} from '../common.js';

import { 
    convertTable
    , getColumnByName 
} from '../table.js';

function data_table(content) {
    return convertTable(
        content,
        /from\s+to\s+by\s+etd\s+eta/i,
        /import\s+terminal\s+pick\s+up/i
    );
}

export function booking_number(content) {
    return matchFirst(
        content,
        /our\s+reference\s*:\s*(\w+)/i
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /booking\s+date\s*:\s*/i,
        /(\d{2}-[a-z]{3}-\d{2,})/i
    );
}

export function bill_number(content) {
    return '';
}

export function vessel(content) {
    const table = data_table(content);
    const column = getColumnByName(table, /by/i);
    const vessel = column
        .join(' ')
        .replace(/.*?vessel\s*/i, '')
        .replace(/\s*dp\s.*?voyage.*/i, '');

    return [fixstr(vessel)];
}

export function pol(content) {
    const table = data_table(content);
    const column = getColumnByName(table, /from/i).
        filter(item => item.trim() !== '');
    return fixPODStr(column[1]);
}

export function pod(content) {
    const table = data_table(content);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (/vessel/i.test(table[i][j])) {
                return fixPODStr(table[i][j - 1]);
            }
        }
        
    }
    return '';
}


const date_time = /(\d{2}-[a-z]{3}-\d{4}(\s+\d{2}:\d{2})?)/i;

export function closing_time(content) {
    const service = matchFirst(
        content,
        /ext\.\s+voy\s*:\s*([^\n]+)/i
    );
    const service_date = /.*?:\s*(\d{2})[:h](\d{2})\s+on\s+([a-z]{3})\s+/i;
    const regex= new RegExp(service.toLowerCase() + service_date.source, 'i');
    const match = content.match(regex);
    
    return match && match.length > 3 ? getPreviousDate(etd(content), match.slice(1, 4)) : '';
}

export function si_cut_off(content) {
    const regex = /shipping\s+instruction\s+closing[\s\S]*?(\d{2}-[a-z]{3}-\d{4})[\s\S]*?(\d{2}:\d{2})/i;
    const match = content.match(regex);
    return match && match.length > 2 ? new Date(match.slice(1, 3)) : '';
}

export function etd(content) {
    const table = data_table(content);
    const column = getColumnByName(table, /etd/i);

    return getBookingET(
        column.join(' '),
        /\s*/i,
        date_time,
        'min'
    );
}

export function eta_origin(content) {
    const table = data_table(content);
    const column = getColumnByName(table, /eta/i);
    
    return getBookingET(
        column.join(' '),
        /\s*/i,
        date_time,
        'max'
    );
}

export function eta(content) {
    return eta_origin(content);
}
