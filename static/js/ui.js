import './libs/flatpickr.min.js'
import './libs/bootstrap.bundle.min.js'
import './libs/sweetalert2.min.js'
import { basename, formatValue, getFmtStr } from './common.js'
import { bookings } from './bookings.js'
import { docs } from './docs.js'
import { items } from './new.js'
import { postData, stopApp } from './connect.js'

function excludeFromDisplay(key) {
    return /content|file_path|line|type/i.test(key);
}

function showForm(data) {
    const list_wrapper = document.querySelector('.list-wrapper');
    const doc = document.querySelector('.doc');
    if (!list_wrapper || !doc) {
        return;
    }
    doc.innerHTML = '';
    list_wrapper.innerHTML = '';
    for (const [key, value] of Object.entries(data)) {
        if (excludeFromDisplay(key)) {
            continue;
        }

        const row = document.createElement('div');
        row.className = 'mb-2';
        list_wrapper.appendChild(row);

        const title = key
            .toUpperCase()
            .replace(/_/g, ' ')
            .replace(/numbers?/gi, 'No.')
            .replace(/company/gi, 'Co.');
        
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'input-group';
        row.appendChild(inputWrapper);

        const span = document.createElement('span');
        span.className = 'input-group-text';
        if (key === 'eta_origin' && value.toString() !== data['eta'].toString()) {
            span.classList.add('text-danger', 'fw-bold');
        }
        span.textContent = title;
        inputWrapper.appendChild(span);

        const isTextarea = /po_numbers|vessel|cont/i.test(key);
        const input = document.createElement(isTextarea ? 'textarea' : 'input');
        if (isTextarea) {
            input.rows = 3;
        } else {
            input.type = 'text';
        }
        const fmtStr = getFmtStr(key, value);
        input.value = formatValue(key, value);
        input.className = 'form-control fw-bold';
        const updateData = (evt) => {
            const val = evt.currentTarget.value;
            data[key] = fmtStr !== '' ? new Date(val) : val;
        };
        input.addEventListener('input', updateData);
        input.addEventListener('change', updateData);
        inputWrapper.appendChild(input);
        if (fmtStr !== '') {
            flatpickr(input, {
                enableTime: true,
                time_24hr: true,
                dateFormat: fmtStr,
            });
        }
    }

    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'text-end btn-txt-wrapper';
    list_wrapper.appendChild(btnWrapper);

    const btnTxt = document.createElement('button');
    btnTxt.type = 'button';
    btnTxt.className = 'btn p-0';
    btnTxt.innerHTML = '<img src="/static/images/text.svg" width="24" height="24" alt="View TXT file">';
    btnTxt.addEventListener('click', () => {
        const textarea = document.querySelector('.textarea');
        if (!textarea) {
            return;
        }
        textarea.classList.toggle('d-none');
    });
    btnWrapper.appendChild(btnTxt);

    const textarea = document.createElement('pre');
    textarea.className = 'textarea w-100 h-100 fw-bold bg-white d-none position-absolute';
    doc.appendChild(textarea);
    const lines = data.content.split(/\n/).filter(line => line.trim() !== '');
    lines.forEach(line => {
        const code = document.createElement('code');
        code.className = 'd-block';
        code.tabIndex = 0;
        code.textContent = line;
        textarea.appendChild(code);
    });

    const url = '/load-file?path=' + encodeURIComponent(data.file_path.replace(/\.xlsx?$/, '.pdf'));    
    const frame = document.createElement('object');
    frame.className = 'w-100 h-100 border-none';
    frame.type = 'application/pdf';
    frame.data = url + '#view=FitH&page=1';
    doc.appendChild(frame);
}

function showTable(data) {
    const doc = document.querySelector('.doc');
    if (!doc) {
        return;
    }
    doc.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-striped table-hover font-monospace small';
    doc.appendChild(table);
    const thead = document.createElement('thead');
    table.appendChild(thead);
    let tr = document.createElement('tr');
    thead.appendChild(tr);

    Object.keys(data[0]).forEach((key) => {
        if (excludeFromDisplay(key)) {
            return;
        }
        const th = document.createElement('td');
        th.scope = 'col';
        th.className = 'bg-danger text-white';
        th.setAttribute('data-key', key);
        th.textContent = key.toUpperCase().replace(/_/g, ' ');
        tr.appendChild(th);
    });

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    data.forEach(item => {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (const [key, value] of Object.entries(item)) {
            if (excludeFromDisplay(key)) {
                continue;
            }
            const td = document.createElement('td');
            td.textContent = formatValue(key, value);
            tr.appendChild(td);
        }
    });

    const btnWrapper = document.querySelector('.btn-txt-wrapper');
    if (btnWrapper) {
        btnWrapper.parentNode.removeChild(btnWrapper);
    }
}

export function loadItem() {
    const select = document.querySelector('select');
    if (!select) {
        return;
    }
    const idx = select.selectedIndex;
    const value = select.options[idx].value;
    for (let data of bookings) {
        if (data.file_path === value) {
            showForm(data);
            return;
        }
    }
    for (let data of docs) {
        if (data.file_path === value) {
            showForm(data);
            return;
        }
    }
    const [val, line] = value.split(/\|{5}/);
    for (let data of items) {
        if (data.file_path === val && data.line === Number(line)) {
            showForm(data);
            showTable(items);
            return;
        }
    }
}

export function prepareLayout() {
    const select = document.querySelector('select');
    if (!select) {
        return;
    }
    select.addEventListener('change', loadItem);
    document.querySelectorAll('button[value="btn-stop"]').forEach(btn => {
        btn.addEventListener('click', () => {
            Sweetalert2.fire({
                title: "Ngừng chương trình!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Có',
                confirmButtonColor: '#198754',
                cancelButtonText: 'Không',
                allowOutsideClick: false,
                heightAuto: false,
            }).then(async result => {
                if (result.isConfirmed) {
                    const str = await stopApp();
                    if (str === 'OK') {
                        Sweetalert2.fire({
                            title: "Ngừng chương trình thành công!",
                            icon: "warning",
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#198754',
                            allowOutsideClick: false,
                            heightAuto: false,
                        });
                    }
                }
            });
        });
    });
    document.querySelectorAll('button[value="btn-apply"]').forEach(btn => {
        btn.addEventListener('click', () => {
            Sweetalert2.fire({
                title: "Cập nhật dữ liệu!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Có',
                confirmButtonColor: '#198754',
                cancelButtonText: 'Không',
                allowOutsideClick: false,
                heightAuto: false,
            }).then(async result => {
                if (result.isConfirmed) {
                    const response = await postData();
                    if (response && 
                        response.status && 
                        response.status.length
                    ) {
                        Sweetalert2.fire({
                            title: "Cập nhật dữ liệu thành công!",
                            icon: "success",
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#198754',
                            allowOutsideClick: false,
                            heightAuto: false,
                        });
                    }
                }
            });
        });
    });
    document.querySelectorAll('.file-nav').forEach(btn => {
        btn.addEventListener('click', evt => {
            const val = parseInt(evt.currentTarget.value);
            let currentSelectedIndex = select.selectedIndex;
            let selectedIndex = currentSelectedIndex;
            selectedIndex += val;
            if (selectedIndex < 0) {
                selectedIndex = 0;
            }
            if (selectedIndex > select.options.length - 1) {
                selectedIndex = select.options.length - 1;
            }
            select.selectedIndex = selectedIndex;
            if (currentSelectedIndex !== selectedIndex) {
                loadItem();
            }
        });
    });
}

export function updateLayout(data) {
    const select = document.querySelector('select');
    if (!select) {
        return;
    }
    const option = document.createElement('option');
    option.value = data.file_path + (typeof data.line !== 'undefined' ? '|||||' + data.line : '');
    option.text = basename(data.file_path) + (typeof data.line !== 'undefined' ? ' - Line: ' + data.line : '');
    select.appendChild(option);
}

export function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) {
        return;
    }
    const total = __files.length;
    const completed = document.querySelectorAll('select option').length;
    const percentage = (completed / total) * 100;
    progressBar.style.width = `${percentage}%`;

    if (percentage == 100) {
        hideProgressBar();
    }
}

export function hideProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) {
        return;
    }
    const progressBarHolder = progressBar.parentNode;
    progressBarHolder.parentNode.removeChild(progressBarHolder);
}
