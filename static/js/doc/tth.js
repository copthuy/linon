import * as all from './all.js';

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on\s*\/\s*or\s+about/i);
}


export {
    invoice_number,
    bill_number,
    vessel,
    cont_number,
    eta,
    total 
} from './all.js';