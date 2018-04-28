function usetpl(tpl,data,fast){
	var fn=function(d,f) {
		if(fast){
			fn.$ = fn.$ || new Function(fn.t);
			return fn.$.apply(d);
		}else{
			var i=0,k=[],v=[];
			for(i in d){
				k.push(i);
				v.push(d[i]);
			}
			return (new Function(k,fn.t)).apply(d,v);
		}
	}
	,tagBegin=usetpl.tagBegin||'{{'
	,tagEnd=usetpl.tagEnd||'}}'
	,tagOut=usetpl.tagOut||'='
	,_tagBegin=null
	,_tagEnd=null
	,regTpl=null
	,regJs=null
	;

	if(typeof tpl==='object'){
		usetpl.tagBegin=tpl.tagBegin||tagBegin;
		usetpl.tagEnd=tpl.tagEnd||tagEnd;
		usetpl.tagOut=tpl.tagOut||tagOut;
		return usetpl;
	}
	_tagBegin=tagBegin.replace(/(.)/g,'\\$1');
	_tagEnd=tagEnd.replace(/(.)/g,'\\$1');
	regTpl=eval("/"+_tagEnd+"(.*?)"+_tagBegin+"/g");
	regJs=eval("/"+_tagBegin+"(.*?)"+_tagEnd+"/g");

	tpl=(tagBegin+"var P='';"+tagEnd+tpl+tagBegin+'return P;'+tagEnd)
	.replace(/([\n\t])|(  )|(\<\!-\-[\w\W]*?\-\-\>)/g,'')
	.replace(regTpl,function(a,b){ /*遍历全部内容*/
		if(b[0]){
			return tagEnd+"P+='"+b.replace(/\'/g,"\\'")+"';"+tagBegin;
		}else{
			return a;
		}
	})
	.replace(regJs,function(a,b,c){ /*遍历全部定义函数*/
		if(tagOut===b.charAt(0)){
			return 'P+='+b.substr(1)+';';
		}
		if(b.indexOf('else')>-1){
			if(b.indexOf('elseif')>-1){
				return b.replace(/elseif(.*?)( ){0,}\:/,'}else if$1{');
			}
			return b.replace(/else( ){0,}\:/,'}else{');
		}else if(b==='/for'||b==='/if'){
			return '}';
		}
		return b.replace(/\)( ){0,}\:/,'){');
	});
	fn.t=tpl;
	tpl=null;
	return data ? fn(data,fast) : fn;
}
