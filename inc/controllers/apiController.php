<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of apiController
 *
 * @author Станислав
 */
require_once '/inc/components/FormData.php'; 

class apiController {
    public function actionIndex(){
        //load dashboard
        $this->headersInitial();
        
        
        $headers=getallheaders();
        if (!array_key_exists('ajax',$headers)){
            require_once '/templates/adminpanel/admin.html';  
            return true;
        } 
        
        
        
        $result=false;
        $result=  $this->checkIsUserValid();

        if ($result) {
            echo(api::getDashboardMainContentData());
        }else {
            echo($this->requestErrors('1'));
            return true;
        }
        return true;
    }
    
    private function headersInitial(){
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Allow-Methods:*");
        header("Access-Control-Allow-Headers:usl, usp, rowcount, rowpp, entity, entityid, ajax, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Allow-Methods, Access-Control-Request-Headers");
         
    }
    
    private function cleanInputs($data){
        $cleaned = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $cleaned[$k] = $this->cleanInputs($v);
            }
        } else {
            $cleaned = trim(strip_tags($data));
        }
        return $cleaned;
    }

    
    private function checkIsUserValid(){
        $headers=getallheaders();
        if (array_key_exists('usl',$headers) && array_key_exists('usp',$headers) ){
            $user=$headers['usl'];
            $pass=$headers['usp'];
            return  api::checkCredentialsIsValid($user, $pass);
        }
        return false;
    }
    
    
    public function actionEntity($parameters){
        $this->headersInitial();
        
        $method=$_SERVER['REQUEST_METHOD'];
        
        
        
        if ($method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $method = 'PUT';
            } else {
                throw new Exception("Unexpected method");
            }
        }
        
        
        $result=false;
        $result=  $this->checkIsUserValid();
            
            
        if ($result) {
            $responseObj=new stdClass();
            
            if ($method=="GET"){
                $page=1;
                $id='';
                $filter='';
                
                if(count($parameters)==0){
                    echo('{"error":"parametrs error"}');
                    return true;
                }
                if(count($parameters)>=2){
                    if (substr($parameters[1],0,5)=='page-'){
                        //it is request for dats for grid and the second parametr is pager
                        $page=(int) substr($parameters[1],5);  
                    }else{
                        //it is request for data for ONE entity item for Edit form
                        $id= (int)$parameters[1];
                    }
                                
                }
                
                $entity=$parameters[0];

                //check if user valid          
               
                $rowCount=api::getEntityDataRowCount($entity);
                header("rowcount:".$rowCount);
                
                $rowPP=api::getRowPerPage();
                header("rowpp:".$rowPP);
                
                echo(api::getEntityGridContentData($entity, $page, $id, $filter));
                return true;


            }else if ($method=="PUT"){
                //echo ("put");
                $datas = new \CMF\Component\FormData\FormData($_SERVER['CONTENT_TYPE'],file_get_contents('php://input'));
                $files=$datas->getFILES();
                $data=$datas->getPOST();
                
                
                $entity="";
                if ((array_key_exists('_entity',$data))&& (array_key_exists('_id',$data)) ){       
                    $entity=trim($data['_entity']);
                    $id=trim($data['_id']);
                }else{
                    echo($this->requestErrors('5'));
                    return true;
                }
                
                //save data
                $res=api::saveEntityData($data,$entity,$id,$files);
                if (!$res){
                    //error
                    echo($this->requestErrors('3'));
                    return true;
                }  
                
                //for ADD mode-----
                if ($id==0){
                    $id=$res;
                }
                //-----------------
                
                
                if (!api::saveEntityFiles($files,$entity,$id)){
                    //error
                    echo($this->requestErrors('4'));
                    return true;
                } 
                
                //empty object respose
                echo json_encode($responseObj, JSON_UNESCAPED_UNICODE);
               
                 
                return true;
            }else if ($method=="POST"){
                //echo 'post';
              
                
                return true;
                
            }else if ($method=="DELETE"){
               
                //get data from headers
                $headers=getallheaders();
                if (array_key_exists('entity',$headers) && array_key_exists('entityid',$headers) ){
                    $entity=$headers['entity'];
                    $id=$headers['entityid'];
                   
                }else{
                    echo($this->requestErrors('7'));
                    return true;
                }
                
                 if (!api::deleteEntityItem($entity,$id)){
                    //error
                    echo($this->requestErrors('6'));
                    return true;
                } 
                
                //empty object respose
                echo json_encode($responseObj, JSON_UNESCAPED_UNICODE);
                return true;

                
            }
            
        
         
        }else {
                
                echo($this->requestErrors('1'));
                return true;
            }
        
        echo($this->requestErrors('1'));
        return true;
    }
    
    
    private function requestErrors($code) {
        $status = array(  
            1 => 'User or password are not correct',
            2 => 'Internal error',
            3 => 'Internal error during saving data',
            4 => 'Internal error during saving files',
            5 => 'Internal error during keyfields extracting',
            6 => 'Internal error during deletting. You can not delete this item',
            7 => 'Internal error during deletting. Missing information what should be deleted',
        ); 
        return '{"error":"'.(($status[$code])?$status[$code]:$status[2]).'","code":"'.$code.'"}'; 
    }
    
    public function  actionLogin($parameters){
        header("Access-Control-Allow-Origin:*");
        
        
        if ($_POST ){     
            $user=$_POST['login'];
            $pass=$_POST['pass'];
            $result=false;
            $result=  api::checkCredentialsIsValid($user, $pass);
            
            
            if ($result) {         
                $email=$result['email'];
                $avatar=$result['image'];
                echo api::getSettingsJsonUpdated($email,$avatar);
                return true;
            }else {
                echo($this->requestErrors('1'));
                return true;
            }
        }
        echo($this->requestErrors('2'));
        return true;
    }
    
    
}
