import { matchFirst, strToDate } from '../common.js';
import {
    convertTable,
    getColumnByName
} from '../table.js'

export function bill_number(content) {
    return matchFirst(
        content,
        /waybill.*?number:\s*([^\n]+)/i
    );
}

function localTable(content) {
    return convertTable(
        content,
        /\(\s*\d+\s*\)\s*carrier/i,
        /\(\s*\d+\s*\)\s*marks/i,
    );
}

export function vessel(content) {
    const table = localTable(content);
    return getColumnByName(table, /\(\s*\d+\s*\)\s*carrier/i).filter(item => item.trim() != '')[1];
}

export function etd(content) {
    const table = localTable(content);
    return strToDate(getColumnByName(table, /\(\s*\d+\s*\)\s*etd/i).filter(item => item.trim() != '')[1]);
}

export {
    invoice_number,
    cont_number,
    eta,
    total 
} from './all.js';
