export const items = [];
export async function loadNewContent(data) {
    try {
        if (!data.file_content) {
            return [];
        }
        let new_data = JSON.parse(data.file_content);
        if (typeof new_data.length === 'undefined') {
            new_data = [new_data];
        }
        new_data.forEach((line, index) => {
            const item = {
                file_path: data.file_path,
                content: data.file_content,
                line: index + 1,
                booking_number: line['BOOKING#'] ? line['BOOKING#'].trim() : '',
                shipping: line['SHIPPING'] ? line['SHIPPING'].trim() : '',
                vessel: [line['VESSEL'] ? line['VESSEL'] : ''],
                closing_time: line['CLOSING TIME'] && line['CLOSING TIME'].trim() !== '' ? new Date(line['CLOSING TIME']) : '',
                si_cut_off: line['SI CUT OFF'] && line['SI CUT OFF'].trim() !== '' ? new Date(line['SI CUT OFF']) : '',
                etd: line['ETD'] ? new Date(line['ETD']) : '',
                eta_origin: line['OETA'] ? new Date(line['OETA']) : '',
                eta: line['ETA'] ? new Date(line['ETA']) : '',
                type: 'new',
            }
            items.push(item);
        });

        return items;
    } catch (error) {
        console.error('Error loading doc:', error);
    }
}
