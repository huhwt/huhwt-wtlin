[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

![webtrees major version](https://img.shields.io/badge/webtrees-v2.1-green)
![Latest Release](https://img.shields.io/github/v/release/huhwt/huhwt-wttam)

This [webtrees](https://www.webtrees.net/) module hosts Lineage, a node-link diagram that visualizes genealogical relationships. Lineage was originally developed by Ben Garvey, I came across it at the time in an adapted version on Horst Stern's homepage.

The version presented here combines the concepts of the originals with elements from TAM and own extensions.

Currently, the module is still under development, not all actions lead to the desired results yet.  However, the primary function is already sufficiently stable that I consider it reasonable to publish it as a pre-release.

## Contents
This readme contains the following main sections

* [description](#description)
* [requirements](#requirements)
* [installation](#installation)
* [upgrade](#upgrade)
* [translations](#translation)
* [Support Contact](#support)
* [Thanks](#thanks)
* [license](#license)

<a name="description"></a>
## Description

<p align="center"><img src="_ASSETTS/wtlin-screen.png" alt="Screenshot of wtlin" align="center" width="80%"></p>

Lineage or **LIN** is a node-link diagram based on a D3.js force simulation. The nodes represent individuals, and the links show the lineages.

Unlike **TAM**, where families are a central element of the representation, LIN represents the connection of parents and children one at a time, and the relationship between parents as a separate visually delimited link.

The primary representation is the tree view with the links. Alternatively, individuals can be displayed in a timeline or grouped by family name.

The nodes are differentiated by gender - women as circles, men as squares. The colors vary with the family names.

Links between parents and children are directed, to male descendants light blue, to female light purple ... ('sorry). Links between parents are undirected, dashed and in a yellow-green color variation.

The data is extracted from webtrees, using [huhwt-cce](https://github.com/huhwt/huhwt-cce) as the interface. The data stored there in a session variable is rewritten to IndexedDB by the PHP portion of this module. The actual LIN components access the information in IndexedDB and as such are independent of the server side.

However, there is a basic content coupling to Webtrees with respect to the color scheme of the person nodes. Webtrees offers not only the surname in plain text but also the conversion according to [Soundex](https://en.wikipedia.org/wiki/Soundex) both in the Standard and in the Daitch-Mokotoff variant. All 3 expressions are taken over in LIN. The SoundDM expression serves thereby as index characteristic for the D3js color space [interpolateSinebow](https://github.com/d3/d3-scale-chromatic/blob/main/README.md#interpolateSinebow). Family names, which differ e.g. in upper and lower case or alternative umlaut spellings, are represented in such a way in the same color, differently than if one uses the name in the plain text. 

In the group display, the display can be switched by changing the order criterion; depending on the criterion, different distributions result.

An essential addition to the lineage origin is the possibility to set the reference time of the representation. The display period is preset to the time span from 1500 to the last relevant person date rounded up to even 10s. If a person date before 1500 is found, the time span is extended accordingly by smooth 100s of years forward. In the menu now appropriate jump marks are inserted, so that one can set the reference time to the respective century marks.
In the upper part of the screen there is a double slider and a start-stop block. With the lower slider one can influence the start and end value of the display period in 10-year steps. The upper slider allows to change the display period freely in 10-year steps.
The start-stop block contains buttons that can be used to change the reference year in 1-year steps (bottom) and elements that can be used to automatically run through the display period forwards or backwards (1-year steps) or to stop the automatic run (top).

When changing the reference time, such nodes whose reference year lies outside the period are automatically removed or also inserted again if the limit values (start year of the display period - current reference time) include the reference year.

Another addition to the lineage origin concerns the option to delimit subsets of nodes by family name. One can call up a comprehensive list of family names, optionally sorted by frequency or alphabetically, and within the total set also delimitable by initial letter. By means of checkboxes names can be selected and deposited as filter criterion. It is also possible to create several filter definitions and to switch between them in the further course. As with the reference year, all nodes whose name criterion does not correspond to the active filter are removed from the display. The relevant name criterion results according to the default of the name scheme (see above), e.g. if SoundDM is set, all nodes corresponding to the SoundDM value of a name in the filter will be displayed, even if their plain name differs from it.

By clicking on the checkbox "with partners", in addition to the persons selected via the active filter, the respective assigned spouses are also included in the display. The representing nodes are then displayed with reduced size.

At the bottom of the screen, the current reference time and the number of active and hidden nodes are displayed.

Finally, there are action buttons at the top right of the screen:

By means of the top button - a printer icon - the current rendering can be exported as SVG.

The other buttons are related to the technical platform that generates the rendering. As mentioned, it is a D3js force simulation. The idea behind it is that a representation results from the interplay of attractive and repulsive forces, which act iteratively on the nodes in a large number of passes. Initially, the energy level of the forces is high and decreases from run to run. The display is not generated after each run but after a fixed period of time. If the energy level is high, the nodes can change their location abruptly from one screen update to the next. If the level is lower, the location changes are much less pronounced, so that you may only notice a certain "tremor". Once the energy level drops below the final value the iteration loop is terminated.

From **TAM** the feature was taken over that at energy level "0" the display tree is underlaid with a kind of map whose contour lines correspond to temporal values - the **T** in **TAM**. The middle button - a stop symbol - alternately sets the energy level to "0" - the map appears - or back to the previous value - the map disappears again. 

Each simulation starts with a relatively compact agglomeration of all nodes. Each node acts on its environment. If a dataset contains many nodes, it is quite likely that at the end of the iteration cycle the distribution of the nodes is not yet really balanced due to mutual quasi blockades. An iteration cycle contains about 300 runs, possibly less if a final energy value > "0" is given. The third button - a thermometer symbol - raises the current energy level by 0.1 each time it is pressed (the maximum value is 1), so that a further sequence of iterations is triggered. If the number of nodes is large, this will result in further shifts, if the number of nodes is rather low (a few 100s at the most), the display will not change any more, because a stable state of equilibrium of the acting forces has probably been reached.

Under the action buttons the current "alpha" value is displayed for information, it corresponds to the respective energy level, scaled up from the range 0-1 to 0-100 for better recognizability. If the value does not change anymore, the iteration cycle is finished. In the tree display, the end value is currently 0.05, in the timeline 0.01 and in the groups 0.001. The D3js procedure is comprehensibly computationally expensive, rounding errors inevitably occur, therefore the displayed "alpha" values are not shown accordingly smooth, but with various decimal places.

Finally, it should be mentioned that the display supports zoom and pan. The generated graphic is created in a viewport of 6000 pixels height and width, the zero point is outside the screen area. The simulation arranges the nodes evenly distributed around the zero point, thus the nodes are usually generated at the bottom right. By clicking into the representation it can be dragged into the visible area. The mouse wheel can be used to zoom in and out as desired.

If the mouse pointer hovers over a node, the associated information is displayed as a tooltip.

Clicking on a node doubles its size. If you drag it to another position in this state, it is fixed there, is no longer subject to the iteration process and, as a side effect, also stabilizes the positions of the other nodes connected to it via links. Clicking on the node again removes the fixation, the size is reset to the regular value and the node follows the simulation effects again.

You can also fix a node by double-clicking on it without dragging it to another position; it will be highlighted in the same way and released again with a single click.

<a name="requirements"></a>
## Requirements

This module requires **webtrees** version 2.1.x.
This module has the same general requirements as named for **Webtrees** overall [webtrees#system-requirements](https://github.com/fisharebest/webtrees#system-requirements).

<a name="installation"></a>
## Installation

This section describes how to install this module.

1. Download [Latest Release](https://github.com/huhwt/huhwt-wtlin/releases/latest).
2. Unzip to the `webtrees/modules_v4` directory on the web server.
3. Occasionally rename the folder to `huhwt-wtlin`. If the folder already exists, it can be easily overwritten.

<a name="upgrade"></a>
## Upgrade

For the latest version, simply replace the existing huhwt-wtlin files with those from the latest release.

<a name="translation"></a>
## translation

You can help with the translation of this module. The po/mo system is used in the PHP part. The javascript functions have their own independent i18n implementation.
Updated translations will be distributed with the next version of the module.

So far only German is available.

The internationalization is currently still 'work in progress'.

<a name="support"></a>
## support

<span style="font-weight: bold;">Issues: </span>You can report bugs by filing an issue in this GitHub repository.

<a name="thanks"></a>
## Thanks

* **Lineage**   Ben Garvey https://github.com/bengarvey/lineage / Jens-Peter Stern https://knoten.familie-stern.de/
* **TAM**       R.Preiner and team at the University of Graz, who published the method in his repository https://github.com/rpreiner/tam.
* **Slider**    John Walley and contributors https://github.com/johnwalley/d3-simple-slider
* **i18n**      Simon Rodwell and contributors https://github.com/roddeh/i18njs

<a name="license"></a>
## License

This program is open source, governed by the terms of the GNU General Public License, either version 3 of the License, or (at your option) any later version.

You should have received a copy of the GNU General Public License with this program, if not see <http://www.gnu.org/licenses/>.

* * *