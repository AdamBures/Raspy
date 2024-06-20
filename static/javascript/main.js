window.onload = function () {
  const led = document.getElementById("ledPic");
  const button = document.getElementById("btnPic");
  const lcd = document.getElementById("lcdPic");

  const lst = document.getElementById("lstDiv");

  const btn = document.getElementById("btn");
  const btn_save_rpy = document.getElementById("btn_save_rpy");
  const open = document.getElementById("btn_open");

  const menu = document.getElementById("menu_check");

  var menu_opened = false;
  var moving = false;
  var newImage;

  var X;
  var Y;

  led.addEventListener("mousedown", initialClick.bind(led), false);
  button.addEventListener("mousedown", initialClick.bind(button), false);
  lcd.addEventListener("mousedown", initialClick.bind(lcd), false);

  btn.addEventListener("mousedown", save_as_py, false);
  btn_save_rpy.addEventListener("mousedown", save_as_rpy, false);
  open.addEventListener("mousedown", open_file, false);

  menu.addEventListener("mousedown", more_components, false);


  function more_components() {
    console.log("Components");
    const components = document.getElementById("menu");

    if (components.style.display === "none") {
      menu_opened = true;
      components.style.display = "block";
      const children = components.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.addEventListener("mousedown", initialClick.bind(child), false);
      }
    } else {
      menu_opened = false;
      components.style.display = "none";
    }
  }


  function show_menu(clickedElement) {
    const pins = document.getElementById("pins");
    const pins_lcd = document.getElementById("lcd_pins")
    
    var submit = document.getElementById('pin_btn');
    var submit2 = document.getElementById('pin_btn2');
    var error = document.getElementById("pin_error");
    var element = clickedElement;
    error.innerHTML = "";

    if (element.id === "lcd") {
      if (pins_lcd.style.display === "none") {
        pins_lcd.style.display = "block";
      } else {
        pins_lcd.style.display = "none";
      }

      var lcd_rs = document.getElementById("lcd_rs");
      var lcd_en = document.getElementById("lcd_en");
      var lcd_d4 = document.getElementById("lcd_d4");
      var lcd_d5 = document.getElementById("lcd_d5");
      var lcd_d6 = document.getElementById("lcd_d6");
      var lcd_d7 = document.getElementById("lcd_d7");
      var lcd_backlight = document.getElementById("lcd_backlight");
      var lcd_columns = document.getElementById("lcd_columns");
      var lcd_rows = document.getElementById("lcd_rows");
      var lcd_message = document.getElementById("lcd_message");

      pins_lcd.style.left = X + 50 + "px";
      pins_lcd.style.top = Y + 50 + "px";
      pins_lcd.style.position = "absolute";

      submit2.onclick = function () {
        console.log("Clicked")
        component.dataset.lcd_rs = lcd_rs.value;
        component.dataset.lcd_en = lcd_en.value;
        component.dataset.lcd_d4 = lcd_d4.value;
        component.dataset.lcd_d5 = lcd_d5.value;
        component.dataset.lcd_d6 = lcd_d6.value;
        component.dataset.lcd_d7 = lcd_d7.value;
        component.dataset.lcd_backlight = lcd_backlight.value;
        component.dataset.lcd_columns = lcd_columns.value;
        component.dataset.lcd_rows = lcd_rows.value;
        component.dataset.message = lcd_message.value;

        var isEmpty = (
          component.dataset.lcd_rs === "" ||
          component.dataset.lcd_en === "" ||
          component.dataset.lcd_d4 === "" ||
          component.dataset.lcd_d5 === "" ||
          component.dataset.lcd_d6 === "" ||
          component.dataset.lcd_d7 === "" ||
          component.dataset.lcd_backlight === "" ||
          component.dataset.lcd_columns === "" ||
          component.dataset.lcd_rows === "" ||
          component.dataset.message === ""
      );

      if (!isEmpty) {
        component.title = "Nakonfigurováno";
      }
      }
    }
    else {
      const pins_lst = ["7", "11", "13", "15", "16", "18", "22", "29", "31", "32", "33", "36", "37"];
      if (pins.style.display === "none") {
        pins.style.display = "block";
      } else {
        pins.style.display = "none";
      }

      var input = document.getElementById("pin");
      input.value = element.dataset.pin == "pin" ? "" : element.dataset.pin;
      pins.style.left = X + 50 + "px";
      pins.style.top = Y + 50 + "px";
      pins.style.position = "absolute";


      if (element.title === "Není nakonfigurováno") {
        element.classList.add("circle");
      }

      submit.onclick = function () {
        if (pins_lst.includes(input.value)) {
          element.dataset.pin = input.value;
          error.innerHTML = "";
          element.title = "Nakonfigurováno";
          element.classList.remove("circle");
        }
        else {
          error.innerHTML = "ERROR: Invalid PIN!";
        }
      }

    };

  }

  function clearDiv(div) {
    div.innerHTML = "";
  }

  function open_file() {
    var fileInput = document.getElementById("fileInput");

    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];

      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var fileContents = reader.result;

        var lines = fileContents.split('\n');

        for (var i = 0; i < lines.length; i++) {
          var type = lines[i].split(' = ')[0];
          var details = lines[i].split(' = ')[1];
          var variables = details.slice(1, -1).split(', ');

          console.log(variables)

          component = document.createElement("img");
          component.id = type.slice(0, 3);
          component.className = "component";
          if (type.includes("lcd")) {
            component.dataset.lcd_rs = variables[2];
            component.dataset.lcd_en = variables[3];
            component.dataset.lcd_d4 = variables[4];
            component.dataset.lcd_d5 = variables[5];
            component.dataset.lcd_d6 = variables[6];
            component.dataset.lcd_d7 = variables[7];
            component.dataset.lcd_backlight = variables[8];
            component.dataset.lcd_columns = variables[9];
            component.dataset.lcd_rows = variables[10];
            component.dataset.message = variables[11];
            component.source = variables[12];
          }
          else {
            component.src = variables[3];
            component.dataset.pin = variables[2];
          }
          component.style.position = "absolute";
          component.style.width = "50px";
          component.style.height = "50px";
          component.style.left = variables[0];
          component.style.top = variables[1];

          component.addEventListener("mousedown", function(event) {
          var clickedElement = event.target;

          if (event.button === 1) {
            event.preventDefault();
            clickedElement.remove();
          } else {
            show_menu(clickedElement);
          }
        }, false);
          
          lst.appendChild(component);
        }
      });

      reader.readAsText(file);
    });

    fileInput.click();
  }

  function save_file(filename, text) {
    const file = new Blob([text], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileUrl;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function save_as_rpy() {
    var lst = document.getElementById("lstDiv").children;
    var text = "";
    // for (var i = 0; i < lst.length; i++) {
    //   if (lst[i].id === "lcd") {
    //     text += `${lst[i].id} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.lcd_rs}, ${lst[i].dataset.lcd_en}, ${lst[i].dataset.lcd_d4}, ${lst[i].dataset.lcd_d5}, ${lst[i].dataset.lcd_d6}, ${lst[i].dataset.lcd_d7}, ${lst[i].dataset.lcd_columns}, ${lst[i].dataset.lcd_rows}, ${lst[i].dataset.lcd_backlight}, ${lst[i].dataset.message}, ${lst[i].src})`;
    //     text += "\n";
    //   }
    //   else {
    //     text += `${lst[i].id} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
    //     text += "\n";
    //   }
    // }

    var led_count = 1;
    var btn_count = 1;
    var lcd_count = 1;
    for (var i = 0; i < lst.length; i++) {
      if (lst[i].id == "led") {
        text += `led${led_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "light") {
        text += `light${led_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "motion") {
        text += `motion${led_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "motor") {
        text += `motor${led_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "cam") {
        text += `cam${led_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "btn") {
        text += `btn${btn_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
        btn_count++;
      }
      if (lst[i].id == "lcd") {
        text += `lcd${lcd_count} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.lcd_rs}, ${lst[i].dataset.lcd_en}, ${lst[i].dataset.lcd_d4}, ${lst[i].dataset.lcd_d5}, ${lst[i].dataset.lcd_d6}, ${lst[i].dataset.lcd_d7}, ${lst[i].dataset.lcd_columns}, ${lst[i].dataset.lcd_rows}, ${lst[i].dataset.lcd_backlight}, ${lst[i].dataset.message}, ${lst[i].src})`;
        text += "\n";
        lcd_count++;
      }
    }


    var title = prompt("Vložte název souboru:", "Název");
    if (title == null) {
        title = "template.rpy";
    }
    else {
      title += ".rpy";
    }
    save_file(title, text);

    var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;


    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ title: title, content: text })
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  function save_as_py() {
    var lst = document.getElementById("lstDiv").children;
    var text = "from gpiozero import *\nfrom Adafruit_CharLCD import Adafruit_CharLCD\nfrom picamera import Picamera\n";
    var led_count = 1;
    var btn_count = 1;
    var lcd_count = 1;
    for (var i = 0; i < lst.length; i++) {
      if (lst[i].id == "led") {
        text += `led${led_count} = LED(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "light") {
        text += `light${led_count} = LightSensor(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "motion") {
        text += `motion${led_count} = MotionSensor(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "motor") {
        text += `motor${led_count} = Motor(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "cam") {
        text += `cam${led_count} = Picamera(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }

      if (lst[i].id == "btn") {
        text += `btn${btn_count} = Button(${lst[i].dataset.pin})`;
        text += "\n";
        btn_count++;
      }
      if (lst[i].id == "lcd") {
        text += `lcd${lcd_count} = Adafruit_CharLCD(${lst[i].dataset.lcd_rs}, ${lst[i].dataset.lcd_en}, ${lst[i].dataset.lcd_d4}, ${lst[i].dataset.lcd_d5}, ${lst[i].dataset.lcd_d6}, ${lst[i].dataset.lcd_d7}, ${lst[i].dataset.lcd_columns}, ${lst[i].dataset.lcd_rows}, ${lst[i].dataset.lcd_backlight})`;
        text += "\n";
        text += `lcd${lcd_count}.message(${lst[i].dataset.message})`
        text += "\n";
        lcd_count++;
      }
    }

      var title = prompt("Vložte název souboru:", "Název");
      if (title == null) {
          title = "code.py";
      }
      else {
        title += ".py";
      }
      save_file(title, text);

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
      newImage.style.left = X + "px";
      newImage.style.top = Y + "px";
      lst.appendChild(newImage);
      document.addEventListener("mousemove", move.bind(this, newImage), false);
      newImage.addEventListener("mouseup", create_img);
    }
  }

  function create_img() {
    var can_place = true;
    if (83 < X) {
      if (menu_opened){
        if (X < 383){
          newImage.remove();
          can_place = false;
          moving = false;
        }
        else{
          can_place = true;
        }
      }
      if (can_place) {
        document.removeEventListener("mousemove", move);
      component = document.createElement("img");
      component.src = image.src;
      component.id = image.alt;
      component.title = "Není nakonfigurováno";
      component.className = "component";
      if (image.alt === "lcd") {
        component.dataset.lcd_rs = "lcd_rs";
        component.dataset.lcd_en = "lcd_en";
        component.dataset.lcd_d4 = "lcd_d4";
        component.dataset.lcd_d5 = "lcd_d5";
        component.dataset.lcd_d6 = "lcd_d6";
        component.dataset.lcd_d7 = "lcd_d7";
        component.dataset.lcd_backlight = "lcd_backlight";
        component.dataset.lcd_columns = "lcd_columns";
        component.dataset.lcd_rows = "lcd_rows";
        component.dataset.message = "message";
      }
      else {
        component.dataset.pin = "pin";
      }
      component.style.position = "absolute";
      component.style.width = "50px";
      component.style.height = "50px";
      component.style.left = X + "px";
      component.style.top = Y + "px";
      lst.appendChild(component);

      component.addEventListener("mousedown", function(event) {
        var clickedElement = event.target;

        if (event.button === 1) {
          event.preventDefault();
          clickedElement.remove();
        } else {
          show_menu(clickedElement);
        }
      }, false);

      moving = false;
      }
      
    }

    else {
      newImage.remove();
      moving = false;
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
