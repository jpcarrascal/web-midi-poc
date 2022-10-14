

function listDevices(midi) {
    var outList = document.getElementById("select-midi-out");
    var inList  = document.getElementById("select-midi-in");
    var outputs = midi.outputs.values();
    var inputs  = midi.inputs.values();
    var numOuts = 0;
    var numIns  = 0;
    // outputs is an Iterator

    for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
        var option = document.createElement("option");
        option.value = output.value.id;
        option.text = output.value.name + ", ID: " + output.value.id;
        outList.appendChild(option);
        numOuts++;
    }

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        var option = document.createElement("option");
        option.value = input.value.id;
        option.text = input.value.name + ", ID: " + input.value.id;
        inList.appendChild(option);
        console.log(option)
        numIns++;
    }
    
    if(numOuts == 0) {
        console.log("No MIDI OUT devices found...");
        setCookie("MIDIout",0,1000);
    }

    if(numIns == 0) {
        console.log("No MIDI IN devices found...");
        setCookie("MIDin",0,1000);
    }
}

  



var MIDIout = null;
var MIDIin = null;
var MIDIoutIndex = 0;
// Replace this with the right index:
var MIDIinIndex = 193811423;

if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI. Yay!');
    navigator.requestMIDIAccess().then(success, failure);
}

function success(midi) {
    listDevices(midi);
    MIDIout = midi.outputs.get(MIDIoutIndex);
    MIDIin = midi.inputs.get(MIDIinIndex);
    MIDIin.onmidimessage = processMIDIin;
}

function processMIDIin(midiMsg) {
    //console.log(midiMsg);
    // altStartMessage: used to sync when playback has already started
    // in clock source device
    // 0xB0 & 0x07 = CC, channel 8.
    // Responding to altStartMessage regardless of channels
    if(midiMsg.data[0] == 191) { //CC, right channel
        console.log("CC\t" + midiMsg.data[1] + "\tvalue:" + midiMsg.data[2]);
    } else if (midiMsg.data[0] == 144) {
        console.log("Note ON\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
    } else if (midiMsg.data[0] == 128) {
        console.log("Note OFF\t" + midiMsg.data[1] + "\tvelocity: " + midiMsg.data[2]);
    } else {
        console.log(midiMsg.data[0])
    }
}

function failure(){ console.log("MIDI not supported :(")};

function calculateTempo(time) {
    let tempoElem = document.getElementById("ext-tempo");
    let tempo = Math.round(60000/(time*4));
    tempoElem.innerText = tempo;
}

function MIDIplayNote (note, vel, out) {
    out.send([NOTE_ON, note, vel]);
    setTimeout(out.send([NOTE_OFF, note, 0x00]), NOTE_DURATION);
}

