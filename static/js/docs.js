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
import * as gis from "./doc/gis.js"; ////
import * as goc from "./doc/goc.js"; // hgc
import * as hat from "./doc/hat.js"; ////
import * as hgc from "./doc/hgc.js"; //
import * as hgt from "./doc/hgt.js"; //
import * as hlc from "./doc/hlc.js";
import * as hmv from "./doc/hmv.js"; ////
import * as hoa from "./doc/hoa.js"; //
import * as hpc from "./doc/hpc.js"; //// hgc
import * as hyf from "./doc/hyf.js"; ////
import * as jia from "./doc/jia.js";
import * as mgc from "./doc/mgc.js";
import * as nkc from "./doc/nkc.js"; //
import * as pkp from "./doc/pkp.js"; ////
import * as pri from "./doc/pri.js"; ////
import * as qvm from "./doc/qvm.js"; //
import * as sav from "./doc/sav.js"; ////
import * as spc from "./doc/spc.js";
import * as sun from "./doc/sun.js"; ////
import * as ten from "./doc/ten.js"; ////
import * as tdv from "./doc/tdv.js"; ////
import * as tlc from "./doc/tlc.js"; //// nkc
import * as tlp from "./doc/tlp.js"; //// nkc
import * as uls from "./doc/uls.js"; ////
import * as unt from "./doc/unt.js"; ////
import * as vdt from "./doc/vdt.js"; ////
import * as vha from "./doc/vha.js";
import * as vto from "./doc/vto.js"; ////
import * as xaw from "./doc/xaw.js"; // hgc
import * as zfc from "./doc/zfc.js";
import * as xgx from "./doc/xgx.js";
import * as ydc from "./doc/ydc.js";

const modules = {
	all: all,
	arf: arf,
	bra: bra,
	cba: cba,
	cow: cow,
	cyc: cyc,
	dlf: dlf,
	gis: gis,
	goc: goc,
	hat: hat,
	hgc: hgc,
	hgt: hgt,
	hlc: hlc,
	hmv: hmv,
	hoa: hoa,
	hpc: hpc,
	hyf: hyf,
	jia: jia,
	mgc: mgc,
	nkc: nkc,
	pkp: pkp,
	pri: pri,
	qvm: qvm,
	sav: sav,
	spc: spc,
	sun: sun,
	ten: ten,
	tdv: tdv,
	tlc: tlc,
	tlp: tlp,
	uls: uls,
	unt: unt,
	vdt: vdt,
	vha: vha,
	vto: vto,
	xaw: xaw,
	zfc: zfc,
	xgx: xgx,
	ydc: ydc,
};

const factories = {
	all: /ALLEN\s+FURNITURE/i,
	arf: /ARTISAN\s+FURNITURE/i, ////
	bra: /BRADSENSE/i, ////
	cba: /CHANG\s+BAO/i, ////
	cow: /COUNTRY\s+WOOD/i, ////
	cyc: /CYC\s+IMPORT\s+EXPORT/i, //
	dlf: /DUC\s+LOI/i, // hgc
	gis: /GIAI\s+SAM/i, // hgc
	goc: /GLORY\s+OCEANIC/i, // hgc
	hat: /HA\s+THANH/i, ////
	hgc: /HOANG\s+GIANG/i, //
	hgt: /HUNG\s+GIA\s+THINH/i, //
	hlc: /LAM\s+THINH/i,
	hmv: /HONG\s+MEI\s+VN/i, ////
	hoa: /HIEP\s+HOA\s+PHAT/i, //
	hpc: /HAO\s+PHONG\s+I/i, //// hgc
	hyf: /HONG\s+YI/i, ////
	jia: /JIA\s+DING\s+INDUSTRY/i,
	mgc: /MADE\s+GREEN\s+COMPANY/i, //
	nkc: /NGHIA\s+KY/i, //
	pkp: /PHU\s+KHANG\s+PHAT/i, ////
	pri: /PRINCEMATE\s+VN/i, ////
	qvm: /QUYNH\s+VY/i, //
	sav: /SAM\s+VUONG/i, ////
	spc: /SANH\s+PHAT/i,
	sun: /SUN\s+CO\./i, ////
	ten: /THANH\s+THANH/i, ////
	tdv: /TAN\s+DAI\s+VIET/i, ////
	tlc: /THANG\s+LOI/i, //// nkc
	tlp: /THANH\s+LOC\s+PHAT/i, //// nkc
	uls: /MING\s+ZE/i, ////
	unt: /UNITY\s+VIET\s+NAM/i, ////
	vdt: /VINH\s+DAT\s+THANH/i, ////
	vha: /VAN\s+HAO/i,
	vto: /VAN\s+THANH/i, ////
	xaw: /TUONG\s+AN\s+WOOD/i, // hgc
	zfc: /TRUNG\s+DANH/i, ////
	xgx: /XIN\s+GUAN\s+XING/i,
	ydc: /YING\s+DONG/i,
};

export const docs = [];
export async function loadDocContent(data) {
	try {
		const file_content = data.file_content;
		const mode = getISO(file_content, factories);
		const module = modules[mode];
		if (!module) {
			console.log("Missing module: " + mode + ' for ' + data.file_path);
			return;
		}
        console.log('Module ' + mode + ' loaded!');
		const bill_number = await applyFunc(
			module,
			"bill_number",
			file_content
		);
		const invoice_doc = getInvoiceDoc(file_content);
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
			content: file_content,
			file_path: data.file_path,
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

		docs.push(item);
		return item;
	} catch (error) {
		console.error("Error loading doc:", error);
	}
}
