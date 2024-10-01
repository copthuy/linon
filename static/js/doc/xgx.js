import { 
    matchFirst,
    strToDate
} from '../common.js';

export function etd(content) {
    return strToDate(matchFirst(
        content,
        /sailing\s+on\s*:\s*([^\n]+)/i 
    ));
}

export function eta(content) {
    return strToDate(matchFirst(
        content,
        /eta\s+at\s+port\s*([^\n]+)/i 
    ));
}

export { 
    invoice_number,
    bill_number,
    vessel,
    cont_number,
    total 
} from './hlc.js';
