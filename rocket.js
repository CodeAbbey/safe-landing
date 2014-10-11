var term = new JsMonoTerm({selector: "#terminal", w: 60, h: 20});

var st = {
    mass: 7500,
    fuel: 7500,
    height: 200000,
    speed: 1600,
    gravity: 1.62,
    exhaust: 2800,
    time: 0,
    tStep: 10
};

function report() {
    if (st.fuel <= 0) {
        term.printl('No more fuel!');
    }
    if (st.height <= 0) {
        term.println('Touch down!');
        term.println('Landing speed was: ' + Math.round(st.speed) + ' m/s');
        if (st.speed < 5) {
            term.println('Perfect landing, your contract is prolonged!');
            term.println('Congratulations!');
        } else if (st.speed < 50) {
            term.println('You are still alive, but the craft is damaged!');
            term.println('Waiting for the rescue team...');
        } else {
            term.println('CRASH! Your landing created a new crater');
            term.println(Math.round(st.speed * 4) + ' meters deep!');
        }
    }
    term.printf('%4d   %8d   %8d   %8d', st.time,
            Math.round(st.height), Math.round(st.speed), Math.round(st.fuel));
    term.println();
    term.print('new burning rate: ');
}

function gets(str) {
    var rate = parseFloat(str);
    makeStep(rate);
    report();
    term.gets = gets;
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
        st.speed += st.gravity * dt - dv;
    }
    st.time += st.tStep;
}

term.println('You are in a rocket approaching the Moon!');
term.println('Main computer failed (it was not built by DEC)!');
term.println('You are to perform manual landing by controlling engines');
term.println('specify fuel burning rate (kgs per second) for each 10 sec');
term.println('and try to touch down with safe speed. Good luck!!!');
term.println();
term.println('Time   Height(m)   Speed(m/s)   Fuel(kg)');
report();
term.gets = gets;

