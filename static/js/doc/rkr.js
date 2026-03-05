import * as all from './all.js';
import * as gyv from './gyv.js';

function isFact(content) {
    let inv = all.invoice_number(content);
    return !!inv;
}

export function invoice_number(content) {
    if (isFact(content)) {
        return all.invoice_number(content);
    }
    return gyv.invoice_number(content);
}

export function vessel(content) {
    if (isFact(content)) {
        return all.vessel(content);
    }
    return gyv.vessel(content);
}

export function etd(content) {
    if (isFact(content)) {
        return all.etd(content);
    }
    return gyv.etd(content);
}

export function eta(content) {
    if (isFact(content)) {
        return all.eta(content);
    }
    return gyv.eta(content);
}

export function total(content) {
    if (isFact(content)) {
        return all.total(content);
    }
    return gyv.total(content);
}

export {
    bill_number,
    cont_number,
} from './all.js';
