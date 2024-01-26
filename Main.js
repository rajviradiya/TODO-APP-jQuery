$(document).ready(function () {
   /*local storage */
   let todoApp = {
      todoData: []
   }

   /*append element */
   let button = $(".todo-inpput").find("button");

   button.on("click", function () {
      AppendElement()
   });
   /**Switch Function */
   var currentState = 1;
   console.log("currrrr", currentState)

   $(".todo-li").each(function () {   
      $(this).on("click","#custom-toggle", function () {
         currentValue = parseInt($(this).val(), 10);
         console.log("value", currentValue)
         if (currentState === 1 && currentValue !== 1) {
            $(this).val(1);
            updateSwitchUI(1, $(this));
         } else if (currentState === 3 && currentValue === 1) {
            $(this).val(1);
            updateSwitchUI(1, $(this));
         } else {
            var newValue = currentValue === 1 ? 2 : (currentValue === 2 ? 3 : 1);
            $(this).val(newValue);
            updateSwitchUI( $(this).val(), $(this));
           console.log("val",$(this).val())    
           storeStateInLocalStorage($(this).val())     
         }
      })
   });
   /**switch function */
   function updateSwitchUI(value, element) {
      if (value === 1) {
         element.removeClass('tgl-off tgl-def').addClass('tgl-on').addClass('rangeActive');
      } else if (value === 2) {
         element.removeClass('tgl-on tgl-off').addClass('tgl-def').removeClass('rangeActive');
      } else if (value === 3) {
         element.removeClass('tgl-def tgl-on').addClass('tgl-off').addClass('rangeActive');
      }
      currentState = value;
      console.log("state",currentState)
   }
   // Store the updated state in local storage
   function storeStateInLocalStorage(value) {
      let data = JSON.parse(localStorage.getItem('todoApp'));
      data.todoData.forEach((item) => {
         item.currentState = value;
         localStorage.setItem('todoApp', JSON.stringify(data));
      });
   }



   $(".todo-body").on("click", ".btn2", function () {
      ActiveListItems()
   });

   $(".todo-li").on("click", ".editBtn", function () {
      editElement(this)
   });

   $(".todo-li").on("click", ".deleteBtn", function () {
      $(this).closest("li").remove();
   });

   $(".clear").on("click", function () {
      $(".todo-li").empty()
   });

   $('.bt').on("click", function () {
      if ($(this).css("color") === "rgba(10, 10, 10, 0.5)") {
         $(this).css({ "color": "blue" })
      } else {
         $(this).css({ "color": "rgba(10, 10, 10, 0.5)" })
      }
   });



   /**Add Fuctionality */
   function AppendElement(currentState) {
      let input = $(".todo-inpput").find("input");
      let inputval = input.val()
      let list = $(".todo-body").find(".todo-li");


      if (inputval.trim() !== "") {
         StoreData(inputval)
         let Data = `<li class ="">
                     <div class="wrapper switch">
                        <input type="range" name="points" min="1" step="1" id="custom-toggle" class="tgl-on" max="3" value="1">
                        <label class="form-check-label overflow-hidden "for="flexSwitchCheckChecked">${inputval}</label>
                     </div>
                     <div class= "f-button">
                        <button class="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>
                     </div>
                  </li>`
         list.append(Data);
      }
      input.val("")


   }


   /**Edit Fuctionality */
   function editElement(element) {
      let listItem = $(element).closest("li");
      let label = listItem.find(".form-check-label");
      let currentValue = label.text();

      let inputedit = $(".todo-inpput").find("input");
      let buttonedit = $(".todo-inpput").find("button");

      inputedit.replaceWith(`<input type="text" value="${currentValue}">`);
      buttonedit.replaceWith(`<button type="button" class=" btn btn-primary"><i class="fa-solid fa-file-export"></i></button>`);
      $(".todo-inpput").find("button").on("click", function () { saveElement(label) });
   }

   function saveElement(label) {
      let editedValueli = $(".todo-inpput").find("input")
      let editedValueli2 = editedValueli.val();
      let editbutton = $(".todo-inpput").find("button");

      label.replaceWith(`<label class="form-check-label overflow-hidden " for="flexSwitchCheckChecked">${editedValueli2}</label>`)
      editbutton.replaceWith(`<button type="button" class=" btn btn-danger "><i class="fa-solid fa-plus"></i></button>`)
      editedValueli.replaceWith(`<input type="text" placeholder="Enter Title"/>`)
      editback()

   }
   function editback() {
      let button2 = $(".todo-inpput").find("button");
      button2.on("click", function () {
         AppendElement()
      })
   }

   /*Store data in local storage*/

   function StoreData(title) {
      let obj = {
         title: title,
      };
      todoApp.todoData.push(obj)
      localStorage.setItem('todoApp', JSON.stringify(todoApp));
   }




});



