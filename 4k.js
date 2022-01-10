let keybinds = ["D", "F", "J", "K"];
let presses = 0;

let time_mode = true;
let time_or_clicks = 0;
let running = false;

let setup_number = 0;

function is_int(value) { return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)); }
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

var dps = [];
var dataLength = 20;

// Graph Handler
window.onload = function () {

    // hide scroll bar lol
    document.body.style.overflow = 'hidden';

    var chart = new CanvasJS.Chart("graph", {
        theme: 'dark2',
        backgroundColor: "#001618",
        title :{
            fontSize: 25,
            fontColor: "#eee",
            text: "KPS GRAPH"
        },
        axisX: {gridColor: "#555", title: "Time (Seconds)", gridThickness: 0},
        axisY: {includeZero: true, gridColor: "#555", gridThickess: 1, title: "KPS"},
        data: [{
            type: "line",
            color: 'yellow',
            dataPoints: dps
        }]
    });
    
    this.updateChart = function (count, seconds, kps) {
    
        count = count || 1;
    
        for (var j = 0; j < count; j++) {
            dps.push({
                x: seconds,
                y: kps
            });
        }
    
        if (dps.length > dataLength) {
            dps.shift();
        }
    
        chart.render();
    };
    this.updateChart(dataLength, 0, 0);
}

// Setup Manager
async function proceed_setup(direction)
{
    if (direction == 0)
    {
        //setup_number--;
        show_notification("Not Yet Implemented", "#ff0000");
    }
    else
    {
        setup_number++;

        let ST = document.getElementById("step_text");

        if (setup_number == 1)
        {
            document.getElementById("Key1").style.display = 'none';
            document.getElementById("Key2").style.display = 'none';
            document.getElementById("Key3").style.display = 'none';
            document.getElementById("Key4").style.display = 'none';
            ST.innerHTML = 'Pick A Mode';

            document.getElementById("time").style.display = 'inline-block';
            document.getElementById("time").className = "button";

            document.getElementById("click").style.display = 'inline-block';
            document.getElementById("click").className = "button";
        }
        else if (setup_number == 2)
        {
            document.getElementById("time").style.display = 'none';
            document.getElementById("click").style.display = 'none';
            ST.innerHTML = 'Choose A Value';
            document.getElementById("nextbtn").innerHTML = 'BEGIN';

            document.getElementById("ClickTimeText").style.display = 'inline-block';
            if (time_mode)
            {
                document.getElementById("ClickTimeText").innerHTML = 'End After  <input onkeypress="click_time_amount(event);" type="text" id="Click_Time_Amount" maxlength="2" size="2"></input>  Seconds';
            }
            else
            {
                document.getElementById("ClickTimeText").innerHTML = 'End After  <input onkeypress="click_time_amount(event);" type="text" id="Click_Time_Amount" maxlength="2" size="2"></input>  Clicks';
            }
        }
        else if (setup_number == 3)
        {
            if (isNaN(time_or_clicks) || time_or_clicks <= 0)
            {
                show_notification("Enter A Number Greater Than 0", "#ff0000");
                setup_number--;
                return;
            }

            ST.style.display = 'none';
            document.getElementById("ClickTimeText").style.display = 'none';
            document.getElementById("backbtn").style.display = 'none';
            document.getElementById("nextbtn").style.display = 'none';

            document.getElementById("Countdown").className = "box animate fadeInUp one";
            await sleep(1500);
            document.getElementById("Countdown").innerHTML = "2";
            await sleep(1000);
            document.getElementById("Countdown").innerHTML = "1";
            await sleep(1000);
            document.getElementById("Countdown").innerHTML = "TAP!";
            await sleep(1000);
            document.getElementById("Countdown").style.display = 'none';

            document.getElementById("TimerCount").style.display = 'block';
            document.getElementById("TimerCount").style.position = 'relative';
            document.getElementById("TimerCount").style.bottom = '450px';
            document.getElementById("TimerCount").style.left = '0px';

            document.getElementById("graph").className = "graph";
            document.getElementById("graph").style.display = 'inline-block';
            document.getElementById("graph").style.position = 'relative';
            document.getElementById("graph").style.bottom = '400px';
            document.getElementById("graph").style.left = '0px';

            document.getElementById("KpsLbl").style.display = 'block';
            document.getElementById("KpsLbl").style.position = 'relative';
            document.getElementById("KpsLbl").style.bottom = '490px';
            document.getElementById("KpsLbl").style.left = '-300px';

            document.getElementById("TotalClicks").style.display = 'block';
            document.getElementById("TotalClicks").style.position = 'relative';
            document.getElementById("TotalClicks").style.bottom = '400px';
            document.getElementById("TotalClicks").style.left = '0px';

            document.getElementById("BpmLbl").style.display = 'block';
            document.getElementById("BpmLbl").style.position = 'relative';
            document.getElementById("BpmLbl").style.bottom = '580px';
            document.getElementById("BpmLbl").style.left = '300px';
            
            start();
        }
    }
}

// Get Time Or Clicks For Timer (X Seconds or X Clicks before finishing)
function click_time_amount(event)
{
    let CTElem = document.getElementById("Click_Time_Amount"); 
    let val = Number(CTElem.value + event.key);

    if (!isNaN(val) && is_int(val)) { time_or_clicks = val; }
    else { time_or_clicks = 0; }
}

// Notification Handler
function show_notification(text, colour)
{
    NB = document.getElementById("NotificationBar");
    NT = document.getElementById("NotificationText");

    NT.className = "notification-text box animate fadeInUp one";

    NB.style.display = "block";
    
    NT.style.backgroundColor = colour;
    NT.innerHTML = text;

    setTimeout(function()
    {
        NB.style.display = 'none';
    }, 3000);
}

// Handle Keybind Assignments
function new_keybind(event, key_element)
{
    let KeyElem = document.getElementById("Key" + key_element);
    let Key = event.key.toUpperCase();

    if (keybinds.indexOf(Key) > -1)
    {
        show_notification("Keybind Already In Use!", "#ff0000");
    }
    else
    {
        keybinds[key_element - 1] = Key;
        KeyElem.value = Key;
    }
}

// Handle Keypresses
onkeydown = function(event)
{
    if (event.repeat) { return; }
    if (running)
    {
        let Key = event.key.toUpperCase();
        if (keybinds.indexOf(Key) > -1)
        {
            presses++;
        }
    }
}

// Switch Between Time & Clicks
function switch_mode(mode)
{
    if (running) { return; }
    if (mode == 0)
    {
        time_mode = true;
        document.getElementById("time").style.color = 'magenta';
        document.getElementById("click").style.color = 'gray';
    }
    else
    {
        time_mode = false;
        document.getElementById("click").style.color = 'magenta';
        document.getElementById("time").style.color = 'gray';
    }
}

// Called To Start Everything
function start()
{
    if (time_mode)
    {
        run_timer();
    }
    else
    {
        run_clicks();
    }
}

// Timer Mode
function run_timer()
{
    if (running) { return; }
    running = true;
    let kps = 0;
    let timer = 0;
    let end_timer = time_or_clicks*1000;

    function run_timer_()
    {
        if (!running) { return; }
        
        kps = (presses/(timer/1000)).toFixed(1);
        bpm = ((kps/4) * 30).toFixed(1);

        if (timer % 1000 == 0)
        {
            let TimeLeft = end_timer/1000 - timer/1000;
            if (TimeLeft <= 0) { document.getElementById("TimerCount").innerHTML = "Results"; }
            else if (TimeLeft == 1) { document.getElementById("TimerCount").innerHTML = TimeLeft + " Second Left"; }
            else { document.getElementById("TimerCount").innerHTML = TimeLeft + " Seconds Left"; }

            this.updateChart(dataLength, timer/1000, presses/(timer/1000));
        }

        document.getElementById("TotalClicks").innerHTML = presses + " Clicks";
        document.getElementById("KpsLbl").innerHTML = kps + " KPS";
        document.getElementById("BpmLbl").innerHTML = bpm + " BPM";

        timer = timer + 10;

        if (timer > end_timer)
        {
            timer = 0;
            presses = 0;
            running = false;
            return;
        }
        setTimeout(run_timer_, 10)
    }
    run_timer_();
}

// Click Mode
function run_clicks()
{
    if (running) { return; }
    running = true;
    let timer = 0;
    let kps = 0;

    function run_click_timer()
    {
        if (!running) { return; }
        
        kps = (presses/(timer/1000)).toFixed(1);
        bpm = ((kps/4) * 30).toFixed(1);

        document.getElementById("TimerCount").innerHTML = (time_or_clicks-presses) + " Clicks Left";

        if (timer % 1000 == 0) { this.updateChart(dataLength, timer/1000, presses/(timer/1000)); }

        if (time_or_clicks-presses <= 0) { document.getElementById("TimerCount").innerHTML = "Results"; }

        document.getElementById("TotalClicks").innerHTML = presses + " Clicks";
        document.getElementById("KpsLbl").innerHTML = kps + " KPS";
        document.getElementById("BpmLbl").innerHTML = bpm + " BPM";

        timer = timer + 10;

        if (presses >= time_or_clicks)
        {
            timer = 0;
            presses = 0;
            running = false;
            return;
        }
        setTimeout(run_click_timer, 10)
    }
    run_click_timer();
}