import { 
    getPONumbers, 
    getISO, 
    ISOtoString, 
    applyFunc,
} from './common.js'; 

import * as cma from './booking/cma.js';
import * as cosco from './booking/cosco.js';
import * as evergreen from './booking/evergreen.js';
import * as hapag_lloyd from './booking/hapag_lloyd.js';
import * as maersk from './booking/maersk.js';
import * as msc from './booking/msc.js';
import * as one from './booking/one.js';
import * as oocl from './booking/oocl.js';
import * as zim from './booking/zim.js';

const modules = {
    cma: cma,
    cosco: cosco,
    evergreen: evergreen,
    hapag_lloyd: hapag_lloyd,
    maersk: maersk,
    msc: msc,
    one: one,
    oocl: oocl,
    zim: zim
};

const shipping_lines = {
    'cma': /CMA\s+CGM\s+GROUP/i,
    'cosco': /COSCO\s+SHIPPINGS\s+LINES/i,
    'evergreen': /EVERGREEN\s+LINE/i,
    'hapag_lloyd': /HAPAG-LLOYD\s+\(VIETNAM\)/i,
    'maersk': /MAERSK\s+LINE/i,
    'msc': /MEDITERRANEAN\s+SHIPPING/i,
    'one': /OCEAN\s+NETWORK\s+EXPRESS/i,
    'oocl': /OOCL\s+\(VIETNAM\)/i,
    'zim': /ZIM\s+INTEGRATED\s+SHIPPING/i,
};

export const bookings = [];
export async function loadBookingContent(data) {
    try {
        const file_content = data.file_content;
        const mode = getISO(file_content, shipping_lines);
        const module = modules[mode];
        if (!module) {
            console.log('Missing ' + data.file_path);
            return;
        }
        const booking_number = await applyFunc(module, 'booking_number', file_content);
        const booking_date = await applyFunc(module, 'booking_date', file_content);
        const bill_number = await applyFunc(module, 'bill_number', file_content);
        const vessel = await applyFunc(module, 'vessel', file_content);
        const pol = await applyFunc(module, 'pol', file_content);
        const pod = await applyFunc(module, 'pod', file_content);
        const closing_time = await applyFunc(module, 'closing_time', file_content);
        const si_cut_off = await applyFunc(module, 'si_cut_off', file_content);
        const etd = await applyFunc(module, 'etd', file_content);
        const eta_origin = await applyFunc(module, 'eta_origin', file_content);
        const eta = await applyFunc(module, 'eta', file_content);
        const item = {
            content: file_content,
            file_path: data.file_path,
            po_numbers: getPONumbers(data.file_path),
            shipping_company: ISOtoString(shipping_lines[mode]),
            booking_number: booking_number,
            booking_date: booking_date,
            bill_number: bill_number,
            vessel: vessel,
            pol: pol,
            pod: pod,
            closing_time: closing_time,
            si_cut_off: si_cut_off,
            etd: etd,
            eta_origin: eta_origin,
            eta: eta,
            type: 'booking',
        };

        bookings.push(item);
        return item;
    } catch (error) {
        console.error('Error loading booking:', error);
    }
}

