var statusLogin = false; //true-login, false-not
var globalSettings = ""; //object with settings
var numberTextareasFoReplaceToCkEditor = 0;
var numberNewImages = 0;
var numberNewvideos = 0;
var rowCount = 0;
var rowPerPage = 0;

var HostName = "booknew";

var pagesOnPage = 5; //the whole number of pages on page

//underscore settings for change to  {{...}}
_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

//**** show login panel
function showlogin() {
    var templ = document.getElementById("templ-login-ajax").innerHTML;
    var compiled = _.template(templ);
    document.getElementById("content").innerHTML = compiled();
    idh("current-page-info", " Login");
}

//**** check if user valid
function loginAjax() {
    var serial = new FormData(document.forms.ajaxForm);
    ajax_post("http://" + HostName + "/api/login/", serial, function(data) {
        if (!checkForErrors(data)) {
            storeGlobalSettingsLocalStorage(data);
            Hash.set("");
        }
    });
}

//**** load dashboard data and show it
function dashboardAjax() {
    serial = "";
    ajax_get("http://" + HostName + "/api/", serial, function(data) {
        if (!checkForErrors(data)) {
            showDashboardMenue();
            changeStatusLine(" Dashboard");
            loadDashboardContent(data);
        }
    });
}

//**** load particular entity grid data and show it in grid
function getEntityAjax(entity, page = "1") {
    serial = "";
    pageString = "";
    if (page > 1) {
        pageString = "/page-" + page;
    }

    //filter check
    if (window.sessionStorage["entityFilterEnabled"] == "1") {
        //filter enabled
        // try
        //serial=new FormData(document.forms['filter-form-'+entity]);
        //    serial="";
        //catch (err){alert('filterform not found');}
    }

    ajax_get(
        "http://" + HostName + "/api/" + entity + pageString,
        serial,
        function(data) {
            if (!checkForErrors(data)) {
                showDashboardMenue();
                changeStatusLine(globalSettings[entity].title);
                loadDashboardContent(data);
                loadPagination(data, page, entity);
            }
        }
    );
}

//**** load particular entity item data and show it in grid for EDIT
function getEntityDataForEditAjax(entity, entityID) {
    serial = "";
    ajax_get(
        "http://" + HostName + "/api/" + entity + "/" + entityID,
        serial,
        function(data) {
            if (!checkForErrors(data)) {
                showDashboardMenue();
                changeStatusLine(
                    globalSettings[entity].title + " ID: " + entityID
                );
                showEntityEditAddForm(entity, entityID, data);
            }
        }
    );
}

//**** load particular entity item data and show it in grid for ADD (id=0  for empty entyty)
function getEntityDataForAddAjax(entity) {
    serial = "";
    ajax_get("http://" + HostName + "/api/" + entity + "/0", serial, function(
        data
    ) {
        if (!checkForErrors(data)) {
            showDashboardMenue();
            changeStatusLine(globalSettings[entity].title + " Adding new ");
            showEntityEditAddForm(entity, "0", data);
        }
    });
}

function entityEditAjax(entity, entityID) {
    var serial = new FormData(document.forms.entityEditAjaxForm);

    ajax_put(
        "http://" + HostName + "/api/" + entity + "/" + entityID,
        serial,
        function(data) {
            if (!checkForErrors(data)) {
                alert("Data saved succesfully");
                Hash.set("");
            }
        }
    );
}

function entityDeleteAjax(entity, entityID) {
    ajax_delete(
        "http://" + HostName + "/api/" + entity + "/" + entityID,
        entity,
        entityID,
        function(data) {
            if (!checkForErrors(data)) {
                alert("Data deleted succesfully");
                hashChange();
            }
        }
    );
}

function changeStatusLine(statusText) {
    idh("current-page-info", statusText);
}

function storeGlobalSettingsLocalStorage(data) {
    globalSettings = data.settings;
    statusLogin = true;

    window.sessionStorage["globalSettings"] = JSON.stringify(globalSettings);
    window.sessionStorage["statusLogin"] = statusLogin;

    window.sessionStorage["useremail"] = data.credentials.email;
    window.sessionStorage["useravatar"] = data.credentials.avatar;

    changeUserLoginStatus();
}

function restoreGlobalSettingsLocalStorage() {
    statusLogin = window.sessionStorage["statusLogin"];
    // alert(statusLogin);
    changeUserLoginStatus();
    try {
        globalSettings = JSON.parse(window.sessionStorage["globalSettings"]);
    } catch (err) {}

    hashChange();
}

//**** show / hide DOOM objects according to Login status
function changeUserLoginStatus() {
    if (statusLogin) {
        //remember credentials login-form-name
        objname = id("login-form-name");
        objpass = id("login-form-pass");
        try {
            window.sessionStorage["username"] = objname.value;
            window.sessionStorage["userpass"] = objpass.value;
            objname.value = "";
            objpass.value = "";
        } catch (err) {}

        id("header-email").setAttribute(
            "data-title",
            window.sessionStorage["useremail"]
        );

        //install avatar
        (img = new Image()),
            (img.onload = function() {
                obj = id("ava");
                obj.src = img.src;
            });

        img.src = "/uploads/" + window.sessionStorage["useravatar"];

        document.getElementById("sign-in").style.display = "none";
        document.getElementById("sign-out").style.display = "block";
        //alert("d");
    } else {
        document.getElementById("sign-in").style.display = "block";
        document.getElementById("sign-out").style.display = "none";

        window.sessionStorage["userpass"] = "";
        window.sessionStorage["globalSettings"] = "";
        window.sessionStorage["statusLogin"] = "";

        window.sessionStorage["useremail"] = "";
        window.sessionStorage["useravatar"] = "";

        window.sessionStorage["entityFilterEnabled"] = "";

        clearContent();
        idh("menu-left", "");
        changeStatusLine(" Not signed in");
        Hash.set("");
    }
}

//**** getting user login from localstorage
function getUsl() {
    return window.sessionStorage["username"];
}

//**** getting user password from localstorage
function getUsp() {
    return window.sessionStorage["userpass"];
}

function id(i) {
    return document.getElementById(i);
}

function idh(i, c) {
    document.getElementById(i).innerHTML = c;
}

//**** error processing
function checkForErrors(data) {
    if (data.hasOwnProperty("error")) {
        var hash = Hash.get();
        if (data.code != "1") {
            alert(data.code + " " + data.error);
        }

        //user/pass not found
        if (data.code == "1") {
            signOut();
        }

        return true;
    }
    return false;
}

function signOut() {
    Hash.set("");
    statusLogin = false;
    changeUserLoginStatus();
    clearContent();
}

function clearContent() {
    id("content").innerHTML = "content here";
}

function addClass(o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    if (re.test(o.className)) return;
    o.className = (o.className + " " + c)
        .replace(/\s+/g, " ")
        .replace(/(^ | $)/g, "");
}

function removeClass(o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    o.className = o.className
        .replace(re, "$1")
        .replace(/\s+/g, " ")
        .replace(/(^ | $)/g, "");
}

//**** show Dashboard page
//   function showDashboard(){
//   alert("hash.length");
//       showDashboardMenue();
//       loadDashboardContent();
//   }

//**** pagination
function loadPagination(data, page, entity) {
    var cont = "";
    wholePages = parseInt(rowCount / rowPerPage) + 1;
    half = parseInt(pagesOnPage / 2) + 1;

    if (page < half) {
        position = page;
        firstPageNumber = 1;
    } else if (page >= half && page <= wholePages - (pagesOnPage - half)) {
        position = half;
        firstPageNumber = page - half + 1;
    } else {
        position = pagesOnPage - (wholePages - page);
        firstPageNumber = wholePages - pagesOnPage + 1;
    }

    if (wholePages >= pagesOnPage) {
        currentPageCount = pagesOnPage;
    } else {
        currentPageCount = wholePages;
    }

    cont += '<div class="pagination"> <ul id="pagination-digg">';
    cont +=
        "<li " +
        (position > 1
            ? 'class="previous" > <span onclick="Hash.set' +
              "('" +
              entity +
              "/" +
              (page - 1) +
              "')" +
              '"> « Previous </span>'
            : 'class="previous-off" > « Previous ');
    cont += "</li>";

    z = 1;
    for (
        var i = firstPageNumber;
        i <= firstPageNumber + currentPageCount - 1;
        i++
    ) {
        cont +=
            "<li " +
            (z == position
                ? ' class="active">' + i
                : ' class="page-number"><span onclick="Hash.set' +
                  "('" +
                  entity +
                  "/" +
                  i +
                  "')" +
                  '">' +
                  i +
                  "</span>");
        cont += "</li>";
        z++;
    }

    cont +=
        "<li " +
        (position < pagesOnPage
            ? 'class="next"> <span onclick="Hash.set' +
              "('" +
              entity +
              "/" +
              (+page + 1) +
              "')" +
              '"> next » </span>'
            : 'class="next-off" > next »');
    cont += "</ul></div>";
    cont += "</li>";

    id("content").innerHTML += cont;
}

//**** show Dashboard page left menue
function showDashboardMenue() {
    //fullfill dashboard menue

    var dl = "";
    dl += "<ul>";
    for (var i in globalSettings) {
        if (!globalSettings.hasOwnProperty(i)) continue;
        dl +=
            '<li onclick="Hash.set(' +
            "'" +
            i +
            "'" +
            ');">' +
            globalSettings[i].title +
            "</li>";
    }

    dl += "</ul>";

    document.getElementById("menu-left").innerHTML = dl;
 }

//**** show Dashboard page main content
function loadDashboardContent(data) {
    var contful = "";
    for (var i in globalSettings) {
        if (!globalSettings.hasOwnProperty(i)) continue;
        dataLenght = 0;
        try {
            dataLenght = data[i].length;
        } catch (err) {}

        if (dataLenght > 0) {
            contful = contful + getEntityContent(i, data, true) + "<br>";
        }
    }
    idh("content", contful);
}

// function loadEntityContent(data){
//     var contful="";

//     contful=contful+ getEntityContent(i, data, false)+"<br>";
//     idh("content",contful);
// }

function getEntityContent(entityName, data, isDash = false) {
    var contful = "";
    var cont = "";
    entityData = data[entityName];

    //create table title and add buttons
    cont +=
        '<div class="table-title "><span>' +
        globalSettings[entityName].title +
        "</span> " +
        getButton("Add new", "Hash.set('" + entityName + "/add');", "add") +
        getButton(
            "Filter",
            "showFilter('" + "filter-" + entityName + "',this);",
            "filter"
        ) +
        "</div>";

    //add filter section
    var filterContent = '<form name="filter-form-' + entityName + '">';

    filterContent += "<table>";
    //cont +='<table>';
    for (var settingsItem in globalSettings[entityName].elements) {
        if (!globalSettings[entityName].elements.hasOwnProperty(settingsItem))
            continue;
        var settingsString = globalSettings[entityName].elements[settingsItem];
        var filterItemContent = "";

        if (settingsString["type"] == "n") {
            if (settingsString["filterExclude"] == "1") {
                continue;
            }

            filterItemContent +=
                "<td><span>" +
                settingsString["title"] +
                ' <u>From:</u></span></td><td><input type="number" name="filter-' +
                entityName +
                "-" +
                settingsString["name"] +
                "-from" +
                '" /></td> <td><span> <u>To:</u></span></td><td><input type="number" name="filter-' +
                entityName +
                "-" +
                settingsString["name"] +
                "-to" +
                '" /></td>';

            filterContent += getInTr("filter-item-wrap", "", filterItemContent);
        } else if (settingsString["type"] == "d") {
            if (settingsString["filterExclude"] == "1") {
                continue;
            }
            filterItemContent +=
                "<td><span>" + settingsString["title"] + ": </span></td>";
            filterItemContent +=
                '<td><select name="filter-' +
                entityName +
                "-" +
                settingsString.name +
                '" size="1"> ';

            // entering Options
            var optionString = entityData[0].attachdata[settingsString.name];
            for (var option in optionString) {
                if (!optionString.hasOwnProperty(option)) continue;
                filterItemContent +=
                    '<option value="' +
                    optionString[option].id_category +
                    '">' +
                    optionString[option].title +
                    "</option>";
            }

            filterItemContent += "</select></td>";

            filterContent += getInTr("filter-item-wrap", "", filterItemContent);
        } else if (settingsString["type"] == "rb") {
            if (settingsString["filterExclude"] == "1") {
                continue;
            }
            filterItemContent +=
                "<td><span>" + settingsString["title"] + ": </span></td>";
            filterItemContent +=
                '<td><select name="filter-' +
                entityName +
                "-" +
                settingsString.name +
                '" size="1"> ';
            // entering Options
            radioString = settingsString.items;
            for (var radio in radioString) {
                if (!radioString.hasOwnProperty(radio)) continue;
                filterItemContent +=
                    '<option value="' +
                    radioString[radio].keyfield +
                    '">' +
                    radioString[radio].name +
                    "</option>";
            }
            filterItemContent += "</select></td>";

            filterContent += getInTr("filter-item-wrap", "", filterItemContent);
        }
    }
    //submit button
    filterContent +=
        "<td></td><td>" +
        getButton("Submit", "filterApply('" + entityName + "');", "submit") +
        "</td>";

    filterContent += "</table>";

    filterContent += "</form>";

    cont += getInDiv("filter-wrap", "filter-" + entityName, filterContent);

    //create TABLE-------------------------------
    //create titles line
    cont += '<table class="pma_table "><thead><tr>';
    entity = globalSettings[entityName].elements;
    for (var j in entity) {
        if (!entity.hasOwnProperty(j)) continue;
        if (entity[j].showInGrid == "1") {
            cont +=
                '<th class="draggable" width="' +
                entity[j].gridWidth +
                '"><span>' +
                entity[j].title +
                "</span></th>";
        }
    }

    //add buttons titles
    entity = globalSettings[entityName].buttons;
    for (var j in entity) {
        if (!entity.hasOwnProperty(j)) continue;
        if (entity[j].showInGrid == "1") {
            cont +=
                '<th class="button-title" width="' +
                entity[j].gridWidth +
                '"><span>' +
                entity[j].title +
                "</span></th>";
        }
    }

    cont += "</thead>";

    //create data lines
    cont += "<tbody>";

    var ind = 0;

    for (var row in entityData) {
        if (!entityData.hasOwnProperty(row)) continue;
        if (ind % 2 == 0) {
            clasString = "even";
        } else {
            clasString = "odd";
        }
        cont += '<tr class="' + clasString + '">';

        keyNumber = "";

        for (var settingsItem in globalSettings[entityName].elements) {
            if (!globalSettings[entityName].elements.hasOwnProperty(settingsItem)) continue;
            settingsString = globalSettings[entityName].elements[settingsItem];

            if (settingsString["isKey"] == "1") {
                keyNumber = entityData[row][settingsString.name];
            }

            if (settingsString.showInGrid == "0") {
                continue;
            }

            valueforReplace = "";

            if (settingsString.parentDependant == "2") {
                for (var itm in settingsString.items) {
                    if (!settingsString.items.hasOwnProperty(itm)) continue;
                    if (
                        settingsString.items[itm].keyfield ==
                        entityData[row][settingsString.name]
                    ) {
                        valueforReplace = settingsString.items[itm].name;
                        break;
                    } else {
                        valueforReplace = entityData[row][settingsString.name];
                    }
                }
             } else if (settingsString.parentDependant == "1") {
                valueforReplace = entityData[row][settingsString.name + "par"];
            } else {
                valueforReplace = entityData[row][settingsString.name];
            }

            cont += "<td ><span>" + valueforReplace + "</span></td>";
        }

        //add buttons
        for (var settingsButton in globalSettings[entityName].buttons) {
            if (!globalSettings[entityName].buttons.hasOwnProperty(settingsButton)) continue;
            if (
                globalSettings[entityName].buttons[settingsButton].showInGrid ==
                "0"
            ) {
                continue;
            }
            actionString = "";
            switch (globalSettings[entityName].buttons[settingsButton].action) {
                case "delete":
                    actionString =
                        "itemDelete('" + entityName + "','" + keyNumber + "')";
                    break;
                case "edit":
                    actionString =
                        "itemEdit('" + entityName + "','" + keyNumber + "')";
                    break;
                case "close":
                    actionString =
                        "itemClose('" + entityName + "','" + keyNumber + "')";
                    break;
            }

            cont +=
                '<td class="button"><span onclick="' +
                actionString +
                '">' +
                globalSettings[entityName].buttons[settingsButton].title +
                "</span></td>";
        }

        cont += "</tr>";
        ind++;
    }

    cont += "</tbody></table>";
    // return cont;

    return cont;
}

//**** create edit or add form
function showEntityEditAddForm(entity, entityID, data) {
    var cont =
        '<div class="edit-title"> Entity edit <span id="edit-title-not-saved"> * </span></div> ';
    var entityData = data[entity];

    numberTextareasFoReplaceToCkEditor = 0;

    cont +=
        ' <form action="#" name="entityEditAjaxForm" id="edit-form" method="put" entity="' +
        entity +
        '" entityID="' +
        entityID +
        '" enctype="multipart/form-data" onchange="changeStatusEditFormNotSavedToOn();" > ';

    //add two system inputs
    cont +=
        '<input type="text" name="_id" value="' +
        entityID +
        '" style="display:none">';
    cont +=
        '<input type="text" name="_entity" value="' +
        entity +
        '" style="display:none">';

    for (var settingsItem in globalSettings[entity].elements) {
        if (!globalSettings[entity].elements.hasOwnProperty(settingsItem)) continue;
        settingsString = globalSettings[entity].elements[settingsItem];
        try {
            cont += window["getEntityElementType_" + settingsString.type](
                settingsString,
                entityData
            );
        } catch (err) {
            //alert("probably unsupported entity element Type "+settingsString.type);
        }
    }

    cont +=
        '<input type="submit" name="submit" id="edit-form-submit-button" value="Save data"  />';
    cont += " </form>";

    idh("content", cont);

    var fm = id("edit-form");
    fm.addEventListener("submit", function(e) {
        e.preventDefault();

        editorReplaceToTextarea();
        entityEditAjax(
            e.target.getAttribute("entity"),
            e.target.getAttribute("entityID")
        );
    });

    textAreaReplaceToEditor();
}

function getFormatedEntityElement(title, value) {
    return (
        '<div class="edit-item-container"><div class="edit-item-title">' +
        title +
        '</div> <div class="edit-item-content">' +
        value +
        " </div></div>"
    );
}

function getEntityElementType_s(settingsString, entityData) {
    var title = "";
    var value = "";

    title = settingsString.title; 
    value =
        '<input type="text" name="' +
        settingsString.name +
        '" value="' +
        entityData[0][settingsString.name] +
        '" ' +
        (settingsString.read == 1 ? "disabled" : "") +
        ">";
    return getFormatedEntityElement(title, value);
}

function getEntityElementType_n(settingsString, entityData) {
    var title = "";
    var value = "";

    title = settingsString.title; 
    value =
        '<input type="number" name="' +
        settingsString.name +
        '" value="' +
        entityData[0][settingsString.name] +
        '" ' +
        (settingsString.read == 1 ? "disabled" : "") +
        ">";
    return getFormatedEntityElement(title, value);
}

function getEntityElementType_d(settingsString, entityData) {
    var title = "";
    var value = "";

    title = settingsString.title;
    value =
        '<select name="' +
        settingsString.name +
        '" size="1" ' +
        (settingsString.read == 1 ? "disabled" : "") +
        "> ";

    // entering Options
    checkedOption = entityData[0][settingsString.name]; //
    optionString = entityData[0].attachdata[settingsString.name];
    if (settingsString.read == 1) {
        value +=
            '<option value="' +
            checkedOption +
            '" selected>' +
            entityData[0][settingsString.name + "par"] +
            "</option>";
    } else {
        for (var option in optionString) {
            if (!optionString.hasOwnProperty(option)) continue;
            value +=
                '<option value="' +
                optionString[option].id_category +
                '" ' +
                (checkedOption == optionString[option].id_category
                    ? "selected"
                    : "") +
                ">" +
                optionString[option].title +
                "</option>";
        }
    }
    value += "</select>";
    return getFormatedEntityElement(title, value);
}

function getEntityElementType_t(settingsString, entityData) {
    var title = "";
    var value = "";

    numberTextareasFoReplaceToCkEditor++;

    title = settingsString.title;
    value =
        '<textarea  name="' +
        settingsString.name +
        '" id="textareaForEditor' +
        numberTextareasFoReplaceToCkEditor +
        '" ' +
        (settingsString.read == 1 ? "disabled" : "") +
        ">" +
        entityData[0][settingsString.name] +
        "</textarea> ";

    return getFormatedEntityElement(title, value);
}

function getEntityElementType_rb(settingsString, entityData) {
    var title = "";
    var value = "";

    title = settingsString.title;

    // entering Options
    checkedRadio = entityData[0][settingsString.name]; //checked
    radioString = settingsString.items;
    for (var radio in radioString) {
        if (!radioString.hasOwnProperty(radio)) continue;
        value +=
            '<input type="radio" name="' +
            settingsString.name +
            '" ' +
            (settingsString.read == 1 ? "disabled" : "") +
            ' value="' +
            radioString[radio].keyfield +
            '"' +
            (checkedRadio == radioString[radio].keyfield ? "checked" : "") +
            ">" +
            radioString[radio].name +
            "<br>";
    }

    return getFormatedEntityElement(title, value);
}

function getEntityElementType_i(settingsString, entityData) {
    var title = "";
    var value = "";
    var imgSrc = entityData[0][settingsString.name];
    var name = settingsString.name;
    var read = settingsString.read;

    title = settingsString.title;

    value += getFormEditOneImageTempl(name, imgSrc, read, "-1");

    return getFormatedEntityElement(title, value);
}

function getEntityElementType_is(settingsString, entityData) {
    var value = "";
    var read = settingsString.read;
    var title = settingsString.title;
    var name = "";
    var imgSrc = "";
    var imgId = "";

    imagesList = entityData[0].attachdata[settingsString.name];
    for (var image in imagesList) {
        if (!imagesList.hasOwnProperty(image)) continue;
        name =
            settingsString.name +
            "_" +
            imagesList[image][settingsString.attachment.id];
        imgSrc = imagesList[image][settingsString.attachment.file_name];

        value += getFormEditOneImageTempl(name, imgSrc, read);
    }

    //add empty dif foe adding new image
    numberNewImages = 1;
    value += getFormEditOneImageTempl(
        settingsString.name + "_new_" + numberNewImages,
        "",
        read,
        numberNewImages,
        settingsString.name
    );

    //add marker-div as the end of list pointer
    value += '<div id="end_marker_' + settingsString.name + '"></div>';

    return getFormatedEntityElement(title, value);
}

function getFormEditOneImageTempl(
    name,
    imgSrc,
    read,
    newImg = "",
    entityName = ""
) {
    var value = "";

    value +=
        '<div class="edit-item-img-container" id="mark-' +
        name +
        '"><span id="edit-item-img-title-' +
        name +
        '">' +
        imgSrc +
        '</span><br><div id="edit-item-img-' +
        name +
        '"><img src="/uploads/' +
        imgSrc +
        '" class="edit-item-img" width=200 ></div><br>';
    value +=
        '<input type="file" name="' +
        name +
        '" value="111" id="' +
        name +
        '" ' +
        (read == 1 ? "disabled" : "") +
        ' newImg="' +
        newImg +
        '" entityName="' +
        entityName +
        '" onchange="handleFileSelect(this);"><br><br>';
    value += getButton(
        "Clear",
        "clearImgFormInput('" + name + "','" + newImg + "');",
        "clear"
    );
    value += "</div>";

    return value;
}

function getEntityElementType_vs(settingsString, entityData) {
    var value = "";
    var read = settingsString.read;
    var title = settingsString.title;
    var name = "";
    var videoSrc = "";
    var videoId = "";

    videoList = entityData[0].attachdata[settingsString.name];
    for (var video in videoList) {
        if (!videoList.hasOwnProperty(video)) continue;
        name =
            settingsString.name +
            "_" +
            videoList[video][settingsString.attachment.id];
        videoSrc = videoList[video][settingsString.attachment.file_name];

        value += getFormEditOnevideoTempl(name, videoSrc, read);
    }

    //add empty dif foe adding new image
    numberNewVideos = 1;
    value += getFormEditOnevideoTempl(
        settingsString.name + "_new_" + numberNewVideos,
        "",
        read,
        numberNewVideos,
        settingsString.name
    );

    //add marker-div as the end of list pointer
    value += '<div id="end_marker_' + settingsString.name + '"></div>';

    return getFormatedEntityElement(title, value);
}

function getFormEditOnevideoTempl(
    name,
    videoSrc,
    read,
    newvideo = "",
    entityName = ""
) {
    var value = "";

    value +=
        '<div class="edit-item-img-container" id="mark-' +
        name +
        '"><span id="edit-item-img-title-' +
        name +
        '">' +
        videoSrc +
        '</span><br><div id="edit-item-img-' +
        name +
        '"><video src="/uploads/' +
        videoSrc +
        '" class="edit-item-img" width=200 controls="controls" </video> </div><br>';
    value +=
        '<input type="file" name="' +
        name +
        '" id="' +
        name +
        '" ' +
        (read == 1 ? "disabled" : "") +
        ' newImg="' +
        newvideo +
        '" entityName="' +
        entityName +
        '" onchange="handleVideoSelect(this);"><br><br>';
    value += getButton(
        "Clear",
        "clearVideoFormInput('" + name + "','" + newvideo + "');",
        "clear"
    );
    value += "</div>";

    return value;
}

function clearImgFormInput(objName, newNumber) {
    if (!confirm("Do you want to clear uploaded image?")) {
        return;
    }
    if (newNumber == numberNewVideos || newNumber == -1) {
        d = document.getElementById(objName);
        d.value = "";
        idh("edit-item-img-title-" + objName, "");
        id("edit-item-img-" + objName).innerHTML = "";
        handleFileSelect(d);
    } else {
        //delete all section
        try {
            var obj = id("mark-" + objName);
            obj.parentElement.removeChild(obj);
        } catch (err) {}
    }
}

function clearVideoFormInput(objName, newNumber) {
    if (!confirm("Do you want to clear uploaded video?")) {
        return;
    }
    if (newNumber == numberNewVideos) {
        d = document.getElementById(objName);
        d.value = "";
        idh("edit-item-img-title-" + objName, "");
        id("edit-item-img-" + objName).innerHTML = "";
        handleFileSelect(d);
    } else {
        //delete all section
        try {
            var obj = id("mark-" + objName);
            obj.parentElement.removeChild(obj);
        } catch (err) {}
    }
}

function textAreaReplaceToEditor() {
    for (var i = 1; i <= numberTextareasFoReplaceToCkEditor; i++) {
        CKEDITOR.replace("textareaForEditor" + i);
    }
}

function editorReplaceToTextarea() {
    for (var i = 1; i <= numberTextareasFoReplaceToCkEditor; i++) {
        ta = id("textareaForEditor" + i);
        ta.innerHTML = CKEDITOR.instances["textareaForEditor" + i].getData();
    }
}

function handleFileSelect(evt) {
    var value = "";
    var entityName = "";
    if (evt.getAttribute("newImg") != "") {
        if (evt.getAttribute("newImg") == numberNewImages) {
            numberNewImages++;
            entityName = evt.getAttribute("entityName");
            value = getFormEditOneImageTempl(
                entityName + "_new_" + numberNewImages,
                "",
                "0",
                numberNewImages,
                entityName
            );
            var s = document.createElement("div");
            s.innerHTML = value;
            var destination = id("end_marker_" + entityName);
            destination.parentNode.insertBefore(s, destination);
        }
    }

    var files = evt.files; // FileList object
    var name = evt.name;
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; (f = files[i]); i++) {
        // Only process image files.
        if (!f.type.match("image.*")) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement("span");
                span.innerHTML = [
                    '<img class="thumb"  width=200 src="',
                    e.target.result,
                    '" title="',
                    escape(theFile.name),
                    '"/>'
                ].join("");

                idh("edit-item-img-" + name, span.innerHTML);
                idh("edit-item-img-title-" + name, escape(theFile.name));
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function handleVideoSelect(evt) {
    var value = "";
    var entityName = "";
    if (evt.getAttribute("newImg") != "") {
        if (evt.getAttribute("newImg") == numberNewImages) {
            numberNewImages++;
            entityName = evt.getAttribute("entityName");
            value = getFormEditOneImageTempl(
                entityName + "_new_" + numberNewImages,
                "",
                "0",
                numberNewImages,
                entityName
            );
            var s = document.createElement("div");
            s.innerHTML = value;
            var destination = id("end_marker_" + entityName);
            destination.parentNode.insertBefore(s, destination);
        }
    }

    var files = evt.files; // FileList object
    var name = evt.name;
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; (f = files[i]); i++) {
        // Only process image files.
        if (!f.type.match("video.*")) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var span = document.createElement("span");
                span.innerHTML = [
                    '<video class="thumb" controls="controls"  width=200 src="',
                    e.target.result,
                    '" title="',
                    escape(theFile.name),
                    '"/>'
                ].join("");

                idh("edit-item-img-" + name, span.innerHTML);
                idh("edit-item-img-title-" + name, escape(theFile.name));
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function changeStatusEditFormNotSavedToOn() {
    id("edit-title-not-saved").style.display = "inline";
}

function showFilter(filterBlockName, obj) {
    ft = id(filterBlockName);
    if (ft.style.display == "block") {
        ft.style.display = "none";
        removeClass(obj, "text-color-red");
        window.sessionStorage["entityFilterEnabled"] = "";
    } else {
        ft.style.display = "block";
        addClass(obj, "text-color-red");
        window.sessionStorage["entityFilterEnabled"] = "1";
    }
}

function filterApply(entityName) {
    //store filter data in sessionStorage
    alert("filter");
    var elements = document.forms["filter-form-" + entityName].elements;
    for (var i = 0; i < elements.length; i++) {
        alert(elements[i].name);
    }
}

function itemDelete(entityName, id) {
    if (
        !confirm(
            "Do you want to delete item ID:" + id + " from " + entityName + "?"
        )
    ) {
        return;
    }
    entityDeleteAjax(entityName, id);
}

function itemEdit(entityName, id) {
    Hash.set(entityName + "/edit/" + id);
}

function itemClose(entityName, id) {
    alert(entityName + " " + id);
}

function getInDiv(className, idName, content) {
    return (
        '<div class="' +
        className +
        '" id="' +
        idName +
        '">' +
        content +
        "</div>"
    );
}

function getInTr(className, idName, content) {
    return (
        '<tr class="' + className + '" id="' + idName + '">' + content + "</tr>"
    );
}

function getButton(title, url, type) {
    if (type == "add") {
        return '<button onclick="' + url + '">' + title + "</button>";
    } else if (type == "clear") {
        return (
            '<div class="button-div" onclick="' + url + '">' + title + "</div>"
        );
    } else if (type == "filter") {
        return '<button onclick="' + url + '">' + title + "</button>";
    } else if (type == "submit") {
        return (
            '<div class="button-div" onclick="' + url + '">' + title + "</div>"
        );
    }
}

function entityGrid(entity) {}

function entityEdit(entity, entityID) {
    //showEntityEditAddForm(entity,entityID);
}

function entityAdd(entity) {}

function ajax_post(url, params, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("usl", getUsl());
    xmlhttp.setRequestHeader("usp", getUsp());
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.send(params);
}

function ajax_get(url, params, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("ajax", "1");
    xmlhttp.setRequestHeader("usl", getUsl());
    xmlhttp.setRequestHeader("usp", getUsp());
    xmlhttp.setRequestHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin, Access-Control-Allow-Headers, usl, usp, rowcount, rowpp, ajax, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Allow-Methods, Access-Control-Request-Headers"
    );

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
                rowCount = xmlhttp.getResponseHeader("rowcount");
                rowPerPage = xmlhttp.getResponseHeader("rowpp");
            } catch (err) {
                //  console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.send(params);
}

function ajax_put(url, params, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("PUT", url, true);
    xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "*");
    xmlhttp.setRequestHeader("usl", getUsl());
    xmlhttp.setRequestHeader("usp", getUsp());
    xmlhttp.setRequestHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin, Access-Control-Allow-Headers, usl, usp, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Allow-Methods, Access-Control-Request-Headers"
    );

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                //      console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.send(params);
}

function ajax_delete(url, entity, entityId, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("DELETE", url, true);
    xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "*");
    xmlhttp.setRequestHeader("usl", getUsl());
    xmlhttp.setRequestHeader("usp", getUsp());
    xmlhttp.setRequestHeader("entity", entity);
    xmlhttp.setRequestHeader("entityid", entityId);
    xmlhttp.setRequestHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin, Access-Control-Allow-Headers, usl, usp, entity, entityid, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Allow-Methods, Access-Control-Request-Headers"
    );

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                //      console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };
    xmlhttp.send();
}

function supports_html5_storage() {
    try {
        return "localStorage" in window && window["localStorage"] !== null;
    } catch (e) {
        return false;
    }
}

function unknownRoot() {
    //action for unknown roots
    dashboardAjax();
}

function hashChange() {
    var hash = Hash.get();

    if (hash.length == 0) {
        dashboardAjax();
    }
    if (hash.length == 1) {
        if (hash[0] == "login") {
            showlogin();
        } else {
            getEntityAjax(hash[0]);
        }
    } else if (hash.length == 2) {
        if (hash[1] == "add") {
            getEntityDataForAddAjax(hash[0]);
        } else {
            getEntityAjax(hash[0], hash[1]);
        }
    } else if (hash.length == 3) {
        if (hash[1] == "edit") {
            getEntityDataForEditAjax(hash[0], hash[2]);
        } else {
            unknownRoot();
        }
    }
}

window.onhashchange = function() {
    hashChange();
};

var Hash = {
    // Получаем данные из адреса
    get: function() {
        var vars = [],
            hash,
            splitter,
            hashes;

        hashes = decodeURIComponent(window.location.hash.substr(1));
        splitter = "/";

        if (hashes.length == 0) {
            return vars;
        } else {
            vars = hashes.split(splitter);
        }
        return vars;
    },
    // Заменяем данные в адресе на полученный массив
    set: function(vars) {
        window.location.hash = vars;
    }
};

restoreGlobalSettingsLocalStorage();
