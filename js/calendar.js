let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");

function next() {
    currentYear = localStorage.getItem('year');
    currentYear = parseInt(currentYear);
    currentMonth = localStorage.getItem('month');
    currentMonth = parseInt(currentMonth);
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    localStorage.setItem('year',currentYear);
    localStorage.setItem('month',currentMonth);
    // clone.animate(
    //     {left: screen.width},
    //     {
    //         duration: 2000,
    //         complete: function () {
    //             console.trace();
    //         }
    //       });
    showCalendar(currentMonth, currentYear);
}

function previous() {
    
    currentYear = localStorage.getItem('year');
    currentYear = parseInt(currentYear);
    currentMonth = localStorage.getItem('month');
    currentMonth = parseInt(currentMonth);
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    localStorage.setItem('year',currentYear);
    localStorage.setItem('month',currentMonth);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) 
{
console.log('showCalendar');
let today = new Date();
// let currentMonth = today.getMonth();
// let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");
var monthYear = months[month] + '_' + year;
data = localStorage.getItem('calendar');
data = JSON.parse(data);
console.log('showCalendar data: '+data);
attendance = data.attendance;
var column = attendance[0].indexOf(monthYear);

let firstDay = (new Date(year, month)).getDay();
let daysInMonth = 32 - new Date(year, month, 32).getDate();

let tbl = document.getElementById("calendar-body"); // body of the calendar

// clearing all previous cells
tbl.innerHTML = "";

// filing data about month and in the page via DOM.
monthAndYear.innerHTML = months[month] + " " + year;

// creating all cells
let date = 1;
for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                $(cell).attr('data-date',date);
                cell.addEventListener("click", function(){
                    displayDateDetails($(this).attr('data-date'));
                    $('#calendarDd').slideUp('0.2s','swing');
                    $('#monthDetails').hide();
                    $('#dateDetails').show();
                });
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");// color today's date
                }

                console.log(date);
                switch(attendance[date][column])
                {
                    case true:
                        if(column<0)
                            break;
                        else
                        {
                            var attendanceMonthYear = attendance[0][column];
                            var thisDate = new Date(parseInt(attendanceMonthYear.substring(4)),months.indexOf(attendanceMonthYear.substring(0,3)))
                            var when = today - thisDate;
                            console.log(when);
                            if(when<0)
                                break;
                        }
                        cell.classList.add('Absent');
                        $(cell).attr('data-status','Absent');
                        break;

                    case false:
                    if(column>-1)
                        break;
                    else
                    {
                        var attendanceMonthYear = attendance[0][column];
                        var thisDate = new Date(parseInt(attendanceMonthYear.substring(4)),months.indexOf(attendanceMonthYear.substring(0,3)))
                        var when = today - thisDate;
                        if(when<0)
                            break;
                    }
                        cell.classList.add('present');
                        $(cell).attr('data-status','Present');
                        break;
                    
                    default:
                        $(cell).attr('data-status',attendance[date][column]);
                        break;
                }

                cell.appendChild(cellText); 
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
        }
    
    displayMonthDetails(data,column,daysInMonth,month,year);
    }

function displayDateDetails(date)
{
    console.log('displayDateDetails');
    $('#dateDetails').empty();
    $('.date_' + date).clone().appendTo('#dateDetails');
}
function displayMonthDetails(data,column,daysInMonth,month,year)
{
    console.log('displayMonthDetails');
    var attendance = data.attendance;
    var schedule = data.schedule;
    var assignments = data.assignments;
    var alerts = data.alerts;
    
    $('#monthDetails').empty();
    $('#monthAndYear').off('click');
    $('#monthAndYear').click(function(event){
        $('#calendarDd').slideDown('0.5s','swing');
        $('#monthDetails').slideDown('0.5s','swing');
        $('#dateDetails').slideUp('0.5s','swing');
    });
    
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    month = months[month];

    console.log(data);
    var monthYear = month +'_' + year;
    if(data.schedule.batch !== 'no data')
        var batchMonth = data.schedule.batch[0].indexOf(monthYear);
    else
        var batchMonth = -1;
    
    if(data.schedule.student !== 'no data')
        var studentMonth = data.schedule.student[0].indexOf(monthYear);
    else
        var studentMonth = -1;
    var date;
    var displayData = false, schDiv = false, assignDiv = false, alertDiv = false;
    var today = new Date();
    for(var i = daysInMonth;i>0;i--,displayData = false, schDiv = false, assignDiv = false, alertDiv = false)
    {


        date = i + ' ' + month + ', ' + year;
        var dateAndDetails = $('<div>').addClass('date_' + i).addClass('dateDiv');
        var newDate = $('<div>').text(date).appendTo(dateAndDetails);
        $(newDate).addClass('dateFromMonthDetails');
        if(studentMonth != -1)
            {    
                if(schedule.student[i][studentMonth] != '')
                {
                    var sch = schedule.student[i][studentMonth];
                    sch = sch.split(';');

                    schDiv = $('<div>').appendTo(dateAndDetails);
                    schDiv.addClass('schedule asaa');//main schedule container
                    dateAndDetails.addClass('schedule');
                    $('<div>').text('Schedule').appendTo(schDiv);//title
                    var schContent = $('<div>').appendTo(schDiv);//content container

                    sch.forEach(element => {
                        $('<div>').text(sch).appendTo(schContent);//content
                    });
                    displayData = true;
                }
                if(assignments.student[i][studentMonth] != '')
                {
                    var sch = assignments.student[i][studentMonth];
                    sch = sch.split(';');
                    assignDiv = $('<div>').appendTo(dateAndDetails);
                    assignDiv.addClass('assignments asaa');//main container
                    dateAndDetails.addClass('assignments');
                    $('<div>').text('Assignments').appendTo(assignDiv);//title
                    var assignContent = $('<div>').appendTo(assignDiv);//content container

                    sch.forEach(element => {
                        $('<div>').text(sch).appendTo(assignContent);
                    });
                    displayData = true;
                }
                if(alerts.student[i][studentMonth] != '')
                {
                    var sch = alerts.student[i][studentMonth];
                    sch = sch.split(';');
                    alertDiv = $('<div>').appendTo(dateAndDetails);
                    alertDiv.addClass('alerts asaa');//main container
                    dateAndDetails.addClass('alerts');
                    $('<div>').text('Alerts').appendTo(alertDiv);//title
                    var alertContent = $('<div>').appendTo(alertDiv);//content container

                    sch.forEach(element => {
                        $('<div>').addClass('alerts').text(sch).appendTo(alertContent);
                    });
                    displayData = true;
                }
            };
        if(batchMonth != -1)
        {    
            if(schedule.batch[i][batchMonth] != '')
            {
                console.log(i);
                console.log(schedule.batch[i][batchMonth]);
                var sch = schedule.batch[i][batchMonth];
                sch = sch.split(';');
                if(!schDiv)
                {
                    schDiv = $('<div>').appendTo(dateAndDetails);
                    schDiv.addClass('schedule asaa');//main schedule container
                    dateAndDetails.addClass('schedule');
                    $('<div>').text('Schedule').appendTo(schDiv);//title
                }
                var schContent = $('<div>').appendTo(schDiv);//content container
                
                sch.forEach(element => {
                    console.log(element);
                    $('<div>').text(element).appendTo(schContent);
                });
                displayData = true;
            }
            if(assignments.batch[i][batchMonth] != '')
            {
                var sch = assignments.batch[i][batchMonth];
                sch = sch.split(';');
                if(!assignDiv)
                {
                    assignDiv = $('<div>').appendTo(dateAndDetails);
                    assignDiv.addClass('assignments asaa');//main container
                    dateAndDetails.addClass('assignments');
                    $('<div>').text('Assignments').appendTo(assignDiv);//title
                }
                var assignContent = $('<div>').appendTo(assignDiv);//content container

                sch.forEach(element => {
                    $('<div>').addClass('assignments').text(sch).appendTo(assignContent);
                });
                displayData = true;
            }
            if(alerts.batch[i][batchMonth] != '')
            {
                var sch = alerts.batch[i][batchMonth];
                sch = sch.split(';');
                if(!alertDiv)
                {
                    alertDiv = $('<div>').appendTo(dateAndDetails);
                    alertDiv.addClass('alerts asaa');//main container
                    dateAndDetails.addClass('alerts');
                    $('<div>').text('Alerts').appendTo(alertDiv);//title
                }
                var alertContent = $('<div>').appendTo(alertDiv);//content container

                sch.forEach(element => {
                    $('<div>').addClass('alerts').text(sch).appendTo(alertContent);
                });
                displayData = true;
            }
        }
        switch(attendance[i][column])
        {
            case true:
                attendance[i][column] = 'Absent';
                break;
 
            case false:
                attendance[i][column] = 'Present';
                break;
        }
        var thisDate = new Date(parseInt(monthYear.substring(4)),months.indexOf(monthYear.substring(0,3)))
        var when = today - thisDate;
                
        if(attendance[i][column])
        if(((attendance[i][column] != 'Present')&&(attendance[i][column] != 'Absent'))||(((attendance[i][column] == 'Present')||(attendance[i][column] == 'Absent'))&&(when>0)))
        {
            var attendDiv = $('<div>').addClass('attendance asaa').appendTo(dateAndDetails);
            dateAndDetails.addClass('attendance');
            $('<div>').text('Attendance').appendTo(attendDiv);
            $('<div>').text(attendance[i][column]).appendTo(attendDiv);
            displayData = true;
        }
        if(displayData)
        {
            dateAndDetails.appendTo('#monthDetails');
        }
        
        $(newDate).addClass('dateFromMonthDetails');
        // $('#monthDetails').hide();
        // $('#calendarDd').hide();
        // $('#dateDetails').show();
    }

}

function filterMonthDetails()
{
    var ddval = $('#calendarOnlyDd option:selected').text();
    ddval = ddval.toLowerCase();
    console.log(ddval);



    if(ddval !== 'all')//hide ones that don't have selected dd val
    {   
        $('.dateDiv .' + ddval).slideDown('0.1s','swing');
        $('.' + ddval).slideDown('0.2s','swing');  
        $('.dateDiv').not('.' + ddval).hide();//slideUp('0.1s','swing');    
        $('.asaa').not('.' + ddval).hide();//slideUp('0.1s','swing');     
          
    }
    else
    {
        console.trace();
        $('.dateDiv').slideDown('0.2s','swing');
        $('.asaa').slideDown('0.2s','swing');    
    }
        
}