$(document).ready(function () {
   loadDataFromLocal();

   $(".todo-inpput").on("click", "button", function () {
      addDataToLocal($(this));
   });
   
   /**Switch Function */
   $(".todo-li").each(function () {
      $(this).on("click", "#custom-toggle", function () {
         switchElement($(this))
      });
   });

   /**Edit element*/
   $(".todo-li").on("click", ".editBtn", function () {
      const title = $(this).parent(".f-button").prev(".lable1").find("label").html()
      const id = $(this).parents("li").find("")
      console.log(id)

      $("#input1").val(title);   
      $("#txtId").val(id);
      $(".todo-inpput").find("button").text("save") 


      
      console.log()
      /*editElement($(this));*/
   });


   /*delete*/
   $(".todo-li").on("click", ".deleteBtn", function () {
      $(this).closest("li").remove();
   });
   /*clear All*/
   $(".clear").on("click", function () {
      $(".todo-li").empty();
   });

   /*filter*/
   
});

function loadDataFromLocal() {
   let localdata = localStorage.getItem("localData");

   if (localdata !== null && localdata !== undefined) {
      let localArray = JSON.parse(localdata);
      localArray.forEach((element) => {
         let dynamicList = `<li class ="" id=${element.id}>`;
         dynamicList = dynamicList + `<div class="wrapper">`;
         dynamicList = dynamicList + `<input type="range" name="points" data-id=${element.id} min="1" step="1" id="custom-toggle" class="tgl-on " max="3" value="${element.state}">`;
         dynamicList = dynamicList + `</div>`;
         dynamicList = dynamicList + `<div class="lable1">`
         dynamicList = dynamicList + `<label class="titleLable overflow-hidden">${element.title}</label>`;
         dynamicList = dynamicList + `</div>`
         dynamicList = dynamicList + `<div class= "f-button">`;
         dynamicList = dynamicList + `<button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>`;
         dynamicList = dynamicList + `<button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>`;
         dynamicList = dynamicList + `</div>`;
         dynamicList = dynamicList + `</li>`;
         $(".todo-li").append(dynamicList);
         
      });
   }
}

function addDataToLocal(input1) {
   let localData = localStorage.getItem("localData");
   let input = $(".todo-inpput").find("input");
   let inputval = input.val().trim();
   let color = $(".tgl-on")

   let state = input1.parents(".todo-inpput").next(".todo-body").find("li").find("#custom-toggle").val()
   console.log(state,"state of")

   console.log("color",color)
   if (localData) {
      let localArray = JSON.parse(localData);
      if (inputval !== "") {
         const obj = {
            id: localArray.length + 1,
            state: state,
            color: color,
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
            state: state,
            color:color,
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
   console.log("state11", state)

   value = parseInt(element.val(), 10);
   console.log("value", value)

   if (value === 1 && state === 1) {
      state = 2
      element.val(state);
   } else if (value === 2 && state === 2) {
      state = 3
      element.val(state);
   } else if (state === 3 && value === 3) {
      state = 1
      element.val(state);
   } else if (state === 3 && value === 2) {
      state = 3
      element.val(state);
   } else if (state === 2 && value === 1) {
      state = 2
      element.val(state);
   } else {
      state = 1
      element.val(state);
   }

   if (state === 1) {
      element.removeClass("tgl-off tgl-def").addClass("tgl-on")
   } else if (state === 2) {
      element.removeClass("tgl-on tgl-off").addClass("tgl-def")
   } else if (state === 3) {
      element.removeClass("tgl-def tgl-on").addClass("tgl-off")
   }

   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);

 localArray.forEach(data => {
   if(data.id == element.attr("data-id")){
      data.state = element.val()
      data.color = element.attr()
      console.log(data.state)
   }
   
   localStorage.setItem("localData", JSON.stringify(localArray));
   console.log(localArray)
})
}

/**Edit Fuctionality */


function editElement(element) {
   let listItem = $(element).closest("li");
   let label = listItem.find(".form-check-label");
   let value = label.text();
   let inputedit = $(".todo-inpput").closest("input");
   let buttonedit = $(".todo-inpput").find("button");

   let localData = localStorage.getItem("localData");
   let localArray = JSON.parse(localData);

   console.log(localArray)
   console.log($("#textId").val())

   localArray.find(data => console.log(data.id))


   localStorage.setItem("localData", JSON.stringify(localArray));
   loadDataFromLocal()

   inputedit.replaceWith(`<input type="text" value="${value}">`);
   buttonedit.replaceWith(
      `<button type="button" class=" btn btn-primary"><i class="fa-solid fa-file-export"></i></button>`
   );

   $(".todo-inpput")
      .find("button")
      .on("click", function () {
         saveElement(label);
      });
}

function saveElement(label) {
   let editedValueli = $(".todo-inpput").find("input");
   let editedValueli2 = editedValueli.val();
   let editbutton = $(".todo-inpput").find("button");

   label.replaceWith(
      `<label class="titleLableoverflow-hidden " for="flexSwitchCheckChecked">${editedValueli2}</label>`
   );
   editbutton.replaceWith(
      `<button type="button" class=" btn btn-danger "><i class="fa-solid fa-plus"></i></button>`
   );
   editedValueli.replaceWith(`<input type="text" placeholder="Enter Title"/>`);
   editback();
}

function editback() {
   let button2 = $(".todo-inpput").find("button");
   button2.on("click", function () {
      AppendElement();
   });
}
