import { matchFirst, strToDate } from '../common.js';

export {
    cont_number,
    etd,
    eta,
    total 
} from './all.js';

export function invoice_number(content) {
    return matchFirst(
        content,
        /no\.\s*:\s*([^\n]+)/i
    ).replace(/\s+date[^\n]+/i, '');
}

export function bill_number(content) {
    return matchFirst(
        content,
        /mbl#\s+([^\n]+)/i
    );
}


export function vessel(content) {
    return matchFirst(
        content,
        /vessel\s*:\s*([^\n]+)/i
    ).replace(/\s+eta\s+date[^\n]+/i, '');
}