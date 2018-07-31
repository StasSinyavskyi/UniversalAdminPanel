
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

 type  | Value
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
                    
9. **"parents"**    - (required if "type" is "d") It is object wich decribes parent table key fields.  
                    Properties: "tablename" - 
                                "keyfield"  - 
                                "titlefield"- 
10. **"items"**
