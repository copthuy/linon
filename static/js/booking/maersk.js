import { 
    matchFirst
    , getDatePrefix
    , getPODStr 
    , getBookingET
} from '../common.js';

import { 
    convertTable
    , getColumnByName
} from '../table.js';

function data_table(content) {
    return convertTable(
        content,
        /from\s+to\s+mode\s+vessel\s+voy\s+no\.\s+etd\s+eta/i,
        /load\s+itinerary/i
    );
}

export function booking_number(content) {
    return matchFirst(
        content,
        /booking\s+no\.\s*:\s*(\w+)/i
    );
}

export function booking_date(content) {
    return getDatePrefix(
        content,
        /date\s*:\s*/i,
        /(\d{4}-\d{2}-\d{2})/i
    );
}

export function bill_number(content) {
    return '';
}

export function vessel(content) {
    const table = data_table(content);
    const column = getColumnByName(table, /vessel/i);
    return column.filter(item => !/^(\s*|vessel)$/i.test(item));
}

export function pol(content) {
    return getPODStr(
        content,
        /from\s*:\s*([^\n]+)/i
    );
}

export function pod(content) {
    return getPODStr(
        content,
        /to\s*:\s*([^\n]+)/i
    );
}

const date_time = /(\d{4}-\d{2}-\d{2})/i;

export function closing_time(content) {
    return '';
}

export function si_cut_off(content) {
    return '';
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
