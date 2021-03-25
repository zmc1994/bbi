$(function() {
	FastClick.attach(document.body);
});

/**
 * rem适配移动端方法
 * */
(function(){
    var vw = document.documentElement.offsetWidth;
    var pagesize = 7.5;
    var htmlAttr = $('html').data('pagesize');
    if(htmlAttr){ pagesize = htmlAttr; }
    var iSize = Math.floor(vw / pagesize);
    document.getElementsByTagName("html")[0].style.fontSize = iSize + "px";
})();

/**
 * 兼容新版本浏览器参数passive
 * 用于兼容新版本浏览器取消默认行为
 * */
function tryPassive(){
    var supportPassive = false;
    try{
        var opts = Object.defineProperty({},'passive',{
            get:function(){
                supportPassive = true;
            }
        });
        window.addEventListener("test",null,opts);
    }catch(e){}
    return supportPassive ? {passive:false} : false;
}

/**
 * 金额数字大小写转换
 */
function caseSwitch(n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'], ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
}

/* 检测手机号 */
function checkMobile (mobile) {
    if(mobile == ''){
       console.log('请填写手机号');
       return;
    };
    var reg = /^(?:\+86|86)?1(\d{10})$/;
    if(!reg.test(mobile)){
        console.log('手机号码格式不正确');
        return;
    }
};
