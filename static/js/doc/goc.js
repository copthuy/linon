import * as all from './all.js';

export function invoice_number(content) {
    return all.invoice_number(content, /\(\s*\d+\s*\)\s*invoice\s+number/i);
}

export function vessel(content) {
    return all.vessel(content, /\(\s*\d+\s*\)\s*vessel/i);
}

export {
    cont_number,
    bill_number,
    eta,
    etd,
    total
} from './hgc.js';
