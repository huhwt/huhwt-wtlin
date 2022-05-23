///////////////////////////////////////////////////////////////////////////////
//
// Topographic Attribute Maps Demo
// Copyright 2020 Reinhold Preiner, Johanna Schmidt, Gabriel Mistelbauer
//
// This code is licensed under an MIT License.
// See the accompanying LICENSE file for details.
//
// i18n functionality added by huhwt
//
///////////////////////////////////////////////////////////////////////////////

export function TICKCOUNTER_html() {
    let html_tc = `
	<div class="title">
		Tickcounter Information
		<span id="tClevel" class="version">_</span>
	</div>
	<fieldset>
		<legend><label class="toggler" for="toggle_tcI">Kennwerte</label></legend>
		<input class="menu_toggler" type="checkbox" id="toggle_tcI" checked="" hidden="" />
		<table class="menu" border="0" cellpadding="0" cellspacing="1">
			<tbody>
				<tr>
					<td class="paramlabel">Num Nodes</td>
					<td class="paramL" id="tcinfo_ncount">_</td>
				</tr>
				<tr>
					<td class="paramlabel">tickcount Level</td>
					<td class="paramL" id="tcinfo_level">_</td>
				</tr>
				<tr>
					<td class="paramlabel">tickcount Check</td>
					<td class="paramL" id="tcinfo_check">_</td>
				</tr>
				<tr>
					<td class="paramlabel">tickcount Cycles</td>
					<td class="paramL" id="tcinfo_cycles">_</td>
				</tr>
				<tr>
					<td class="paramlabel">tickcount Modulo</td>
					<td class="paramL" id="tcinfo_modvalue">_</td>
				</tr>
			</tbody>
		</table>
	</fieldset>
	<fieldset>
		<legend><label>tickcounter Reset</label></legend>
		<table class="menu" border="0" cellpadding="0" cellspacing="1">
			<tr>
				<td class="paramlabel">
					<input class="button" type="button" style="border:1px solid gray" value="Reset to 'min'" id="btn_tcIreset" />
				</td>
				<td class="paramL" id="tcinfo_cnts">_</td>
			</tr>
		</table>
	</fieldset>
    <fieldset>
    <legend><label class="toggler" for="toggle_trf">Transform</label></legend>
    <input class="menu_toggler" type="checkbox" id="toggle_trf" checked="" hidden="" />
    <table class="menu" border="0" cellpadding="0" cellspacing="1">
        <tbody>
            <tr>
                <td class="paramlabel">canvas width</td>
                <td class="paramL" id="trfinfo_cw">_</td>
            </tr>
            <tr>
                <td class="paramlabel">canvas height</td>
                <td class="paramL" id="trfinfo_ch">_</td>
            </tr>
            <tr>
                <td class="paramlabel">transform X</td>
                <td class="paramL" id="trfinfo_x">_</td>
            </tr>
            <tr>
                <td class="paramlabel">transform Y</td>
                <td class="paramL" id="trfinfo_y">_</td>
            </tr>
            <tr>
                <td class="paramlabel">transform Scale</td>
                <td class="paramL" id="trfinfo_scale">_</td>
            </tr>
        </tbody>
    </table>
    </fieldset>`;

	return html_tc;
}
