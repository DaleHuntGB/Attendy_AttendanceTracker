// CheckIn.js
// Functionality for CheckIn page. Captures and stores attendance information

// 03 March 2023

// Functionality

// TO DO - Check if localstorage item exists. If it does, use it, if not, fetch json

// TO DO check room and time against lut to get current module in setModule()

// ---------------- // 
// Global Variables // 
// ---------------- // 
let currentTime; 
let timeDisplay = document.querySelector("#CheckInTime")
let data; // JSON Data
let currentModule;

// HTML Elements // 
let submitButton = document.querySelector("#Submit");

// --------- //
// Functions // 
// --------- // 

// Async Fetch Json 
async function fetchAttendanceJson() {
    await fetch("/Scripts/AttendanceData.json")
    .then(res => res.json())
    .then(resJson => {
        data = resJson; 
    });
}

// Update Time Field
let getFormattedTime = () =>
{
    let currentTime = new Date();
    let hours = currentTime.getHours()
    let minutes = currentTime.getMinutes()

    if (minutes < 10) {minutes = "0" + minutes};

    let formattedTime = hours + ":" + minutes;

    // New
    return formattedTime; 
}

let checkIn = () => 
{

    let studentID = document.querySelector("#StudentID").value;
    let roomNumber = document.querySelector("#RoomNumber").value;
    let checkInTime = document.querySelector("#CheckInTime").value;

    setCurrentModule(); 

    // Create new attendance object
    let attendanceObj = {}; 
    
    attendanceObj.type = "lecture"; 
    attendanceObj.date = Date.now(); 
    attendanceObj.room = roomNumber;
    attendanceObj.time = getFormattedTime(); 
    
    data.data[studentID].attendance[currentModule].entries.push(attendanceObj);
    data.data[studentID].attendance[currentModule].entries_num++; 
    data.data[studentID].attendance[currentModule].meetings++;  

    console.log("New attendance record created" + attendanceObj); 

    // Update Local Storage
    updateJsonContent(data, studentID); 
    window.location.assign("./Home.html");
}

let setCurrentModule = () => 
{
    currentModule = "CI517"; 
}

let updateJsonContent = (_newData, _studentID) => 
// Prep for handover to attendance details page
{  
    // add logged in student to local storage (demo only)
    localStorage.setItem('studentID', _studentID); 

    // Add JSON to local storage for this session
    localStorage.setItem('jsonData', JSON.stringify(_newData)); 
    console.log("Local storage updated..."); 
    console.log(localStorage.getItem('jsonData')); 
}

let resetDemo = () => 
// Reset Demo
{
    localStorage.clear(); 
    window.location.reload(); 
}

// Check if localstorage in use / demo in progress
if (localStorage.getItem('jsonData') != null)
{
    data = JSON.parse(localStorage.getItem('jsonData')); 
    console.log("Found local data"); 
} 
else 
{
    data = fetchAttendanceJson(); 
    console.log("Retrieved JSON data"); 
}

// Get Data from URL parameters
try 
{
    let urlParams = new URLSearchParams(window.location.search); 
    let currentRoom = urlParams.get('room_number'); 
}
catch (err) 
{
    console.warn("No url parameters provided"); 
}

// Button Event Listener
submitButton.addEventListener("click", checkIn); 

// Update Time Field
timeDisplay.value = getFormattedTime();