//设置GET方法从服务器获取信息
function GET(url, options, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status >= 200 && request.status < 300 || request.status == 304) {
        callback(request.responseText);
      }else {
      alert("Request was unsuccessful:");
    }
    } 
  }
  request.open("GET", url + "?" + serialize(options), true)
  request.send();
}


//格式化对象参数
function serialize(options) {
  if (!options) return "";
  var pairs = [];
  for (var name in options) {
    if (!options.hasOwnProperty(name)) continue;
    if (typeof options[name] === "function") continue;
    var value = options[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name + "=" + value);
  }
  return pairs.join("&");
}

//设置课程信息
function setCourses(data) {
  var _data = JSON.parse(data);
  var oDiv = document.getElementById("courses");

  for (i = 0; i < _data.list.length; i++) {
    var oLi = document.createElement("li");
    oDiv.appendChild(oLi);

    var _img = document.createElement("img");
    var _name = document.createElement("p");
    var _price = document.createElement("p");
    var _description = document.createElement("p");

    _img.setAttribute("src", _data.list[i].middlePhotoUrl);
    _name.setAttribute("class", "courseName");
    _name.innerHTML = _data.list[i].name;
    _price.innerHTML = "价格：" + _data.list[i].price;
    _description.innerHTML = _data.list[i].description;

    oLi.appendChild(_img);
    oLi.appendChild(_name);
    oLi.appendChild(_price);
    oLi.appendChild(_description);
  }
}

GET("http://study.163.com/webDev/couresByCategory.htm", {
  pageNo: 1,
  psize: 20,
  type: 10
}, setCourses);

//设置热门课程
function setHotCourses (data){
	var _data = JSON.parse(data);
	var oDiv = document.getElementById("hotCourses");
	for (i=0;i<20;i++){
		var oLi = document.createElement("li");
		oDiv.appendChild(oLi);
		var _img = document.createElement("img");
		var _name = document.createElement("p");
		var _learnerCount = document.createElement("p");

		_img.setAttribute("src", _data[i].smallPhotoUrl);
		_img.setAttribute("class", "hotListImg");
		_name.innerHTML=_data[i].name;
		_learnerCount.innerHTML=_data[i].learnerCount;
		oLi.appendChild(_img);
		oLi.appendChild(_name);
		oLi.appendChild(_learnerCount);
	}
}

GET("http://study.163.com/webDev/hotcouresByCategory.htm",{},setHotCourses);

