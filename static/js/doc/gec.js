import * as all from './all.js';

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on/i);
}

export { 
    bill_number,
    invoice_number,
    vessel,
    cont_number,
    eta,
    total
} from './all.js';