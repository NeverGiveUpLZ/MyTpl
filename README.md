# MyTpl （曾用名：useTpl)

![速度测试图片](https://github.com/NeverGiveUpLZ/useTpl/blob/master/_speed.png)

*    注
>        1我开发这个的时候为了小巧，没有可以注重速度方面
>        2模板呢中两个空格以上将替换成一个空格
>        3<!-- -->注释将被直接删除
	
*   使用
>        设置边界符
>        var uefn=MyTpl({tagBegin:'{>',tagEnd:'<}'});
>        设置模板
>        uefn=uefn(模板);
>        进行渲染
>        document.write(MyTpl(数据,true));
>
>        直接渲染输出
>        document.write(MyTpl(模板,数据));

*   注 下面的测试模板使用了自定义边界符，默认的边界符如下
>        {
>            tagBegin:'{{',
>            tagEnd:'}}',
>            tagOut:'='
>        }
*   模板临时定义变量
>        {>var pi=3.1415926;<}
>        或
>        {>
>            var a=1;
>            var b='b';>
>            var c="c";
>            var a=10+5+a;
>        <}


*    输出
>        {>=a<}
>        或者输出参与计算
>        {>=a+a*3<}

*    模板中直接运行函数
>        {>alert('123');<}
>        
>        假如系统定义增强函数 each 函数如下
>        Array.prototype.each=function(c){ /*1.1*/
>            for(var i=0,val;val=this[i++];){
>                (c||empfunc)(val,i);
>            }
>            return this;
>        };
>        使用
>        {> [{id:1},{id:2}].each(function(val,key){ <}
>            {>=val.id<}
>        {> }); <}
>
*    判断 if 注意分号
>        {>if( a>3 ):<}
>            <span>a大于3</span
>        {>elseif(a>4):<}
>            <span>a大于4</span
>        {>else:<}
>            <span>a不大于3也不大于4</span
>        {>/if<}
>
*    循环
>        {>var list=[{id:1},{id:2}]; <}
>        {>for(var k=0;k<list.length;k++): <}
>            {>=list[k].id<}
>        {>/for<}
>
>
