$(document).ready(function () {
   startRunningTimersOnLoad();
   loadDataFromLocal();
   /*add loclal storage & update data*/
   $(".todo-inpput").on("click", "button", function () {
      if ($("#txtId").val() == "") {
         addDataToLocal($(this));
         $(".todo-li").empty();
         loadDataFromLocal();
      } else {
         updateDataFromLocal();
         $(".todo-li").empty();
         loadDataFromLocal();
      }
   });
   /**Switch Function */
   $(".todo-li").each(function () {
      $(this).on("click", "#custom-toggle", function () {
         switchElement($(this));
         $(".todo-li").empty();
         loadDataFromLocal();
      });
   });
   /**Edit element*/
   $(".todo-li").on("click", ".editBtn", function () {
      const title = $(this).parent(".f-button").prevAll(".lable1").find("label") .html();
      const id = $(this).parents("li").find("input").attr("data-id");
      $("#input1").val(title);
      $("#txtId").val(id);
      $(".todo-inpput").find("button").html(`<i class="fa-solid fa-file-export"></i>`);
   });
   /*delete*/
   $(".todo-li").on("click", ".deleteBtn", function () {
      const id = $(this).parents("li").attr("id");
      const localArray = JSON.parse(localStorage.getItem("localData"));
      localArray.splice(findIndexById(localArray, parseInt(id)), 1);
      localStorage.setItem("localData", JSON.stringify(localArray));
      function findIndexById(array, id) {
         for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
               return i;
            }
         }
         return -1;
      }
      $(".todo-li").empty();
      loadDataFromLocal();
   });
   /*clear All*/
   $(".clear").on("click", function () {
      const clearall = $(this).parents(".todo-body").find(".todo-li").empty();
      localStorage.clear();
      loadDataFromLocal();
      location.reload()
   });
   /*filter*/
   $(".btn1").on("click", function () {
      $(".todo-li").empty();
      loadDataFromLocal();
   });
   $(".btn2").on("click", function () {
      Active();
   });
   $(".btn3").on("click", function () {
      Complited();
   });
   /*Timer*/
   $(".todo-li").on("click", "#custom-toggle", function () {
      const timerId = $(this).parent(".wrapper").nextAll(".timer").find(".time").attr("data-timer");
      if ($(this).val() == 1) {
         resetTimer(timerId);
      } else if ($(this).val() == 2) {
         startTimer(timerId);
      } else if ($(this).val() == 3) {
         stopTimer(timerId);
      }
   });
});

/*load data */
function loadDataFromLocal() {
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);
   if (localdata !== null && localdata !== undefined) {
      htmlload(localArray)
   }
}
/**Html */
function htmlload(localArray) {
   localArray.forEach((element) => {
      let dynamicList = `<li class ="" id=${element.id}>`;
      dynamicList += `<div class="wrapper">`;
      dynamicList += `<input type="range" name="points" data-id=${element.id} min="1" step="1" id="custom-toggle" class="${element.color}" max="3" value="${element.state}">`;
      dynamicList += `</div>`;
      dynamicList += `<div class="lable1">`;
      dynamicList += `<label class="titleLable overflow-hidden">${element.title}</label>`;
      dynamicList += `</div>`;
      dynamicList += `<div class="timer">`;
      dynamicList += `<div class="time"  id="timer${element.id}" data-timer=${element.id}>${element.currentTime}</div>`;
      dynamicList += `</div>`;
      dynamicList += `<div class= "f-button">`;
      dynamicList += `<button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>`;
      dynamicList += `<button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>`;
      dynamicList += `</div>`;
      dynamicList += `</li>`;
      $(".todo-li").append(dynamicList);
      timers.push(createTimer(element.id));
   });
}
/*add data to local storage*/
function addDataToLocal(input1) {
   let localData = localStorage.getItem("localData");
   let input = $(".todo-inpput").find("input");
   let inputval = input.val().trim();
   if (localData) {
      let localArray = JSON.parse(localData);
      if (inputval !== "") {
         let maxId = localArray.reduce((max, obj) => Math.max(max, obj.id), 0);
         const obj = {
            id: maxId + 1,
            state: "1",
            color: "tgl-on",
            starttime: "0:00:00",
            currentTime: "0:00:00",
            endtime: "0:00:00",
            title: inputval,
         };
         localArray.push(obj);
         localStorage.setItem("localData", JSON.stringify(localArray));
         input.val("");
      }
   } else {
      if (inputval !== "") {
         let arryObj = [];
         let obj = {
            id: 1,
            state: "1",
            color: "tgl-on",
            starttime: "0:00:00",
            currentTime: "0:00:00",
            endtime: "0:00:00",
            title: inputval,
         };
         arryObj.push(obj);
         localStorage.setItem("localData", JSON.stringify(arryObj));
         input.val("");
      }
   }
}
/**switch function */
let state = 1;
function switchElement(element) {
   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);
   let value = parseInt(element.val(), 10);
   if ((value === 1 && state === 1) || (value === 1 && state === 2) || (value === 2 && state === 1)
   ) {
      state = 2;
   } else if ((value === 2 && state === 2) || (value === 2 && state === 3) || (value === 1 && state === 3) || (value === 3 && state === 2)
   ) {
      state = 3;
   } else if ((value === 3 && state === 3) || (value === 3 && state === 1)) {
      state = 1;
   } else {
      state = 1;
   }
   element.val(state);
   if (state === 1) {
      element.removeClass("tgl-off tgl-def").addClass("tgl-on");
   } else if (state === 2) {
      element.removeClass("tgl-on tgl-off").addClass("tgl-def");
   } else if (state === 3) {
      element.removeClass("tgl-def tgl-on").addClass("tgl-off");
   }
   localArray.find((data) => {
      if (data.id == element.attr("data-id")) {
         data.state = element.val();
         data.color = element.attr("class");
      }
      localStorage.setItem("localData", JSON.stringify(localArray));
   });
}
/**Timer */
const timers = [];
function createTimer(timerId) {
   return {
      id: timerId,
      startTime: null,
      timerInterval: null,
      elapsedTime: 0,
   };
}
function getTimer(timerId) {
   return timers.find((timer) => timerId == timer.id);
}
function startRunningTimersOnLoad() {
   let localData = JSON.parse(localStorage.getItem("localData"));
   if (localData) {
      localData.forEach((element) => {
         if (element.state == "2") {
            const timer = createTimer(element.id);
            timer.elapsedTime = element.elapsedTime || 0;
            timer.startTime = element.starttime ? moment(element.starttime, "H:mm:ss") : null;
            timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
            timers.push(timer);
         }
      });
   }
}
// start timer
function startTimer(timerId) {
   let localData = JSON.parse(localStorage.getItem("localData"));
   let time = moment().format("H:mm:ss");
   localData.forEach((element) => {
      if (element.id == timerId) {
         element.starttime = time;
      }
   });
   localStorage.setItem("localData", JSON.stringify(localData));
   const timer = getTimer(timerId);
   if (!timer.startTime) {
      timer.startTime = moment();
      timer.timerInterval = setInterval(() => updateTimer(timer), 1000);
   }
}
//update timer
function updateTimer(timer) {
   let localData = JSON.parse(localStorage.getItem("localData"));
   const currentTime = moment();
   const duration = moment.duration(currentTime.diff(timer.startTime) + timer.elapsedTime,"milliseconds");
   const formattedTime = moment.utc(duration.asMilliseconds()).format("H:mm:ss");
   $(`#timer${timer.id}`).text(formattedTime);

   localData.forEach((element) => {
      if (element.id == timer.id) {
         element.currentTime = formattedTime
      }
   });
   localStorage.setItem("localData", JSON.stringify(localData));
}
//stop timer
function stopTimer(timerId) {
   let localData = JSON.parse(localStorage.getItem("localData"));
   let time = moment().format("h:mm:ss");
   localData.forEach((element) => {
      if (element.id == timerId) {
         element.endtime = time;
      }
   });
   localStorage.setItem("localData", JSON.stringify(localData));
   const timer = getTimer(timerId);
   if (timer.startTime) {
      clearInterval(timer.timerInterval);
      timer.elapsedTime += moment().diff(timer.startTime);
      timer.startTime = null;
   }
}
//reset timer
function resetTimer(timerId) {
   const timer = getTimer(timerId);
   clearInterval(timer.timerInterval);
   timer.startTime = null;
   timer.elapsedTime = 0;
   $(`#timer${timer.id}`).text("0:00:00");
   let localData = JSON.parse(localStorage.getItem("localData"));
   localData.forEach((element) => {
      if (element.id == timerId) {
         element.starttime = "0:00:00";
         element.endtime = "0:00:00";
         element.currentTime = "0:00:00";
      }
   });
   localStorage.setItem("localData", JSON.stringify(localData));
}
/**Edit Fuctionality */
function updateDataFromLocal() {
   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);
   const oldRecord = localArray.find((m) => m.id == $("#txtId").val());
   oldRecord.title = $(".todo-inpput").find("#input1").val();
   $(".todo-inpput").find("button").html(`<i class="fa-solid fa-plus"></i>`);
   $("totdo-inpput").find("#input1").val("");
   localStorage.setItem("localData", JSON.stringify(localArray));
}
//Filter
//Pending list
function Active() {
   $(".todo-li").empty();
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);
   const filterArray = localArray.filter((data) => {
      return data.state == "2";
   });
   htmlload(filterArray)
}
//Complited list
function Complited() {
   $(".todo-li").empty();
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);

   const filterArray = localArray.filter((data) => {
      return data.state == "3";
   });
   htmlload(filterArray)
}