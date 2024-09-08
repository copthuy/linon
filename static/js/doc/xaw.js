import {
    matchFirst,
    getContNumber
} from '../common.js';

export function cont_number(content) {
    const str = matchFirst(content, /container\s+no\.\s*:\s*([^\n]+)/i) +
        '/' +
        matchFirst(content, /seal\s+no\.\s*:\s*([^\n]+)/i);
    return getContNumber(str);
}

export {
    invoice_number,
    bill_number,
    vessel,
    etd,
    eta,
    total 
} from './hgc.js';
