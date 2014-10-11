var term = new JsMonoTerm({selector: "#terminal", w: 60, h: 20});

var st = {};

function report() {
    if (st.fuel <= 0) {
        term.println('*** Fuel tanks are empty ***');
    }
    if (st.height <= 0) {
        term.println();
        term.println('Touch down at ' + st.time + ' sec');
        term.println('Landing speed was: ' + Math.round(st.speed) + ' m/s');
        if (st.speed < 10) {
            term.println('Perfect landing, your contract is prolonged!');
            term.println('Congratulations!');
        } else if (st.speed < 50) {
            term.println('You are still alive, but the craft is damaged!');
            term.println('Waiting for the rescue team...');
        } else {
            term.println('CRASH! Your landing created a new crater');
            term.println(Math.round(st.speed * 0.2727) + ' meters deep!');
        }
        return false;
    }
    term.printf('%4d   %8d   %8d   %8d   %12s', st.time,
            Math.round(st.height), Math.round(st.speed), Math.round(st.fuel),
            ('' + gravity()).substring(0, 4));
    term.println();
    term.print('burning rate: ');
    return true;
}

function gets(str) {
    var rate = parseFloat(str);
    if (isNaN(rate) || rate < 0 || rate > 100) {
        term.println('Please enter a value between 0 and 100...');
    } else {
        makeStep(rate);
        if (!report()) {
            term.println();
            term.println('Hit "ENTER" to try again...');
            term.gets = getsAgain;
            return;
        }
    }
    term.gets = gets;
}

function getsAgain(str) {
    term.clear();
    init();
}

function gravity() {
    return st.gravity * Math.pow(st.radius, 2) / Math.pow(st.radius + st.height, 2);
}

function makeStep(rate) {
    var steps = 100;
    var dt = st.tStep / steps;
    var dm = rate * dt;
    for (var i = 0; i < steps; i++) {
        st.height -= st.speed * dt;
        if (st.height <= 0) {
            st.time += st.tStep * (i + 1) / steps;
            st.height = 0;
            return;
        }
        var dv;
        if (st.fuel <= dm) {
            dm = st.fuel;
        }
        dv = st.exhaust * dm / (st.mass + st.fuel);
        st.fuel -= dm;
        var g = gravity();
        st.speed += g * dt - dv;
    }
    st.time += st.tStep;
}

function init() {
    st.mass = 7500;
    st.fuel = 7500;
    st.height = 200000;
    st.speed = 1600;
    st.gravity = 1.622;
    st.exhaust = 2800;
    st.time = 0;
    st.tStep = 10;
    st.radius = 1737100;
    
    term.println('You are in a rocket approaching the Moon!');
    term.println('Main computer failed (it was not built by DEC)!');
    term.println('You are to perform manual landing by controlling engines');
    term.println('specify fuel burning rate (kgs per second) for each 10 sec');
    term.println('and try to touch down with safe speed. Good luck!!!');
    term.println('Rocket weight: ' + st.mass + ' kg');
    term.println();
    term.println('Time   Height(m)   Speed(m/s)   Fuel(kg)   Gravity(m/s^2)');
    report();
    term.gets = gets;
}

init();

