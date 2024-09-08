import { matchFirst } from '../common.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /sea\s+waybill\s+\#\s*:\s*(\w+)/i
    );
}

export { 
    invoice_number,
    vessel,
    cont_number,
    etd,
    eta,
    total 
} from './all.js';