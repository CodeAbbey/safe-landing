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
    term.print('t=' + st.time);
    term.print('  ht=' + Math.round(st.height));
    term.print('  spd=' + Math.round(st.speed));
    term.println('  fuel=' + Math.round(st.fuel));
    term.print('new burn rate: ');
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
        var dv = st.exhaust * dm / (st.mass + st.fuel);
        st.fuel -= dm;
        st.speed += st.gravity * dt - dv;
    }
    st.time += st.tStep;
}

term.println('You are in a rocket approaching the Moon');
report();
term.gets = gets;

