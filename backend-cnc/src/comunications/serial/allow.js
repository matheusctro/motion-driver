let allow = true;
let allowAck = true;

function setAllow(mode){
  allow = mode;
}

function setAllowAck(mode){
  allowAck = mode;
}


function readAllow(){
  return allow
}

function readAllowAck(){
  return allowAck
}

module.exports = {setAllow, readAllow, setAllowAck, readAllowAck}
