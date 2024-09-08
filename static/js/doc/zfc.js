import { strToDate, matchFirst } from '../common.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /waybill\s+or\s+reference\s+number\s*:\s*([^\n]+)/i
    );
}

export function etd(content) {
    return strToDate(matchFirst(
        content,
        /sailing\s+on\s*:\s*([^\n]+)/i
    ));
}

export function eta() {
    return '';
}

export {
    invoice_number,
    vessel,
    cont_number,
    total
} from './hlc.js';
