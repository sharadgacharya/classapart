var afterLoader = 'home';
screen.orientation.lock('portrait-primary');
if ('serviceWorker' in navigator) {//register service worker
    window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_site.js')
      .then(reg => console.log('Service Worker: Registered (Pages)'))
      .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
  }
$(document).ready(function () {
    startPage();
    $('h6').click(function (event) {
        $('#studentListHeader')[0].scrollIntoView();
    });
    $('#monthAndYear').click(function(event){
            $('#calendarDd').slideDown('0.5s','swing');
            $('#monthDetails').slideDown('0.5s','swing');
            $('#dateDetails').slideUp('0.5s','swing');
        });
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprommpt');
        console.log(e);
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        // Stash the event so it can be triggered later.
        // deferredPrompt = e;
        var installed = localStorage.getItem('installed');
        console.log(installed);
        if(installed)
        return;
        e.preventDefault();
        // e.prompt();
        // Update UI notify the user they can add to home screen
        $('#installWindow').slideDown('0.2s','swing');
        alert('Install prompted');
    });
    var btnAdd = document.getElementById('install');
    btnAdd.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        $('#installWindow').slideUp('0.2s','swing');
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
          .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
          });
      });

      window.addEventListener('appinstalled', (evt) => {
        app.logEvent('a2hs', 'installed');
        localStorage.setItem('installed',true);
      });
      
});
document.oncontextmenu = function() {
    return false;
    }

history.pushState(null,null,location.href);
window.onpopstate = () =>{
    history.go(1);
    goBack();
}
var histry = ['home'],exit=false;//holds the history of pages visited
console.log(`histry: ${histry}`);
function goBack(){//makes back button work
    console.log('goBack');
    var d = new Date();
    var previousTime = localStorage.getItem('goBackTime');
    previousTime = new Date(previousTime);
    if(previousTime == null)
        var diff = 1001;
    else
        var diff = d-previousTime;
    console.log('time difference: '+ diff);
    if(diff<1000)
        return;
    else
        localStorage.setItem('goBackTime',d);
    console.log('taking it back a page');
    if($('#myNavbar').hasClass('show'))//if menu shown
    {
        $(".navbar-toggle").click();//remove menu
        return;
    }
    console.log(histry);
    histry.pop();//removed current page
    var page = histry.pop();//previous page
    var fn = window[page];//convert to function
    console.log(page);
    console.log(typeof fn);
    if(histry.length > 0)//check if this is the last page loaded. ie user wants to exit
    {
        console.log('checking to run function');
        console.log(page.substring(0,11));
        if(typeof fn == 'function')
        fn();
        else
            if(page.substring(0,12)=='loadTestPage')
            {
                console.log('checking for loadtestpage');
                var functionAndArgument = page.split(',');
                fn = window[functionAndArgument[0]];
                fn(functionAndArgument[1]);
            }
            else
            if(page.substring(0,11)=='subjectPage')
            {
                console.log('checking for subjectpage');
                fn = window['createSubjectPage'];
                fn(page.substring(12));
            }
    }   
    else// when user exits shows the about us page for a 800ms and closes the window
    {
        if(typeof fn == 'function')
            fn();
        else
            {
                console.log(diff);
                about();
            }
    } 
}  
function firstOpen()
{
    changeStudent();
}
function startPage()
{    //disable context menu
    console.log("startPage");
    var studentId = localStorage.getItem('studentId');
    console.log("studentId: " + studentId);
    if(studentId!=null)
    {
        // home();
        getStudentDb(studentId,"available");
    }
    else
        {
            checkDb();
            changeStudent();   
        }
    getStudentIds();
}
function startLoader()
{
    console.log('startLoader');
    $('#loaderPage :nth-child(2)').text('Loading...');
    $('#gotoChangeStudent').remove();
    var DrawingThing, SIZE, TWO_PI, c, canvas, clear, createCanvas, ct, drawingThings, quarterSize, threQuarters, trails;

    SIZE = 400;
  
    quarterSize = SIZE / 4;
  
    threQuarters = SIZE - quarterSize;
  
    TWO_PI = Math.PI * 2;
  
    createCanvas = function() {
      var canvas;
      canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      return canvas;
    };
  
    canvas = createCanvas();
    let loaderPage = document.getElementById("canvas");
    loaderPage.appendChild(canvas);
  
    c = canvas.getContext("2d");
  
    trails = createCanvas();
  
    ct = trails.getContext("2d");
  
    clear = function() {
      c.fillStyle = "whitesmoke";
      c.fillRect(0, 0, SIZE, SIZE);
      ct.fillStyle = "whitesmoke";//background
      ct.fillRect(0, 0, SIZE, SIZE);
    };
  
    clear();
  
    // document.getElementById("erase").onclick = clear;
  
    DrawingThing = (function() {
      function DrawingThing(x, y) {
        this.x = x;
        this.y = y;
        this.radii = [50, 100, 150];
        this.num = this.radii.length;
        this.thetas = [Math.random() * TWO_PI, Math.random() * TWO_PI, Math.random() * TWO_PI];
        this.thetasInc = [Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1];
      }
  
      DrawingThing.prototype.draw = function() {
        var i, x, y, _i, _ref;
        ct.strokeStyle = "rgba(146,200,236,0.1)";//actual lines
        for (i = _i = 0, _ref = this.num; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          x = this.x + this.radii[i] * Math.cos(this.thetas[i]);
          y = this.y + this.radii[i] * Math.sin(this.thetas[i]);
          if (i === 0) {
            ct.beginPath();
            ct.moveTo(x, y);
          } else {
            ct.lineTo(x, y);
          }
          c.strokeStyle = "rgba(134,132,132,0.3)";//circles
          c.fillStyle = "red";//pens
          c.beginPath();
          c.arc(this.x, this.y, this.radii[i], 0, TWO_PI, false);
          c.stroke();
          c.beginPath();
          c.arc(x, y, 2, 0, TWO_PI, false);
          c.fill();
          this.thetas[i] += this.thetasInc[i];
        }
        ct.closePath();
        ct.stroke();
      };
  
      return DrawingThing;
  
    })();
  
    drawingThings = [new DrawingThing(200, 200)];
  
    setInterval(function() {
      var drawThing, _i, _len, _results;
      c.drawImage(trails, 0, 0);
      _results = [];
      for (_i = 0, _len = drawingThings.length; _i < _len; _i++) {
        drawThing = drawingThings[_i];
        _results.push(drawThing.draw());
      }
      return _results;
    }, 10);
  
    return;
  
}
function stopLoader()
{
    console.log('stopLoader');
    $('#canvas').empty();
    if(afterLoader === 'home')
        home();
    else  
        {
            $(".page").slideUp();
            $(".latestPage").slideDown();
            $(".navbar-brand").text('Latest Updates');
            displayLatestUpdate();
        }  
    afterLoader = 'home';
    currentTime = new Date().getTime();
    localStorage.setItem('dbUpdateTime',currentTime);
}

function handleInfo(obj, dbStatus){
    console.log("handleInfo");
    console.log('dbStatus: ' + dbStatus);
    console.log(obj);
    if(dbStatus!=="available")
    obj.studentId = localStorage.getItem('studentId');
    if(!(obj && typeof obj === 'object' && obj.constructor === Object))
    {
        if(obj.length >11)
            obj = "Student ID Incorrect";
        $('#loaderPage :nth-child(2)').text(obj);
        $('#canvas').empty();
        var newButton =$('<button>').attr('id','gotoChangeStudent').text('Try again').click(function(){changeStudent()});
        newButton.appendTo('#loaderPage');
        localStorage.removeItem('studentId');
        return;
    }
    
    displayInfo(obj);       
    displayAboutPage(obj.classDetails);
    infoToLocalStorage(obj);
    createSubjectsTable(obj.subjects);//add subject names to the subjects page
    if(dbStatus == undefined)
        addStudentDb(obj);
    else
        if(dbStatus === 'available')
        {
            $('.home').show();
            getObjectStoresForStudent(obj.studentId);
        }
}

function handleData(obj){
    console.log("handleData");
    stopLoader();
    var studentId = localStorage.getItem('studentId');
    var calendarData = {
        attendance : [],
        schedule: [],
        assignments: [],    
        alerts: [],
    }
    calendarData.attendance = obj.attendance;
    calendarData.schedule = obj.schedule;
    calendarData.assignments = obj.assignments;
    calendarData.alerts = obj.alerts;
    dataToLocalStorage(calendarData);
    addToCalendarObject(studentId,calendarData);
    updateFeesDetails(studentId,obj.fees);
    var subjects = localStorage.getItem('subjects');
    subjects = JSON.parse(subjects);
    for(var i in subjects)
    {
        var newObj = {
            subject : subjects[i],
            range : obj.chapterSummary[i],
        }
        updateChapterSummary(studentId,newObj)
    }
    for(var i in subjects)
    {
        var newObj = {
            subject : subjects[i],
            range : obj.subjectSummary[i],
        }
        updateSubjectSummary(studentId,newObj);
        updateTestCount(i, newObj.range);
    }
    for(var i in obj.subjectName)
    {
        for(var j in obj.range[i])
        {
            if(obj.range[i]=="no data")
            continue;
            var newObj = {range : obj.range[i][j], testId: obj.range[i][j][0]};
            addToSubjectObject(studentId,obj.subjectName[i],newObj);
        }
    }
    displayLatestUpdate();
}

function updateTestCount(i, obj)//array index for subjects and subjectsummary
{
    var subjects = JSON.parse(localStorage.getItem('subjects'));
    var testCount = JSON.parse(localStorage.getItem('testCount'));
    
    subject = subjects[i];
    if(obj === "no data")
        var latestCount = 0;
    else
    {
        var latestCount = obj[7][2];
    }
        
    if(testCount == null)
    {
        if(latestCount!=0)
        addToLatestUpdate(subject, latestCount);
        testCount = [latestCount];
    }
    else
    {
        if(testCount.length > i)
        {
            if(latestCount > testCount[i])
            {
                if(latestCount!=0)
                addToLatestUpdate(subject, latestCount - testCount[i]);
                testCount[i] = latestCount;//update with latest count
            }    
        }
        else//Create localStorage for testCount;
            {
                testCount.push(latestCount);
                if(latestCount!=0)
                addToLatestUpdate(subject, latestCount);
            }
    }
    localStorage.setItem('testCount',JSON.stringify(testCount));
}

function addToLatestUpdate(subject,testCountDiff)//update latest update page
{
    var today = new Date();
    var tomonth = today.getMonth() + 1;
    var toyear = today.getFullYear();
    today = today.getDate();
    today = today + '/' + tomonth + '/' + toyear;
    var latestUpdate = localStorage.getItem('latestUpdate');
    var objfound =false, subjfound = false;
    if(latestUpdate != null)//was there a latestupdate in storage
        {
            latestUpdate = JSON.parse(latestUpdate);
            latestUpdate.forEach(function(obj,i)
            {
                if(obj.date == today)//is today's date stored
                {
                    objfound = true;
                    obj.subjects.forEach(function(subj,j)   
                    {
                        if(subj == subject)//subject found. increase count
                        {
                            subjfound = true;
                            obj.count[j] += testCountDiff;
                            return false;// break;
                        }
                    })
                    return false;// break;
                }
                else//no today's date. this is the first time for today. create new obj
                    {
                        var obj = {
                            date: today,
                            subjects: [subject],
                            count:[testCountDiff]
                        }
                        latestUpdate.push(obj);
                    }        
            })           
        }
    else
        {//no latestUpdate stored. this is the first time
            latestUpdate = [];
            var obj = {
                date: today,
                subjects: [subject],
                count:[testCountDiff]
            }
            latestUpdate.push(obj);
        }
    //find obj in array with today's date and edit if found, else push
    localStorage.setItem('latestUpdate',JSON.stringify(latestUpdate));
}

function displayLatestUpdate()
{
    var latestUpdate = JSON.parse(localStorage.getItem('latestUpdate'));
    if(latestUpdate == null)
        return;
    $('#latestDate').empty();    
    latestUpdate.forEach(function(item, i)
        {
            var date = $('<div>').addClass('dateInLatestUpdate dateDiv').prependTo('#latestDate');
            $('<div>').text(item.date).appendTo(date);
            item.subjects.forEach(function(subject,j)
                {
                    var row = $('<div>').addClass(' asaa').appendTo(date);
                    $('<div>').text(subject).appendTo(row);
                    $('<div>').text('Test Results Added: ' + item.count[j]).appendTo(row);
                })
        })
}

function addToStudentsList(list)//add list of added students on change student page
{
    console.log("addDDLStudents");
    var s = document.getElementById("studentList");
    $('#studentList').empty();
    for(var i in list) {
        var li = $('<li />').attr('data-studentId', list[i].studentId).appendTo(s)
        $('<div>', {text: list[i].range[0][0], onclick: "changeCurrentStudent($(this.parentElement).attr('data-studentId'))",}).appendTo(li);
        $('<span>',{onclick: "this.parentElement.style.display='none';deleteStudentDb($(this.parentElement).attr('data-studentId'));"}).html('&times;').appendTo(li);
    }
}

function createSubjectsTable(subjects)
{
    $('.subjectsHeader').siblings().remove();
    console.log("createSubjectTables");
    for(var i in subjects)
    {
        var row = $('<div>').attr('id','listItem_' + subjects[i]).appendTo('#listOfSubjects');
        $('<div>').text(subjects[i]).click(function(){createSubjectPage(this.innerHTML)}).appendTo(row);        // $('<div>').attr('data-count',0).appendTo(row);        // $('<div>').attr('data-count',0).appendTo(row);
    }
}
function createSubjectPage(subject)
{   
    console.log("createSubjectPage");

    chapters = JSON.parse(localStorage.getItem('chapters'));
    studentId = localStorage.getItem('studentId');
    subjectSummary = JSON.parse(localStorage.getItem('subjectSummary'));
    if(chapters!=null)
    {
        if(chapters.subject == subject)//check if already stored in localstorage else fetch from db
            displayChapters(chapters)
        else
            getChapterObjectStore(studentId,subject);
    }
    else
        getChapterObjectStore(studentId,subject);
    console.log('subjectSummary: ' + subjectSummary)
    
    $(".page").slideUp()
    $(".subjectPage").slideDown();
    $(".navbar-brand").text(subject);
    histry.push('subjectPage,'+subject);
    if($('#' + subject + 'Page').length)
        return;
    var page = $('#subjectPage');
    page.empty();
    var column = $('<div>').attr('id',subject + 'Page').attr('data-subject',subject).addClass('w3-center').appendTo(page);
    $('<div>').text('Chapters').click(function(){loadChaptersPage($(this.parentElement).attr('data-subject'))}).addClass('btn btn-primary').appendTo(column);
    $('<br />').appendTo(column);
    $('<div>').text('Test Results').click(function(){loadTestPage($(this.parentElement).attr('data-subject'))}).addClass('btn btn-primary').appendTo(column);
    $('<br />').appendTo(column);
    // $('<button>').text('Progress').click(function(){loadProgressPage($(this.parentElement).attr('data-subject'))}).addClass('btn btn-primary').appendTo(column);
    // getSubjectSummaryObjectStore(studentId, subject);
    getSubjectObjectStores(studentId, subject);
    if(subjectSummary!=null)
    {
        console.log('not equal to null');
        if(subjectSummary.subject !== subject)//check if already stored in localstorage else fetch from db
            getSubjectSummaryObjectStore(studentId, subject);
        else
            updateDropdownsForSubject();
    }
    else
        getSubjectSummaryObjectStore(studentId, subject);
}

function updateDropdownsForSubject()
{
    // create the option elements for term and unit test    
    subjectSummary = JSON.parse(localStorage.getItem('subjectSummary')).range;
    var term = 0, ut = 0,terms = [],uts = [], tcount = 0, utcount = 0;//count no of terms and uts
    console.log(subjectSummary);
    if(subjectSummary === "no data")
        return;
     for(var i = 1; i < 8;i++)
     {
        if(term !== subjectSummary[i][0])
            {
                term = subjectSummary[i][0];
                terms.push(term);
                tcount++;
            }
        if(term==1)
        if(ut !== subjectSummary[i][1])
        {
            ut = subjectSummary[i][1];
            uts.push(ut);
            utcount++;
        }    
     }
     tcount--; utcount--;
     terms.pop();//remove the last element as it is the blank next to 'overall' from the array

     $('<option>').text('All')
                .appendTo('#termSelect');
    $('<option>').text('All')
                .appendTo('#utSelect');

     terms.forEach(function(val){
        $('<option>').text(val)
                    .appendTo('#termSelect');
     });
     uts.forEach(function(val){
        $('<option>').text(val)
                    .appendTo('#utSelect');
     });

     $('#termSelect').change(function(){
        filterTestResults();
     });
     $('#utSelect').change(function(){
        filterTestResults();
     });
     $('#testDd').change(function(){
        filterTestResults();
     });
}
function filterTestResults(){
    
    var term = $('#termSelect option:selected').text();
    var ut = $('#utSelect option:selected').text();
    var ddval = $('#testDd option:selected').text();

    if(term !== 'All')
    term = '.T' + term;
    
    if(ut !== 'All')
    ut = '.UT' + ut;
    
    if(ddval !== 'All')
    {
        if(ddval=='Ranked First')
            ddval = '.R1';//remove . for previous method
        else
            ddval = '.' + ddval;
    }

    $('.collapsible').show();
    $('.collapsibleContent').slideUp('0.2s','swing');

    if(term!=='All')
        $('.collapsible').not(term).slideUp('0.2s','swing');

    if(ut!=='All')
        $('.collapsible').not(ut).slideUp('0.2s','swing');

    if(ddval!=='All')
    $('.collapsible').not(ddval).slideUp('0.2s','swing');
}   

function loadChaptersPage(subject)
{
    if(histry[histry.length-1]!=='loadChaptersPage')
    histry.push('loadChaptersPage');
 
    console.log("loadChaptersPage");
    $(".page").slideUp()
    $(".chaptersPage").slideDown();
    $(".navbar-brand").text("Chapters - " + subject);
}
function loadTestPage(subject)
{
    if(histry[histry.length-1].substring(12)!=='loadTestPage')
    histry.push('loadTestPage,'+ subject);
    console.log("loadTestPage");
    $(".page").slideUp()
    $(".testPage").slideDown();
    $(".navbar-brand").text("Test Results - " + subject);
}
function loadProgressPage(subject)
{
    
    $(".page").slideUp();
    $(".progressPage").slideDown();
    $(".navbar-brand").text("Progress - " + subject);
}
function infoToLocalStorage(obj)
{
    localStorage.setItem('studentId',obj.studentId);
    localStorage.setItem('subjects',JSON.stringify(obj.subjects));
}
function dataToLocalStorage(calendar)
{
    localStorage.setItem('calendar',JSON.stringify(calendar));
}

function displayInfo(obj)
{
    document.getElementById("studentName").innerHTML = obj.range[0][0];
    document.getElementById("studentContact").innerHTML = obj.range[0][9];
    document.getElementById("parentContact1").innerHTML = obj.range[0][6];
    document.getElementById("parentContact2").innerHTML = obj.range[0][7];
    document.getElementById("parentContact3").innerHTML = obj.range[0][8];
    document.getElementById("board").innerHTML = obj.range[0][2];
    document.getElementById("grade").innerHTML = obj.range[0][3];
    document.getElementById("school").innerHTML = obj.range[0][4];
    document.getElementById("classTiming").innerHTML = obj.range[0][5];
}

function displayAboutPage(obj)
{
    document.getElementById("className").innerHTML = obj.className;
    document.getElementById("classAddress").innerHTML = obj.address;
    document.getElementById("classContact").innerHTML = obj.contact;
    var classAbb = localStorage.getItem('studentId');
    classAbb = classAbb.substring(0,3);
    $('#classIcon').attr('src','ico/'+ classAbb + '.gif').attr('width','200px').attr('height','200px');
}

function displaySubjectDataRow(subject,dataArray)
{
    console.log("displaySubjectDataRow");
    console.log(subject);

var chapters = dataArray[2],
    marks = dataArray[3] + '/' + dataArray[4];
    term = dataArray[5],
    ut = dataArray[6],
    status;

if(dataArray[7]==false)
    {
    if(dataArray[8]==1)
        status="Failed";
    else
        status="Passed";
    }
else
{
    status = "Absent"
} 

var averageStatus;
if(dataArray[10]==1)
    averageStatus = "Below_Average";
if(dataArray[11]==1)
    averageStatus = "Average";
if(dataArray[12]==1)
    averageStatus = "Above_Average";

var rank = dataArray[13], passMarks = dataArray[14], average = dataArray[15].toFixed(2); highest = dataArray[16], month = dataArray[17], year = dataArray[18], num = dataArray[19], date = new Date(dataArray[1]).getUTCDate();

arr = ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

month = arr[month - 1];

date = date + ' ' + month + ' ' + year;
var tbl = $("#testData");
var row1 = $("<div>").addClass("collapsible").attr("id",dataArray[0]);
row1.appendTo(tbl);
row1.click(function(){
$(this).next().slideToggle('0.3s','swing');
});

var cell1 = $('<div>').addClass("cell chapterMarks").appendTo(row1);
var cell2 = $('<div>').addClass("cell date").appendTo(row1);

$('<div>').text("Chapters : " + chapters).addClass("dataRow chapterNo").appendTo(cell1);
$('<div>').text("Marks : " + marks).addClass("dataRow").appendTo(cell1);
$('<div>').text(date).appendTo(cell2);
 
var row2 = $("<div>").addClass("collapsibleContent").appendTo(tbl);
var inRow2 = $('<div>').addClass("dataRow").appendTo(row2);
    $('<div>').addClass("cell2").text("Term: " + term).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Unit Test: " + ut).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Status: " + status).appendTo(inRow2);
var inRow2 = $('<div>').addClass("dataRow").appendTo(row2);
$('<div>').addClass("cell2").text("Rank: " + rank).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Score: \n" + averageStatus).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Total Students: " + num).appendTo(inRow2);
var inRow2 = $('<div>').addClass("dataRow").appendTo(row2);
    $('<div>').addClass("cell2").text("Pass Marks: " + passMarks).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Average Marks: " + average).appendTo(inRow2);
    $('<div>').addClass("cell2").text("Highest Marks: " + highest).appendTo(inRow2);

$(row2).hide();
    //add the term, unit test and filter dropdown list classes

    row1.addClass('T' + term);
    row1.addClass('UT' + ut);
    row1.addClass(averageStatus);
    row1.addClass('R' + rank);
    switch(status)
    {
        case "Passed": row1.addClass('Passed');
                        break;
        case "Failed": row1.addClass('Failed');
                        break;
        case "Absent": row1.addClass('AbsentTest');
                        marks = 0  + '/' + dataArray[4];
                        break;
    };
}

function displayChapters(chapters)
{
    $('#listOfChapters').empty();//remove previous fees data
    var insertAfterThis = $('#chaptersHeader');//display fees table
    chapters = chapters.range;
    for(var i = 20;i>0;i--)
    {
        var statusValue;
        if(chapters[i][0]=='')
            continue;
        var status = $('<img>');
        if(chapters[i][5] == true)//started
            {
                status.attr('alt','started').attr('src','ico/started.svg');
                statusValue = 'Started';
            }
        else
            {
                if(chapters[i][6] == true)//completed
                    {
                        status.attr('alt','completed').attr('src','ico/completed.svg');
                        statusValue = 'Completed';
                    }
                else//not started
                    {
                        status.attr('alt','Not started').attr('src','ico/notStarted.svg');
                        statusValue = "Not started";
                    }
                
            }   
        var row = $('<div>');
        $('<div>').text(chapters[i][0] + '.').appendTo(row);
        $('<div>').text(chapters[i][1]).appendTo(row);
        $('<div>').append(status).appendTo(row).attr('data-status',statusValue);
        
        row.prependTo('#listOfChapters')
        
    }

}
function setCalendarMonth(data)//to latest month
{
    console.log("setCalendarMonth");
    var monthYear = data[0][data[0].length-1];
    monthYear = monthYear.split('_');
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    monthYear[0] = months.indexOf(monthYear[0]);
    month = localStorage.setItem('month',monthYear[0]);
    month = localStorage.setItem('year',monthYear[1]);
}
function displayFees(fees)
{
    console.log('displayFees');
    var total = fees.total;
    var due = fees.due;
    if(due[0][0] == "-")
    {
        $('#nextDueDate').text('-');
        $('#amountDueOnDate').text('-');           
        $('#totalPending').text('-');
        $('#totalFees').text(total[0][1]);
    }
    else
    {
        $('#totalPending').text(total[0][0]);
        $('#totalFees').text(total[0][1]);
        // $('#nextDueDate').text(date + '/' + month + '/' + year);
        $('#nextDueDate').text(due[0][0]);
        $('#amountDueOnDate').text(due[0][1]);   
    }
    $('#feesTableHeader').siblings().remove();//remove previous fees data
    
    var insertAfterThis = $('#feesTableHeader');//display fees table
    for(var i = 0;fees.range[i][0] != '';i++)
    {
        var row = $('<div>');
        // var date = new Date(fees.range[i][0]);
        // var month = date.getMonth() + 1;
        // var year = date.getFullYear();
        // date = date.getDate();
        // date = date + '/' + month + '/' + year;

        var status;
        if(fees.range[i][2] == true)
            status = "Paid";
        else
            status = "Due";
        $('<div>').text(fees.range[i][0]).appendTo(row);
        $('<div>').text(fees.range[i][1]).appendTo(row);
        $('<div>').text(status).appendTo(row);

        row.insertAfter(insertAfterThis);
        insertAfterThis = row;
    }
}

function changeCurrentStudent(studentId)
{
    load();
    deleteStudentDataDb();
    console.log("changeCurrentStudent");
    getStudentDb(studentId);
}

function makeDataUrl(obj)
{
    console.log("makeDataUrl");
    var subjects = obj.subjects;
    var par = "urls=" + obj.url[0] + "&urls=" + obj.url[1];
    for(var i in subjects)
    {
        par += "&subjects=" + subjects[i];
    }
   getData(obj.studentId,par);
}


function home()
{
    // if(histry[histry.length-1]!=='home')
    histry.push('home');
    console.log("home");
    $(".page").slideUp();
    $(".home").slideDown();
    $(".navbar-brand").text('Class Apart');
}
function subjects()
{
    if(histry[histry.length-1]!=='subjects')
    histry.push('subjects');
    console.log("subjects");
    $(".page").slideUp();
    $(".subjects").slideDown();
    $(".navbar-brand").text('Subjects');
}
function calendar()
{
    if(histry[histry.length-1]!=='calendar')
    histry.push('calendar');
    console.log("calendar");
    $(".page").slideUp();
    $(".calendar").slideDown();
    $(".navbar-brand").text('Calendar');
    var month = localStorage.getItem('month');
    var year = localStorage.getItem('year');
    showCalendar(month, year);
}
function fees()
{
    if(histry[histry.length-1]!=='fees')
    histry.push('fees');
    console.log("fees");
    $(".page").slideUp();
    $(".fees").slideDown();
    $(".navbar-brand").text('Fees');
}

function changeStudent()
{
    console.log('changeStudent');
    if(histry[histry.length-1]!=='changeStudent')
    histry.push('changeStudent');
    console.log("changeStudent");
    $(".page").hide();
    $(".changeStudent").slideDown();
    $(".navbar-brand").text('Change Student');
}
function latest()
{
    if(histry[histry.length-1]!=='latest')
    histry.push('latest');
    console.log("Latest");

    var dbUpdateTime = localStorage.getItem('dbUpdateTime');
    if(dbUpdateTime==null)//if there is no dbupdatetime, then there is no student currently
        return;

    currentTime = new Date().getTime();
    localStorage.setItem('dbUpdateTime',currentTime);
    console.log('difference in time: '+ ((currentTime-dbUpdateTime)/1000));
    var hours = 4;
    if(((currentTime-dbUpdateTime)/(1000*60*60))>hours)//check for update only if this many hours have passed
        {
            var studentId = localStorage.getItem('studentId');
            getStudentDb(studentId,'update');
            load();
            afterLoader = 'latest';
            return;         
        }
    else
        {
            load();
            afterLoader = 'latest';
            setTimeout(() => {
                stopLoader();
            }, 5000);
        }
}
function about()
{
    if(histry[histry.length-1]!=='about')
    histry.push('about');
    console.log("About Us");
    $(".page").slideUp();
    $(".aboutPage").slideDown();
    $(".navbar-brand").text('About Us');
}
function load()
{
    console.log('load');
    $('#canvas').empty();
    startLoader();
    $(".page").hide();
    $("#loaderPage").show();
}
function scrollToList()
{
    var elmnt = document.getElementsByClassName("studentListPage");
    elmnt.scrollIntoView();
}
function closeWindow()
{
    console.log('closeWindow');
    $('#installWindow').slideUp('0.5s','swing');
}