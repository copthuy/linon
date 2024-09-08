import { matchFirst, strToDate } from '../common.js';
import * as all from './all.js';

export function invoice_number(content) {
    return matchFirst(
        content,
        /no\.\s*:\s*([^\n]+)/i
    ).replace(/\s+date[^\n]+/i, '');
}

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+no\.\s*:\s*([^\n]+)/i
    ).replace(/\s+/, '');
}

export function vessel(content) {
    return matchFirst(
        content,
        /per\s+([^\n]+)/i
    ).replace(/\s+sailing.+/i, '');
}

export function cont_number(content) {
    return all.cont_number(content);
}

export function etd(content) {
    return strToDate(matchFirst(
        content,
        /sailing\s+on\s+or\s+about\.\s*([^\n]+)/i
    ).replace(/\s*eta[^\n]+/i, ''));
}

export function eta(content) {
    return strToDate(matchFirst(
        content,
        /eta\s*:\s*([^\n]+)/i
    ));
}

export function total(content) {
    return all.total(content, /in\s+words\s*:\s*us\s+dollars/i);
}
