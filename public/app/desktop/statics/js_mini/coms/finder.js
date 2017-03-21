(function(){this.finderGroup={};this.finderDestory=function(){for(var a in finderGroup)delete finderGroup[a]};var q=function(a,d,c){d=d||"controller";var b={},e={};e[d]=e[d]||{};e[d][c[0]]=c[1];b[a]=e;return b},p=new Class({Extends:Drag,start:function(a){this.parent(a)}});Finder=new Class({Implements:[Events],options:{selectName:"items[]"},detailStatus:{},initialize:function(a,d){$extend(this.options,d);this.id=a;this.initStaticView();this.initView();this.listContainer=this.list.getContainer();this.attachStaticEvents();
this.attachEvents();this.options.packet&&this.loadPacket()},initStaticView:function(){$each("action form filter search tip header footer pager packet".split(" "),function(a){this[a]=$("finder-"+a+"-"+this.id)},this)},initView:function(){(this.list=$("finder-list-"+this.id))&&this.list.store("visibility",!0);this.tip=$("finder-tip-"+this.id)},isVisibile:function(){return this.list.retrieve?$chk(this.list.retrieve("visibility")):!1},attachStaticEvents:function(){var a=this;if(a.search){var d=a.search.getElement("input[search]").addEvent("keypress",
function(b){13===b.code&&(b.stop(),this.value.trim().length||(a.filter.value=""),b=a.form.retrieve("rowselected",[]),a.refresh(b.length&&!b.contains("_ALL_")&&!confirm(LANG_Finder.refresh_confirm)))});a.search.getElement(".finder-search-btn").addEvent("click",function(){d.fireEvent("keypress",{stop:$empty,code:13})})}a.action&&a.action.getElements("*[submit]").addEvent("click",function(b){b&&b.stop&&b.stop();var c=this.get("target");b=this.get("submit");var d=a.form.retrieve("rowselected"),k=a.form.retrieve("_rowindex",
$H()),d="_ALL_"==d[0]?d:[];!d.length&&k&&k.getValues().sort(function(a,c){return a.toInt()-c.toInt()}).each(function(a){d.push(k.keyOf(a))});var f=new Element("form"),g=document.createDocumentFragment(),l=!1;d.each(function(c){var b=a.options.selectName;"_ALL_"==c&&(l=b="isSelectedAll");g.appendChild(new Element("input",{type:"hidden",name:b,value:c}))});f.appendChild(g);if(!f.getFirst())return MessageBox.error(LANG_Finder.error);var n=c,m={};c&&c.contains("::")&&(n=c.split("::")[0],m=JSON.decode(c.split("::")[1]),
"object"!=$type(m)&&(m={}));c=this.getProperty("confirm");if(!c||window.confirm(c))switch(l&&(c=a.form.action.match(/\?([\s\S]+$)/),c=c[1]?c[1]:"",c=[c,a.form.toQueryString(),a.filter.value].join("&"),f.adopt(c.toFormElements())),n){case "refresh":W.page(b,$extend({data:f,method:"post",onComplete:a.refresh.bind(a)},m));break;case "command":new cmdrunner(actionurl,{onSuccess:a.refresh.bind(a)});break;case "dialog":new Dialog(b,$extend({title:this.get("dialogtitle")||this.get("text"),ajaxoptions:{data:f,
method:"post"},onClose:function(){a.unselectAll();a.refresh.call(a)}},m));break;case "_blank":b=f.set({action:b,name:n,target:"_blank",method:"post"}).inject(document.body);b.submit();b.remove.delay(1E3,b);break;default:W.page(b,$extend({data:f,method:"post"},m))}});if(a.header){a.header.addEvent("click",function(c){var d=$(c.target);d.hasClass("orderable")||(d=d.getParent(".orderable"));d&&(d=["desc"==d.get("order")?"asc":"desc",d.get("key")].link({"_finder[orderType]":String.type,"_finder[orderBy]":String.type}),
a.fillForm(d).refresh(),c.stopPropagation())});var c=function(c,d){try{a.header.setStyles({width:a.listContainer.clientWidth-a.listContainer.getPatch().x})}catch(h){}};c();LAYOUT.content_main.addEvent("resizelayout",c);a.header.addEvent("dispose",function(){LAYOUT.content_main.removeEvent("resizelayout",c)})}},selectAll:function(a){this.header.getElement(".sellist")&&this.header.getElement(".sellist").set("checked",!a).fireEvent("change");a?(this.form.retrieve("rowselected").empty(),this.form.retrieve("_rowindex",
$H()).empty(),this.tip.fireEvent("_hide")):(this.form.retrieve("rowselected").empty().push("_ALL_"),this.tip.fireEvent("_update","selectedall").fireEvent("_show"))},unselectAll:function(){this.selectAll(!0)},selectFav:function(a){this.form.retrieve("rowselected").empty();this.form.retrieve("_rowindex",$H()).empty();this.list.getElements(".row .sel").each(function(d){d.hasClass("isfav")?d.set("checked",!a).fireEvent("change"):d.set("checked",!!a).fireEvent("change")})},selectunFav:function(){this.selectFav(!0)},
attachEvents:function(){var a=this,d=this.listContainer;a.list.retrieve("eventInfo",{});var c=a.form.retrieve("rowselected",[]);if(a.header&&a.list.getElement("tr")){var b=a.header.getElement(".finder-header"),e=b.getElements(".finder-col-resizer"),h=b.getElements("col"),k=b.getElement("tr").getChildren(),f=a.list.getElements("col");new p(b,{modifiers:{x:!1,y:!1},limit:{x:[35,1E3]},handle:Array.from(e),onStart:function(c,b){c.addClass("col-resizing");var e;e=b.target.getParent(".cell")?b.target.getParent(".cell").getParent("td"):
b.target.getParent("td")?b.target.getParent("td"):b.target;var f=k.indexOf(e);if(0>f)return this.cancel();e=k[f].getElement(".finder-col-resizer");c.store("_dragTargetIndex",f);h[f].addClass("resizing").setStyle("background","#e9e9e9");f=c.retrieve("_dragTargetMoveEl");f||(f=(new Element("div",{"class":"resize-move-el",styles:{height:a.header.offsetHeight+d.offsetHeight,width:e.offsetWidth,position:"absolute",top:e.getPosition().y,left:e.getPosition().x,background:"#e9e9e9",zIndex:65535,cursor:"col-resize",
opacity:0.8,borderRight:"1px #cccccc solid"}})).inject(document.body),c.store("_dragTargetMoveEl",f))},onDrag:function(a){a.retrieve("_dragTargetMoveEl",{}).setStyle("left",this.mouse.now.x)},onComplete:function(c){c.removeClass("col-resizing");var b=c.retrieve("_dragTargetIndex"),e=h[b].removeClass("resizing").setStyle("background","");if(c.retrieve("_dragTargetMoveEl")){c.retrieve("_dragTargetMoveEl").dispose();c.eliminate("_dragTargetMoveEl");c=this.mouse.now.x-this.mouse.start.x;var g=e.getStyle("width").toInt();
c=(g+c).limit(this.options.limit.x[0],this.options.limit.x[1]);var l=$$(e,f[b]),e=a.list.getElement("tr").getChildren()[b];window.webkit&&(l=$$(l,k[b],e));l.setStyle("width",c);var b=d.scrollLeft,l=d.offsetWidth,n=d.scrollWidth;0<b&&b+l>=n&&(g=c-g,0>g&&(d.scrollLeft=(d.scrollLeft-Math.abs(g)).limit(0,d.scrollWidth)));a.dropmenu&&a.dropmenu.fireEvent("position","x");e&&(g=e.get("key"),EventsRemote.post({events:q("finder_colset",a.options.object_name+"_"+a.options.finder_aliasname,[g,c])}))}}})}a.tip&&
(a.tip.addEvents({_update:function(a,c){this.retrieve("arg:class","NULL")!=a&&$$(this.childNodes).hide();var b=this.getElement("."+a);b&&(b.innerHTML=b.innerHTML.replace(/<em>([\s\S]*?)<\/em>/ig,function(){return"<em>"+c+"</em>"}),b.setStyle("display","block"));this.store("arg:class",a);this.retrieve("tipclone")||(b=(new Element("div",{"class":"hide",html:"&nbsp;",styles:{height:this.offsetHeight}})).injectTop(d),this.store("tipclone",b))},_show:function(){"hidden"==this.style.visibility&&(this.setStyle("visibility",
"visible"),this.retrieve("tipclone").removeClass("hide"))},_hide:function(){"hidden"!=this.style.visibility&&(this.setStyle("visibility","hidden"),this.retrieve("tipclone").addClass("hide"))}}),b=c.length,1<b&&(b==a.tip.get("count").toInt()||c.contains("_ALL_")?a.tip.fireEvent("_update",["selectedall",b]).fireEvent("_show"):a.tip.fireEvent("_update",["selected",b]).fireEvent("_show")));a.list.addEvents({selectrow:function(a){a.getParent(".row").addClass("selected")},unselectrow:function(a){a.getParent(".row").removeClass("selected")}});
var g=a.list.getElements(".row .sel");a.rowCount=g.length;if(a.header&&a.header.getElement(".sellist"))var l=a.header.getElement(".sellist").addEvent("change",function(){g.set("checked",this.checked).fireEvent("change")});g.addEvents({click:function(){this.fireEvent("change")},focus:function(){this.blur()},change:function(){if(l){c[this.checked?"include":"erase"](this.value);var b=a.form.retrieve("_rowindex",$H());this.checked?b.set(this.value,this.get("rowindex")):b.erase(this.value)}else c.empty().push(this.value);
if(!this.checked&&c.contains("_ALL_"))return c.erase("_ALL_"),a.unselectAll();var b=c.length,d=0;1<b?b==a.tip.get("count").toInt()||c.contains("_ALL_")?a.tip.fireEvent("_update",["selectedall",b]).fireEvent("_show"):(a.tip.fireEvent("_update",["selected",b]),d=function(){$clear(d);if(!(2>c.length)){if("mousedown"==a.list.retrieve("eventState"))return d=arguments.callee.delay(200);a.tip.fireEvent("_show")}}.delay(200)):($clear(d),a.tip.fireEvent("_update",["selected"]).fireEvent("_hide"));a.list.fireEvent(this.checked?
"selectrow":"unselectrow",this)}});g.filter(function(a){return c&&c.push&&(c.contains(a.value)||c.contains("_ALL_"))}).set("checked",!0).fireEvent("change");(b=a.list.getElement("tr[item-id="+a.detailStatus.rowId+"]"))&&a.showDetail(b.getElement("span[detail]").get("detail"),{},b);a.list.addEvent("click",function(c){var b=$(c.target);if(b){b.match("img")&&(b=$(b.parentNode));if(b.hasClass("fav-star"))return b.toggleClass("fav-star-on"),c=b.getParent("tr[item-id]"),c.getElement(".sel").toggleClass("isfav"),
EventsRemote.post({events:q("finder_favstar",a.options.object_name+"_"+a.options.finder_aliasname,["id-"+c.get("item-id"),b.hasClass("fav-star-on")?1:0])});var d=b.get("detail");if(d)return c.stopPropagation(),a.showDetail(d,{},b.getParent(".row"));if(b.hasClass("cell")||b.hasClass("cell-inside"))b=b.getParent("td");if(b.match("td")&&/row/.test(b.parentNode.className)&&a.detailStatus.row&&(c=b.getParent(".row").getElement("*[detail]"))&&!b.getParent(".row").hasClass("view-detail"))return a.showDetail(c.get("detail"),
{},b.getParent(".row"))}});attachEsayCheck(a.list,"td:nth-child(first) .span-auto");var n=0,m=function(){$clear(n);n=function(){if(this.listContainer.scrollLeft!=this.header.scrollLeft){var a=this.header.scrollLeft=this.listContainer.scrollLeft,b=this.listContainer.getElement(".finder-detail-content");b&&b.setStyle("margin-left",a)}this.tip&&"none"!=this.tip.style.visibility&&this.tip.setStyles({left:this.listContainer.scrollLeft,top:this.listContainer.scrollTop})}.delay(200,this)}.bind(this);m();
this.listContainer.addEvent("scroll",m);this.list.addEvent("dispose",function(){this.listContainer.removeEvent("scroll",m)}.bind(this));this.cellOpts.call(this)},fillForm:function(a){if(a&&"object"==$type(a)){a=$H(a);var d=this;a.each(function(a,b){(d.form.getElement("input[name^="+b.slice(0,-1)+"]")||(new Element("input",{type:"hidden",name:b})).inject(d.form)).set("value",a)});return d}},eraseSelected:function(){var a=this,d=a.form.retrieve("rowselected",[]);if("_ALL_"!=d[0]){var c=a.list.getElements(".row .sel");
$splat(arguments).flatten().each(function(b){var e=c.filter(function(a){return a.value==b});e.length?e.set("checked",!1).fireEvent("change"):(d.erase(b),a.tip.fireEvent("_update",["selected",d.length]))})}},eraseFormElement:function(){var a=Array.flatten(arguments),d=this;$each(a,function(a){d.form.getElement("input[name="+a+"]").remove()});return d},scrollTab:function(a,d,c){d||(d=LAYOUT.content_main);c||(c=a);var b=a.getElements("li"),e=a.getElements(".scroll-handle"),h=a.getElement(".tabs-items"),
k=2;b.each(function(a){k+=a.offsetWidth+a.getPatch("margin").x});a.getElement("ul").setStyle("width",k);var f=new Fx.Scroll(h,{link:"cancel"}),g=function(){try{var b=d.offsetWidth;a[b<k?"addClass":"removeClass"]("tabs-scroll").setStyle("width",b-2);h.setStyle("width",b-2*h.getStyle("marginLeft").toInt());f.options.duration=500;f.scrollIntoView(a.getElement(".current"))}catch(c){}};g();LAYOUT.content_main.addEvent("resizelayout",g);c.addEvent("dispose",function(){LAYOUT.content_main.removeEvent("resizelayout",
g)});e.addEvents({mouseenter:function(){f.options.duration=850;f[this.hasClass("r")?"toRight":"toLeft"]()},mouseleave:function(){f.stop()}})},showDetail:function(a,d,c){var b=this,e=c.getNext();d=c.get("item-id");this.detailCurTab&&this.detailCurTab[0]==d&&(a=this.detailCurTab[1]);if(e&&e.hasClass("finder-detail"))return this.hideDetail(c,e);this.hideDetail(this.detailStatus.row,this.detailStatus.dp);var h=new Element("tr",{"class":"finder-detail"}),k=new Element("td",{colspan:c.getElements("td").length,
"class":"finder-detail-colspan"}),f=(new Element("div",{"class":"finder-detail-content clearfix",id:"finder-detail-"+this.id})).set({container:!0});h.adopt(k.adopt(f));var g=this.list.getContainer();(e=this.detailStatus.Request)&&e.cancel();this.detailStatus.row=c.addClass("view-detail");this.detailStatus.rowId=d;this.detailStatus.Request=(new Request.HTML({evalScripts:!1,url:a+(0<a.indexOf("&")?"&":"")+"finder_name="+this.id,onRequest:function(){new MessageBox(LANG_Finder.detail.request,{type:"notice"})},
onComplete:function(a,d,e,q){h.injectAfter(c);new MessageBox(LANG_Finder.detail.complete,{autohide:1});W.render(f.set("html",e));var p=function(){try{f.setStyle("width",g.clientWidth-k.getPatch().x)}catch(a){}};p();LAYOUT.content_main.addEvent("resizelayout",p);b.list.addEvent("dispose",function(){LAYOUT.content_main.removeEvent("resizelayout",p)});(a=f.getElement(".finder-tabs-wrap"))&&f.getParent(".finder-detail-colspan").addEvent("click",function(a){var c=$(a.target);"A"==c.tagName&&c.getParent(".finder-tabs-wrap")&&
(a.stop(),W.page(c.href,{update:f,onComplete:function(){b.scrollTab(f.getElement(".finder-tabs-wrap"),f,b.list)}}))});a&&b.scrollTab(a,f,b.list);$globalEval(q)}.bind(this),onFailure:function(){new MessageBox(LANG_Finder.detail.failure+[this.xhr.status],{type:"error",autohide:!0})}})).send().chain(function(){delete this.detailStatus.Request;this.detailStatus.dp=h}.bind(this))},hideDetail:function(a,d){a&&a.removeClass("view-detail");d&&d.remove();delete this.detailCurTab;delete this.detail;delete this.detailStatus.row;
delete this.detailStatus.dp;delete this.detailStatus.rowId},getFormQueryString:function(){return this.form.toQueryString()},page:function(a){this.form.store("page",a||1);this.request({method:this.form.method||"post"})},loadPacket:function(){var a=this.packet,d=this;this.options.packet&&(new Request.HTML({url:this.form.action+"&action=packet",update:a,onRequest:function(){a.addClass("loading")},onComplete:function(){a.removeClass("loading");d.scrollTab(a)}})).get()},storeTab:function(){var a=$("finder-detail-"+
this.id);a&&(a=a.getElement(".finder-tabs-wrap .current"))&&(this.detailCurTab=[a.get("item-id"),a.get("url")])},refresh:function(a){this.storeTab();this.request({method:this.form.method||"post",onComplete:function(){this.loadPacket();a&&this.unselectAll()}.bind(this)})},filter2packet:function(){var a=this.filter.value;a&&new Dialog(this.form.action+"&action=filter2packet",{width:400,height:200,ajaxoptions:{method:"post",data:{filterquery:a,finder_id:this.id}}})},setCount:function(){var a=this.tip.get("count").toInt(),
d=$E(".finder-title .count");d&&d.setText(a);return this},request:function(){var a=Array.flatten(arguments).link({options:Object.type,action:String.type});a.action=a.action||this.form.action+"&page="+(this.form.retrieve("page")||1);a.options=a.options||{};var d=a.options.onComplete;"function"!=$type(d)&&(d=$empty);$extend(a.options,{clearUpdateMap:!1,updateMap:{".innerheader":this.header,".pager":this.pager},onComplete:function(){this.initView();this.setCount().attachEvents();d.apply(this,Array.flatten(arguments));
var a=$("filter-tip-"+this.id);a&&(this.filter.value.trim().length?a.setStyle("visibility","visible").highlight("#FFFFCC"):a.setStyle("visibility","hidden"))}.bind(this)});this.search&&this.search.getElement("input[search]").value.trim().length&&(this.filter.value=this.search.toQueryString());var c=this.getFormQueryString().concat("&"+this.filter.value),b=a.options.data;switch($type(b)){case "string":a.options.data=[c,b].join("&");break;case "object":case "hash":a.options.data=[c,Hash.toQueryString(b)].join("&");
break;case "element":a.options.data=[c,$(b).toQueryString()].join("&");break;default:a.options.data=c}for(v in this.detailStatus)"element"==$type(this.detailStatus[v])&&delete this.detailStatus[v];W.page(a.action,a.options)},cellOpts:function(){var a=this,d=a.list.getElements(".opt-handle");d&&d.each(function(c,b){a.dropmenu=new DropMenu(c,{eventType:"mouse",stopState:!0,relative:$("main"),offset:{x:0,y:0},delay:0,size:!0,onPosition:function(a){if("x"==a){a=c.getSize().x;var b=c.getParent("td"),d=
b.getSize().x,b=b.getPatch().x;a=a>d?d-b-c.getParent(".cell").getStyle("padding-right").toInt():a;this.options.offset.x=a-this.menu.getStyle("border-left-width").toInt()}},onHide:function(){this.element.style.position=""},onInitShow:function(){a.detailStatus.rowId&&(this.status=!0)},onShow:function(b){this.element.style.position="relative";this.bind||(b.getElements("a").addEvent("click",function(b){var c=this.get("submit")||this.get("url"),d=this.get("target");if(d&&c){b.preventDefault();b=d.split("::")[0]||
d;var e=JSON.decode(d.split("::")[1])||{};switch(b){case "dialog":var l=new Dialog(c,$extend(e,{onLoad:function(){this.dialog.getElement("form").store("target",{onComplete:function(b){l.close();if(b)a.refresh();else return MessageBox.error("REFRESH ERROR!")}})}}));break;case "tab":a.showDetail(c,e,this.getParent("tr"));break;case "request":(new Request({url:c,method:"post",data:e.data,onComplete:function(b){a.showDetail(e.url,{},this.getParent("tr"))}.bind(this)})).send();break;case "confirm":if((d=
this.get("confirm"))&&!confirm(d))break;W.page(c,{onComplete:function(b){a.refresh()}})}}}),this.bind=!0)}})})}});Filter=new Class({Implements:[Events,Options],options:{onPush:$empty,onRemove:$empty,onChange:$empty},initialize:function(a,d,c){this.finderId=d;this.filter=$(a);this.finderObj=window.finderGroup[d];this.setOptions(c)},update:function(){var a=this.filter,d=a.toQueryString(function(c){var b=$(c).getParent("dl"),d;if(b&&b.isDisplay()&&$(c).value)return(d=c.name.match(/_([\s\S]+)_search/))&&
!a.getElement("*[name="+d[1]+"]").value||c.name.match(/_DTYPE_TIME/)&&!a.getElement("*[name="+c.value+"]").value||(d=c.name.match(/_DTIME_\[([^\]]+)\]\[([^\]]+)\]/))&&!a.getElement("*[name="+d[2]+"]").value?void 0:!0},!0);this.finderObj.search&&(this.finderObj.search.getElement("input[search]").value="");this.finderObj.filter.value=d;d=this.finderObj.form.retrieve("rowselected",[]);!d.length||d.contains("_ALL_")||confirm(LANG_Finder.refresh_confirm)?this.finderObj.refresh():(this.finderObj.form.eliminate("rowselected"),
this.finderObj.refresh(!0));this.fireEvent("change")},retrieve:function(){var a=this.finderObj.filter.value||"";this.finderObj.search&&(this.finderObj.search.getElement("input[search]").value="");var d=this;a.replace(/([^&]+)\=([^&]+)/g,function(){var a=arguments,b=a[1],e=d.filter.getElement("[name="+b+"]");b&&b.slice(-1)&&"]"==b.slice(-1)&&(e=d.filter.getElement("[name^="+b.substr(0,b.length-1)+"]"));e&&(e.value=decodeURIComponent(a[2]))})}})})();
(function(){var q=new Tips({onShow:function(a,b){b.addClass("active");var d;a.setStyle("display","block").store("tip:imgsource",d=$pick(b.get("href"),b.get("src")));var h=a.getElement(".tip-text").set("html","&nbsp;").addClass("loading");Asset.image(d,{onload:function(){this.src==a.retrieve("tip:imgsource")&&(h.empty().adopt(this.zoomImg(h.offsetWidth,h.offsetHeight)).removeClass("loading"),this.setStyle("margin-top",(h.offsetHeight-this.height)/2))}})},text:function(a){return"&nbsp;"},className:"finder-col-img-tip"}),
p=new Tips({onShow:function(a,b){b.addClass("active");a.setStyle("display","block");var d=b.retrieve("loaded:html"),h=a.getElement(".tip-text");if(d)return h.set("html",d);h.set("html","&nbsp;").addClass("loading");(new Request({url:b.get("data-load"),onSuccess:function(a){h.removeClass("loading").empty().set("html",a);b.store("loaded:html",a)}})).get()},text:function(a){return"&nbsp;"},className:"finder-col-desc-tip"}),a=new Tips({onShow:function(a,b){b.addClass("active");a.setStyle("display","block")},
text:function(a){return a.get("title")||a.get("rel")},className:"finder-col-text-tip"}),d=new Tips({onShow:function(a,b){b.addClass("active");a.setStyle("display","block")},text:function(a){return a.getElement("textarea").value},className:"finder-col-desc-tip"});this.bindFinderColTip=function(c){c=new Event(c);var b=c.target;b&&(b.onmouseover=null,b.hasClass("img-tip")?q.attach(b):b.hasClass("desc-tip")?d.attach(b):b.hasClass("load-tip")?p.attach(b):a.attach(b),b.addEvent("mouseleave",function(){this.removeClass("active")}),
b.fireEvent("mouseenter",c))}})();