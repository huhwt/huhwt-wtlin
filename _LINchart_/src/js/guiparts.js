///////////////////////////////////////////////////////////////////////////////
//
// wtLINEAGE
//
// i18n functionality added by huhwt
// Web storage functionality added by huhwt
// 
// Context and Language dependant GUI assembling
//
///////////////////////////////////////////////////////////////////////////////

function html_os() {
	return `
<fieldset>
	<legend><label class="toggler" for="toggle_os">${i18n("mb_OpSt")}</label></legend>
	<input class="menu_toggler" type="checkbox" id="toggle_os" hidden="" />
	<div class="mcontainer menu">
	<legend><label >${i18n("mb_Open")}</label></legend>
		<div>
			<input class="mbutton" type="button" style="border:1px solid gray" value="${i18n("mb_lIDB")}" id="btnLoad" />
			<input type="file" id="browse" name="fileupload" style="display: none" accept=".ged, .tlin" />
			<input class="mbutton" type="button" style="border:1px solid gray" value="${i18n("mb_lF")}" id="fakeBrowse" />
		</div>
		<p>
			<input class="filelabel" type="text" id="filename" contentEditable />
		</p>
		<legend><label >${i18n("mb_Store")}</label></legend>
		<div>
			<input class="mbutton" type="button" style="border:1px solid gray" value="${i18n("mb_sIDB")}" id="btnSave" />
			<input class="mbutton" type="button" style="border:1px solid gray" value="${i18n("mb_sF")}" id="btnSaveF" />
			<input class="mbutton" type="button" style="border:1px solid gray" value="${i18n("mb_sSVG")}" id="btnSvgExport" />
		</div>
	</div>
</fieldset>
<!-------------------------------------------------------------------------------------->`;
}

function html_title() {
	return `
<!-------------------------------------------------------------------------------------->
<div class="title">
	Topographic Attribute Maps
	<span id="version" class="version">1.19</span>
</div>
<!-------------------------------------------------------------------------------------->`;
}

function html_is() {
	return`
<fieldset>
	<legend><label class="toggler" for="toggle_ia">${i18n("mb_ntrct")}</label></legend>
	<input class="menu_toggler" type="checkbox" id="toggle_ia" hidden="" />
	<table class="menu" border="0" cellpadding="0" cellspacing="1">
		<tr>
			<td class="paramlabel">${i18n("mb_Frz")}</td>
			<td class="param"><label class="switch"><input id="settings_freeze" type="checkbox"><span class="slider"></span></label></td>
		</tr>
		<tr>
			<td class="paramlabel">${i18n("mb_HghlC")}</td>
			<td class="param"><label class="switch"><input id="settings_select_time" type="checkbox"><span class="slider"></span></label></td>
		</tr>
		<tr>
			<td class="paramlabel">${i18n("mb_sYV")}</td>
			<td class="param"><label class="switch"><input id="settings_show_yearvalues" type="checkbox"><span class="slider"></span></label></td>
		</tr>
		<tr>
			<td class="paramlabel">${i18n("mb_sTC")}</td>
			<td class="param"><label class="switch"><input id="settings_show_tickcount" type="checkbox"><span class="slider"></span></label></td>
		</tr>
	</table>
</fieldset>
<!-------------------------------------------------------------------------------------->`;
}

function html_ga() {
	return `
	<fieldset>
		<legend><label class="toggler" for="toggle_ga">${i18n("mb_GA")}</label></legend>
		<input class="menu_toggler" type="checkbox" id="toggle_ga" hidden="" />
		<table class="menu" border="0" cellpadding="0" cellspacing="1">
			<tbody>
				<tr>
					<td class="paramlabel">${i18n("mb_SG")}</td>
					<td class="param"><label class="switch"><input id="settings_show_graph" type="checkbox"><span class="slider"></span></label></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_SL")}</td>
					<td class="param"><label class="switch"><input id="settings_show_links" type="checkbox"><span class="slider"></span></label></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_SN")}</td>
					<td class="param"><label class="switch"><input id="settings_show_names" type="checkbox"><span class="slider"></span></label></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_sNI")}</td>
					<td class="param"><label class="switch"><input id="settings_show_tooltips" type="checkbox"><span class="slider"></span></label></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_LW")}</td>
					<td class="param"><input type="number" id="settings_linkwidth" min="1" max="20" step="1" value="6" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_NR")}</td>
					<td class="param"><input type="number" id="settings_noderadius" min="1" max="100" step="1" value="15" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">${i18n("mb_NLO")}</td>
					<td class="param"><input type="number" id="settings_pnodeopacity" min="0.0" max="1.0" step="0.1" value="1.0" class="paramspinbox"></td>
				</tr>
			</tbody>
		</table>
	</fieldset>
	<!-------------------------------------------------------------------------------------->`;
}
function html_linm() {
	return `
	<div class="options">
		<h1>${i18n("Ahnen in Knoten")}<span id="version" class="version">&nbsp;v2.1.0.9</span></h1>
		<hr>
		<h3>${i18n("Knotenansichten:")}</h3>
		<div class="views">
			<button class="btn btn-sm button__30" data-view="TREE">${i18n("Baum")}</button>
			<button class="btn btn-sm button__30" data-view="TLINE">${i18n("Zeitleiste")}</button>
			<button class="btn btn-sm button__30" data-view="CLUSTER">${i18n("Gruppen")}</button>
		</div>
		<hr>
		<div class="namesFilter">
			<h3>${i18n("Nachnamenfilter:")}</h3>
			<div class="checkboxO">
				<button id="clustersA" class="btn btn-sm button__30" title="${i18n('Filtermodus')}">soundDM</button>
				<label type="options__label" for="cbfilterAny" title="${i18n('Wenn aktiv -> jeder Teil-Text wirkt')}">
					<input id="cbfilterAny" type="checkbox" class="checkbox-lg">${i18n("beliebig")}</label>
				<label type="options__label" for="cbfilterSpouse" title="${i18n('Mit Partnern')}">
					<input id="cbfilterSpouse" type="checkbox" class="checkbox-lg">${i18n("mit Partnern")}</label>
			</div>
			<div id="clustersAsel" class="sounds" >
			<!-- content generated by DSprep -->
			</div>
		</div>
		<div class="filterS">
			<div class="filterS-parts">
				<div class="text-info">${i18n("Mehrere Namen durch ';' trennen!")}</div>
				<a data-filter="menu_names" class="btn btn-circle"><span class="fa fa-list-ul fa-big" title="${i18n('Filter bearbeiten')}"></span></a>
			</div>
			<div>
				<input id="menu_names" class="form-control input-lg" value="">
				<div id="filterA" class="filters" size="0"></div>
			</div>
		</div>
		<hr>
		<h3>${i18n("Navigation / Animation:")}</h3>
		<div id="yearBoxes" class="time">
		<!-- content generated by YBprep -->
		</div>
		<hr>
	</div>
`;
}

function html_lang() {
	return `
<fieldset>
	<legend><label class="toggler" for="toggle_lang">${i18n("language")}</label></legend>
	<input class="menu_toggler" type="checkbox" id="toggle_lang" hidden="" />
	<table class="menu" border="0" cellpadding="0" cellspacing="1">
		<tr>
			<td class="paramlabel">
				<input class="button" type="button" style="border:1px solid gray" value="de" id="btn_l_de" />
				<input class="button" type="button" style="border:1px solid gray" value="en" id="btn_l_en" />
				<input class="button" type="button" style="border:1px solid gray" value="nl" id="btn_l_nl" />
			</td>
		</tr>
	</table>
</fieldset>`;
}

export function tamMENUBAR_html() {
	let html_folay = `
	<fieldset>
		<legend><label class="toggler" for="toggle_layout">Force Layout</label></legend>
		<input class="menu_toggler" type="checkbox" id="toggle_layout" hidden="" />
		<table class="menu" border="0" cellpadding="0" cellspacing="1">
			<tbody>
				<tr>
					<td class="paramlabel">Gravity X:</td>
					<td class="param"><input type="number" id="settings_gravity_x" min="0" step="0.01" value="0.1" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">Gravity Y:</td>
					<td class="param"><input type="number" id="settings_gravity_y" min="0" step="0.01" value="0.1" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">Repulsion Strength:</td>
					<td class="param"><input type="number" id="settings_repulsion_strength" min="0" step="20" value="2000" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">Link Strength:</td>
					<td class="param"><input type="number" id="settings_link_strength" min="0" step="0.1" value="2" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">Similarity Strength:</td>
					<td class="param"><input type="number" id="settings_simforce_strength" min="0" step="0.1" value="1" class="paramspinbox"></td>
				</tr>
				<tr>
					<td class="paramlabel">Friction:</td>
					<td class="param"><input type="number" id="settings_friction" min="0.0" max="1.0" step="0.1" value="0.0" class="paramspinbox"></td>
				</tr>
			</tbody>
		</table>
	</fieldset>
	<!-------------------------------------------------------------------------------------->`;
	let html_ma = `
	<fieldset>
		<legend><label class="toggler" for="toggle_ma">${i18n("mb_MA")}</label></legend>
		<input class="menu_toggler" type="checkbox" id="toggle_ma" hidden="" />
		<table class="menu" border="0" cellpadding="0" cellspacing="1">
			<tr>
				<td class="paramlabel">${i18n("mb_SM")}</td>
				<td class="param"><label class="switch"><input id="settings_show_contours" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_RC")}</td>
				<td class="param"><label class="switch"><input id="settings_reversecolor" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_INN")}</td>
				<td class="param"><label class="switch"><input id="settings_interpolation_type" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_EL")}</td>
				<td class="param"><label class="switch"><input id="settings_embed_links" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_ST")}</td>
				<td class="param"><label class="switch"><input id="settings_show_tunnels" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_ES")}</td>
				<td class="param"><label class="switch"><input id="settings_shading" type="checkbox"><span class="slider"></span></label></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_DD")}</td>
				<td class="param"><input type="number" id="settings_dilation_degree" min="0" max="100" step="1" value="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_MinRV")}</td>
				<td class="param"><input type="number" id="settings_range_min" value="1750" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_MaxRV")}</td>
				<td class="param"><input type="number" id="settings_range_max" value="2020" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_CS")}</td>
				<td class="param"><input type="number" id="settings_contour_step" min="0" step="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_CSb")}</td>
				<td class="param"><input type="number" id="settings_contour_big_step" min="0" step="10" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_IS")}</td>
				<td class="param"><input type="number" id="settings_indicator_size" min="0" step="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_HScl")}</td>
				<td class="param"><input type="number" id="settings_height_scale" min="0" max="100" value="80" step="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_Res")}</td>
				<td class="param"><input type="number" id="settings_resolution" min="10" max="5000" value="500" step="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_LSS")}</td>
				<td class="param"><input type="number" id="settings_link_sample_step" min="1" step="1" class="paramspinbox"></td>
			</tr>
			<tr>
				<td class="paramlabel">${i18n("mb_UT")}</td>
				<td class="param"><input type="number" id="settings_underground_threshold" min="0" step="5" class="paramspinbox"></td>
			</tr>
		</table>
	</fieldset>
	<!-------------------------------------------------------------------------------------->`;

	let html_mb = html_os() + html_title() + html_is() + html_folay + html_ga() + html_ma + html_lang();
	return html_mb;
}

export function FILE_MODAL() {
	let html_fm = `
	<div id="overlaybg" onclick="closeModal()"></div>
	<div class="modal">
		<button type="button" class="close" onclick="closeModal()" alt="close">×</button>
		<h1>Cannot find GEDCOM file</h1>
		<p><i><span id="missing-ged-file-name">unknown</span></i></p>
		<p>Please select it from your computer, or <br />make sure it is placed within the subfolder <i>\data</i>.</p>
		<form name="data-source">
			<label for="modal-file-upload" class="custom-button">Open file</label>
			<input type="file" id="modal-file-upload" onchange="processModalFileUpload()" accept=".ged" class="input-file">
		</form>
	</div>`;

	return html_fm;
}

export function IDB_INDEX() {
	let html_idbi = `
	<div id="overlaybg"></div>
	<div class="modal">
		<button type="button" class="close" title="close">×</button>
		<h1>Current state IndexedDB</h1>
		<ul id="idbstores">
		</ul>
	</div>`;

	return html_idbi;
}

export function linMENUBAR_html() {
	let html_mb = `
	<button id="bt_toggleMenu" class="toggle__button" title="${i18n("Menü ein/ausfalten")}">${i18n("Menü")}</button>
	`;

	return html_os() + html_mb + html_linm() + html_ga() + html_lang();

}

export function CONTROLS_html() {
	let html_cs = `
	<a data-info="print"  class="btn btn-circle"><span class="fa fa-print" title="Log-Info"></span></a>
	<a data-info="stop"  class="btn btn-circle"><span class="fa fa-stop-circle" title="Simulation Stop"></span></a>
	<a data-info="rerun"  class="btn btn-circle"><span class="fa fa-thermometer-full" title="Simulation Animieren"></span></a>
	<div class="controls-body">
		<div class="controls">
			<div class="force alpha">
				<p><span>alpha -></span><span id="alpha_value"></span></p>
				<div class="alpha_bar"><div id="alpha_value_bar"></div></div>
			</div>
		</div>
	</div>
`;

	return html_cs;
}