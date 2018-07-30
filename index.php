<?php

//общие настройки
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Подключаем автозагрузчик классов из композера
//require_once __DIR__ . '/vendor/autoload.php';

session_start();//стартуем сессию
//подключение файлов к системе
define('ROOT', dirname(__FILE__));//home catalog
define('TMPL', ROOT.'/templates');//catalog for tmpl files
require_once (ROOT.'/inc/components/Autoload.php');
require_once (ROOT.'/inc/components/Router.php');
require_once (ROOT.'/inc/components/Db.php');
require_once ROOT.'/vendor/twig/twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register();


//вызов роутера

$router=new Router();
$router->run();