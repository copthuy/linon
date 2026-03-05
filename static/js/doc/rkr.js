import { 
    matchFirst, strToDate
} from '../common.js';

import * as all from './all.js';

export function invoice_number(content) {
    return matchFirst(
        content,
        /inv\.\s*no\.\s*:\s*(\w+)/i
    ).replace(/\s+/, '');
}

export function vessel(content) {
    return matchFirst(
        content,
        /vessel\s*:\s*([^\n]+)/i
    ).replace(/\s+/, '');
}

export function etd(content) {
    return strToDate(matchFirst(
        content,
        /etd\s*:\s*([^\n]+)/i
    )) ?? 'TBA';
}

export function eta(content) {
    return strToDate(matchFirst(
        content,
        /eta\s*:\s*([^\n]+)/i
    )) ?? 'TBA';
}

export function total(content) {
    return all.total(content, /total\s*:\s+/i);
}

export {
    bill_number,
    cont_number
} from './all.js';