//设置cookie
function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = " expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires;
}

//获取cookie
function getCookie(cname){
	var arr1 = document.cookie.split("; ");
	for (var i =0; i < arr1.length; i++){
		var arr2 = arr1[i].split("=");
		if (arr2[0] === cname){
			return decodeURI(arr2[1]);
		}
	}
}

//删除cookie
function removeCookie(cname){
	setCookie(cname,"",-1);
}

//检查cookie,存在就隐藏顶部广告，否则设置cookie
function popup(){
	var oPopup = document.getElementById("edu-ad");
	var oAd = document.getElementById("noNotice");
	if (getCookie("off")){
		oPopup.style.display = "none";
	}else{
		oAd.onclick = function(){
			oPopup.style.display = "none";
			setCookie("off","ture",7);//有效期为一周
		};
	}
}
popup();

//设置登录
function Login(){
	var oAttention = document.getElementById("attention");
	var oLogPopup = document.getElementById("Login-popup");
	var oLogClose = document.getElementById("Login-close");
	var oCancel = document.getElementById("cancel");
	var oInput = document.getElementsByTagName("input");
	var oButton = document.getElementsByClassName("submit");

//判断登录的 cookie 是否已设置
	if( !getCookie ("loginSuc") ){
		oAttention.onclick = function(){ 
			oLogPopup.style.display = "block";
		};
	}else{
		oAttention.value = "已关注";
		oAttention.className = "focused";
		oAttention.disabled = true;
		oCancel.style.display = "block";
	}
//点击登录
	oButton[0].onclick = function(){
		var userName1 = hex_md5(oInput[1].value);
		var password1 = hex_md5(oInput[2].value);
		GET("http://study.163.com/webDev/login.htm",{userName:userName1,password:password1},function(a){ 
			if( a === "1" ){
				oLogPopup.style.display = "none";
				setCookie ("loginSuc", "1", 36500);
				GET("http://study.163.com/webDev/attention.htm","", function(b){
					if( b === "1" ){
						setCookie ("followSuc", "1", 36500);
						oAttention.value = "已关注";
						oAttention.className = "focused";
						oAttention.disabled = true;
						oCancel.style.display = "block";
					}
					
				})	
			}else{
				alert( "帐号密码错误，请重新输入!")
			}
		 });
	};
//取消关注
	oCancel.onclick = function(){  
		setCookie("followSuc","",-1);
		setCookie("loginSuc","",-1);
		oAttention.value = "关注";
		oAttention.className = "focus";
		oAttention.removeAttribute("disabled");
		this.style.display = "none";
	};

//关闭登录框
	oLogClose.onclick = function(){
		oLogPopup.style.display = "none";
	}
}
Login();

//设置轮播图
window.onload = function () {
	var container = document.getElementById("container");
	var list = document.getElementById("imgList");
	var buttons = document.getElementById("buttons").getElementsByTagName("span");
	var next = document.getElementById("next");
	var prev = document.getElementById("prev");
	var index = 1;
	var animated = false;//动画运行状态
	var timer;

	function showButton(){
		for (var i = 0; i < buttons.length; i++){
			if (buttons[i].className == "on"){
				buttons[i].className = "";
				break;
			}
		}
		buttons[index-1].className = "on";
	}

	function animate(offset){
		animated = true;
		var newLeft = parseInt(list.style.left) + offset;
		var time = 500;
		var interval = 50;
		var speed = offset/(time/interval);//每次位移量

		function go(){
			if ((speed < 0 && parseInt(list.style.left) > newLeft)||
				(speed > 0 && parseInt(list.style.left) < newLeft)){
				list.style.left = parseInt(list.style.left) + speed + "px";
				setTimeout(go,interval);
			}else{
				animated = false;
				list.style.left = newLeft + "px";

				if (newLeft > -1652){
					list.style.left = -4956 + "px";
				}
				if (newLeft < -4956){
					list.style.left = -1652 + "px";
				}
			}
		}
		go();
	}

	function play(){
		timer = setInterval(function(){
			next.onclick();
		},5000);
	}

	function stop(){
		clearInterval(timer);
	}
//设置下一张图片按钮，只是做个练习
	next.onclick = function(){
		if (index == 3){
			index = 1;
		}else{
			index += 1;
		}
		showButton();
		if (!animated){
			animate(-1652);
		}
	}
//设置上一张图片按钮，只是做个练习
	prev.onclick = function(){
		if (index == 1){
			index = 3;
		}else{
			index -= 1;
		}
		showButton();
		if (!animated){
			animate(1652);
		}
	}

	for (var i = 0; i < buttons.length; i++){
		buttons[i].onclick = function(){
			var myIndex = parseInt(this.getAttribute("index"));
			var offset = -1652 * (myIndex - index);
			if (!animated){
				animate(offset);
			}
			index = myIndex;
			showButton();
		}
	}

	container.onmouseover = stop;
	container.onmouseout = play;

	play();
}

//点击切换设计和编程课程
function courseSwitch(){
	var oType0 = document.getElementById("designType");
	var oType1 = document.getElementById("programmingType");
	var oDesign = document.getElementById("design-courses");
	var oProgramming = document.getElementById("programming-courses");

	oType0.onclick = function(){
		oType0.className = "on";
		oType1.className = "";
		oDesign.style.display = "block";
		oDesign.className = "active";
		oProgramming.style.display = "none";
		oProgramming.className = "";
	}

	oType1.onclick = function(){
		oType1.className = "on";
		oType0.className = "";
		oProgramming.style.display = "block";
		oProgramming.className = "active";
		oDesign.style.display = "none";
		oDesign.className = "";
	}
}
courseSwitch();


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

//设置设计课程信息，一般显示和悬浮显示界面，用了太多DOM操作，不确定是否影响性能
function setDesignCourses(data) {
  var _data = JSON.parse(data);
  var oDiv = document.getElementById("design-courses");

  for (i = 0; i < _data.list.length; i++) {
  	var oLi = document.createElement("li");
    oDiv.appendChild(oLi);

    var _img = document.createElement("img");
    var _name = document.createElement("p");
    var _provider = document.createElement("p");
    var _learnerNum = document.createElement("p");
    var _price = document.createElement("p");
    var oA = document.createElement("a");
    var Aimg = document.createElement("img");
    var Ah = document.createElement("h3");
    var AlearnerNum = document.createElement("span");
    var Ap = document.createElement("p");
    var App = document.createElement("p");
    var AcategoryName = _data.list[i].categoryName;
//课程一般显示的内容
    _img.setAttribute("src", _data.list[i].middlePhotoUrl);
    _name.setAttribute("class", "course-name");
    _name.innerHTML = _data.list[i].name;
    _provider.setAttribute("class","course-provider");
    _provider.innerHTML = _data.list[i].provider;
    _learnerNum.setAttribute("class","learnerNum");
    _learnerNum.innerHTML = _data.list[i].learnerCount;
    _price.setAttribute("class","course-price");
    _price.innerHTML = "<span>￥</span>" + _data.list[i].price;
//课程悬浮显示的内容
    if(AcategoryName == null){AcategoryName = "无";}
    Aimg.setAttribute("src", _data.list[i].middlePhotoUrl);
    Ah.setAttribute("class", "a-course-name");
    Ah.innerHTML = _data.list[i].name;
	AlearnerNum.setAttribute("class", "a-learnerNum");
	AlearnerNum.innerHTML = _data.list[i].learnerCount + "人在学";
	Ap.setAttribute("class", "a-categoryname clearfix");
	Ap.innerHTML = "发布者：" + _data.list[i].provider + "</br>分类：" + AcategoryName;
	App.setAttribute("class", "a-course-description");
	App.innerHTML = _data.list[i].description;
//课程悬浮显示的内容全部在一个a标签里
	oA.appendChild(Aimg);
	oA.appendChild(Ah);
	oA.appendChild(AlearnerNum);
	oA.appendChild(Ap);
	oA.appendChild(App);

    oLi.appendChild(_img);
    oLi.appendChild(_name);
    oLi.appendChild(_provider);
    oLi.appendChild(_learnerNum);
    oLi.appendChild(_price);
    oLi.appendChild(oA);
  }
}

GET("http://study.163.com/webDev/couresByCategory.htm", {
  pageNo: 1,
  psize: 20,
  type: 10
}, setDesignCourses);

//设置编程课程信息
function setProgrammingCourses(data) {
  var _data = JSON.parse(data);
  var oDiv = document.getElementById("programming-courses");

  for (i = 0; i < _data.list.length; i++) {
  	var oLi = document.createElement("li");
    oDiv.appendChild(oLi);

    var _img = document.createElement("img");
    var _name = document.createElement("p");
    var _provider = document.createElement("p");
    var _learnerNum = document.createElement("p");
    var _price = document.createElement("p");
    var oA = document.createElement("a");
    var Aimg = document.createElement("img");
    var Ah = document.createElement("h3");
    var AlearnerNum = document.createElement("span");
    var Ap = document.createElement("p");
    var App = document.createElement("p");
    var AcategoryName = _data.list[i].categoryName;
//课程一般显示的内容
    _img.setAttribute("src", _data.list[i].middlePhotoUrl);
    _name.setAttribute("class", "course-name");
    _name.innerHTML = _data.list[i].name;
    _provider.setAttribute("class","course-provider");
    _provider.innerHTML = _data.list[i].provider;
    _learnerNum.setAttribute("class","learnerNum");
    _learnerNum.innerHTML = _data.list[i].learnerCount;
    _price.setAttribute("class","course-price");
    _price.innerHTML = "<span>￥</span>" + _data.list[i].price;
    if(AcategoryName == null){AcategoryName = "无";}
//课程悬浮显示的内容    
    Aimg.setAttribute("src", _data.list[i].middlePhotoUrl);
    Ah.setAttribute("class", "a-course-name");
    Ah.innerHTML = _data.list[i].name;
	AlearnerNum.setAttribute("class", "a-learnerNum");
	AlearnerNum.innerHTML = _data.list[i].learnerCount + "人在学";
	Ap.setAttribute("class", "a-categoryname clearfix");
	Ap.innerHTML = "发布者：" + _data.list[i].provider + "</br>分类：" + AcategoryName;
	App.setAttribute("class", "a-course-description");
	App.innerHTML = _data.list[i].description;
//课程悬浮显示的内容全部在一个a标签里
	oA.appendChild(Aimg);
	oA.appendChild(Ah);
	oA.appendChild(AlearnerNum);
	oA.appendChild(Ap);
	oA.appendChild(App);

    oLi.appendChild(_img);
    oLi.appendChild(_name);
    oLi.appendChild(_provider);
    oLi.appendChild(_learnerNum);
    oLi.appendChild(_price);
    oLi.appendChild(oA);
  }
}

GET("http://study.163.com/webDev/couresByCategory.htm", {
  pageNo: 1,
  psize: 20,
  type: 20
}, setProgrammingCourses);

//设置介绍视频弹窗
function playVideo(){
	var oVideoImg = document.getElementById("video-img");
	var oVideoPopup = document.getElementById("video-popup");
	var oVideoClose = document.getElementById("video-close");
	oVideoImg.onclick = function(){
		oVideoPopup.style.display = "block";
	}
	oVideoClose.onclick = function(){
		oVideoPopup.style.display = "none";
	}
}
playVideo();

//设置热门课程
function setHotCourses (data){
	var _data = JSON.parse(data);
	var oDiv = document.getElementById("hotCourses");
	for (i=0;i<20;i++){
		var oA = document.createElement("a");
		oA.setAttribute("class","clearfix");
		oDiv.appendChild(oA);
		var _img = document.createElement("img");
		var _name = document.createElement("p");
		var _learnerCount = document.createElement("span");

		_img.setAttribute("src", _data[i].smallPhotoUrl);
		_img.setAttribute("class", "hotListImg");
		_name.innerHTML=_data[i].name;
		_learnerCount.innerHTML=_data[i].learnerCount;
		oA.appendChild(_img);
		oA.appendChild(_name);
		oA.appendChild(_learnerCount);
	}
}

GET("http://study.163.com/webDev/hotcouresByCategory.htm",{},setHotCourses);

//设置热门课程的滚动
function circle(){
	var ohotCourses = document.getElementById("hotCourses");
	var timer;

	function autoplay(){
		timer = setInterval(function(){
			var otop = parseInt(ohotCourses.style.top);
			if (otop <= -700){
				ohotCourses.style.top = 0;
			}else{
				ohotCourses.style.top = otop - 70 + "px";
			}
		},5000);
	}
	autoplay();

	ohotCourses.onmouseover = function(){
		clearInterval(timer);
	};

	ohotCourses.onmouseout = function(){
		autoplay();
	};
}

circle();
