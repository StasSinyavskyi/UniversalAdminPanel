<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of api
 *
 * @author Станислав
 */

 // use ImageManipulator library
 // https://gist.github.com/philBrown/880506
require_once '/inc/components/ImageManipulator.php';

class api {
    // put your code here
    
    public static function getSettingsJson(){
        return file_get_contents('/config/adminsetcatalog.json');
    }

    public static function getRowPerPage(){
        return 20;
    }

    public static function deleteEntityItem($entity,$id){
        $json = self::getSettingsJson();
        $obj=json_decode($json); 
        $keyFieldName='';
        
        $currEntitySettings=$obj->settings->{trim($entity)}->elements;
        //serch for key field
        foreach($currEntitySettings as $key => $item) {
            if ((property_exists($item,'isKey'))&&($item->isKey=='1')){
                $keyFieldName=$item->name;
                break;
            }
        }
        if ($keyFieldName==''){
            return false;
        }
        
        $db = DB::getConnection();
        
        //check for dependants
        //if exhist and not empty -deny to delete
        
        $curSettings=$obj->settings;
        foreach($curSettings as $key => $item) {
            foreach($item->elements as $keyItem => $itemItem){
                if ($itemItem->type=='d'){
                    if ($itemItem->parents->tablename==trim($entity)){
                        //dependant exist
                        //check if its empty
                        $queryText='SELECT count('.$itemItem->name.') AS count FROM '.$key.' WHERE '.$itemItem->name.'=:id';
                        $result = $db->prepare($queryText);
                        $result->bindParam(':id',$id,PDO::PARAM_STR);
                        
                        if (!$result->execute()){
                            return false;
                        }
                        $result->setFetchMode(PDO::FETCH_ASSOC);

                        $row= $result->fetch();
                        if ($row['count']>0){
                            return false;
                        }
                    }
                }
            }
        }
        
        
        //delete attachments
        foreach($currEntitySettings as $key => $item){
            if (($item->type=='is')||($item->type=='vs')){
                //here we can enter the code to delete attached files itselfes.  But we don`t :) 
                //-----------
                $queryText='DELETE FROM '.$item->attachment->tablename.' WHERE '.$item->attachment->id_parent.'=:id ;';
                $result = $db->prepare($queryText);
                $result->bindParam(':id',$id,PDO::PARAM_STR);
                if (!$result->execute()) {
                    return false;
                }
                
                break;//delete all kind of attachments from the same table. not need to delete the other types
            }
        }
        
        //delete entity item itself
        $queryText='DELETE FROM '.$entity.' WHERE '.$keyFieldName.'=:id ;';
        $result = $db->prepare($queryText);
        $result->bindParam(':id',$id,PDO::PARAM_STR);
        if (!$result->execute()) {
            return false;
        }
        
        return true;
    }

    public static function saveEntityData($data,$entity,$id,$files){
        $json = self::getSettingsJson();
        
        $currDate=date("Y-m-d H:i:s");
        $obj=json_decode($json); 
        
        $currEntitySettings=$obj->settings->{trim($entity)};
        $keys="";
        $values="";
        $firsStep=0;
        $keyFieldName='';
        $params= array();
        foreach($currEntitySettings->elements as $key => $item) {
            if ((property_exists($item,'isKey'))&&($item->isKey=='1')){$keyFieldName=$item->name;}
            else{
                if ((array_key_exists($item->name,$data))&&($data[$item->name]!="")&&($item->read!="1")){

                    if ($firsStep==1){$keys=$keys.',';   $values=$values.',';}
                    
                    if ($id==0){
                        $keys=$keys.$item->name;
                        $values=$values.':'.$item->name;
                    }else{
                        $keys=$keys.$item->name.'=:'.$item->name;   
                    }
                    $params[':'.$item->name]=trim($data[$item->name]);
                    $firsStep=1;        
                }
                //check for file
                if (($item->type=='i')&&(array_key_exists($item->name,$files))&&(trim($files[$item->name]['name'])!="")){
                  
                    $filenN='img-'.$id.'-max';
                    $newFileName=self::prepareFile($files[$item->name],$id,$filenN);

                    if (!$newFileName){
                        return false;
                    }
                    if ($firsStep==1){$keys=$keys.',';  $values=$values.',';}
                    
                    if ($id==0){
                        $keys=$keys.$item->name;
                        $values=$values.':'.$item->name;  
                    }else{
                        $keys=$keys.$item->name.'=:'.$item->name;   
                    }
                    $params[':'.$item->name]=$newFileName;
                    
                    $firsStep=1; 
                    
                }
            }
        }
        
        if ($id==0){
            $keys=$keys.',change_date';
            $values=$values.',:change_date';
        }else{
            $keys=$keys.',change_date=:change_date';
        }
        $params[':change_date']=$currDate;
        
        $db = DB::getConnection();
        
        if ($id==0){
             $queryText='INSERT INTO '.$entity.' ('.$keys.') '
                .'VALUES ('.$values.')';
        }else{
            $queryText='UPDATE '.$entity.' SET '.$keys.' WHERE '.$keyFieldName.'='.$id;
        }
        
        $result=$db->prepare($queryText);
        $res=$result->execute($params);
        if ($id==0){
            if ($res){
                return $db->lastInsertId();}
            else {return $res;}
        }else{
            return $res;
        }
    }
    
    private static function prepareFile($file,$id,$fileName){
        
        $fileType=substr(stristr($file['type'], '/'),1);
       
        $fileNameFull=$file['tmp_name'];
        $validExtensions = array('jpg', 'jpeg', 'gif', 'png');
        
        if (!in_array($fileType, $validExtensions)) {
            echo("type not alowed ".$fileType);
            return false;
        }
        
        if (!file_exists($fileNameFull)){
            echo("file not exist ".$fileNameFull);
            return false;
        }
        
        $segments=explode("\\",$fileNameFull);
        $count=  count($segments);
        //print_r($segments);
        if ($count==0) {return false;}
        $fileNameRandom=$segments[$count-1];
        $fileName=$fileName.'-'.$fileNameRandom.'.'.$fileType;
       
        $destinationFile=ROOT.'/uploads/'.$fileName;
        copy($fileNameFull,$destinationFile);
        
        
        
        self::getExtraSizedImg($destinationFile,100,100);
        self::getExtraSizedImg($destinationFile,400,400);
        
        
        
        
        
        return $fileName;
        
    }

     private static function prepareVideo($file,$id,$fileName){
        
        $fileType=substr(stristr($file['type'], '/'),1);
       
        $fileNameFull=$file['tmp_name'];
        $validExtensions = array('ogg ', 'mpeg4', 'mp4', 'webm');
        
        if (!in_array($fileType, $validExtensions)) {
            echo("type not alowed ".$fileType);
            return false;
        }
        
        if (!file_exists($fileNameFull)){
            echo("file not exist ".$fileNameFull);
            return false;
        }
             
        $segments=explode("\\",$fileNameFull);
        $count=  count($segments);
       
        if ($count==0) {return false;}
        $fileNameRandom=$segments[$count-1];
        $fileName=$fileName.'-'.$fileNameRandom.'.'.$fileType;     
       
        $destinationFile=ROOT.'/uploads/'.$fileName;
        copy($fileNameFull,$destinationFile);
       
        return $fileName;
        
    }
    
    //make two more resized picture files
    //use ImageManipulator library
    //https://gist.github.com/philBrown/880506
    private static function getExtraSizedImg($destinationFile,$rezolutionX,$rezolutionY){
        $manipulator = new ImageManipulator($destinationFile);
        $width  = $manipulator->getWidth();
        $height = $manipulator->getHeight();
        
        $centreX = round($width / 2);
        $centreY = round($height / 2);
        // our dimensions will be 200x130
        if ($width > $height){
            $x1 = $centreX - $centreY; 
            $y1 = 0; 

            $x2 = $centreX + $centreY; 
            $y2 = $height; 
        }else{
            $x1 = 0; 
            $y1 = $centreY-$centreX; 

            $x2 = $width; 
            $y2 = $centreY+$centreX; 
        }
      
        // center cropping to 200x130
        $newImage = $manipulator->crop($x1, $y1, $x2, $y2);
        $newImage1 = $manipulator->resample($rezolutionX, $rezolutionY);
        if ($rezolutionX==$rezolutionY){
            $markerName=$rezolutionX."";
        }else{
            $markerName=$rezolutionX."x".$rezolutionY;
        }
        $manipulator->save(self::getFileName($destinationFile,$markerName));
    }

    private static function getFileName($name,$new){
       return str_replace('max',$new,$name);
    }
    
    public static function saveEntityFiles($files,$entity,$id){
        $json = self::getSettingsJson();
        
        //check for one image field
        $currDate=date("Y-m-d H:i:s");
        $obj=json_decode($json);       
        $currEntitySettings=$obj->settings->{trim($entity)};
        
        $db = DB::getConnection();
        $index=0;
        $indexVideo=0;
        
        foreach($currEntitySettings->elements as $key => $item){
            if (($item->type=='is')||($item->type=='vs')){
                //delete files which are not in $files
                $attachSettings=$item->attachment;
                $queryText='SELECT * FROM '.$attachSettings->tablename.' WHERE '.$attachSettings->id_parent.'=:id ;';
                $result = $db->prepare($queryText);
                $result->bindParam(':id',$id,PDO::PARAM_STR);
                $result->execute();
                $result->setFetchMode(PDO::FETCH_ASSOC);
                
                $forDelete=array();
                
                $filesIds=array();
                
                while($row=$result->fetch()){
                    $fileExist=0;
                    foreach ($files as $keyFile =>$itemFile){
                        $s=$item->name.'_';
                        $l=strlen($s);
                        if (substr($keyFile,0,$l)==$s){
                           $idFile= (int)trim(substr($keyFile,$l));
                           if ($idFile==$row[$attachSettings->id]){
                               $fileExist=1;
                               $filesIds[$keyFile]=$idFile;
                              
                               break;
                           }
                        }
                    }
                    if ($fileExist==0) {
                        $forDelete[]=$row[$attachSettings->id];
                    }                    
                }
                
                $queryText='';
                foreach ($forDelete as $keyFile =>$itemFile){
                    $queryText='DELETE FROM '.$attachSettings->tablename.' WHERE '.$attachSettings->id.'='.$itemFile.' AND type='.$attachSettings->type.' ;';
                    $result =  $db->query($queryText);                    
                }
                
                //adding or updating data
                foreach ($files as $keyFile =>$itemFile){
                    $s=$item->name.'_';
                    $l=strlen($s);
                    
                    if (substr($keyFile,0,$l)==$s){  
                        if ($itemFile['name']!=''){                     
                            if ($item->type=='is'){
                             
                                $filenN='img-'.$id.'-max';
                                $newFileName=self::prepareFile($itemFile,$id,$filenN);
                            }else{
                              
                                $filenN='video-'.$id;
                                $newFileName=self::prepareVideo($itemFile,$id,$filenN);
                            }
                           
                           
                            if (substr($keyFile,$l,3)=='new'){
                                //insert
                                $queryText='INSERT INTO '.$attachSettings->tablename.' ('.$attachSettings->id_parent.','.$attachSettings->file_name.',type,change_date) '
                                          .' VALUES (:id,:fileName,:type,:change_date);';
                                
                                $result = $db->prepare($queryText);
                                $result->bindParam(':id',$id,PDO::PARAM_STR);
                                $result->bindParam(':fileName',$newFileName,PDO::PARAM_STR);
                                $result->bindParam(':type',$attachSettings->type,PDO::PARAM_STR);
                                $result->bindParam(':change_date',$currDate,PDO::PARAM_STR);
                                
                                $res=$result->execute(); 
                                
                            }else{
                                //update
                                if (array_key_exists($keyFile,$filesIds)){
                                    $queryText='UPDATE '.$attachSettings->tablename.' SET '.$attachSettings->file_name.'=:fileName, change_date=:change_date  WHERE '.$attachSettings->id.'=:id ;';
                                   
                                    $result = $db->prepare($queryText);
                                    $result->bindParam(':fileName',$newFileName,PDO::PARAM_STR);
                                    $result->bindParam(':id',$filesIds[$keyFile],PDO::PARAM_STR);
                                    $result->bindParam(':change_date',$currDate,PDO::PARAM_STR);
                                    $result->execute();       
                                }
                            }
                        }
                    }
                }
    
                
            }
            
        }
        
        
        return TRUE;
    }

    public static function getSettingsJsonUpdated($email,$avatar){
        $json = self::getSettingsJson();
        
        
       
        //получим емейл и автатар пользователя и добавим к джейсону
        $addStr='"credentials":{"email":"'.$email.'", "avatar":"'.$avatar.'"}';
        
        $jsonFull=str_replace('"userCredentialsPlaceholder":{"1":"1"}',$addStr,$json);
       
        return $jsonFull;
    }
    
    public static function getEntityDataRowCount($entity,$filter=""){
        $json = self::getSettingsJson();
        $obj=json_decode($json); 
        
      
        $fieldName=$obj->settings->{$entity}->elements[0]->name;
        $db = DB::getConnection();
        $queryText= 'SELECT count('.$fieldName.') AS count FROM '.$entity;
        if ($filter!=''){
            $queryText=$queryText.' WHERE '.$filter;
        }
        $result =  $db->query($queryText);
        $result->setFetchMode(PDO::FETCH_ASSOC);

        $row= $result->fetch();
        return $row['count'];
    }

        public static function getEntityData($numbersGridPerPage,$offset,$entity,$item,$id="",$filter=""){
        
    
        $db = DB::getConnection();
        
        $queryText= 'SELECT ';
        $jointTables='';
        $firstStep=0;
        $attach = new stdClass();
        $keyField='';
        
        $virtual = new stdClass();//for ADD mode
        
        $id=(string)$id;
       
        
        
        foreach($item->elements as $element) {
            
            if (property_exists($element,'isKey')){
                if ($element->isKey=='1'){
                    $keyField=$element->name;
                }
            }
            if (($element->showInGrid==1)||($id!='')){
                
                if (($element->type!='is')&&($element->type!='vs')){
                    if ($firstStep==1){ $queryText=$queryText.', ';}
                    if ($element->parentDependant==1){
                        $queryText=$queryText.' '.$element->parents->tablename.'.'.$element->parents->titlefield.' AS '.$element->name.'par, ';
                        $jointTables=$jointTables.'LEFT JOIN '.$element->parents->tablename.' ON '.$entity.'.'.$element->name.' = '.$element->parents->tablename.'.'.$element->parents->keyfield.' ';
                    }else{
                         
                    } 
                    $queryText=$queryText.$entity.'.'.$element->name.' AS '.$element->name.' ';
                    
                    $firstStep=1;
                    
                    //for adding mode
                    $virtual->{$element->name}="";
                }
                //echo $element->type." ";
                //prepare attachments instructions
                if (in_array($element->type, array('d', 'is', 'vs'))){
                   
                   $attach->{$element->name}=($element->type=='d')? $element->parents:$element->attachment;
                   $attach->{$element->name}->typeOrig=$element->type;
                   
                   echo" ";
                }  
                
               
            }
            
            
        }
       
        
        
        $queryText=$queryText.'FROM '.$entity.' ';
        
        if ($jointTables!='') {
            $queryText=$queryText.$jointTables.' ';
        }
        
        if ($keyField==''&& $id!=''){return false;}//unknown keyfield. Can not select by ID
       
        
        if (($id!='')||($filter!='')){
           
            $wereText=" WHERE ";
            if ($id!=''){
               $wereText=$wereText.$keyField.'='.$id.' '; 
               if ($filter!=''){$wereText=$wereText.'AND ';}
            }
            if ($filter!=''){
                
            }
            $queryText=$queryText.$wereText.' ';
           
        }
        $queryText=$queryText.' ORDER BY '.$entity.'.change_date DESC ';
        $queryText=$queryText.'LIMIT '.$numbersGridPerPage.' OFFSET '.$offset.';';
        
        
       
        $result=$db->prepare($queryText);
        $result->execute();
        if (!$result){
            return '["error":'.$entity.']';
        }
        
        $data = array();
        
        
        if ($id=='0'){
            $virtualResponseData=array();
            
            $virtual->attachdata=self::getEntityItemAttachments($attach, $virtual,$id);
            $virtualResponseData[]=$virtual;
            return json_encode($virtualResponseData,JSON_UNESCAPED_UNICODE);
        }
        
       
        while ($row=$result->fetch(PDO::FETCH_ASSOC)) {
            
            $row['attachdata']=self::getEntityItemAttachments($attach, $row,$id);
            //convert img
            $data[] = $row;
        }
        
        return json_encode($data,JSON_UNESCAPED_UNICODE);
        
    }

    
    private static function getEntityItemAttachments($attach,$data,$id){
        $queryText="";
        $obj = new stdClass();
        
        foreach($attach as $key => $row) { 
            if ($row->typeOrig=='d'){
                $queryText= 'SELECT '.$row->keyfield.', '.$row->titlefield.' FROM '.$row->tablename.' ;';}
            else if ($id=='0') { 
                $obj->{$key}=array();
                return $obj;
                
                }    
            else if (($row->typeOrig=='is') || ($row->typeOrig=='vs')) {
                $queryText= 'SELECT '.$row->id.', '.$row->file_name.' FROM '.$row->tablename.' WHERE '.$row->id_parent.'='.$data[$row->parent_id].' AND type='.$row->type.';';    
            }      
        
            $db = DB::getConnection();
            $result=$db->prepare($queryText);
            $result->execute();

            $resultData = array();
            while ($row=$result->fetch(PDO::FETCH_ASSOC)) {
              
                $resultData[] = $row;
            } 
            $obj->{$key}=$resultData;
        }
        
        
        return $obj;
    }

    public static function getEntityGridContentData($entity,$page,$id,$filter){
        $resJSON="{";
        $numbersGridPerPage= self::getRowPerPage();//----------------NUMBER PER PAGE HERE----------------------------
        
        $offset=$numbersGridPerPage*($page-1);
        
        $json = self::getSettingsJson();
        $obj=json_decode($json); 
        
        $key=$entity;
        $item=$obj->settings->$entity;
        
        $temp='"'.$key.'":'.self::getEntityData($numbersGridPerPage, $offset, $key, $item, $id, $filter).'';
         
        $resJSON=$resJSON.$temp;
        $resJSON=$resJSON.'}';
        return $resJSON;
     }
    
    public static function getDashboardMainContentData(){
        $resJSON="{";
        $numbersGridPerPage=5;
        $page=1;
        $offset=$numbersGridPerPage*($page-1);
        
        $firstStep=0;
        
        $json = self::getSettingsJson();
        $obj=json_decode($json);
        
        
        foreach($obj->settings as $key => $item) {
            $temp='';
            if ($firstStep==1){$temp=$temp.', ';}
            
            $temp=$temp.'"'.$key.'":'.self::getEntityData($numbersGridPerPage, $offset, $key, $item).'';
           
            $resJSON=$resJSON.$temp;
            $firstStep=1;
        }
        $resJSON=$resJSON.'}';
        return $resJSON;
    }

    public static function checkCredentialsIsValid($user,$pass){
        $encrypted=md5($pass);
        
        $db = DB::getConnection();
        
        $queryText= "SELECT * FROM users WHERE users.name = :name AND users.password= :pass ";
        $result = $db->prepare($queryText);
        $result->bindParam(':name',$user,PDO::PARAM_STR);
        $result->bindParam(':pass',$pass,PDO::PARAM_STR);
        $result->execute();
        $users = $result->fetch();
      
       return $users;
    }
    
       
}
