function MyTpl(tpl,data,fast){
	var fn=function(d){
			if(fast){
				fn.$=fn.$||new Function(fn.t);
				return fn.$.apply(d);
			}else{
				var i,
					k=[],
					v=[];
				for(i in d){
					k.push(i);
					v.push(d[i]);
				}
				return (new Function(k,fn.t)).apply(d,v);
			}
		},
		tagBegin=MyTpl.tagBegin||'{{',
		tagEnd=MyTpl.tagEnd||'}}',
		tagOut=MyTpl.tagOut||'=',
		debug=MyTpl.debug||false,
		_tagBegin,
		_tagEnd,
		regTpl,
		regJs;
	var fnEStr=function(V,V2){
		return "try{"+V+";}catch(e){console.error('Error','(',"+JSON.stringify(V2||V)+",')',e);return '';}";
	};
	if(typeof tpl==='object'){
		MyTpl.tagBegin=tpl.tagBegin||tagBegin;
		MyTpl.tagEnd=tpl.tagEnd||tagEnd;
		MyTpl.tagOut=tpl.tagOut||tagOut;
		MyTpl.debug=tpl.debug||debug;
		return MyTpl;
	}
	_tagBegin=tagBegin.replace(/(.)/g,'\\$1');
	_tagEnd=tagEnd.replace(/(.)/g,'\\$1');
	regTpl=eval('/'+_tagEnd+"(.*?)"+_tagBegin+"/g");
	regJs=eval('/'+_tagBegin+"(.*?)"+_tagEnd+"/g");
	
	tpl=(tagBegin+"var P='';"+tagEnd+tpl+tagBegin+'return P;'+tagEnd)
	.replace(/([\n\t])|(  )/g,'')
	.replace(/(\<\!--[\w\W]*?->)/g,'')
	.replace(regTpl,function(a,b){ /*遍历全部内容*/
		if(b[0]){
			if(debug){
				var VAL=b.replace(/'/g,"\\'");
				return tagEnd+fnEStr("P+='"+VAL+"'",JSON.stringify(VAL))+tagBegin;
			}else{
				return tagEnd+"P+='"+b.replace(/'/g,"\\'")+"';"+tagBegin;
			}
		}else{
			return a;
		}
	})
	.replace(regJs,function(a,b){ /*遍历全部定义函数*/
		if(tagOut===b.charAt(0)){
			if(debug){
				var HTL=b.substr(1);
				return fnEStr('P+='+HTL,JSON.stringify(HTL));
			}else{
				return 'P+='+b.substr(1)+';';
			}
		}
		if(b.indexOf('else')> -1){
			if(b.indexOf('elseif')> -1){
				return b.replace(/elseif(.*?)( )*:/,'}else if$1{');
			}
			return b.replace(/else( )*:/,'}else{');
		}else if(b==='/for'||b==='/if'){
			return '} /*--*/ ';
		}
		if(debug){
			if(!b.match(/(\)( )*:)/)&&b.match(/(.*)=(.*)/)){
				b=fnEStr(b);
			}
		}
		return b.replace(/\)( )*:/,'){');
	});
	fn.t=tpl;
	tpl=null;
	return data?fn(data,fast):fn;
}
