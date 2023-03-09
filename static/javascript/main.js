window.onload = function () {
  var led = document.getElementById("ledPic");
  var button = document.getElementById("btnPic");
  var lcd = document.getElementById("lcdPic");
  var lst = document.getElementById("lstDiv");
  var btn = document.getElementById("btn");
  var pins = document.getElementById("pins");
  
  var moving = false;
  var newImage;

  var X;
  var Y;

  led.addEventListener("mousedown", initialClick.bind(led), false);
  button.addEventListener("mousedown", initialClick.bind(button), false);
  lcd.addEventListener("mousedown", initialClick.bind(lcd), false);
  btn.addEventListener("mousedown", save_as_py, false);

  function show_menu(){
    const pins_lst = ["7", "11", "13", "15", "16", "18", "22", "29", "31", "32", "33", "36", "37"];
    if (pins.style.display === "none") {
      pins.style.display = "block";
    } else {
      pins.style.display = "none";
    }
    var input = document.getElementById("pin");
    var submit = document.getElementById('pin_btn');
    var error = document.getElementById("pin_error");
    var element = this;
    input.value = "";
    error.innerHTML = "";
    pins.style.left = X + 50 + "px";
    pins.style.top = Y + 50 + "px";
    pins.style.position = "absolute";



    submit.onclick = function() {
      if (pins_lst.includes(input.value)){
        console.log("Is in list");
        element.dataset.pin = input.value;
        console.log("Clicked");
      }
      else{
        error.innerHTML = "ERROR: Invalid PIN!";
      }
      
    };

    console.log(X, Y, this.id, this.dataset.pin, element);
  }

  function save_as_py() {
    console.log("Save as RPY");
    
    var lst = document.getElementById("lstDiv").children;
    var text = "from gpiozero import LED, Button\nfrom Adafruit_CharLCD import Adafruit_CharLCD\n\n";
    var led_count = 1;
    var btn_count = 1;
    var lcd_count = 1;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].id == "led") {
          text += `led${led_count} = LED(${lst[i].dataset.pin})`;
          text += "\n";
          led_count++;
        }
        if (lst[i].id == "btn") {
          text += `btn${btn_count} = Button(${lst[i].dataset.pin})`;
          text += "\n";
          btn_count++;
        }
        if (lst[i].id == "lcd") {
          text += `lcd${lcd_count} = Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7, lcd_columns, lcd_rows, lcd_backlight)`;
          text += "\n";
          lcd_count++;
        }
    }

    const file = new Blob([text], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = "code.py";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  };

  function initialClick(e) {
    if (moving) {
      if (this.src === image.src) {
        document.removeEventListener("mousemove", move);
        moving = false;
      }
      return;
  }

  moving = true;
  image = this.getElementsByTagName("img")[0];
  if (image && image.src) {
    newImage = document.createElement("img");
    newImage.src = image.src;
    newImage.style.position = "absolute";
    newImage.style.width = "50px";
    newImage.style.height = "50px";
    lst.appendChild(newImage);
    document.addEventListener("mousemove", move.bind(this, newImage), false);
    newImage.addEventListener("mouseup", function () {
      if (83 < X) {
      document.removeEventListener("mousemove", move);
      component = document.createElement("img");
      component.src = image.src;
      component.id = image.alt;
      component.dataset.pin = "pin";
      component.style.position = "absolute";
      component.style.width = "50px";
      component.style.height = "50px";
      component.style.left = X + "px";
      component.style.top = Y + "px";
      lst.appendChild(component);
      component.addEventListener("mousedown", show_menu, false);
      moving = false;
    }
    else {
      newImage.remove();
    }
    });
  }
}

  function move(newImage, e) {
    if (newImage) {
      var newX = e.clientX - 10;
      var newY = e.clientY - 10;
      X = newX;
      Y = newY;
      newImage.style.left = newX + "px";
      newImage.style.top = newY + "px";
    }
  }
};
