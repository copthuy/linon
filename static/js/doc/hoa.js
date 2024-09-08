import { matchFirst } from '../common.js';
import * as all from './all.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+of\s+lading\s+\#\s*:\s*(\w+)/i
    ).replace(/\s+/, '');
}

export function total(content) {
    return all.total(content, /say\s+total\s+in\s+us/i);
}

export {
    invoice_number,
    vessel,
    cont_number,
    etd,
    eta
} from './cyc.js';
