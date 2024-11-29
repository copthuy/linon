import * as all from './all.js';

export {
    invoice_number,
    bill_number,
    vessel,
    cont_number,
    eta,
    total 
} from './all.js';

export function etd(content) {
    return all.etd(content, /sailing\s+on/i);
}