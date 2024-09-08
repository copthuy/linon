import * as all from './all.js';

export function cont_number(content) {
    return all.cont_number(content, /cont\s+no\.\s*\/\s*seal\s+no\./i);
}

export { 
    invoice_number,
    bill_number,
    vessel,
    etd,
    eta,
    total
} from './hgc.js';
