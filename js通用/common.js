GLOBAL.namesplace('dyJs');
/**
 * 公共组件-联系我们弹窗
 * */
GLOBAL.dyJs.contactAlert = function(){
    var parent = $('#pm_contact_alert');
    var mask = $("#pm_blachMask_allView");
    var closeBtn = $(parent).find('.closeBtn');
    var dh = $(document).height();
    var vh = $(window).height();
    var alertHei = parent.height();
    var bBtn = true;
    var contactWxShowBtn = parent.find('.contactAlert_weixin');
    mask.off('click').css('height',dh);
    parent.css('top',(vh-alertHei)/2 + $(window).scrollTop()).add(mask).show();
    bBtn = false;
    closeBtn.add(mask).on('click',function(){
        parent.add(mask).hide();
        bBtn = true;
    });
    contactWxShowBtn.on('click',function(){
        parent.add(mask).hide();
        bBtn = true;
        GLOBAL.dyJs.wxAlert();
    });
    document.addEventListener('touchmove', function (e) { if(!bBtn)e.preventDefault(); }, tryPassive());
};

/**
 * 公共组件-如何联系微信客服遮罩
 * */
GLOBAL.dyJs.wxAlert = function(){
    var parent = $('#pm_contactWx_alert');
    var mask = $("#pm_blachMask_allView");
    var content = parent.find('.content');
    var closeBtn = $(parent).find('.closeBtn');
    var dh = $(document).height();
    var vh = $(window).height();
    mask.off('click').css('height',dh);
    parent.css({'height':vh*.7,'top':vh*.15});
    content.css('height',vh*.7*.88);
    parent.add(mask).show();
    closeBtn.add(mask).on('click',function(){
        parent.add(mask).hide();
    });
};

/**
 * 公共组件-分享遮罩
 * */
GLOBAL.dyJs.shareMask = function(){
    var parent = $('#pm_shareMask');
    var mask = $("#pm_blachMask_allView");
    var dh = $(document).height();
    var bBtn = true;
    mask.off('click').css('height',dh);
    parent.add(mask).show();
    bBtn = false;
    mask.on('click',function(){
        parent.add(mask).hide();
        bBtn = true;
    });
    document.addEventListener('touchmove', function (e) { if(!bBtn)e.preventDefault(); }, tryPassive());
};

/**
 * 公共组件弹窗
 * 参数
 * {
 *  title:弹窗标题（选填，默认'温馨提示'）,
 *  content:提示信息（必填）,
 *  btn1(选填):{
 *      name:按钮名称（选填，默认'确定'）,
 *      url:按钮链接（选填，默认空连接）,
 *      callback:回调函数（选填，默认关闭弹窗）
 *  },
 *  btn2(选填):{
 *      name:按钮名称（选填，默认'关闭'）,
 *      url:按钮链接（选填，默认空连接）,
 *      callback:回调函数（选填，默认关闭弹窗）
 *  },
 *  btn3(选填):{
 *      name:按钮名称（选填，默认'关闭'）,
 *      url:按钮链接（选填，默认空连接）,
 *      callback:回调函数（选填，默认关闭弹窗）
 *  }
 * }
 * 备注 若btn1与btn2都没有定义，默认显示单按钮btn3，默认按钮文字'确定'，点击后关闭弹窗
 * */
GLOBAL.dyJs.alert = function(json){
    var parent = $("#pm_alert");
    var mask = $("#pm_blachMask_allView");
    var title = parent.find(".title");
    var content = parent.find(".content");
    var btn1 = parent.find(".btn1");
    var btn2 = parent.find(".btn2");
    var btn3 = parent.find(".btn3");
    var dh = $(document).height();
    var vh = $(window).height();
    var bBtn = false;
    btn1.add(btn2).add(btn3).off('click');
    json.title ? title.html(json.title) : title.html('温馨提示');
    if(json.content)content.html(json.content);
    if(!json.btn1 && !json.btn2){
        btn1.add(btn2).hide();
        btn3.html('确定').show();
        if(btn3.name){btn3.html('确定')}
        settingBtn('btn3');
    }else{
        btn1.add(btn2).show();
        btn3.hide();
        settingBtn('btn1');
        settingBtn('btn2');
    }
    mask.css({"height":dh}).show();
    parent.css({'top':(vh-parent.height())/2 + $(window).scrollTop()}).show();
    mask.on('click',function(){
        GLOBAL.dyJs.closeAlert();
    });
    document.addEventListener('touchmove', function (e) { if(!bBtn)e.preventDefault(); }, tryPassive());
    function settingBtn(btnName){
        var btn = parent.find('.'+btnName),
            btnInfo = null;
        if(json[btnName]){
            btnInfo = json[btnName];
            if(btnInfo.name)btn.html(btnInfo.name);
            if(btnInfo.url)btn.attr("href",btnInfo.url);
        }
        btn.on("click",function(){
            if(json[btnName]){
                if(!btnInfo.url){
                    if(!btnInfo.callback){
                        GLOBAL.dyJs.closeAlert();
                    }
                    btnInfo.callback && btnInfo.callback();
                }
            }else{
                GLOBAL.dyJs.closeAlert();
            }
        })
    }
    /* 关闭公共组件弹窗 */
    GLOBAL.dyJs.closeAlert = function(){
        parent.add(mask).hide();
        bBtn = true;
    };
};

/**
 * 公共组件toast
 * 参数 格式string(默认'加载中...')
 * */
GLOBAL.dyJs.toast = function(str, callback){
    var parent = $('#pm_toast');
    var content = parent.find('.content');
    var vh = $(window).height();
    var vw = $(window).width();
    content.html(str);
    var iw = parent.innerWidth();
    var ih = parent.innerHeight();
    var len = str.length;
    var second = 2000;
    var timer = null;
    if(iw>=vw*.8)iw = vw*.8;
    parent.css({'top':(vh-ih)/2,'left':(vw-iw)/2,'opacity':100,'display':'inline'});
    if(len >= 12)second = 3500;
    clearInterval(timer);
    timer = setTimeout(function(){
        parent.animate({'opacity':0},200,function(){
            parent.hide();
            callback && callback();
        })
    },second);
};

/**
 * 公共组件loading
 * 参数 格式string(默认'努力加载中...')
 * */
GLOBAL.dyJs.loading = function(str){
    var parent = $('#pm_loading');
    var desc = parent.find('.desc');
    var mask = $('#pm_blachMask_allView');
    var vw = $(window).width();
    var vh = $(window).height();
    var dh = $(document).height();
    var iw = parent.innerWidth();
    var ih = parent.innerHeight();
    var bBtn = false;
    mask.css({'height':dh}).show();
    if(str)desc.html(str);
    parent.css({'top':(vh-ih)/2,'left':(vw-iw)/2}).show();
    document.addEventListener('touchmove', function (e) { if(!bBtn)e.preventDefault(); }, tryPassive());
    /* 关闭公共组件loading */
    GLOBAL.dyJs.closeLoading = function(){
        parent.add(mask).hide();
        bBtn = true;
    }
};

/**
 * 公共脚本ajax请求封装
 * 格式json
 * {
 *  url 请求地址,
 *  type 请求类型(选填),
 *  data 请求参数 格式json（选填）,
 *  callback 回调函数（选填）
 *  extend 扩展ajax方法参数 格式json（选填）
 *  loadingType 0:默认  1:自定义
 *  error   请求失败回调函数（选填）
 * }
 * */
GLOBAL.dyJs.ajax = function(json){
    var type = 'post';
    var data = {};
    var url = json.url;
    var loadingType = 0;
    if(json.loadingType === 1){
        loadingType = 1;
    }
    if(json.type)type = json.type;
    if(json.data)data = json.data;
    var parameter = {
        type:type,
        url:url,
        data:data,
        success:function(result){
            if(loadingType !== 1) {
                GLOBAL.dyJs.closeLoading();
            }
            json.callback && json.callback(result);
        },
        error:function(){
            if(loadingType !== 1) {
                GLOBAL.dyJs.closeLoading();
            }
            json.error && json.error(result);
            //- GLOBAL.dyJs.toast('网络繁忙，请稍后重试');
        }
    };
    if(json.extend){
        $.each(json.extend,function(i,item){
            parameter[i] = item;
        })
    }
    if(loadingType !== 1){
        GLOBAL.dyJs.loading('');
    }
    $.ajax(parameter);
};

/**
 * 公共脚本分页加载方法封装
 * 参数 格式 json
 * {
 *  type 请求类型（选填，默认post）
 *  url 请求链接（必填，不需要填写页数）
 *  parent 列表父级（选填，DOM对象类型）
 *  list 列表（必填，DOM对象类型）
 *  callback 回调函数（选填）
 * }
 * */
GLOBAL.dyJs.pageLoad = function(json){
    var type = 'post';
    var url = json.url;
    var list = json.list;
    var pageNum = 1;
    var vh = 0;
    var st = 0;
    var iTop = 0;
    var dh = list.height();
    var list_warp = $('.flexPage_content');
    var bBtn = true;
    var pageLoadIcon = null;
    if(json.parent){
        iTop = $(json.parent).offset().top;
        dh += iTop;
    }
    if(json.type)type = json.type;
    $(list_warp).on('scroll',function(){
        st = list_warp.scrollTop();
        vh = list_warp.height();
        if((st + vh)>= dh && dh > vh && bBtn){
            bBtn = false;
            pageLoadIcon = $('<li style="background:none; margin-top:0; margin-bottom:0; text-align:center; border-bottom:0; height:auto; padding-top:20px; padding-bottom:20px;"><i class="pm_pageLoad_icon"></i></li>');
            pageLoadIcon.appendTo(list);
            pageNum++;
            $.ajax({
                type:type,
                url:url + pageNum,
                success:function(result){
                    pageLoadIcon.remove();
                    if(result){
                        $(list).append(result);
                        dh = list.height();
                        bBtn = true;
                    }else{
                        json.callback && json.callback(result);
                    }
                },
                error:function(){
                    pageLoadIcon.remove();
                    GLOBAL.dyJs.toast('网络繁忙，请稍后重试');
                    bBtn = true;
                }
            })
        }
    })
};

/**
 * 设置红色头部
 * 参数 json
 * {
 *  title 页面title名称（必填）
 *  right{
 *      name 右侧按钮名称，默认是'加载中...'（选填）
 *      url  右侧按钮链接，默认为空（选填）
 *      callback 点击右侧按钮后的回调函数(选填)
 *      type 右侧按钮类型，会有对应的事件，默认为空（选填）
 *          已有类型：
 *          联系我们 'contact'，联系我们的对应的弹出层及对应的功能实现
 *          分享遮罩 'share' 分享遮罩显示
 *  }
 * }
 * */
GLOBAL.dyJs.setTop = function(json){
    var parent = $('#pm_top');
    var mask = $("#pm_blackMask");
    var title = parent.find('.page_title');
    var left = parent.find('.left_warp');
    var leftBtn = left.find('.nav_icon');
    var nav = left.find('.nav_content');
    var right = parent.find('.right_warp');
    var rightBtn = right.find('.right_name');
    var wxService = right.find('.wx_service');
    var rightJson = json.right || {};
    var type = rightJson.type || '';
    var dh = $(document).height();
    var contact_warp = right.find('.contact');
    var lBtn = true;
    var rBtn = true;
    var bBtn = true;
    rightBtn.off('click');
    leftBtn.off('click');
    title.html(json.title);
    /* 红色头部初始化 */
    if(type === 'contact'){
        rightBtn.html('联系客服');
        right.show();
    }
    if(rightJson.name){
        right.show();
        rightBtn.html(rightJson.name).attr('href',rightJson.url);
    }
    /* 头部左侧菜单事件 */
    leftBtn.on('click',function(){
        dh = $(document).height();
        mask.css({"height":dh});
        if(lBtn){
            bBtn = false;
            mask.add(nav).show();
            if(type==='contact'){
                contact_warp.hide();
            }
            rBtn = true;
        }else{
            bBtn = true;
            closeLayer();
        }
        lBtn = !lBtn;
    });
    /* 头部右侧按钮事件 */
    rightBtn.on('click',function(){
        dh = $(document).height();
        mask.css({"height":dh});
        lBtn = true;
        nav.add(mask).hide();
        if(rBtn){
            if(type==='contact'){
                bBtn = false;
                mask.add(contact_warp).show();
            }
            if(type==='share'){
                bBtn = false;
                closeLayer();
                GLOBAL.dyJs.shareMask();
                lBtn = rBtn = true;
                return;
            }
        }else{
            bBtn = true;
            closeLayer();
        }
        rightJson.callback && rightJson.callback(leftBtn,bBtn);
        rBtn = !rBtn;
    });
    /* 微信客服点击事件 */
    wxService.on('click',function(){
        closeLayer();
        GLOBAL.dyJs.wxAlert();
        lBtn = rBtn = true;
    });
    /* 黑色遮罩层点击事件 */
    mask.on('click',function(){
        if(!lBtn || !rBtn){
            lBtn = rBtn = true;
            closeLayer();
        }
    });
    /* 关闭弹出层遮罩层 */
    function closeLayer(){
        bBtn = true;
        mask.add(nav).hide();
        if(type==='contact'){
            contact_warp.hide();
        }
    }
    document.addEventListener('touchmove', function (e) { if(!bBtn)e.preventDefault(); }, tryPassive());
};

/**
 * 协议遮罩公共脚本
 * */
GLOBAL.dyJs.agreement = function(json){
    var parent = $("#pm_agreement");
    var mask = $("#pm_blachMask_allView");
    var main = parent.find('.main_warp');
    var title = parent.find('.agreementTitle');
    var content = parent.find('.content_warp');
    var closeBtn = parent.find('.closeBtn');
    var vh = $(window).height();
    var dh = $(document).height();
    var showBtn = $('.agreement');
    /* 点击协议显示按钮 */
    showBtn.on('click',function(){
        var url = $(this).data('url');
        if(url.indexOf('isPdf=0') != -1){
            if(GLOBAL.dyAttr.andior) {
                dyJsApi.callShowFile(url);
            }else{
                window.open(url);
            }
            return;
        }else{
            if(GLOBAL.dyAttr.remote){
                window.open(url);
            }
        }
        var agreeName = $.trim($(this).text());
        if(agreeName.indexOf('《') != -1){
            agreeName = agreeName.substring(1,agreeName.length -1)
        }
        title.text(agreeName);
        content.html('<div class="loadingText">加载中...</div>');
        if(url.indexOf('isPdf=0')){
            url.replace('isPdf=0', 'isPdf=1')
        }
        GLOBAL.dyJs.ajax({
            url: 'agree/post',
            data: {
                t: 1,
                url:url
            },
            callback: function (result) {
                if(!result || (!result.success && typeof result.success != 'undefined')){
                    parent.add(mask).hide();
                    GLOBAL.dyJs.toast('网络繁忙，请稍后重试');
                    return;
                }
                content.html(result);
                content.find('div').children().each(function(i,item){
                    var iStr = $.trim($(item).text());
                    if(iStr.length === agreeName.length && iStr === agreeName){
                        $(item).remove();
                    }
                });
                agreementShow();
            }
        });
    });
    /* 协议遮罩显示 */
    function agreementShow(){
        parent.show();
        mask.css({'height':dh}).show();
        main.css({'height':vh*.8,'top':vh*.1}).show();
        setAgreementMask();
        $(window).on('resize',function(){
            setAgreementMask();
        });
        $('body').css({'position':'fixed','top':0,'left':0,'width':'100%'});
    }
    /* 关闭用户协议遮罩 */
    closeBtn.add(mask).on('click',function(){
        parent.add(mask).hide();
        $('body').removeAttr('style');
    });
    /* 协议遮罩高度设置 */
    function setAgreementMask(){
        var contentH = main.height() - closeBtn.outerHeight(true) - title.outerHeight(true);
        content.css({'height': contentH});
    }
};
