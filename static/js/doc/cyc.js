import { 
    matchFirst
} from '../common.js';

import * as all from './all.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+no\s*[\.:]\s*(\w+)/i
    ).replace(/\s+/, '');
}

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on\s*\/\s*or\s+about/i);
}

export {
    invoice_number,
    vessel,
    cont_number,
    eta,
    total
} from './all.js';
