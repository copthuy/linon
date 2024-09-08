import * as all from './all.js';

export function etd(content) {
    return all.etd(content, /etd\s*:/i);
}

export function eta(content) {
    return all.eta(content, /eta\s*:/i);
}

export {
    invoice_number,
    bill_number,
    vessel,
    cont_number,
    total 
} from './all.js';
