$(document).ready(function () {
   loadDataFromLocal();

   $(".todo-inpput").on("click", "button", function () {
      if ($("#txtId").val() == "") {
         addDataToLocal($(this));
         location.reload(true);
      } else {
         updateDataFromLocal();
      }
   });

   /**Switch Function */
   $(".todo-li").each(function () {
      $(this).on("click", "#custom-toggle", function () {
         switchElement($(this));
      });
   });

   /**Edit element*/
   $(".todo-li").on("click", ".editBtn", function () {
      const title = $(this).parent(".f-button").prevAll(".lable1").find("label").html();
      const id = $(this).parents("li").find("input").attr("data-id");
      $("#input1").val(title);
      $("#txtId").val(id);
      $(".todo-inpput").find("button").html(`<i class="fa-solid fa-file-export"></i>`);
   });

   /*delete*/
   $(".todo-li").on("click", ".deleteBtn", function () {
      const id = $(this).parents("li").attr("id")
      const localArray = JSON.parse(localStorage.getItem("localData"));

      localArray.splice(id > 0 ? 0 : id - 1, 1);

      localStorage.setItem("localData", JSON.stringify(localArray));
      location.reload()
   });

   /*clear All*/
   $(".clear").on("click", function () {
      const clearall = $(this).parents(".todo-body").find(".todo-li").empty();
      localStorage.clear();
      loadDataFromLocal();
   });

   /*filter*/
   $(".btn1").on("click", function () {
      All()
   })
   $(".btn2").on("click", function () {
      Active()
   })
   $(".btn3").on("click", function () {
      Complited()
   })

   /*Timer*/
   $(".todo-li").on("click", "#custom-toggle", function () {
      const timerId = $(this).parent(".wrapper").nextAll(".timer").find(".time").attr("data-timer")
      console.log(timerId)
      if ($(this).val() == 1) {
         resetTimer(timerId);
      } else if ($(this).val() == 2) {
         startTimer(timerId);
      } else if ($(this).val() == 3) {
         stopTimer(timerId);
      }
   });


});

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
   return timers.find(timer => timerId == timer.id);
}

function startTimer(timerId) {
   let localData = JSON.parse(localStorage.getItem("localData"));
   console.log(localData,"localdatad")

   const timer = getTimer(timerId);
   if (!timer.startTime) {
      timer.startTime = moment();
      timer.timerInterval = setInterval(() => updateTimer(timer,localData), 1000);
   }
   console.log("start")
}

function updateTimer(timer,localData) {
 
   const currentTime = moment();
   const duration = moment.duration(currentTime.diff(timer.startTime) + timer.elapsedTime, 'milliseconds');
   const formattedTime = moment.utc(duration.asMilliseconds()).format('h:mm:ss');
   $(`#timer${timer.id}`).text(formattedTime);

    localData.forEach((element) => {
      if(element.id == timer.id){
         return element.starttime = formattedTime;
      } 
   })

   localStorage.setItem("localData", JSON.stringify(localData));
}

function stopTimer(timerId) {
   const timer = getTimer(timerId);
   if (timer.startTime) {
      clearInterval(timer.timerInterval);
      timer.elapsedTime += moment().diff(timer.startTime);
      timer.startTime = null;
   }
   console.log("stop")
}

function resetTimer(timerId) {
   const timer = getTimer(timerId);
   clearInterval(timer.timerInterval);
   timer.startTime = null;
   timer.elapsedTime = 0;
   $(`#timer${timer.id}`).text('0:00:00');
}

console.log(timers)
/*load html data */


function loadDataFromLocal() {
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);
   console.log(localArray)

   if (localdata !== null && localdata !== undefined) {
      localArray.forEach((element) => {
         let dynamicList = `<li class ="" id=${element.id}>`;
         dynamicList += `<div class="wrapper">`;
         dynamicList += `<input type="range" name="points" data-id=${element.id} min="1" step="1" id="custom-toggle" class="${element.color}" max="3" value="${element.state}">`;
         dynamicList += `</div>`;
         dynamicList += `<div class="lable1">`;
         dynamicList += `<label class="titleLable overflow-hidden">${element.title}</label>`;
         dynamicList += `</div>`;
         dynamicList += `<div class="timer">`;
         dynamicList += `<div class="time"  id="timer${element.id}" data-timer=${element.id}>${element.starttime}</div>`
         dynamicList += `</div>`;
         dynamicList += `<div class= "f-button">`;
         dynamicList += `<button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>`;
         dynamicList += `<button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>`;
         dynamicList += `</div>`;
         dynamicList += `</li>`;
         $(".todo-li").append(dynamicList);
         timers.push(createTimer(element.id));
      })
   }
}

/*add data to local storage*/
function addDataToLocal(input1) {
   let localData = localStorage.getItem("localData");
   let input = $(".todo-inpput").find("input");
   let inputval = input.val().trim();

   if (localData) {
      let localArray = JSON.parse(localData);
      if (inputval !== "") {
         const obj = {
            id: localArray.length + 1,
            state: "1",
            color: "tgl-on",
            starttime: "0:00:00",
            stoptime: "0:00:00",
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
            stoptime: "0:00:00",
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

function switchElement(element) { //#custom-toggle switch = element
   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);
   let value = parseInt(element.val(), 10);
   if (value === 1 && state === 1) {
      state = 2;
      element.val(state);
   } else if (value === 2 && state === 2) {
      state = 3;
      element.val(state);
   } else if (value === 3 && state === 3) {
      state = 1;
      element.val(state);
   } else if (value === 2 && state === 3) {
      state = 3;
      element.val(state);
   } else if (value === 1 && state === 2) {
      state = 2;
      element.val(state);
   } else if (value === 2 && state === 1) {
      state = 3;
      element.val(state);
   } else {
      state = 1;
      element.val(state);
   }

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
         data.color = element.attr("class")
      }
      localStorage.setItem("localData", JSON.stringify(localArray));
   });
}

/**Timer */


/*
function timer(element,timerval) {
   let timerInterval;
   let startTime;
   let elapsedTime = 0;
   

   if(timerval == "startTimer"){
      startTimer(element,startTime, timerInterval, elapsedTime)
   }else if(timerval == "stopTimer"){
      stopTimer(element,timerInterval,startTime,elapsedTime)
   }   
}


function startTimer(element,startTime, timerInterval, elapsedTime) {
   startTime = moment();
   timerInterval = setInterval(function () {
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(startTime) + elapsedTime, 'milliseconds');
      formattedTime = moment.utc(duration.asMilliseconds()).format('H:mm:ss');
      element.parent(".wrapper").nextAll(".timer").find(".time").text(formattedTime);
   }, 1000);
}

function stopTimer(element,timerInterval,startTime,elapsedTime) {
   if (timerInterval) {
      clearInterval(timerInterval);
      elapsedTime += moment().diff(startTime);
   }
   console.log(timerInterval,"timerval")
}

function resetTimer() {
   clearInterval(timerInterval);
   elapsedTime = 0;
   $('#timer').text('0:00:00');
}
*/
/**Edit Fuctionality */
function updateDataFromLocal() {
   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);

   const oldRecord = localArray.find((m) => m.id == $("#txtId").val());
   oldRecord.title = $(".todo-inpput").find("#input1").val();
   $(".todo-inpput").find("button").html(`<i class="fa-solid fa-plus"></i>`);
   $("totdo-inpput").find("#input1").val("");
   localStorage.setItem("localData", JSON.stringify(localArray));
   location.reload(true);
}
//Filter
// All list
function All() {
   let val = $(".todo-li").empty()
   loadDataFromLocal()
}
//Pending list
function Active() {
   let val = $(".todo-li").empty()
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);
   const filterArray = localArray.filter((data) => {
      return data.state == "2"
   })
   filterArray.forEach((element) => {
      let dynamicList = `<li class ="" id=${element.id}>`;
      dynamicList += `<div class="wrapper">`;
      dynamicList += `<input type="range" name="points" data-id=${element.id} min="1" step="1" id="custom-toggle" class="${element.color}" max="3" value="${element.state}">`;
      dynamicList += `</div>`;
      dynamicList += `<div class="lable1">`;
      dynamicList += `<label class="titleLable overflow-hidden">${element.title}</label>`;
      dynamicList += `</div>`;
      dynamicList += `<div class="timer">`;
      dynamicList += `<div class="time">hh:mm:ss</div>`
      dynamicList += `</div>`;
      dynamicList += `<div class= "f-button">`;
      dynamicList += `<button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>`;
      dynamicList += `<button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>`;
      dynamicList += `</div>`;
      dynamicList += `</li>`;
      $(".todo-li").append(dynamicList);
   })
}
//Complited list
function Complited() {
   let val = $(".todo-li").empty()
   let localdata = localStorage.getItem("localData");
   let localArray = JSON.parse(localdata);

   const filterArray = localArray.filter((data) => {
      return data.state == "3"
   })
   filterArray.forEach((element) => {
      let dynamicList = `<li class ="" id=${element.id}>`;
      dynamicList += `<div class="wrapper">`;
      dynamicList += `<input type="range" name="points" data-id=${element.id} min="1" step="1" id="custom-toggle" class="${element.color}" max="3" value="${element.state}">`;
      dynamicList += `</div>`;
      dynamicList += `<div class="lable1">`;
      dynamicList += `<label class="titleLable overflow-hidden">${element.title}</label>`;
      dynamicList += `</div>`;
      dynamicList += `<div class="timer">`;
      dynamicList += `<div class="time">hh:mm:ss</div>`
      dynamicList += `</div>`;
      dynamicList += `<div class= "f-button">`;
      dynamicList += `<button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>`;
      dynamicList += `<button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>`;
      dynamicList += `</div>`;
      dynamicList += `</li>`;
      $(".todo-li").append(dynamicList);
   })
}