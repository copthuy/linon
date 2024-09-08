import { strToDate, matchFirst, getContNumber } from '../common.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /waybill\s+or\s+reference\s+number\s*:\s*([^\n]+)/i
    );
}

export function cont_number(content) {
    const str = matchFirst(
        content,
        /cont\.\'\s*\/\s*seal\s+no\.\s*:\s*([^\n]+)/i
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
    return '';
}

export {
    invoice_number,
    vessel,
    total
} from './hlc.js';
