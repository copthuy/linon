import { 
    matchFirst,
    getContNumber,
    strToDate
} from '../common.js';

export function cont_number(content) {
    const str = matchFirst(
        content,
        /cont.\s*\/\s*seal\s+no.:\s*(\w+\s*\/\s*\w+)/i
    );
    return getContNumber(str);
}

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
    total 
} from './hlc.js';
