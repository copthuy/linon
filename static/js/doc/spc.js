import * as cyc from './cyc.js';

export function cont_number(content) {
    return cyc.cont_number(content, /cont\.\'\s*\/\s*size\s*\/\s*seal\s+no.\s*:\s*/i);
}

export {
    invoice_number,
    bill_number,
    vessel,
    etd,
    eta,
    total
} from './hgc.js';
