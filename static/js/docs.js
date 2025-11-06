import {
	getInvoiceDoc,
	getPONumbers,
	getISO,
	ISOtoString,
	applyFunc,
} from "./common.js";

import * as all from "./doc/all.js";
import * as arf from "./doc/arf.js"; ////
import * as bra from "./doc/bra.js"; ////
import * as cba from "./doc/cba.js"; ////
import * as cow from "./doc/cow.js"; ////
import * as cyc from "./doc/cyc.js"; //
import * as dlf from "./doc/dlf.js"; // hgc
import * as ful from "./doc/ful.js"; ////
import * as gis from "./doc/gis.js"; ////
import * as goc from "./doc/goc.js"; // hgc
import * as hat from "./doc/hat.js"; ////
import * as hgc from "./doc/hgc.js"; //
import * as hgt from "./doc/hgt.js"; //
import * as hlc from "./doc/hlc.js";
import * as hmv from "./doc/hmv.js"; ////
import * as hoa from "./doc/hoa.js"; //
import * as hop from "./doc/hop.js"; ////
import * as hpc from "./doc/hpc.js"; //// hgc
import * as hxy from "./doc/hxy.js"; //
import * as hyf from "./doc/hyf.js"; ////
import * as jia from "./doc/jia.js";
import * as lon from "./doc/lon.js";
import * as mgc from "./doc/mgc.js";
import * as nkc from "./doc/nkc.js"; //
import * as pkp from "./doc/pkp.js"; ////
import * as pri from "./doc/pri.js"; ////
import * as qvm from "./doc/qvm.js"; //
import * as rkr from "./doc/rkr.js"; ////
import * as sav from "./doc/sav.js"; ////
import * as spc from "./doc/spc.js";
import * as sun from "./doc/sun.js"; ////
import * as ten from "./doc/ten.js"; ////
import * as tdv from "./doc/tdv.js"; ////
import * as tlc from "./doc/tlc.js"; //// nkc
import * as tlp from "./doc/tlp.js"; //// nkc
import * as tth from "./doc/tth.js"; ////
import * as uls from "./doc/uls.js"; ////
import * as unt from "./doc/unt.js"; ////
import * as vdt from "./doc/vdt.js"; ////
import * as vha from "./doc/vha.js";
import * as vto from "./doc/vto.js"; ////
import * as woo from "./doc/woo.js";
import * as xaw from "./doc/xaw.js"; // hgc
import * as xgx from "./doc/xgx.js";
import * as ydc from "./doc/ydc.js";
import * as zfc from "./doc/zfc.js";

const modules = {
	all: all,
	arf: arf,
	bra: bra,
	cba: cba,
	cow: cow,
	cyc: cyc,
	dlf: dlf,
	ful: ful,
	gis: gis,
	goc: goc,
	hat: hat,
	hgc: hgc,
	hgt: hgt,
	hlc: hlc,
	hmv: hmv,
	hoa: hoa,
	hop: hop,
	hpc: hpc,
	hxy: hxy,
	hyf: hyf,
	jia: jia,
	lon: lon,
	mgc: mgc,
	nkc: nkc,
	pkp: pkp,
	pri: pri,
	qvm: qvm,
	rkr: rkr,
	sav: sav,
	spc: spc,
	sun: sun,
	ten: ten,
	tdv: tdv,
	tlc: tlc,
	tlp: tlp,
	tth: tth,
	uls: uls,
	unt: unt,
	vdt: vdt,
	vha: vha,
	vto: vto,
	woo: woo,
	xaw: xaw,
	xgx: xgx,
	ydc: ydc,
	zfc: zfc,
};

const factories = {
	all: /ALLEN\s+FURNITURE/i,
	arf: /ARTISAN\s+FURNITURE/i, ////
	bra: /BRADSENSE/i, ////
	cba: /CHANG\s+BAO/i, ////
	cow: /COUNTRY\s+WOOD/i, ////
	cyc: /CYC\s+IMPORT\s+EXPORT/i, //
	dlf: /DUC\s+LOI/i, // hgc
	ful: /FULLWAY\s+COMPANY\s+LIMITED/i, ////
	gis: /GIAI\s+SAM/i, // hgc
	goc: /GLORY\s+OCEANIC/i, // hgc
	hat: /HA\s+THANH/i, ////
	hgc: /HOANG\s+GIANG/i, //
	hgt: /HUNG\s+GIA\s+THINH/i, //
	hlc: /LAM\s+THINH/i,
	hmv: /HONG\s+MEI\s+VN/i, ////
	hoa: /HIEP\s+HOA\s+PHAT/i, //
	hop: /HOA\s+PHAT\s+WOOD/i, //
	hpc: /HAO\s+PHONG\s+I/i, //// hgc
	hxy: /HANG\s+XUYEN\s+CO/i, //
	hyf: /HONG\s+YI/i, ////
	jia: /JIA\s+DING\s+INDUSTRY/i,
	lon: /LONGWIN\s+FURNITURE/i, ////
	mgc: /MADE\s+GREEN\s+COMPANY/i, //
	nkc: /NGHIA\s+KY/i, //
	pkp: /PHU\s+KHANG\s+PHAT/i, ////
	pri: /PRINCEMATE\s+VN/i, ////
	qvm: /QUYNH\s+VY/i, //
	rkr: /RK\s+RESOURCES/i, ////
	sav: /SAM\s+VUONG/i, ////
	spc: /SANH\s+PHAT/i,
	sun: /SUN\s+CO\./i, ////
	ten: /THANH\s+THANH/i, ////
	tdv: /TAN\s+DAI\s+VIET/i, ////
	tlc: /THANG\s+LOI/i, //// nkc
	tlp: /THANH\s+LOC\s+PHAT/i, //// nkc
	tth: /THANH\s+TRUNG\s+HIEU/i, //// nkc
	uls: /MING\s+ZE/i, ////
	unt: /UNITY\s+VIET\s+NAM/i, ////
	vdt: /VINH\s+DAT\s+THANH/i, ////
	vha: /VAN\s+HAO/i,
	vto: /VAN\s+THANH/i, ////
	woo: /WOODPARK/i, ////
	xaw: /TUONG\s+AN\s+WOOD/i, // hgc
	xgx: /XIN\s+GUAN\s+XING/i,
	ydc: /YING\s+DONG/i,
	zfc: /TRUNG\s+DANH/i, ////
};

export const docs = [];
function updateItemValues(targetItem, sourceItem) {
    for (const key in sourceItem) {
        if (
			key !== 'line' &&
            Object.prototype.hasOwnProperty.call(targetItem, key) &&
            (targetItem[key] === null || targetItem[key] === undefined || targetItem[key] === '') &&
            sourceItem[key] !== null && sourceItem[key] !== undefined && sourceItem[key] !== ''
        ) {
            targetItem[key] = sourceItem[key];
        }
    }
	return targetItem;
}
export async function loadDocContent(data) {
	try {
		const items = [];
		let file_content = data.file_content;
		file_content = file_content.replace(/c\s*o\s*m\s*m\s*e\s*r\s*c\s*i\s*a\s*l/gi, "COMMERCIAL");
		const mode = getISO(file_content, factories); //  || "all"
		const module = modules[mode];
		if (!module) {
			console.log("Missing module: " + mode + ' for ' + data.file_path);
			return;
		}
        console.log('Module ' + mode + ' loaded!');
		const default_item = {
			file_path: data.file_path,
			content: file_content,
			line: null,
			po_numbers: getPONumbers(data.file_path),
			factory: ISOtoString(factories[mode]),
			bill_number: null,
			invoice_number: null,
			vessel: null,
			cont_number: null,
			etd: null,
			eta: null,
			total: null,
			type: 'doc',
		};

		const parts = file_content.split(/commercial\s+invoice|invoice\s+for\s+export\s+service/i).slice(1);
		console.log();
		console.log(parts);
		console.log();
		let i = 1;
		for (const part of parts) {
			const doc = 'COMMERCIAL INVOICE ' + part;
			const bill_number = await applyFunc(
				module,
				"bill_number",
				doc
			);
			const invoice_doc = getInvoiceDoc(doc);
			const invoice_number = await applyFunc(
				module,
				"invoice_number",
				invoice_doc
			);
			const vessel = await applyFunc(module, "vessel", invoice_doc);
			const cont_number = await applyFunc(module, "cont_number", invoice_doc);
			const etd = await applyFunc(module, "etd", invoice_doc);
			const eta = await applyFunc(module, "eta", invoice_doc);
			const total = await applyFunc(module, "total", invoice_doc);
	
			const item = {
				file_path: data.file_path,
				content: file_content,
				line: i++,
				po_numbers: getPONumbers(data.file_path),
				factory: ISOtoString(factories[mode]),
				bill_number: bill_number,
				invoice_number: invoice_number,
				vessel: vessel,
				cont_number: cont_number,
				etd: etd,
				eta: eta,
				total: total,
				type: 'doc',
			};
			updateItemValues(default_item, item);
			items.push(item);
		}
		
		for (i = 0; i < items.length; i++) {
			updateItemValues(items[i], default_item);
		}
		//console.log(items);
		docs.push(...items);
		return items;
	} catch (error) {
		console.error("Error loading doc:", error);
	}
}
