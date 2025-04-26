import { matchFirst } from '../common.js';
import * as all from './all.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+of\s+lading\s+\#\s*:\s*(\w+)/i
    ).replace(/\s+/, '');
}

export function total(content) {
    return all.total(content, /s\s*a\s*y\s+t\s*o\s*t\s*a\s*l\s+i\s*n\s+u\s*s/i);
}

export {
    invoice_number,
    vessel,
    cont_number,
    etd,
    eta
} from './cyc.js';
