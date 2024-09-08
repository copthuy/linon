import { 
    matchFirst,
    getContNumber,
    getDatePrefix
} from '../common.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /mbl\s*:\s*(\w+)/i 
    );
}

export function invoice_number(content) {
    return matchFirst(
        content,
        /no\.\s*:\s*([^\n]+)/i
    );
}

export function vessel(content) {
    return matchFirst(
        content,
        /vessel\s*:\s*(.*?)(?=\s{3})/i
    );
}

export function cont_number(content) {
    const str = matchFirst(
        content,
        /cont\s*\/\s*seal\s+no\.\s*:\s*(.*?)(?=\s{3})/i
    );
    return getContNumber(str);
}

const date_time = /(\d{1,2}\/\d{1,2}\/\d{4})/i;
export function etd(content) {
    return getDatePrefix(
        content,
        /etd\s+date\s*:\s*/i,
        date_time
    );
}

export function eta(content) {
    return getDatePrefix(
        content,
        /eta\s+date\s*:\s*/i,
        date_time
    );
}

export function total(content) {
    return matchFirst(
        content,
        /total.*?\$([\d,.]+)/i 
    );
}
