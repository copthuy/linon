import { 
    fixstr,
    matchFirst,
    getContNumber
} from '../common.js';

import * as all from './all.js';

export function bill_number(content) {
    return matchFirst(
        content,
        /bill\s+no\s*\.\s*(\w+)/i
    );
}

export function cont_number(content, regex = /cont\.\'\s*\/\s*seal\s+no\.\s*:?\s*/i) {
    const result = new Set();
    const matches = [...content.matchAll(
            new RegExp(regex.source + /([^\n]+)/i.source, 'gi')
        )].
        filter(match => match.length === 2);
    
    for (const match of matches) {
        const str = fixstr(
            match[1].
            replace(/\s*\(.*?\)\s*/g, '').
            split(/\s{2,}/)[0]
        );
        const cont = getContNumber(str);
        if (cont) {
            result.add(cont);
        }
    }
    return [...result];
}

export function etd(content) {
    return all.etd(content, /\(\s*\d+\s*\)\s*sailing\s+on\s*\/\s*or\s+about/i);
}

export {
    invoice_number,
    vessel,
    eta,
    total
} from './all.js';
