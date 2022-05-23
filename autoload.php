<?php

namespace HuHwt\WebtreesMods\LINchart;

use Composer\Autoload\ClassLoader;

$loader = new ClassLoader();
$loader->addPsr4('HuHwt\\WebtreesMods\\LINchart\\', __DIR__ );
$loader->addPsr4('HuHwt\\WebtreesMods\\LINchart\\', __DIR__ . '/resources');
// $loader->addPsr4('HuHwt\\WebtreesMods\\Module\\LINchart\\', __DIR__ . '/Module');

$loader->register();
