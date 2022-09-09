<?php

declare(strict_types=1);

namespace HuHwt\WebtreesMods\LINchart;

use Aura\Router\RouterContainer;
use Aura\Router\Map;
use Fig\Http\Message\RequestMethodInterface;
use fisharebest\Localization\Translation;
use Fisharebest\Webtrees\Webtrees;
use Fisharebest\webtrees\module\AbstractModule;
use Fisharebest\Webtrees\Module\ModuleCustomInterface;
use Fisharebest\Webtrees\Module\ModuleCustomTrait;
// use Fisharebest\Webtrees\Module\ModuleChartInterface;
// use Fisharebest\Webtrees\Module\ModuleChartTrait;
// use Fisharebest\Localization\Locale\LocaleInterface;
// use Fisharebest\Webtrees\Auth;
use Fisharebest\Webtrees\Http\Middleware\AuthManager;
// use Fisharebest\Webtrees\Contracts\UserInterface;
use Fisharebest\Webtrees\Http\ViewResponseTrait;
use Fisharebest\Webtrees\Registry;
// use Fisharebest\Webtrees\Menu;
use Fisharebest\Webtrees\I18N;
use Fisharebest\Webtrees\View;
// use Fisharebest\Webtrees\Individual;
// use Fisharebest\Webtrees\Services;
use Fisharebest\Webtrees\Module\ModuleInterface;
use Fisharebest\Webtrees\Module\ModuleGlobalInterface;
use Fisharebest\Webtrees\Module\ModuleGlobalTrait;

// use Fisharebest\Webtrees\Services\LocalizationService;
use Fisharebest\Webtrees\Session;
use Fisharebest\Webtrees\Soundex;
use Fisharebest\Webtrees\Tree;
use Fisharebest\Webtrees\Services\TreeService;
// use Illuminate\Database\Capsule\Manager as DB;
// use Illuminate\Database\Query\Builder;
// use Illuminate\Database\Query\Expression;
// use Illuminate\Database\Query\JoinClause;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
// use Psr\Http\Server\RequestHandlerInterface;


// use HuHwt\WebtreesMods\Http\RequestHandlers\LINchartRH;

use function app;
use function array_keys;
use function assert;
use function e;
use function implode;
use function in_array;
use function ob_get_clean;
use function ob_start;
use function redirect;
use function route;
use function usort;
use function view;

/**
 * Class LINaction
 */
class LINaction extends AbstractModule 
    implements ModuleGlobalInterface, ModuleCustomInterface, ModuleInterface
{
    use ModuleCustomTrait;
    use ViewResponseTrait;

    private const ROUTE_DEFAULT = 'huhwt-LINaction';
    // private const ROUTE_URL = '/tree/{tree}/LINchart&actKey={actKey}';
    private const ROUTE_URL = '/LINaction&actKey={actKey}';

    private $huh;

    /** @var TreeService */
    private $tree_service;

    /**
     * @param TreeService $tree_service
     */
    public function __construct(TreeService $tree_service) {
        $this->tree_service = $tree_service;
        $this->huh = json_decode('"\u210D"') . "&" . json_decode('"\u210D"') . "wt";
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleAuthorName()
     *
     * @return string
     */
    public function customModuleAuthorName(): string {

        return 'EW.Heinrich';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleVersion()
     *
     * @return string
     */
    public function customModuleVersion(): string {
        return '2.1.0.9';
    }

    /**
     * {@inheritDoc}
     * A URL that will provide the latest stable version of this module.
     *
     * @return string
     */
    public function customModuleLatestVersionUrl(): string {
        return 'https://github.com/huhwt/huhwt-wtlin/master/latest-version.txt';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\ModuleCustomInterface::customModuleSupportUrl()
     *
     * @return string
     */
    public function customModuleSupportUrl(): string {
        return 'https://github.com/huhwt/huhwt-wtlin/issues';
    }

    /**
     * Additional/updated translations.
     *
     * @param string $language
     *
     * @return array<string,string>
     */
    public function customTranslations(string $language): array
    {
        // no differentiation according to language variants
        $_language = substr($language, 0, 2);
        $ret = [];
        $languageFile = $this->resourcesFolder() . 'lang/' . $_language . '.po';
        if (file_exists($languageFile)) {
            $ret = (new Translation($languageFile))->asArray();
        }
        return $ret;
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::resourcesFolder()
     *
     * @return string
     */
    public function resourcesFolder(): string {
        return __DIR__ . DIRECTORY_SEPARATOR . 'resources' . DIRECTORY_SEPARATOR;
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::title()
     *
     * @return string
     */
    public function title(): string 
    {
        $title = I18N::translate('LINchart');
        return $this->huh . ' ' . $title;
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::description()
     *
     * @return string
     */
    public function description(): string 
    {
        return I18N::translate('Download Gedcom information to client-side for postprocessing in LINEAGE.');
    }

    /**
     * CSS class for the URL.
     *
     * @return string
     */
    /**
     * Raw content, to be added at the end of the <head> element.
     * Typically, this will be <link> and <meta> elements.
     *
     * @return string
     */
    public function headContent(): string
    {
        return '';
    }

    /**
     * Raw content, to be added at the end of the <body> element.
     * Typically, this will be <script> elements.
     * @return string
     */
    public function bodyContent(): string
    {
        return '';
    }

    /**
     * {@inheritDoc}
     * @see \Fisharebest\Webtrees\Module\AbstractModule::boot()
     */
    public function boot(): void 
    {
        $router_container = app(RouterContainer::class);
        assert($router_container instanceof RouterContainer);
        $router = $router_container->getMap();
        // echo(json_encode($router->getRoutes()));

        $router->attach('', '/tree/{tree}', static function (Map $router) {
            // $router->extras([
            //     'middleware' => [
            //         AuthManager::class,
            //     ],
            // ]);

            $router->get(LINaction::class, '/LINaction');
            });
        // Here is also a good place to register any views (templates) used by the module.
        // This command allows the module to use: view($this->name() . '::', 'fish')
        // to access the file ./resources/views/fish.phtml
        View::registerNamespace($this->name(), $this->resourcesFolder() . 'views/');
    }

    /**
     * hook for calling LINEAGE ...
     * it would be preferable to switch over to LINEAGE seemlesly, but by now 
     * the action is managed by some javascript and a href opening the LINEAGE-subsystem
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function getLINAction(ServerRequestInterface $request): ResponseInterface
    {
        $tree = $request->getAttribute('tree');
        assert($tree instanceof Tree);

        $params = (array) $request->getQueryParams();
        $actKey = $params['actKey'] ?? '';

        $title = I18N::translate('LINEAGE Launch');
        $label = I18N::translate('Key to retrieve data');

        // the path to LINEAGE-subsystem - pure javascript, no php
        $LINpath = e(asset('snip/'));
        $LINpath = str_replace("/public/snip/", "", $LINpath) . "/modules_v4/huhwt-wtlin/_LINchart_/index_DL.html";

        $LINdname = Session::get('VIZ_DSname');
        $LINdname = str_replace("VIZ", "LIN", $LINdname);
        $LINdname = str_replace("DATA", $tree->name(), $LINdname);
        Session::put('LIN_DSname', $LINdname);

        // we don't want to transfer gedcom directly - prepare url for AJAX call
        $urlAJAX = [];
        $urlAJAX['module'] = $this->name();
        $urlAJAX['action'] = 'Gedcom';
        $urlAJAX['actKey'] = $actKey;
        $urlAJAX['tree']   = $tree->name();
        // for assembling transfer-data we need tree
        Session::put('wt2LINtree', $tree->name());

        // we habe two slots of javascript
        $jsImp[] = $this->assetUrl('js/LINaction_DBman.js');
        $jsImp[] = $this->assetUrl('js/LINaction.js');

        // TODO : 'module' is hardcoded - how to get the name from foreign PHP-class 'ClippingsCartModuleEnhanced20'?
        $module_cce = '_huhwt-cce_';
        if (str_starts_with(Webtrees::VERSION, '2.0')) {
            $module_cce = '_huhwt-cce20_';
        }

        return $this->viewResponse($this->name() . '::' . 'LINaction', [
            'module_cce'     => $module_cce,
            'actKey'         => $actKey,
            'title'          => $title,
            'label'          => $label,
            'tree'           => $tree,
            'LINpath'        => $LINpath,
            'LINdname'       => $LINdname,
            'urlAJAX'        => $urlAJAX,
            'jsimp'          => $jsImp,
            'stylesheet'     => $this->assetUrl('css/cceLa.css'),
        ]);
    }

    /**
     * Transfer the Gedcom to the client side via AJAX-call
     *
     * @param string $route    this route ...
     * @param string $actKey    Key for access to session-stored gedcom
     * @param string $q    Key for access to session-stored gedcom
     * 
     * @return string
     */
    public function getGedcomAction(ServerRequestInterface $request): ResponseInterface
    {
        $params = (array) $request->getQueryParams();
        $actKey = $params['actKey'] ?? '';

        $treeName = Session::get('wt2LINtree');
        $tree  = $this->tree_service->all()->get($treeName);
        assert($tree instanceof Tree);

        $gedKey = Session::get($actKey);
        $theGedcom = Session::get($gedKey);
        $LINdname = Session::get('LIN_DSname');

        $arr_string = array();
        $decodedstring = json_decode($theGedcom);
        $arr_string["gedcom"] = $decodedstring->gedcom;
        $arr_string["dsname"] = $LINdname;

        $Txrefs = Session::get('wt2LINxrefsI');
        $arr_string = $this->getSoundex($tree, @$arr_string, $Txrefs);

        return response($arr_string);
    }

    function getSoundex($tree, $arr_string, $Txrefs)
    {
        $nam_xrefs = array();               // name and soundex-definitions for xref
        $sDM_items = array();               // names corresponding with soundex(DaitchMokotoff)-definition
        $sSTD_items = array();              // names corresponding with soundex(Russell)-definition
        $nam_list = array();                // names with frequency counter
        $nam_idx = array();                 // names with frequency count and corresponding soundex-definitions

        foreach ($Txrefs as $xref) {
            $individual = Registry::individualFactory()->make($xref, $tree);
            $indi_aname = $individual->getAllNames();
            $surname = $indi_aname[0]['surname'];
            $sstd = Soundex::russell($surname);
            $sdm = Soundex::daitchMokotoff($surname);
            $nam_xrefs[$xref] = implode('|',[$surname, $sstd, $sdm]);

            $f_surn = '|' . $surname;
            if( isset($sDM_items[$sdm]) ) {
                $sdm_names = $sDM_items[$sdm];
                if (strpos($sdm_names, $f_surn) === false) {
                    $sdm_names .= $f_surn;
                } 
            } else {
                $sdm_names = $f_surn;
            }
            $sDM_items[$sdm] = $sdm_names;

            if( isset($sSTD_items[$sstd]) ) {
                $sstd_names = $sSTD_items[$sstd];
                if (strpos($sstd_names, $f_surn) === false) {
                    $sstd_names .= $f_surn;
                } 
            } else {
                $sstd_names = $f_surn;
            }
            $sSTD_items[$sstd] = $sstd_names;

            if ( isset($nam_list[$surname]) ) {
                $nam_cnt = $nam_list[$surname];
            } else {
                $nam_cnt = 0;
            }
            $nam_cnt += 1;
            $nam_list[$surname] = $nam_cnt;

            if ( isset($nam_idx[$surname]) ) {
                $nam_vals = $nam_idx[$surname];
            } else {
                $nam_vals = [0, $sdm, $sstd];
            }
            $nam_cnt = $nam_vals[0];
            $nam_cnt += 1;
            $nam_vals[0] = $nam_cnt;
            $nam_idx[$surname] = $nam_vals;
        }
        arsort($nam_list, SORT_NUMERIC);


        // $this->dumpArray($nam_xrefs, 'records-names');
        $nam_string = json_encode($nam_xrefs);
        $arr_string["names"] = $nam_string;     
        $nam_string = json_encode($nam_list);
        $arr_string["names_list"] = $nam_string;
        $nam_string = json_encode($nam_idx);
        $arr_string["names_lidx"] = $nam_string;
        $nam_string = json_encode($sSTD_items);
        $arr_string["names_sSTD"] = $nam_string;
        $nam_string = json_encode($sDM_items);
        $arr_string["names_sDM"] = $nam_string;

        return $arr_string;
    }

    public function appName(): string
    {
        return $this->name;
    }
}