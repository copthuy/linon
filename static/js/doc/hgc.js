import * as all from './all.js';

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on/i);
}

export function eta(content) {
    return all.eta(content, /\(\s*\d+\s*\)\s*final\s+destination/i);
}

export { 
    bill_number,
    invoice_number,
    vessel,
    cont_number,
    total 
} from './all.js';