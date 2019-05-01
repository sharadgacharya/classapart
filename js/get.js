// index
// getInfo(par)
// getData(par)
var scripturl = "https://script.google.com/macros/s/AKfycbzTLFsAE8i4dAZEw_iFLEQyVDtAMKnnSyNq6_iu/exec?";

//fetch batch info and student info
// function getInfo(par){
// console.log("getInfo");
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//     console.log(this.readyState);
//     console.log(this.status);
//     if (this.readyState == 4 && this.status == 200) {
//         var obj = JSON.parse(this.responseText);
//         $('body').css('background-color','white');
//     	handleInfo(obj);
//     }
// };		
// var contentUrl = scripturl + par ;//create a url with parameters
// xmlhttp.open("GET",contentUrl, true);
// xmlhttp.send();

// };
//new implementation using ajax that allows CORS and thus can run user accessing the app for the webapp server
function getInfo(par)
{
    var url = scripturl + 'callback=handleInfo&' + par;
    console.log(url);
    var request = jQuery.ajax({
      crossDomain: true,
      url: url,
      method: "GET",
      dataType: "jsonp"
    });

}

//fetch data from student sheet. 
// function getData(studentId,par){
// console.log("getData");
// var xmlhttp = new XMLHttpRequest();
// xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         var obj = JSON.parse(this.responseText);
//     	handleData(studentId,obj);
// 	}
// };
// var contentUrl = scripturl + par ;//create a url with parameters
// xmlhttp.open("GET",contentUrl, true);
// xmlhttp.send();

// };

function getData(studentId,par)
{
    var url = scripturl + 'callback=handleData&' + par;
    console.log(url);
    var request = jQuery.ajax({
      crossDomain: true,
      url: url,
      method: "GET",
      dataType: "jsonp"
    });

}