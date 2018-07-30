<?php

return array(
   'api/login' => 'api/login',
    
   'api/([a-z]+)' => 'api/entity/$1', 
   
   'api' => 'api/index',    //api dashboard
    
   '' => 'site/index'       //siteController
);
