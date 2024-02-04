function init_plotting(data) {

    const config = {
        displayModeBar: false, // hide toolbar
        responsive: true // resize 
    };

    var layout = {
        hovermode: 'closest',
        scene: {
            xaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1, 1.1]
            },
            yaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1, 1.1]
            },
            zaxis: {
                showspikes: false,
                showgrid: false,
                zeroline: false,
                showline: false,
                visible: false,
                ticks: '',
                showticklabels: false,
                range: [-1.1, 1.1]
            },
            camera: {
                center: {
                    x: 0, y: 0, z: 0
                },
                eye: {
                    x: -0.9, y: 1, z: 0.6
                },
                projection: 'perspective'
            }
        },
        showlegend: false,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        annotations: [
            {
                showarrow: false,
                text: 'bloch.kherb.io',
                x: 1.0,
                y: 0.0,
                xref: 'paper',
                yref: 'paper',
                xanchor: 'right',
                yanchor: 'bottom',
                opacity: 0.4
            }
        ]

    };

    Plotly.react('myDiv', data, layout, config);
}

function cylinder_axes(v, k = [2, 0, 0]) {
    // v needs to be normalized, k must not be parallel to v
    // t is height
    //k = [2,0,0];
    //vp = (k+p2)-((k+p2)*p2)*p2;
    //c = vp/norm(vp);
    //p = (1-t)*p2 + c*d*cos(phi) + u*d*sin(phi);
    qp = math.subtract(k, math.dotMultiply(Array(3).fill(math.dot(v, k)), v));
    //console.log(qp);
    q = math.dotMultiply(qp, Array(3).fill(1 / math.norm(qp, 2)));
    //console.log("-----------");
    //console.log(q);
    p = math.cross(v, q);
    p = math.dotMultiply(p, Array(3).fill(1 / math.norm(p, 2)));
    //console.log("+++++++++++")
    //console.log(p);
    return [q, p]

}

function gen_vector_plot(vector, normalize = true) {
    color = document.getElementById('spin_color').value;
    [u, v, w] = vector;
    if (normalize === true) {
        l = math.sqrt(u ** 2 + v ** 2 + w ** 2);
        u = u / l;
        v = v / l;
        w = w / l;
    }
    //console.log("NUR ZUR SICHERHEIT");
    //console.log(u);
    //console.log(v);
    //console.log(w);
    hovertext = '|Ψ〉= |0〉+ 0.5 |1〉<extra></extra>';

    /*var upp = {
        name: 'stick',
        showscale: false,
        type: 'streamtube',
        hovertemplate: hovertext,
        sizeref: 0.5,
        u: [u*0.9],
        v: [v*0.9],
        w: [w*0.9],
        x: [0],
        y: [0],
        z: [0],
        starts: {
            x: 0,
            y: 0,
            z: 0
        }
        }
        */

    /*
    var upp = {
        name: 'stick',
        showscale: false,
        type: 'scatter3d',
        mode: 'lines',
        hovertemplate: hovertext,
        width: 5,
        x: [0,u*0.9],
        y: [0,v*0.9],
        z: [0,w*0.9],
        line: {color: '#000000', width:9},
        }
    */


    zax = [u, v, w];
    [q, p] = cylinder_axes(zax);

    xarr = Array(0);
    yarr = Array(0);
    zarr = Array(0);

    //console.log("q is");
    //console.log(q);
    //console.log("p is")
    //console.log(p);
    //console.log("zarr is");
    //console.log(zarr);

    //console.log("Jetzt kommt Schleife");
    for (var i = 0; i < 7; i++) {
        phi = 2 * Math.PI * i / 6;
        r = 0.025;
        l = 0.9
        //console.log(phi);
        //console.log(math.cos(phi));
        //console.log(q[0]*math.cos(phi)+p[0]*math.sin(phi));
        //console.log("############");
        xarr.push([(q[0] * math.cos(phi) + p[0] * math.sin(phi)) * r, (q[0] * math.cos(phi) + p[0] * math.sin(phi)) * r + zax[0] * l]);
        //xarr.push(q[0]*math.cos(phi)+p[0]*math.sin(phi)+zax[0]);

        yarr.push([(q[1] * math.cos(phi) + p[1] * math.sin(phi)) * r, (q[1] * math.cos(phi) + p[1] * math.sin(phi)) * r + zax[1] * l]);
        //yarr.push(q[1]*math.cos(phi)+p[1]*math.sin(phi)+zax[1]);

        zarr.push([(q[2] * math.cos(phi) + p[2] * math.sin(phi)) * r, (q[2] * math.cos(phi) + p[2] * math.sin(phi)) * r + zax[2] * l]);
        //zarr.push(q[2]*math.cos(phi)+p[2]*math.sin(phi)+zax[2]);

    }

    //console.log(xarr);
    //console.log(yarr);
    //console.log(zarr);


    //phiT = linspace(0,2*Math.PI,12);
    //zT = [0,0.8];
    //[uT,vT] = meshgrid(zT,phiT);
    //xT =  math.dotMultiply(math.map(vT,math.cos),0.025);
    //yT =  math.dotMultiply(math.map(vT,math.sin),0.025);  

    var upp = {
        name: 'tail',
        x: xarr, y: yarr, z: zarr,
        type: 'surface',
        colorscale: [['0.0', color], ['1.0', color]],
        showscale: false,
        opacity: 1.0,
        //hoverinfo: 'skip',
        hovertemplate: hovertext,
        contours: {
            x: {
                highlight: false
            },
            y: {
                highlight: false
            },
            z: {
                highlight: false
            }
        }
    };
    var head = {
        u: [0.3 * (u)],
        v: [0.3 * (v)],
        w: [0.3 * (w)],
        sizemode: 'absolute',
        sizeref: .25,
        hovertemplate: hovertext,
        colorscale: [['0.0', color], ['1.0', color]],
        showscale: false,
        type: 'cone',
        anchor: 'tip',
        x: [u],
        y: [v],
        z: [w]
    }
    //console.log(upp);
    return [head, upp]
}

function gen_bloch_sphere() {

    theta = linspace(0, Math.PI, 20);
    phi = linspace(0, 2 * Math.PI, 40);
    [u, v] = meshgrid(theta, phi);
    su = math.map(u, math.sin);
    xs = math.dotMultiply(math.map(v, math.cos), su);
    ys = math.dotMultiply(math.map(v, math.sin), su);
    zs = math.map(u, math.cos);
    //console.log("Here is the sphere");
    //console.log(xs);
    //console.log(ys);
    //console.log(zs);


    var x = []
    var y = []
    var z = []
    var xb = []
    var yb = []
    var zb = []
    for (var i = 0; i < 12; i++) {
        //meridians 
        t = i * math.PI / 6;
        xcurr = math.multiply(math.map(theta, math.sin), math.cos(t));
        ycurr = math.multiply(math.map(theta, math.sin), math.sin(t));
        zcurr = math.map(theta, math.cos);
        if ([0, 3, 6, 9].includes(i)) {
            xb = xb.concat(xcurr);
            xb = xb.concat([null]);

            yb = yb.concat(ycurr);
            yb = yb.concat([null]);

            zb = zb.concat(zcurr);
            zb = zb.concat([null]);

        }
        else {
            x = x.concat(xcurr);
            x = x.concat([null]);

            y = y.concat(ycurr);
            y = y.concat([null]);

            z = z.concat(zcurr);
            z = z.concat([null]);
        }

    }
    for (var i = 1; i < 9; i++) {
        //parallels
        t = i * math.PI / 6;
        xcurr = math.multiply(math.map(phi, math.cos), math.sin(t));
        ycurr = math.multiply(math.map(phi, math.sin), math.sin(t));
        zcurr = Array(phi.length).fill(math.cos(t));

        if ([3].includes(i)) {
            xb = xb.concat(xcurr);
            xb = xb.concat([null]);

            yb = yb.concat(ycurr);
            yb = yb.concat([null]);

            zb = zb.concat(zcurr);
            zb = zb.concat([null]);
        }
        else {
            x = x.concat(xcurr);
            x = x.concat([null]);

            y = y.concat(ycurr);
            y = y.concat([null]);

            z = z.concat(zcurr);
            z = z.concat([null]);
        }
    }

    var sphere = {
        name: 'sphere',
        x: xs, y: ys, z: zs,
        type: 'surface',
        colorscale: [['0.0', '#AAAAAA'], ['1.0', '#AAAAAA']],
        showscale: false,
        opacity: 0.1,
        hoverinfo: 'skip',
        contours: {
            x: {
                highlight: false
            },
            y: {
                highlight: false
            },
            z: {
                highlight: false
            }
        }
    };


    var gridlines = {
        name: 'gridlines_bold',
        x: x, y: y, z: z,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'lines',
        opacity: 0.05,
        line: { color: '#000000', width: 3 },
    }


    var gridlines_bold = {
        name: 'gridlines_bold',
        x: xb, y: yb, z: zb,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'lines',
        opacity: 0.075,
        line: { color: '#000000', width: 3 },
    }


    var equator_plane = {
        name: 'equator_plane',
        x: xs, y: ys, z: math.multiply(zs, 0),
        type: 'surface',
        colorscale: [['0.0', '#AAAAAA'], ['1.0', '#AAAAAA']],
        showscale: false,
        opacity: 0.075,
        hoverinfo: 'skip',

    }

    north_text = document.getElementById('north_text').value;
    south_text = document.getElementById('south_text').value;
    if (north_text != "") {
        north_text = "|" + north_text + "〉"
    }
    if (south_text != "") {
        south_text = "" + south_text + "〉"
    }

    var axes = {
        name: 'axes',
        x: [-1, 1, null, 0, 0, null, 0, 0], y: [0, 0, null, -1, 1, null, 0, 0], z: [0, 0, null, 0, 0, null, -1, 1],
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'lines+text',
        opacity: 0.5,
        line: { color: '#000000', width: 3 },
        text: ["x", "", "", "y", "", "", "", north_text, ""],
        textfont: {
            size: 30,
            color: "#000000"
        },
        textposition: 'top center'
    }
    var lower_tag = {
        x: [0], y: [0], z: [-1],
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'text',
        opacity: 0.5,
        line: { color: '#000000', width: 3 },
        text: [south_text],
        textfont: {
            size: 30,
            color: "#000000"
        },
        textposition: 'bottom center'
    }




    return [sphere, gridlines, gridlines_bold, equator_plane, axes, lower_tag]
    //return [axes,lower_tag]

}


function update_state_plot(full_update = false) {
    point_vector = state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length - 1]);
    new_data = gen_vector_plot(point_vector);
    if (PHOSPHOR_ENABLED === true) {
        phosphor_length = document.getElementById('phosphor_length').value - 1;
        startidx = PHOSPHOR.length - 1 - phosphor_length;
        if (startidx < 0) {
            startidx = 0;
        }
        stopidx = PHOSPHOR.length;
        phosphor_data = PHOSPHOR.slice(startidx, stopidx);
        //console.log("Phosphor set to");
        //console.log(phosphor_data);
    }
    else {
        phosphor_data = []
    }
    /*Plotly.animate('myDiv', {
        group: 'state',
        data: Array(BLOCHSPHERE.length).fill(null).concat(new_data).concat(phosphor_data)
      }, {
        transition: {
          duration: 0,
        },
        frame: {
          duration: 0,
          redraw: true,
        }
      });
      */

    init_plotting(BLOCHSPHERE.concat(new_data).concat(phosphor_data));

}








// the helper scripts
function state2vector(state) {
    // https://en.wikipedia.org/wiki/Bloch_sphere#u,_v,_w_representation
    r01 = math.multiply(state['_data'][0], math.conj(state['_data'][1]));
    r00 = math.multiply(state['_data'][0], math.conj(state['_data'][0]));
    r11 = math.multiply(state['_data'][1], math.conj(state['_data'][1]));
    u = -2 * math.re(r01);
    v = 2 * math.im(r01);
    w = math.re(r00 - r11);
    return [u, v, w]
}

function rot(axis_op, angle, ...state) {
    //rot_op = (-1j*phi*op).expm()
    if (typeof (axis_op) === 'string') {
        if (axis_op === 'x') {
            op = math.matrix([[0, math.complex(0.5, 0)], [math.complex(0.5, 0), 0]]);
        }
        else if (axis_op === 'y') {
            op = math.matrix([[0, math.complex(0, -0.5)], [math.complex(0, 0.5), 0]]);
        }
        else if (axis_op === 'z') {
            op = math.matrix([[math.complex(0.5, 0), 0], [0, math.complex(-0.5, 0)]]);
        }
        else {
            throw 'Unknown axis string';
        }
    }
    /*
    else if (false) {
        
    }
     */
    else {
        op = axis_op;
    }

    //console.log(math.multiply(math.complex(0,-angle),op));
    rot_op = math.expm(math.multiply(math.complex(0, -angle), op));
    //console.log("Rotation operator");
    //console.log(rot_op);
    if (state.length === 0) {
        return rot_op
    }
    else {
        //console.log("new state is");
        //console.log(math.multiply(rot_op,state[0]));
        return math.multiply(rot_op, state[0])
    }

}

function gen_state(vector) {
    return math.matrix(vector)
}

function print_state(state) {
    arrText = '(' + state['_data'][0] + ', ' + state['_data'][1] + ')';
    console.log(arrText);
}

function rot_phosphor(axis_op, angle, state, divider = 10) {
    //console.log("Divider is");
    //console.log(divider);
    uarr = [];
    varr = [];
    warr = [];
    [u, v, w] = state2vector(state);
    uarr.push(u);
    varr.push(v);
    warr.push(w);

    for (var i = 1; i <= divider; i++) {
        staten = rot(axis_op, angle / divider * i, state);
        [u, v, w] = state2vector(staten);
        //console.log("We rotate by");
        //console.log(angle/divider*i);
        //console.log([u,v,w]);
        //console.log("old state");
        //console.log(state);
        //console.log("new state");
        //console.log(staten);
        uarr.push(u);
        varr.push(v);
        warr.push(w);
    }

    var hist = {
        x: uarr, y: varr, z: warr,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'lines',
        opacity: 1.0,
        line: { color: document.getElementById('phosphor_color').value, width: 3 },
    }
    PHOSPHOR.push(hist);
}

function rabi_plot(data = null) {
    time = document.getElementById('pulselength').value;
    if (data === null) {
        t_stop = Math.max(2, time);
        tax = linspace(0, t_stop, 101);
        detune = 2 * math.PI * document.getElementById('detuning').value;
        w1 = 2 * math.PI * document.getElementById('amplitude').value;
        Omega = math.sqrt(detune * detune + w1 * w1);
        arg_ax = math.dotMultiply(tax, Omega / 2);
        y = math.map(arg_ax, math.sin);
        y = math.dotMultiply(y, w1 / Omega);
        y = math.map(y, math.square);
        data = [{
            x: tax,
            y: y,
            hoverinfo: 'skip',
        }];

    }
    const config = {
        displayModeBar: false, // hide toolbar
        responsive: false // resize 
    };

    var layout = {
        hovermode: 'closest',
        autosize: false,
        width: '400',
        height: '200',
        automargin: true,
        showlegend: false,
        margin: {
            l: 50,
            r: 10,
            b: 50,
            t: 10
        },
        xaxis: {
            title: 'time',
            showgrid: false,
            zeroline: true,
            fixedrange: true

        },
        yaxis: {
            showgrid: false,
            zeroline: true,
            fixedrange: true,
            range: [0, 1.1]

        },

        shapes: [
            {
                type: 'line',
                x0: time,
                y0: -1,
                x1: time,
                y1: 1,
                line: {
                    color: 'rgb(255, 10, 10)',
                    width: 3
                }
            }],
    };

    Plotly.react('rabi_div', data, layout, config);
}

function pulse(axis, time, state) {
    opZ = math.matrix([[math.complex(0.5, 0), 0], [0, math.complex(-0.5, 0)]]);
    detune = 2 * math.PI * document.getElementById('detuning').value;
    w1 = 2 * math.PI * document.getElementById('amplitude').value;
    phase = math.PI / 180 * document.getElementById('phase').value;
    H0 = math.multiply(opZ, detune);
    if (axis === "x") {
        //opX = math.matrix([[0,0.5*math.exp(math.complex(0,phase+math.PI/2))],[0.5*math.exp(math.complex(0,-phase-math.PI/2)),0]]); 
        //H1 = math.multiply(opX,w1);
        phase = phase + math.PI / 2;
    }
    console.log(phase);
    opT = math.matrix([[0, math.multiply(0.5, math.exp(math.complex(0, phase)))], [math.multiply(0.5, math.exp(math.complex(0, -phase))), 0]]);
    H1 = math.multiply(opT, w1);
    console.log(H1);
    rot_op = math.expm(math.multiply(math.complex(0, time), math.add(H0, H1)));
    return math.multiply(rot_op, state)
}

function pulse_phosphor(axis, time, state, divider = 10) {

    uarr = [];
    varr = [];
    warr = [];
    [u, v, w] = state2vector(state);
    uarr.push(u);
    varr.push(v);
    warr.push(w);

    for (var i = 1; i <= divider; i++) {
        staten = pulse(axis, time / divider * i, state);
        [u, v, w] = state2vector(staten);
        uarr.push(u);
        varr.push(v);
        warr.push(w);
    }

    var hist = {
        x: uarr, y: varr, z: warr,
        type: 'scatter3d',
        showscale: false,
        hoverinfo: 'skip',
        mode: 'lines',
        opacity: 1.0,
        line: { color: document.getElementById('phosphor_color').value, width: 3 },
    }
    PHOSPHOR.push(hist);
}











// ui.js

QMSTATEVECTOR = [gen_state([1, 0])];
BLOCHSPHERE = gen_bloch_sphere();
STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
PHOSPHOR = []
PHOSPHOR_ENABLED = true

init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
// BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR)
rabi_plot();


function rotate_state(axis, angle) {
    QMSTATEVECTOR.push(rot(axis, angle, QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
    rot_phosphor(axis, angle, QMSTATEVECTOR[QMSTATEVECTOR.length - 2], divider = Math.max(6, Math.round(angle / (0.5 * math.PI) * 10)));
    update_state_plot();
}


function pulse_apply(axis) {
    time = document.getElementById('pulselength').value;
    QMSTATEVECTOR.push(pulse(axis, time, QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
    pulse_phosphor(axis, time, QMSTATEVECTOR[QMSTATEVECTOR.length - 2], divider = Math.max(6, Math.round(time / 0.01)));
    update_state_plot();
}



function export_png() {
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate() + "_" + currentdate.getHours() + '- ' + currentdate.getMinutes() + '-' + currentdate.getSeconds();
    Plotly.downloadImage('myDiv', { format: 'png', width: document.getElementById('export_size').value, height: document.getElementById('export_size').value, filename: datetime });
}

function custom_rotate_state() {
    opX = math.matrix([[0, math.complex(0.5, 0)], [math.complex(0.5, 0), 0]]);
    opY = math.matrix([[0, math.complex(0, -0.5)], [math.complex(0, 0.5), 0]]);
    opZ = math.matrix([[math.complex(0.5, 0), 0], [0, math.complex(-0.5, 0)]]);

    rot_op = math.multiply(math.cos(document.getElementById('custom_axis_polar').value / 180 * math.PI), opZ);
    rot_op = math.add(rot_op, math.multiply(math.sin(document.getElementById('custom_axis_polar').value / 180 * math.PI) * math.cos(document.getElementById('custom_axis_azimuth').value / 180 * math.PI), opX));
    rot_op = math.add(rot_op, math.multiply(math.sin(document.getElementById('custom_axis_polar').value / 180 * math.PI) * math.sin(document.getElementById('custom_axis_azimuth').value / 180 * math.PI), opY));

    rotate_state(rot_op, document.getElementById('custom_axis_rot_angle').value / 180 * math.PI);
}


function undo() {
    if (QMSTATEVECTOR.length > 1) {
        QMSTATEVECTOR.pop();
        PHOSPHOR.pop();
        update_state_plot();
    }

}

function restart(vector) {
    QMSTATEVECTOR = [gen_state(vector)];
    BLOCHSPHERE = gen_bloch_sphere();
    STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
    PHOSPHOR = [];
    PHOSPHOR_ENABLED = true;
    init_plotting(BLOCHSPHERE.concat(STATEARROW).concat(PHOSPHOR));
}








// helper.js

function linspace(a, b, n) {
    if (typeof n === 'undefined') {
        n = Math.max(Math.round(b - a) + 1, 1);
    }
    if (n < 2) {
        return n === 1 ? [a] : [];
    }
    var i, ret = Array(n);
    n--;
    for (i = n; i >= 0; i--) {
        ret[i] = (i * b + (n - i) * a) / n;
    }
    return ret;
}

function meshgrid(a, b) {
    var n1 = a.length;
    var n2 = b.length;
    var arr1 = Array(n1);
    var arr2 = Array(n1);
    for (var i = 0; i < n2; i++) {
        arr1[i] = a;
    }
    for (var i = 0; i < n2; i++) {
        arr2[i] = Array(n1).fill(b[i]);
    }

    return [arr1, arr2];
}

// Print a 2D array
function print2d(arr) {
    var arrText = '';
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arrText += arr[i][j] + ' ';
        }
        console.log(arrText);
        arrText = '';
    }
}

// Basic assertion function
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

// Function for combining plotly arrays
function combine(a1, a2) {
    assert(a1.length === a2.length, "input arrays have different length");
    var new_arr = [];
    for (var i = 0; i < a1.length; i++) {
        if (!(a1[i] === null)) {
            new_arr.push(a1[i]);
        }
        else if (!(a2[i] === null)) {
            new_arr.push(a2[i]);
        }
    }
    return new_arr;
}