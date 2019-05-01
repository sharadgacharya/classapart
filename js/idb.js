// index
// checkDb()
// addStudentDb(obj)
// getStudentDb(val)
// addTestDataDb(obj)
// getTestDataDb(val)
// getStudentIds()

var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB)
   alert("Please install the latest version of chrome or safari and make it your default browser");
// console.log("idb file loaded");
function checkDb()//function to be called at opening of page to check if database exists
{
console.log("checkDb");
var request = idb.open("Class");
request.onerror = function(event) {
  alert("There seems to be an error");
};

request.onupgradeneeded = function(event) {
    console.log("creating student objectstore");
    firstOpen();
    var db = event.target.result;
    var obj = db.createObjectStore("students",{keyPath: "studentId"});
};

request.onsuccess = function(event) {
  var db = event.target.result;
  console.log(db.name + " exists");
  console.log("db closed");
  db.close();
};

}
//add objects to store
function addStudentDb(obj) {
    var request = idb.open("Class");
    console.log("addStudentDb");
    
    request.onsuccess = function(event) {
        var db = event.target.result;
        var tx = db.transaction("students", "readwrite")
        .objectStore("students")
        .put(obj).onsuccess = function(event){
        createObjectStoresForStudent(obj.studentId,obj.subjects);
        makeDataUrl(obj);	
        $(studentList).find('li:not(:first)').remove();//remove the list
        getStudentIds();//repopulate the list
        }
        
        console.log("added student");
    };   
}
function createObjectStoresForStudent(studentId,subjects)
{
    console.log("createSubjectObjectStores");
    var request = idb.open(studentId);
    request.onupgradeneeded = function(event){
        var db = event.target.result;
        for(var i in subjects)
        {
            var obj = db.createObjectStore(subjects[i],{keyPath: "testId", autoIncrement: true});

            obj.onsuccess= function(event){
                console.log("object store created for " + subjects[i]);
            };      
            obj.onerror = function(event){
                console.log("object store not created for" + subjects[i]);
            };
        }
        var obj2 = db.createObjectStore('calendar',{ autoIncrement: true});//calendar object

        obj2.onsuccess= function(event){
            console.log("calendar object store created for " + studentId);
        };      
        obj2.onerror = function(event){
            console.log("calendar object store not created for " + studentId);
        }

        var obj3  = db.createObjectStore('fees',{ autoIncrement: true});//fees object

        obj3.onsuccess= function(event){
            console.log("Fees object store created for " + studentId);
        };      
        obj3.onerror = function(event){
            console.log("Fees object store not created for " + studentId);
        }

        var obj3  = db.createObjectStore('chapterSummary',{ keyPath: 'subject' });//ChapterSummary object

        obj3.onsuccess= function(event){
            console.log("ChapterSummary object store created for " + studentId);
        };      
        obj3.onerror = function(event){
            console.log("ChapterSummary object store not created for " + studentId);
        }

        var obj3  = db.createObjectStore('subjectSummary',{ keyPath: 'subject' });//SubjectSummary object

        obj3.onsuccess= function(event){
            console.log("SubjectSummary object store created for " + studentId);
        };      
        obj3.onerror = function(event){
            console.log("SubjectSummary object store not created for " + studentId);
        }
    };
}

function getObjectStoresForStudent(studentId)
{
    console.log('getObjectStoresForStudent')
    var request = idb.open(studentId);
    request.onsuccess = function(event) {
        console.log("Start data retrieval process");
        var db = event.target.result;
        db.transaction('calendar').objectStore('calendar').get(1).onsuccess = function(event){
            console.log("calendar data received");
            var obj = event.target.result;
            console.log(obj);
            setCalendarMonth(obj.attendance);      
        };

        db.transaction('fees').objectStore('fees').get(1).onsuccess = function(event){
            console.log("calendar data received");
            var obj = event.target.result;
            console.log(obj);
            displayFees(obj);
        };
    };
}
//get objects from store
function getStudentDb(val,status){
    console.log("getStudentDb");
    var request = idb.open("Class");
    console.log("val=" + val);
    request.onsuccess = function(event) {
        console.log("Start data retrieval process");
        var db = event.target.result;
        db.transaction("students").objectStore("students").get(val).onsuccess = function(event){
            console.log("data received");
            var obj = event.target.result;
            console.log(obj);
            if(status !== 'update')
                handleInfo(obj,status);
            else    
                makeDataUrl(obj);
        };
    };
}

function addDataDb(obj) {
    console.log("addDataDb");
    var request = idb.open("Class");
    
    // var val = document.getElementById("name").value;

    request.onsuccess = function(event) {
        console.log("putting data to testdata");
        var db = event.target.result;
        var tx = db.transaction("testData", "readwrite")
        .objectStore("testData")
        .put(obj);
        console.log("added test");
        
        tx.oncomplete = function(event){
            console.log("db closed");
            db.close();
        };

    };   
}

function deleteStudentDb(studentId)
{
    //delete entry from class db
    var request = idb.open("Class");

    request.onsuccess = function(event){
        var db = event.target.result;
        console.log(studentId);
        var tx = db.transaction("students", "readwrite").objectStore("students").delete(studentId)
            .onsuccess = function(event){
                console.log("deleted" + studentId);
                var currentStudent = localStorage.getItem('studentId');
                console.log(currentStudent);
                if(studentId == currentStudent)
                {
                    console.log("removed from localStorage");   
                    deleteStudentDataDb();    //delete student db
                }
            };
    }
}
function deleteStudentDataDb()
{
    console.log('deleteStudentDataDb');
    localStorage.removeItem('studentId');
    localStorage.removeItem('month');
    localStorage.removeItem('year');
    localStorage.removeItem('calendar');
    localStorage.removeItem('fees');
    localStorage.removeItem('subjects');
    localStorage.removeItem('chapters');
    localStorage.removeItem('chapterSummary');
    localStorage.removeItem('subjectSummary');
    localStorage.removeItem('testCount');
    localStorage.removeItem('dbUpdateTime');
}
//get objects from store
function getDataDb(val){
    console.log("getDataDb")
    var request = idb.open("Class");
	    console.log("val=" + val);
	    request.onsuccess = function(event) {
	        console.log("Start data retrieval process");
	        var db = event.target.result;
	    	db.transaction("testData",).objectStore("testData").get(val).onsuccess = function(event){
	        console.log("testData received");
	        var obj = event.target.result;
	        displayInfo(obj);
	    };
    };
}

function getStudentIds()
//gets a list of student ids, should also get the names of the student and that should be added to text and the student id should be added to value and passed to the formdata function.working on this
//working on this.
{
	var request = idb.open("Class");
	var keys;
	request.onerror = function(event) {
	  	alert("There seems to be an error");
	};

	request.onsuccess = function(event) {
	  	var db = event.target.result;
		db.transaction("students",).objectStore("students").getAll().onsuccess = function(event){
	        console.log("all students info received");
	        var obj = event.target.result;
	        addToStudentsList(obj);
	    };
	}

}

function addToSubjectObject(studentId,subject,range)
{
    var request = idb.open(studentId);

	request.onsuccess = function(event){
		var db = event.target.result;
		var tx = db.transaction(subject, "readwrite")
        .objectStore(subject)
        .put(range).onsuccess = function(event){
            console.log("added to subject object");
    	};
    };
}

function getSubjectObjectStores(studentId,subject)
{
    console.log("getSubjectObjectStores");
    var request = idb.open(studentId);
    request.onsuccess = function(event){
        var db = event.target.result;
            var tx = db.transaction(subject).objectStore(subject).getAll();

            tx.onsuccess= function(event){
                var obj = event.target.result;
                $("#testData").empty();
                console.log(obj);
                for(var j in obj)
                    displaySubjectDataRow(subject,obj[j].range);//send data to display
                
            };  

            tx.onerror = function(event){
                console.log("object store not created for" + subjects[i]);
            };
        
    };
}

function getSubjectSummaryObjectStore(studentId,subject)
{
    console.log("getSubjectSummaryObjectStores");
    var request = idb.open(studentId);
    request.onsuccess = function(event){
        var db = event.target.result;
            var tx = db.transaction('subjectSummary').objectStore('subjectSummary').get(subject);

            tx.onsuccess= function(event){
                console.log('subject: ' + subject);
                var obj = event.target.result;
                localStorage.setItem('subjectSummary',JSON.stringify(obj));
                console.log(JSON.stringify(obj));
                updateDropdownsForSubject();
            };  

            tx.onerror = function(event){
                console.log("object store not created for" + subjects[i]);
            };
        
    };
}

function getChapterObjectStore(studentId,subject)//object store has key of subject
{
    console.log("getChapterObjectStore");
    var request = idb.open(studentId);
    request.onsuccess = function(event){
        var db = event.target.result;
            var tx = db.transaction('chapterSummary').objectStore('chapterSummary').get(subject);

            tx.onsuccess= function(event){
                var obj = event.target.result;
                console.log(obj);
                for(var j in obj)
                {
                    localStorage.setItem('chapters',JSON.stringify(obj));
                    displayChapters(obj);//send data to display
                }   
            };  

            tx.onerror = function(event){
                console.log("object store not created for" + subjects[i]);
            };
        
    };
}

function addToCalendarObject(studentId,obj)
{
    var request = idb.open(studentId);
    console.log("addToCalendarObject");
    request.onsuccess = function(event) {
        console.log("Updating student calendar data");
        var db = event.target.result;

        const studentObj = db.transaction('calendar', 'readwrite').objectStore('calendar');

        studentObj.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if(cursor)
            {
                console.log('update object')
                const request = cursor.update(obj);
                    request.onsuccess = function(event) {
                    console.log('updated ' + studentId + ' with calendar details');
                    setCalendarMonth(obj.attendance);
                };
            }
            else//calendar is added. first time
            {
                console.log('create new object')
        		var tx = db.transaction('calendar', "readwrite")
                        .objectStore('calendar')
                        .put(obj).onsuccess = function(event){
                        console.log("added to calendar object");
                        setCalendarMonth(obj.attendance);
    	        };      
            }

        }
    }

}

function updateFeesDetails(studentId,obj)
{
    var request = idb.open(studentId);
    console.log("updateFeesDetails");
    // var val = document.getElementById("name").value;
    
    request.onsuccess = function(event) {
        console.log("Updating student data");
        var db = event.target.result;

        const studentObj = db.transaction('fees', 'readwrite').objectStore('fees');

        studentObj.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if(cursor)
            {
                const request = cursor.update(obj);
                    request.onsuccess = function(event) {
                    console.log('updated ' + studentId + ' with fees details');
                    displayFees(obj);
                }
            }
            else//fees is added. first time
            {
        		var tx = db.transaction('fees', "readwrite")
                        .objectStore('fees')
                        .put(obj).onsuccess = function(event){
                        console.log("added to fees object");
                        displayFees(obj);
    	        };      
            }

        }
    }
}
function updateChapterSummary(studentId,obj)
{
    var request = idb.open(studentId);
    console.log("updateChapterSummary");
    console.log(obj);   
    // var val = document.getElementById("name").value;
    
    request.onsuccess = function(event) {
        var db = event.target.result;
        const studentObj = db.transaction('chapterSummary', 'readwrite').objectStore('chapterSummary');

        studentObj.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if(cursor)
            {
                console.log(cursor.key);
                if(cursor.key == obj.subject)
                {
                    console.log(obj.subject);
                    const request = cursor.update(obj);
                    request.onsuccess = function(event) {
                    console.log('updated ' + obj.subject + ' with chapterSummary');
                    var stored = JSON.parse(localStorage.getItem('chapters'));
                    if(stored)
                        if(stored.subject === obj.subject)
                        {
                            localStorage.setItem('chapters',JSON.stringify(obj));
                        }
                    }
                }
                    
            }
            else//chapterSummary is added. first time
            {
        		var tx = db.transaction('chapterSummary', "readwrite")
                        .objectStore('chapterSummary')
                        .put(obj).onsuccess = function(event){
                        console.log("added to chapterSummary object");
    	        };      
            }
            if(cursor)
            cursor.continue();
        }
    }
}
function updateSubjectSummary(studentId,obj)
{
    var request = idb.open(studentId);
    console.log("updateSubjectSummary");
    // var val = document.getElementById("name").value;
    
    request.onsuccess = function(event) {
        var db = event.target.result;

        const studentObj = db.transaction('subjectSummary', 'readwrite').objectStore('subjectSummary');

        studentObj.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if(cursor)
            {
                if(cursor.key == obj.subject)
                {
                    const request = cursor.update(obj);
                        request.onsuccess = function(event) {
                        console.log('updated ' + studentId + ' with subjectSummary');
                        var stored = JSON.parse(localStorage.getItem('subjectSummary'));
                        if(stored)
                            if(stored.subject === obj.subject)
                            {
                                localStorage.setItem('subjectSummary',JSON.stringify(obj));
                            }
                    }
                }
            }
            else//SubjectSummary is added. first time
            {
        		var tx = db.transaction('subjectSummary', "readwrite")
                        .objectStore('subjectSummary')
                        .put(obj).onsuccess = function(event){
                        console.log("added to subjectSummary object");
    	        };      
            }
            if(cursor)
            cursor.continue();
        }
    }
}