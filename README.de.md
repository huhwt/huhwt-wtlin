[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

![webtrees major version](https://img.shields.io/badge/webtrees-v2.1-green)
![Latest Release](https://img.shields.io/github/v/release/huhwt/huhwt-wttam)

Dieses [webtrees](https://www.webtrees.net/) Modul enthält Lineage, ein Knoten-Link-Diagramm, das genealogische Beziehungen visualisiert. Lineage wurde ursprünglich von [Ben Garvey](https://github.com/bengarvey/lineage) entwickelt, ich habe es seinerzeit in einer angepassten Version auf der Homepage von [Horst Stern](https://knoten.familie-stern.de/) entdeckt.

Die hier vorgestellte Version kombiniert die Konzepte der Originale mit Elementen aus TAM und eigenen Erweiterungen.

Derzeit ist das Modul noch in laufender Entwicklung, noch nicht alle Aktionen führen zu den gewünschten Ergebnissen.  Die primäre Funktion ist jedoch bereits genügend stabil, dass ich es für vertretbar halte, es als **Pre-Release** zu veröffentlichen.

## Contents
Dieses Readme enthält die folgenden Hauptabschnitte

* [Beschreibung](#description)
* [Voraussetzungen](#requirements)
* [Installation](#installation)
* [Upgrade](#upgrade)
* [Übersetzungen](#translation)
* [Support Contact](#support)
* [Danksagungen](#thanks)
* [Lizenz](#license)

<a name="description"></a>
## Beschreibung

<p align="center"><img src="_ASSETTS/wtlin-screen.png" alt="Screenshot wtlin" align="center" width="90%"></p>

Lineage oder **LIN** ist ein Node-Link Diagramm auf Basis einer D3.js Force Simulation. Die Nodes stehen für Personen, die Links zeigen die Abstammungslinien auf.

Anders als **TAM**, wo die Familien ein zentrales Element der Darstellung sind, stellt LIN die Verbindung von Eltern und Kindern jeweils einzeln dar und die Beziehung zwischen den Eltern als eigene optisch abgegrenzte Verknüpfung.

Die primäre Darstellung ist die Baum-Ansicht mit den Verknüpfungen. Alternativ können die Personen auch in einer Zeitleiste oder nach Familiennamen gruppiert dargestellt werden.

Die Knoten werden nach Geschlecht differenziert - Frauen als Kreise, Männer als Quadrate. Die Farben variieren mit den Familiennamen.

Die Links zwischen Eltern und Kindern sind gerichtet, zu männlichen Nachkommen hellblau, zu weiblichen helllila ... ('Tschuldigung). Die Links zwischen den Eltern sind ungerichtet, unterbrochen und in einer gelb-grünen Farbvariante.

Die Daten werden aus Webtrees extrahiert, als Schnittstelle dient [huhwt-cce](https://github.com/huhwt/huhwt-cce). Die dort in einer Session-Variablen abgelegten Daten werden vom PHP-Anteil dieses Moduls auf IndexedDB umgeschrieben. Die eigentlichen LIN-Komponenten greifen auf die Informationen in IndexedDB zu und sind als solche unabhängig von der Server-Seite.

Eine grundsätzliche inhaltliche Kopplung an Webtrees gibt es jedoch in Bezug auf das Farbschema der Personen-Knoten. Webtrees bietet neben dem Nachnamen im Klartext auch die Umsetzung gemäß [Soundex](https://en.wikipedia.org/wiki/Soundex) sowohl im Standard als auch in der Daitch–Mokotoff-Variante an. Alle 3 Ausprägungen werden in LIN übernommen. Die SoundDM-Ausprägung dient dabei als Index-Merkmal für den D3js-Farbraum [interpolateSinebow](https://github.com/d3/d3-scale-chromatic/blob/main/README.md#interpolateSinebow). Familiennamen, welche sich z.B. in Groß- und Klein-Schreibung oder alternativen Umlaut-Schreibweisen unterscheiden, werden so gleichfarbig dargestellt, anders als wenn man den Namen im Klartext verwendet. 

In der Gruppendarstellung kann man durch Wechsel des Ordnungskriteriums die Darstellung umschalten; je nach Kriterium ergeben sich unterschiedliche Verteilungen.

Eine wesentliche Ergänzung des Lineage-Ursprungs besteht in der Möglichkeit, den Bezugs-Zeitpunkt der Darstellung einzustellen. Der Darstellungszeitraum ist auf die Zeitspanne von 1500 bis zum letzten relevanten Personendatum aufgerundet auf glatte 10-er Jahre voreingestellt. Sollte ein Personendatum vor 1500 gefunden werden, erweitert sich die Zeitspanne entsprechend um glatte 100-er Jahre nach vorne. Im Menü werden nun entsprechende Sprungmarken eingefügt, so dass man den Bezugszeitpunkt auf die jeweiligen Jahrhundert-Marken einstellen kann.
Im oberen Bereich des Bildschirms befindet sich ein Doppel-Slider und ein Start-Stop-Block. Mit dem unteren Slider kann man Anfangs- und Endwert des Darstellungszeitraums in 10-Jahres-Schritten beeinflussen. Der obere Slider erlaubt es, im Darstellungszeitraum frei in 10-Jahres-Schritten zu wechseln.
Im Start-Stop-Block finden sich Schaltflächen, mit denen man das Bezugsjahr in 1-Jahres-Schritten verändern kann (unten) sowie Elemente, mit denen man automatisch den Darstellungszeitraum nach vorne bzw. hinten durchlaufen (1-Jahres-Schritte) bzw. den automatischen Durchlauf stoppen kann (oben).

Beim Wechsel des Bezugszeitpunkts werden solche Nodes deren Bezugsjahr außerhalb des Zeitraums liegen automatisch entfernt bzw. auch wieder eingefügt, wenn die Grenzwerte (Startjahr des Darstellungszeitraums - aktueller Bezugszeitpunkt) das Bezugsjahr mit einschliessen.

Eine weitere Ergänzung des Lineage-Ursprungs betrifft die Option, Teilmengen der Nodes nach Familiennamen abzugrenzen. Man kann eine umfassende Liste der Familiennamen aufrufen, wahlweise sortiert nach Häufigkeit oder alphabetisch und innerhalb der Gesamtmenge auch noch abgrenzbar nach Anfangs-Buchstaben. Mittels Checkboxen können nun Namen ausgewählt und als Filter-Kriterium hinterlegt werden. Dabei können auch mehrere Filter-Definitionen gebildet und im weiteren Verlauf zwischen diesen gewechselt werden. Wie beim Bezugsjahr werden alle Nodes, deren Namenskriterium nicht dem aktiven Filter entsprechen, aus der Darstellung entfernt. Das relevante Namenskriterium ergibt sich gemäß der Vorgabe des Names-Schemas (siehe oben), ist z.B. SoundDM gesetzt, werden alle dem SoundDM-Wert eines Namens im Filter entsprechenden Nodes mit angezeigt, auch wenn deren Klarnamen davon abweicht.

Durch Klick auf die Checkbox "mit Partnern" werden zusätzlich zu den über den aktiven Filter selektierten Personen auch die jeweils zugeordneten Ehepartner mit in die Darstellung einbezogen. Die repräsentierenden Nodes werden dann mit verringerter Größe dargestellt.

Am unteren Rand des Bildschirms werden der aktuelle Bezugszeitpunkt sowie die Anzahl der aktiven sowie der ausgeblendeten Nodes angezeigt.

Schließlich gibt es noch Aktions-Schaltflächen oben rechts auf dem Bildschirm:

Mittels der obersten Schaltfläche - ein Drucker-Symbol - lässt sich die aktuelle Darstellung als SVG exportieren.

Die anderen Schaltflächen stehen im Zusammenhang mit der technischen Plattform, welche die Darstellung erzeugt. Wie erwähnt handelt sich um eine D3js-Force-Simulation. Die Idee dahinter ist, dass sich eine Darstellung aus dem Wechselspiel von anziehenden und abstoßenden Kräften ergibt, welche iterativ in einer Vielzahl von Durchläufen auf die Nodes wirken. Anfangs ist der Energie-Level der Kräfte hoch und nimmt von Durchlauf zu Durchlauf ab. Die Anzeige wird nicht nach jedem Durchlauf erzeugt sondern nach einem festgelegten Zeitraum. Bei hohem Energie-Level können deshalb die Nodes sprunghaft von einer Bildschirm-Aktualisierung zur nächsten den Standort wechseln, ist der Level niedriger, sind die Standort-Wechsel wesentlich weniger ausgeprägt, so dass man unter Umständen nur noch ein gewisses "Zittern" wahrnimmt. Sobald der Energie-Level unter den Endwert sinkt wird die Iterations-Schleife beendet.

Aus **TAM** wurde das Feature übernommen, dass bei Energie-Level "0" der Darstellungs-Baum mit einer Art Karte unterlegt wird, deren Höhenlinien Jahreswerten entspricht - das **T** in **TAM**. Die mittlere Schaltfläche - ein Stop-Symbol - setzt den Energie-Level wechselweise auf "0" - die Karte erscheint - bzw. wieder auf den vorherigen Wert zurück - die Karte verschwindet wieder. 

Jede Simulation beginnt mit einer relativ kompakten Zusammenballung aller Nodes. Jeder Node wirkt auf seine Umgebung. Enthält ein Datenbestand viele Nodes, ist es recht wahrscheinlich, dass bei Ende des Iterations-Zyklus die Verteilung der Nodes durch gegenseitige quasi Blockaden noch nicht wirklich ausgeglichen ist. Ein Iterations-Zyklus beinhaltet ca. 300 Durchläufe, eventuell auch weniger, wenn ein End-Energiewert > "0" vorgegeben ist. Die dritte Schaltfläche - ein Thermometer-Symbol - setzt den aktuellen Energie-Level pro Betätigung um jeweils 0.1 hoch (der Maximalwert ist 1), so dass eine weitere Abfolge von Iterationen angestossen wird. Bei grosser Node-Anzahl wird sich das in weiteren Verschiebungen bemerkbar machen, liegt die Node-Anzahl in eher niedrigem Bereich von maximal einigen 100ern, wird sich die Darstellung eher nicht mehr verändern, da ein stabiler Gleichgewichtszustand der wirkenden Kräften eingetreten sein dürfte.

Unter den Aktions-Schaltflächen wird zur Information der aktuelle "alpha"-Wert angezeigt, er entspricht dem jeweiligen Energie-Level, zur besseren Erkennbarkeit vom Bereich 0-1 auf 0-100 hochskaliert. Ändert sich der Wert nicht mehr, ist der Iterations-Zyklus beendet. Bei der Baum-Darstellung ist aktuell der Endwert 0.05, bei der Zeitleiste 0.01 und bei den Gruppen 0.001 hinterlegt. Das D3js-Verfahren ist nachvollziehbar rechenaufwendig, es stellen sich zwangsläufig Rundungsfehler ein, deshalb werden die angezeigten "alpha"-Werte nicht entsprechend glatt, sondern mit diversen Nachkommastellen angezeigt.

Schließlich ist zu erwähnen, dass die Darstellung Zoom und Pan unterstützt. Die erzeugte Grafik wird in einem Viewport von 6000 Pixeln Höhe und Breite erzeugt, der Nullpunkt liegt außerhalb des Bildschirm-Bereich. Die Simulation ordnet die Nodes gleichmäßig um den Nullpunkt verteilt an, mithin werden die Nodes üblicherweise rechts unten erzeugt. Mit Klick in die Darstellung kann diese dann in den sichtbaren Bereich gezogen werden. Mit dem Mausrad kann man die Darstellung nach Belieben vergrößern und verkleinern.

Überstreicht der Mauszeiger einen Node, werden die zugehörigen Informationen als Tooltip angezeigt.

Beim Klick auf einen Node wird dessen Größe verdoppelt. Zieht man ihn in diesem Zustand an eine andere Position, wird er dort fixiert, unterliegt nicht mehr dem Iterations-Verfahren und stabilisiert als Nebeneffekt auch die Positionen der mit ihm über Links verbundenen anderen Nodes. Ein erneuter Klick auf den Node hebt die Fixierung auf, die Größe wird auf den regulären Wert zurückgesetzt und der Node folgt wieder den Simulations-Effekten.

Man kann einen Node auch per Doppelklick fixieren, ohne ihn an eine andere Position zu ziehen; er wird gleichermaßen hervorgehoben und mit einem einfachen Klick wieder freigesetzt.

<a name="requirements"></a>
## Voraussetzungen

Dieses Modul benötigt **webtrees** Version 2.1.x.
Dieses Modul hat die gleichen allgemeinen Anforderungen wie für **Webtrees** insgesamt genannt [webtrees#system-requirements](https://github.com/fisharebest/webtrees#system-requirements).

<a name="installation"></a>
## Installation

In diesem Abschnitt wird beschrieben, wie Sie dieses Modul installieren.

1. Laden Sie die [Neueste Version] (https://github.com/huhwt/huhwt-wttam/releases/latest) herunter.
2. Entpacken Sie es in das Verzeichnis `webtrees/modules_v4` auf dem Webserver.
3. Benennen Sie den Ordner fallweise in `huhwt-wttam` um. Wenn der Ordner bereits existiert, kann er einfach überschrieben werden. 

<a name="upgrade"></a>
## Upgrade

Um die neueste Version zu erhalten, ersetzen Sie einfach die vorhandenen huhwt-wttam-Dateien mit denen der neuesten Version.

<a name="translation"></a>
## Übersetzungen

Sie können bei der Übersetzung dieses Moduls helfen. Das po/mo-System wird im PHP-Teil verwendet. Die Javascript-Funktionen haben ihre eigene unabhängige i18n-Implementierung.
Aktualisierte Übersetzungen werden mit der nächsten Version des Moduls verteilt.

Bislang gibt es nur Deutsch.

Die Internationalisierung ist derzeit noch `Work in Progress`.

<a name="support"></a>
## Support

<span style="font-weight: bold;">Issues: </span>Fehler bitte in diesem GitHub-Repository melden.

<a name="thanks"></a>
## Danksagungen

* **Lineage** : Ben Garvey https://github.com/bengarvey/lineage / Jens-Peter Stern https://knoten.familie-stern.de/
* **TAM**     : R.Preiner und Team an der Universität Graz, der das Verfahren in seinem Repository veröffentlicht hat https://github.com/rpreiner/tam.
* **Slider**  : John Walley und Mitgestalter https://github.com/johnwalley/d3-simple-slider
* **i18n**    : Simon Rodwell und Mitgestalter https://github.com/roddeh/i18njs

<a name="license"></a>
## Lizenz

Dieses Programm ist quelloffen und unterliegt den Bedingungen der GNU General Public License, entweder der Version 3 der Lizenz oder (nach Ihrer Wahl) einer späteren Version.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem Programm erhalten haben, falls nicht, siehe <http://www.gnu.org/licenses/>.

* * *