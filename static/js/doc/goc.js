import { getLines, getContNumber } from '../common.js';
import * as all from './all.js';

export function invoice_number(content) {
    return all.invoice_number(content, /\(\s*\d+\s*\)\s*invoice\s+number/i);
}

export function vessel(content) {
    return all.vessel(content, /\(\s*\d+\s*\)\s*vessel/i);
}

export function cont_number(content) {
    const regex = /cont\.\'\/seal\s+no\.:/i;
    const lines = getLines(
        content, 
        regex, 
        /say\s+total/i
    ).map(row => row.trim()).
    filter(row => row != '');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(regex)) {
            return getContNumber(lines[i + 1].split(/\s{2,}/)[0]);
        }
    }
    return '';
}

export {
    bill_number,
    eta,
    etd,
    total
} from './hgc.js';
