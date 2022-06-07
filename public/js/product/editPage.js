console.log("edit page script loaded...");

const startTimeLabel = document.getElementById("startTime");

startTime = new Date(startTime);
const year = startTime.getFullYear();
const month = startTime.getMonth() + 1 + "";
const day = startTime.getDate() + "";
const hour = startTime.getHours() + "";
const minute = startTime.getMinutes() + "";

const dateControl = document.querySelector('input[type="datetime-local"]');
dateControl.value = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;