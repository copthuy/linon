import { matchFirst, getLines } from '../common.js';
import * as all from './all.js';

export function invoice_number(content) {
    return matchFirst(
        content,
        /inv.\s+no.\s*:\s*([^\n]+)/i
    );
}

export function etd(content) {
    return matchFirst(
        content,
        /etd\s*:\s*([^\n]+)/i
    );
}

export function eta(content) {
    return matchFirst(
        content,
        /eta\s*:\s*([^\n]+)/i
    );
}

export function vessel(content) {
    return matchFirst(
        content,
        /vessel\s*:\s*([^\n]+)/i
    );
}

export function cont_number(content) {
    let cont = matchFirst(
        content,
        /cont\/seal\s+no\.\s*:[ \t]*([^\n]+)/i
    );
    let lines = getLines(
        content, 
        /cont\/seal\s+no\.\s*:/i, 
        /ctns/i
    );
    return cont ? cont : lines[1].trim();
}

export function total(content) {
    return matchFirst(
        content,
        /total\s+amount\s+[ \t]*([^\n]+)/i
    );
}

export {
    bill_number
} from './all.js';
