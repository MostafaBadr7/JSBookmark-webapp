
// Global Variables //.........................................................................................
var websiteNameInput = document.getElementById('websiteName');
var websiteURLInput = document.getElementById('websiteURL');
var websiteNoteInput = document.getElementById('websiteNote');
var crudBookmarksArray = [];                                                    //Array to use the saved links
var bookmarksHtmlLines;
var tableRow = document.getElementById('table-row');
var mainUpdateBtn = document.getElementById('update-btn');                      //button submit updating the url
var submitBtn = document.getElementById('addWebsite-btn');
var currentEditProduct = document.getElementById('current-product');
var editID;                                                                     //ID of product cuurently updating
var bookmarksInStorage = JSON.parse(localStorage.getItem("crud-Bookmarks"));    //Get data frm lcl storage
var warningBoxMsg = document.getElementById('warningBoxMsg');                   //Validation Message
var warningBox = document.getElementById('warningBox');                         //Validation Box

//REGEX AREA//.....................................................................................................

/* Regex filters URL includes local URLS too,  like router URL, file URL, ftp - ex: >> //
                                http://127.55.125.256:1875
        http://docs.google.com/document/d/15JmGWVLn8_646njSUdDvBM0ouklzjVQ4y16cdrkByxg/edit
        file:///D:/Programing/Route/Front/HTML/Lectures/transition
                                http://127.55.125.256
*/
var regExURL = /^((https?)|(ftp)|(file)):\/\/\/?((([A-Za-z]:){1}|([a-zA-Z:-]{1,100}\d*\.\w{1,50}\.?[a-zA-Z]{2,10}))|((\d{1,3}\.){3}\d{1,3}(:(?=\d{1,4}))?))[\w-@%+.~#\?&\/=_]*$/;
var regExName = /^([a-zA-Z][\w\-@%\+.~#?&\/=]*\w*){3,75}/;                     // Regex for site's name

//Warm-Up Display//............................................................................................

// let array empty if nthing in lcl strge
if (bookmarksInStorage != null) { crudBookmarksArray = bookmarksInStorage }

displayBookmarks();

//Add Bookmark And Display//.......................................................................................

function addBookmark() {
    // Get user input
    var Bookmark = {
        'websiteName': websiteNameInput.value.trim(),
        'websiteURL': websiteURLInput.value.trim(),
        'websiteNote': websiteNoteInput.value.trim()
    };

    // Validate the input then submit 
    if (validateBookmark(Bookmark) === true) {
        crudBookmarksArray.push(Bookmark);
        localStorage.setItem("crud-Bookmarks", JSON.stringify(crudBookmarksArray))
        displayBookmarks();
        resetForm();
    }
}

function displayBookmarks() {
    if (bookmarksInStorage != null) {
        bookmarksHtmlLines = ``;
        for (var i = 1; i <= crudBookmarksArray.length; i++) {

            bookmarksHtmlLines += `
        <tr class="w-100">
            <th  scope="row">${i}</th>
            <td >${crudBookmarksArray[i - 1].websiteName}</td>
            <td >${crudBookmarksArray[i - 1].websiteURL}</td>
            <td >${crudBookmarksArray[i - 1].websiteNote}</td>
            <td  class"text-center"><button onclick="window.open('${crudBookmarksArray[i - 1].websiteURL}', '_blank');" type="button" class="btn btn-outline-primary noBreak-word">Visit Website</button></td>
            <td  class"text-center"><button onclick="updateBookmark(${i - 1})" type="button" class="btn btn-outline-warning noBreak-word">Update</button></td>
            <td class"text-center"><button onclick="deleteBookmark(${i - 1})" type="button" class="btn btn-outline-danger noBreak-word">Delete</button></td>
        </tr>
        `
        }
        tableRow.innerHTML = bookmarksHtmlLines;
    }
    goToTable();                                                            //Aftr fetching dta mv vwport t z table
}

//Delete Bookmark//..................................................................................................

function deleteBookmark(i) {
    // if z ordered deleting bookmark "index" = currently editing bookmark >> delete the url then turn the vw to submit instead of editing  
    // editID took (index + 1) to show him to user after number 0
    if (i == editID - 1) {
        disableButton(mainUpdateBtn, submitBtn);                            //Bookmark gnna be deleted - disble editing button
    }
    crudBookmarksArray.splice(i, 1);                                        //Dlete the bookmark
    localStorage.setItem("crud-Bookmarks", JSON.stringify(crudBookmarksArray))
    displayBookmarks();
}

//Updating Bookmark//..................................................................................................

//Fetch currently editing bookmark to z input area.
function updateBookmark(i) {
    goToForm();     //Get VW prt to input area.
    websiteName.value = crudBookmarksArray[i].websiteName;
    websiteURL.value = crudBookmarksArray[i].websiteURL;
    websiteNote.value = crudBookmarksArray[i].websiteNote;
    disableButton(submitBtn, mainUpdateBtn);
    currentEditProduct.innerHTML = `Bookmark ${websiteName.value}`;         //Shw t user z currently editing bookmark.
    editID = i + 1
}


// submit z editied bookmark
function edit(editID) {
    var Bookmark = {
        'websiteName': websiteNameInput.value.trim(),
        'websiteURL': websiteURLInput.value.trim(),
        'websiteNote': websiteNoteInput.value.trim()
    }

    if (crudBookmarksArray[editID - 1].websiteName != Bookmark.websiteName) {          //If name chngd chck URL
        if (crudBookmarksArray[editID - 1].websiteURL != Bookmark.websiteURL) {        //If URL changed validate it -- else update the name
            if (validateBookmark(Bookmark) === true) {
                crudBookmarksArray.splice(editID - 1, 1, Bookmark);                 //editID sent on update bookmark button click / (-1) to get the index
                localStorage.setItem("crud-Bookmarks", JSON.stringify(crudBookmarksArray));
                displayBookmarks();
                resetForm();
            }                                                           //editID = 0 indicate zere is no current edition
        } else {
            if (regExName.test(Bookmark.websiteName) == true) {
                crudBookmarksArray.splice(editID - 1, 1, Bookmark);                 //editID sent on update bookmark button click / (-1) to get z index
                localStorage.setItem("crud-Bookmarks", JSON.stringify(crudBookmarksArray));
                displayBookmarks();
                resetForm();
            } else {
                alertMsg("Please enter a valid Name");
            }
        }
    } else {
        if (validateBookmark(Bookmark) === true) {
            crudBookmarksArray.splice(editID - 1, 1, Bookmark);                 //editID sent on update bookmark button click / (-1) to get the index
            localStorage.setItem("crud-Bookmarks", JSON.stringify(crudBookmarksArray));
            displayBookmarks();
            resetForm();
        }
    }
    disableButton(mainUpdateBtn, submitBtn);
    editID = 0;
}

//Automation Functions//.........................................................................................

// Reset inputs after any operations
function resetForm() {
    websiteNameInput.value = "";
    websiteURLInput.value = "";
    websiteNoteInput.value = "";
}
// Mv vw port to input area
function goToForm() {
    document.body.scrollTop = 0;                // For Safari
    document.documentElement.scrollTop = 0;
}
// Mv vw port to display data area
function goToTable() {
    document.body.scrollTop = 1000;             // For Safari
    document.documentElement.scrollTop = 1000;
}
// To show validation msg t user
function alertMsg(msg) {
    goToForm();
    warningBoxMsg.innerHTML = msg;
    warningBox.classList.add('display');
    setTimeout(() => {
        warningBox.classList.remove('display');
        warningBoxMsg.innerHTML = "";
    }, "3000");
}

function validateBookmark(Bookmark) {
    // Validate URL
    if (regExURL.test(Bookmark.websiteURL) === false) {                     //chck if URL valid
        alertMsg("Please enter a valid URL");
        return false;                                                       //Rtrn t stp fnction nd t use rtrn in anthr fnction
    } else {
        for (var i = 0; i < crudBookmarksArray.length; i++) {               //chck if z URL alrdy exst.
            if (Bookmark.websiteURL == crudBookmarksArray[i].websiteURL) {
                alertMsg("Already Exist!");
                return false;
            }
        }
    }

    // Validate site name nd note
    if (!Bookmark.websiteURL | !Bookmark.websiteName) {                     //If input url or name empty
        alertMsg("Please fill<br>URL & Name");
        return false;
    } else if (regExName.test(Bookmark.websiteName) === false) {
        alertMsg("Please enter a valid Name");
        return false;
    } else if (Bookmark.websiteNote.length > 75) {
        alertMsg("Too big note");
        return false;
    } else {
        return true;                                                        //Aftr all chcks retrn true
    }
}

// Disble edit button - enble add bookmark button - hide currenly editing bookmark name
function disableButton(disable, enable) {
    disable.classList.add("disabled");                                      //Disble bttn aftr done
    enable.classList.remove("disabled");                                    //Enble another button 
    if (disable == mainUpdateBtn) {
        currentEditProduct.classList.add("hideCurrentEditProduct");         //Hide currently editing bookmark name
    } else {
        currentEditProduct.classList.remove("hideCurrentEditProduct");      //Shw currently editing bookmark name
    }
}
//.............................................................................................................//
// Happy Coding! END