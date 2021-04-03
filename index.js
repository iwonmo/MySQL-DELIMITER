const fs = require('fs')

var isCharString = false;
var tokenList = [];
var isNum_d = 0,isNum_s = 0;
var keysymbol=["'",'"',";","(",")",",","="];
var splitKey = ['　',' ','\n']
var token_de = false; //分词阶段的是否有定界符
var token_de_num = 0; //第几次查到定界符
var is_set_de = false; //是否设置过定界符
var is_de_str = ""; //当前定界符文本

/** 增加数组方法 */
Array.prototype.indexOfEl = function(val) {
  for (let i = 0; i < this.length; i++) {
     if (this[i] == val) {
         return i;
     }
 }
 return -1;
}; 
Array.prototype.removeEl = function(val) {
 let index = this.indexOfEl(val);
 if (index > -1) {
     this.splice(index, 1);
 }
};

/** 是否有定界符 - 初始化定界符判断变量 */
function isDelimiter(element){
  if(element.toLowerCase() == "DELIMITER".toLowerCase()){
    token_de_num = token_de_num+1
    if(token_de_num % 2 == 0){
      token_de = false
      is_set_de = false;
      keysymbol.removeEl(is_de_str)
      is_de_str="";
    }else{
      token_de = true
    }
  }
}

/* 分词压入到Token数组里 */
function pushToken(token){
  if(token_de == true && is_set_de == false){
    keysymbol.push(token[0]);
    is_de_str = token[0]
    is_set_de = true;
  }
  /** 新的定界符（关键字）判断 */
  let isTure = false;
  let temp = [];
  keysymbol.some(element => {
    if(element == token[0].slice(-element.length)){
      isTure = true;
      if(token[0].length == element.length){
        isTure = false; //本身为token
      }else{
        /** 总位置 - token长度 + 分割的token长度  = 分割的token位置 */
        temp.push([token[0].substring(0,token[0].length - element.length),token[1] - token[0].length + element.length])
        temp.push([element.slice(-element.length),token[1]]) 
      }
      return true;
    }
  });
  if(isTure == true){
    temp.forEach(element => {
      tokenList.push(element)
    });
    isTure = false;
    temp = [];
  }else{
    tokenList.push(token)
  }
  isDelimiter(token[0])
}

fs.readFile('sql.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  var _tmpStr = "";
  for(var i = 0;i < data.length;i++){
    let token= data.charAt(i);
    if(splitKey.indexOf(token) !== -1 && isCharString == false){
      if(_tmpStr != ""){
        pushToken([_tmpStr,i])
      }
      _tmpStr = ""
      continue;
    }
    if(keysymbol.indexOf(token) !== -1 && isCharString == false){
      if(_tmpStr != ""){
        pushToken([_tmpStr,i]); 
      }
      pushToken([token,i]);
      _tmpStr = "";
      if(token == "'" && isNum_s % 2 == 0){
        isNum_d = isNum_d +1
      }
      if(token == '"' && isNum_d % 2 == 0){
        isNum_s = isNum_s +1
      }
      continue;
    }
    if(token == "'" && isNum_s % 2 == 0){
      isNum_d = isNum_d +1
    }
    if(token == '"' && isNum_d % 2 == 0){
      isNum_s = isNum_s +1
    }
    if(isNum_d % 2 == 0 && isNum_s % 2 == 0){
      isCharString = false;
    }else{
      isCharString = true
    }
    if(keysymbol.indexOf(token) !== -1 && isCharString == false){
      if(_tmpStr != ""){
        pushToken([_tmpStr,i]);
      }
      pushToken([token,i]);
      _tmpStr = "";
      continue;
    }
    _tmpStr = _tmpStr + token
  } 
  console.log(tokenList)
  console.log(keysymbol) 

  /////////////////////

  var split_point = [];
  var split_token = ";";
  var delimiter = false;
  tokenList.forEach(element => {
    if(delimiter == true){
      split_token = element[0]
      delimiter = false;
  
    }
    if(element[0]==split_token){
      split_point.push(element[1])
    } 
    if(element[0].toLowerCase() == "DELIMITER".toLowerCase()){
      delimiter = true
    }
  });

  var point = 0;
  split_point.forEach(element => {
    console.log(data.substring(point,element+1))
    console.log(point,element+1)
    point = element +1;
    console.log("-----------------------")
  });
  
})