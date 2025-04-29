import { formatValue } from './common.js';
import { bookings } from './bookings.js'
import { docs } from './docs.js'
import { items } from './new.js'

export function getData() {
    const data = [];
    [bookings, docs, items].forEach(block => {
        block.forEach(item => {
            const obj = {};
            for (const key in item) {
                if (/content/i.test(key)) {
                    continue;
                }
                obj[key] = formatValue(key, item[key]);
            }
            data.push(obj);
        });
    });
    return data;
}


export async function postData() {
    const form = new FormData();
    const data = JSON.stringify(getData());
    form.append('data', data);
    const response = await fetch('/save-data', {
        method: 'POST',
        body: form,
    });
    return await response.json();
}

export async function stopApp() {
    try {
        const response = await fetch('/stop');
        return await response.json();
    } catch(err) {
        return 'OK';
    }
}
