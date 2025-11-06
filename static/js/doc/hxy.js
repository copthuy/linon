import { matchFirst } from '../common.js';

export function invoice_number(content) {
    return matchFirst(
        content,
        /invoice\s*:\s*([^\n]+)/i
    );
}

export function vessel(content) {
    return matchFirst(
        content,
        /vessel\s*([^\n]+)/i
    );
}

export {
    bill_number,
    cont_number,
    etd,
    eta,
    total 
} from './all.js';
