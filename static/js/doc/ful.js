import { matchFirst } from '../common.js';
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
    return matchFirst(
        content,
        /cont\/seal\s+no\.\s*:[ \t]*([^\n]+)/i
    );
}

export function total(content) {
    return all.total(content, /total\s*:\s*us\s+dollars\s*/i);
}

export {
    bill_number
} from './all.js';
