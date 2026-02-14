import { 
    matchFirst
} from '../common.js';
import * as all from './all.js';

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on/i);
}

export function eta(content) {
    return new Date(matchFirst(
        content,
        /\s+eta\s+(\d{1,2}-[a-z]{3}-\d{1,2})\s+/i
    ).replace(/\s+/, ''));
}

export {
    invoice_number,
    bill_number,
    vessel,
    cont_number,
    total 
} from './all.js';
