
## Universal administrative panel (UAP)  (version 1.0)

UAP easylly allows to add admin interface to your site. Wich can help to manage all site's data. 
For example: if your site is a internet shop you can add/delete new products, edit it description, upload product's pictures to the gallery and manage orders.

UAP implements MVC model.

UAC consists of two parts:

1. One-page client app (javascript)
2. Server side app which implements API interface (php)

-----------------------------------------------------------------

### File structure:
                    
File                                | Description
------------------------------------|------------------------
config/adminsetcatalog.json         | Main castomization file
dist/css/adminstyle.css             | Table of styles
dist/js/admin.js                    | Client script
inc/                                | Server side PHP script
inc/components/FormData.php         | FormData paser component 
inc/components/ImageManipulator.php | Image resize component
inc/config/routs.php                | UAP routes
inc/controllers/apiController.php   | Controller
inc/models/api.php                  | Model
templates/adminpanel/admin.html     | Viewer
uploads                             | Folder for image uploading

-----------------------------------------------------------------


### adminsetcatalog.json 



This strict structured json file decribes your dstabase structure and client-side user interface inside one "settings" object.

    "settings":{
        "entity1":{},
        "entity2":{},
        "entity3":{}
        }

**entity**  is a Child object which describes particular table in site database.

**entity** should be named the same as corresponding table 

**entity** consists of two hard-named arrays **"elements"**  and **"buttons"**  and one proprty **"title"**


    "entity1":{
        "elements":[],
        "buttons":[],
        "title":""
        }


**"elements"** is the array of objects and describes all entity's properties (table columns)

**"buttons"** is the array of objects and describes all entity's interface buttons (actions)

**"title"** is a name of entity (how it will be titled in user interface).



**"elements"** - has properties:

1. **"name"**       - (required) Table column name

2. **"title"**      - (required) How this column will be titled in user interface

3. **"isKey"**      - (not required) If "1"  tells that this field id key  ("isKey":"1")

4. **"type"**       - (required) Field interface type 

type   | Value
-------|---------------
     s | string, 
     n | numerous, 
     t | multiline text, 
     rb| radioButton, 
     i | single image,
     is| multi images,
     vs| multi videos,
     d | dependant on other table

5. **"read"**       - (required) Readonly field (0|1) (1 - readonly active)

6. **"showInGrid"** - (required) Tells if this fiel should be shown in interface grid (entity's list table)

7. **"gridWidth"**  - (required) Width in pixels  eg: "gridWidth":"80px"   

8. **"parentDependant"** - (required) (0|1|2)  Type of dependancy 
                    0 - none
                    1 - dependant on other table  (suitable only for type = d). 
                        To substitute some id-field with value from the corresponding table field
                    2 - offers list of possible dependant values for choose (suitable only for type = rb)
                        To substitute some id-field with value from the list
                    
9. **"parents"**    - (required if "type" is "d") It is the object wich decribes parent table key fields. In this case type "d" field Data 
                    will be substituted for Data from the parent table according to key field conjunction ("name" -> "keyfield")
                    Properties: "tablename" - parent table name (as in DB)
                                "keyfield"  - index key table field
                                "titlefield"- field (in parent table) is uded as showed data
                                
10. **"items"**     - (required if "type" is "rb") It is the array of objects which used as data list. In this case type "rb" field Data 
                    will be substituted for Data from the list according to key field conjunction ("name" -> "keyfield")
                    Each object in the array has two properties **"name"** and **"keyfield"**         
                    **"name"**      - list element title (how it appears to user to choose)           
                    **"keyfield"**  - data to store in database when this element is chosen
                    
11. **"attachment"**- (required if "type" is "is" or "vs") It is the object which describes table for Image (is) or video (vs) attachments
                    This object has several parameters:
                    **"tablename"** - name of table for stosing attachments (as in DB)
                    **"id"**        - index key field in the attachements table 
                    **"id_parent"** - index key field in the current entity table
                    **"parent_id"** - name of the field in the attachements table wich contain current entity ID (link to the entity key field) 
                    **"file_name"** - name of the field in the attachements table wich contain image|video fileneme (how they stored in "upload" folder) 
                    **"type"**      - content type (1|0) 0-image, 1-video
       
       
       
**"buttons"** is an array of object. Each object describes one action Button which appears in  entity's grid. Each object in the array has  properties:

1. **"name"**       - Button system name

2. **"title"**      - Title on the button

3. **"action"**     - This button action. (delete|edit) 

4. **"showInGrid"   - (0|1)  1-button will show in grid

5. **""gridWidth"   - Width in pixels  eg: "gridWidth":"80px"



**"title"** is a name of the entity (how it appears to user)



