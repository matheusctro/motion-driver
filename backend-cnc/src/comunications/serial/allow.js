let allow = true;

function setAllow(mode){
  allow = mode;
}

function readAllow(){
  return allow
}

module.exports = {setAllow, readAllow}
