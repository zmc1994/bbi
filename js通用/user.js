define(function(require,exports,moduls){
    /**
     * 财富首页交互弹窗
     * mingchao_zh
     * */
    function userTreasur(){
        //个人信息跳转
        $('.telMessage').on('click',function () {
           location.href = 'my/setting';
        });
        //-底部推荐列表优化：动态获取列表产品数量
        var liEle = $('#userCenterPage .user_product_list li');
        var contentList = $('#userCenterPage .user_product_list .contentlist');
        var liWidth = $(liEle[0]).outerWidth(true)+1;
        var contentWidth = liWidth*(liEle.length);
        contentList.css('width',contentWidth);
        //-三大收益为零弹窗提示
        $('.total_income').on('click',function () {
            GLOBAL.dyJs.alert({
                'content':'累计收益是指所有已购买产品已兑付收益总和。',
                'btn3':{'name':'我知道了'}
            });
        });
        // $('.today_income').on('click', function () {
        //     GLOBAL.dyJs.alert({
        //         'content': '今日收益是指今日实际到账的收益。',
        //         'btn3': {'name': '我知道了'}
        //     });
        // });
        $('.coming_income').on('click', function () {
            GLOBAL.dyJs.alert({
                'content': '在途收益是指截至昨日，所有收益中的投资项目(余额存除外)每日未分配的收益总和，最终收益以实际兑付为准。',
                'btn3': {'name': '我知道了'}
            });
        });
        //-提现操作弹窗提示
        $('.tixian').on('click',function () {
            var mobile = $(this).data('mobile');
            GLOBAL.dyJs.ajax({
                url:'my/bank',
                callback:function(isBindCard) {
                    if (isBindCard.data.bind == 0) {
                        GLOBAL.dyJs.alert({
                            content: '为了保障您的资金安全，请绑定银行卡确认实名信息',
                            btn2: {
                                name: '取消',
                            },
                            btn1: {
                                name: '立即绑定',
                                callback:function () {
                                    GLOBAL.dyJs.closeAlert();
                                    window.location.href = 'my/bind/card'
                                }
                            }
                        })
                    }else{
                        var isReturn = false;
                        checkMobile(mobile, function(result){
                            if(result.data.isFastUser == 0){
                                isReturn = true;
                                window.location.href=GLOBAL.dyAttr.baseUrl + 'index/setpwd?returnUrl='+ GLOBAL.dyAttr.baseUrl +'my';
                                return;
                            }
                        })
                        if(isReturn) return;
                        GLOBAL.dyJs.alert({
                            'content':'频繁提现不利于长期赚钱，看看大家都在疯抢的高收益投资项目吧！',
                            'btn2':{
                                'name':'继续提现',
                                'callback':function () {
                                    GLOBAL.dyJs.closeAlert();
                                    window.location.href = 'my/cash/out'
                                }
                            },
                            'btn1':{
                                'name':'立即查看',
                                'callback':function () {
                                    GLOBAL.dyJs.closeAlert();
                                    window.location.href = 'product/list'
                                }
                            }
                        })
                    }
                }
            });
        });
    }
    exports.userTreasur = userTreasur;

    /**
     * 在途收益-数据加载
     * mingchao_zh
     * */
    function userUnderwayEarning() {
        var listEle = $('.user_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noMore = $('.no_more');
        var noData = $('.none_data');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                noMore.add(noData).add('.select_section').add('.user_earn_title').hide();
                bBtn = true;
                listEle.children().remove();
                listIndex = $(this).data('type');
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/earnings/underway?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        noMore.add(noData).add('.loadingshow').hide();
                        listEle.append(data).show();
                        if(listEle.children().length >0 && listEle.children().length <=20){
                            noMore.show();
                        }
                        var earnNumber = $('.earning_number').html();
                        var earnItems = $('.earn_items').html();
                        $('.user_earn_num').html(earnNumber);
                        if(earnItems=="" && earnNumber == 0){
                            noMore.hide();
                            noData.show();
                            listEle.append(data);
                            $('.user_earn_num').html(earnNumber+'.00');
                            listEle.hide();
                        };
                        if(!data){
                            noMore.hide();
                            noData.show();
                            $('.user_earn_num').html('0.00');
                            listEle.hide();
                        }
                        $('.user_earn_title').show();
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/earnings/underway?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    noMore.show();
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if (listIndex == 0) {
                    titleEle = '在途收益'
                }
                setTop(titleEle);
            });
        });
        GLOBAL.dyJs.pageLoad({
            'url': 'my/earnings/underway?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.userUnderwayEarning = userUnderwayEarning;

    /**
     * 设置头部
     * mingchao_zh
     */
    function setTop(titleEle) {
        GLOBAL.dyJs.setTop({
            'title': titleEle,
            'right': {
                'name': '筛选',
                'callback': function (leftBtn) {
                    $('.select_section').toggle();
                    $(leftBtn).on('click', function () {
                        $('.select_section').hide();
                    })
                }
            }
        });
    }
    /**
     * 理财记录-数据加载和筛选
     * mingchao_zh
     * */
    function userTradeList(lcListIndex) {
        var listEle = $('.user_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noMore = $('.no_more');
        var noContent = $('.none_content');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').hide();
                noMore.hide();
                bBtn = true;
                listEle.children().remove();
                listIndex = i;
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/trade/list?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        if(data){
                            noContent.add(noMore).hide();
                            listEle.append(data).show();
                            if(listEle.children().length >0 && listEle.children().length <20){
                                noMore.show();
                            }
                        }else{
                            listEle.add(noMore).hide();
                            if(listIndex == 0){
                                noContent.show().find('p').html('暂无记录');
                            }else{
                                noContent.show().find('p').html('暂无符合条件的理财记录');
                            }
                        }
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/trade/list?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    noMore.show();
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if(listIndex==0){
                    titleEle = '理财记录'
                }
                setTop(titleEle);
            });
        });
        if (lcListIndex == 0) {
            $('.user_list').hide();
            noMore.hide();
            noContent.show();
        }
        GLOBAL.dyJs.pageLoad({
            'url': 'my/trade/list?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.userTradeList = userTradeList;

    /**
     * 累计收益-数据加载和筛选
     * mingchao_zh
     * */
    function totalEarning() {
        var listEle = $('.user_earn_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noMore = $('.no_more');
        var noData = $('.none_data');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').add('.user_earn_title').hide();
                bBtn = true;
                listEle.children().remove();
                noMore.hide();
                listIndex = $(this).data('type');
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/earnings/total?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        noData.add(noMore).hide();
                        listEle.append(data).show();
                        var isNext = $('.isNext').html();
                        if(isNext == "false"){
                            noMore.show();
                        }
                        var earnNumber = $('.earning_number').html();
                        $('.user_earn_num').html(earnNumber);
                        if(!data){
                            noMore.hide();
                            noData.show();
                            $('.user_earn_num').html('0.00');
                            listEle.hide();
                        }
                        $('.user_earn_title').show();
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/earnings/total?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    noMore.show();
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if (listIndex == 0) {
                    titleEle = '累计收益'
                }
                setTop(titleEle);
            });
        });
        GLOBAL.dyJs.pageLoad({
            'url': 'my/earnings/total?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.totalEarning=totalEarning;

    /**
     * 今日收益-数据加载和筛选
     * mingchao_zh
     * */
    function todayEarning() {
        var listEle = $('.user_earn_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noMore = $('.no_more');
        var noData = $('.none_data');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').add('.user_earn_title').hide();
                bBtn = true;
                listEle.children().remove();
                noMore.hide();
                listIndex = $(this).data('type');
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/earnings/today?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        noData.add(noMore).hide();
                        listEle.append(data).show();
                        var earnNumber = $('.earning_number').html();
                        var earnItems = $('.earn_items').html();
                        $('.user_earn_num').html(earnNumber);
                        if(!data){
                            noMore.hide();
                            noData.show();
                            $('.user_earn_num').html('0.00');
                            listEle.hide();
                        }
                        $('.user_earn_title').show();
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/earnings/today?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    noMore.show();
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if (listIndex == 0) {
                    titleEle = '今日收益'
                }
                setTop(titleEle);
            });
        });
        GLOBAL.dyJs.pageLoad({
            'url': 'my/earnings/today?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
        // 第一列数据自动展开
        $('.user_childList').eq(0).show();
        $('.left_arrow').eq(0).find('img').attr('src','images/user/up_arrow.png').data('state','up');
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.todayEarning=todayEarning;

    /**
     * 设置-退出账号
     * mingchao_zh
     * */
    function logout(outBtn) {
        outBtn.on('click',function () {
            GLOBAL.dyJs.ajax({
                url: 'my/loginout',
                callback: function (data) {
                    window.location.href = data.data.url;
                }
            });
        })
    }
    exports.logout = logout;

    /**
     * 上下箭头图标切换
     * mingchao_zh
     * */
    function arrowchange(btn) {
        btn.on('click','.user_list',function () {
            var state = $(this).find('img').data('state');
            if(state=='down'){
                $(this).find('img').attr('src','images/user/up_arrow.png');
                $(this).find('img').data('state','up');
            }else{
                $(this).find('img').attr('src','images/user/down_arrow.png');
                $(this).find('img').data('state','down');
            }
            $(this).next().toggle();
        });
    }
    exports.arrowchange = arrowchange;

    /**
     * 三大收益说明提示弹窗
     * mingchao_zh
     * */
    function incomeExplain(btn) {
        btn.on('click', function () {
            GLOBAL.dyJs.alert({
                'content': '1、累计收益：<br>所有已购买产品已兑付收益总和。<br>2、在途收益：<br>截至昨日，所有收益中的投资项目(余额存除外)每日未分配的收益总和，最终收益以实际兑付为准。',
                'btn3': {'name': '确认'}
            });
        })
    }
    exports.incomeExplain = incomeExplain;

    /**
     * 用户信息-信息加载和信息类型切换
     * mingchao_zh
     * */
    function userMsg(infoIndex) {
        var listEle = $('.user_msg_list');
        var listEle2 = $('.user_msg_list2');
        var listIndex = 'info';
        var selectList = $('.user_msg_type');
        var noMore = $('.no_more');
        //-标记消息为已读
        listEle.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).find('.user_msg_state').hide();
                $.ajax({
                    url: 'my/message/read'
                });
            });
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                listIndex = $(this).data("type");
                if(listIndex=='daily'){
                    GLOBAL.dyJs.setTop({
                        'title': '我的消息',
                        'right': {
                            'name': ' ',
                            'callback': function () {
                                $('.user_msg_state').hide();
                                $.ajax({
                                    url: 'my/message/read'
                                });
                                GLOBAL.dyJs.toast('标为已读成功！');
                            }
                        }
                    });
                    $('.user_msg_list').hide();
                    $('.user_msg_list2').show();
                    var length = $('.user_msg_list2 li' ).length;
                    if(length>=15){
                        noMore.hide();
                    }else{
                        noMore.show();
                    }
                    $(window).off("scroll");
                    GLOBAL.dyJs.pageLoad({
                        'url': 'my/message/' + listIndex + '/list?pn=',
                        'list': listEle2,
                        'callback':function (data) {
                            if(!data){
                                noMore.show();
                                $(window).off("scroll");
                            }
                        }
                    });
                }else{
                    GLOBAL.dyJs.setTop({
                        'title': '我的消息',
                        'right': {
                            'name': '全标为已读',
                            'callback': function () {
                                $('.user_msg_state').hide();
                                $.ajax({
                                    url: 'my/message/read'
                                });
                                GLOBAL.dyJs.toast('标为已读成功！');
                            }
                        }
                    });
                    $('.user_msg_list2').hide();
                    $('.user_msg_list').show();
                    var length = $('.user_msg_list li' ).length;
                    if(length>=15){
                        noMore.hide();
                    }else{
                        noMore.show();
                    }
                    $(window).off("scroll");
                    GLOBAL.dyJs.pageLoad({
                        'url': 'my/message/' + listIndex + '/list?pn=',
                        'list': listEle,
                        'callback':function (data) {
                            if(!data){
                                noMore.show();
                                $(window).off("scroll");
                            }
                        }
                    });
                }
            });
        });
        if ( infoIndex == 0) {
            $('.user_list').hide();
            noMore.hide();
            $('.none_content').show();
        }
        GLOBAL.dyJs.pageLoad({
            'url': 'my/message/' + listIndex + '/list?pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
    }
    exports.userMsg = userMsg;

    /**
     * 用户余额明细-余额信息的加载和信息类型的切换
     * mingchao_zh
     * */
    function balance(banlanceIndex) {
        var listEle = $('.user_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noMore = $('.no_more');
        var noData = $('.none_content');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').hide();
                bBtn = true;
                listEle.children().remove();
                noMore.hide();
                listIndex = $(this).data("type");
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/money/change/list?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        if(data){
                            noData.add(noMore).hide();
                            listEle.append(data).show();
                            if(listEle.children().length<20){
                                noMore.show();
                            }
                        }else if(listIndex == 0){
                            noData.show().find('p').html('暂无记录');
                        }else{
                            listEle.add(noMore).hide();
                            noData.show().find('p').html('暂无符合条件的记录');
                        }
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/money/change/list?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    noMore.show();
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if(listIndex==0){
                    titleEle = '余额明细'
                }
                setTop(titleEle);
            });
        });
        if (banlanceIndex == 0) {
            listEle.add(noMore).hide();
            noData.show();
        }
        GLOBAL.dyJs.pageLoad({
            'url': 'my/money/change/list?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    noMore.show();
                    $(window).off("scroll");
                }
            }
        });
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.balance=balance;

    /**
     * 用户多盈币信息-信息的加载和信息的类型切换
     * mingchao_zh
     * */
    function dyCoin(dyCoinIndex) {
        var listEle = $('.user_list');
        var listIndex = 0;
        var selectList = $('.select');
        var bBtn = true;
        var noData = $('.none_content');
        //遮罩显示时禁止滚动
        $('#pm_top').on('click','.right_name',function () {
            if($('.select_section').is(":visible") ){
                bBtn = false;
            }else{
                bBtn = true;
            }
        });
        $('.select_section').on('click',function () {
            bBtn = true;
        });
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').hide();
                bBtn = true;
                listEle.children().remove();
                listIndex = i;
                noData.hide();
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/coin/list?type=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        if(data){
                            noData.hide();
                            listEle.append(data).show();
                        }else{
                            listEle.hide();
                            if(listIndex == 0){
                                noData.show().find('p').html('暂无明细');
                            }else{
                                noData.show().find('p').html('暂无符合条件的明细');
                            }
                        }
                        $(window).off("scroll");
                        GLOBAL.dyJs.pageLoad({
                            'url': 'my/coin/list?type=' + listIndex + '&pn=',
                            'list': listEle,
                            'callback':function (data) {
                                if(!data){
                                    $(window).off("scroll");
                                }
                            }
                        });
                    }
                });
                var titleEle = $(this).html();
                if(listIndex==0){
                    titleEle = '多盈币明细'
                }
                setTop(titleEle);
            });
        });
        if (dyCoinIndex == 0) {
            listEle.hide();
            noData.show();
        }
        GLOBAL.dyJs.pageLoad({
            'url': 'my/coin/list?type=' + listIndex + '&pn=',
            'list': listEle,
            'callback':function (data) {
                if(!data){
                    $(window).off("scroll");
                }
            }
        });
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.dyCoin=dyCoin;

    /**
     * 用户优惠券信息-信息的加载和信息的类型切换
     * mingchao_zh
     * */
    function userCoupon() {
        var listEle = $('.user_coupon_list');
        var listIndex = 1;
        var selectList = $('.user_coupon_state');
        selectList.children().each(function (i, item) {
            $(item).on('click', function () {
                $(this).addClass('selected').siblings().removeClass('selected');
                $('.select_section').hide();
                listEle.children().remove();
                $(window).scrollTop(0);
                listIndex = i+1;
                $('.none_content').hide();
                $('.loadingshow').show();
                GLOBAL.dyJs.ajax({
                    url: 'my/coupon/list?status=' + listIndex + '&pn=1',
                    loadingType: 1,
                    callback: function (data) {
                        $('.loadingshow').hide();
                        listEle.children().remove();
                        if(data){
                            listEle.append(data).show();
                        }else{
                            $('.none_content').show();
                            if(listIndex == 1){
                                $('.none_content p').html('暂无可用优惠券');
                            }else{
                                $('.none_content p').html('暂无历史优惠券');
                            }
                        }
                    }
                });
            });
        });
        //ajax请求获取跳转链接
        (function () {
            $('.user_coupon_list').on('click','li',function(){
                var activate = $(this).data('activate');
                var scope = $(this).data('scope');
                var ctype = $(this).data('type');
                var cid = $(this).data('cid');
                console.log(activate,ctype,scope)
                if(activate == 2){
                    window.location.href = "product/list?type1=8"
                }else if(ctype==1 && (scope == 4 || scope == 6)){
                    GLOBAL.dyJs.ajax({
                        url: 'coupon/product?scope='+scope,
                        callback: function (result) {
                            if(result.productId === null ){
                                GLOBAL.dyJs.toast('抱歉，暂无体验金券产品，请稍后再试!');
                                return;
                            }else{
                                // window.location.href = "product/detail/"+result.productId+'?cid='+cid+'&ctype='+ctype;
                                window.location.href = "product/bbin/detail/"+result.productId+'?cid='+cid+'&ctype='+ctype;
                            }
                        }
                    })
                }else{
                    window.location.href = 'my/coupon/wight/list?cid='+cid+'&ctype='+ctype;
                }
            });
        })();
    }
    exports.userCoupon=userCoupon;

    /**
     * 用户定期理财记录信息-信息的加载和信息的类型切换
     * mingchao_zh
     * */
    function regular(regularIndex,btn) {
        var type = 0;
        var status= 0;
        var selectParent = $('.userRegular_type');
        var userSelect = $('.userRegular_select');
        var listEle = $('.userRegular_list');
        var noMore = $('.no_more');
        var noData = $('.none_content');
        var bBtn = true;
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        $('.mask').on('click',function () {
            bBtn = true;
        });
        btn.on('click',function () {
            reset();
        });
        //-定向跳转
        var hrefType = $('body').data('type');
        if(hrefType == 1){
            userSelect.eq(0).html('银行理财通<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.bank').addClass('selected').siblings().removeClass('selected');
        }else if(hrefType == 2){
            userSelect.eq(0).html('信托理财通<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.xintuo').addClass('selected').siblings().removeClass('selected');
        }else if(hrefType == 3){
            userSelect.eq(0).html('固收理财<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.gushou').addClass('selected').siblings().removeClass('selected');
        }
        var textLength = 0;
        setTitle();
        function setTitle() {
            $('.buy_list').each(function (i,item) {
                var titleWarp = $(item).find('.buy_title');
                var icon = $(item).find('.buy_state');
                if(icon.length > 0){
                    titleWarp.find('p').css('max-width','80%');
                }
            });
        }
        //选择状态初始化
        function reset() {
            userSelect.removeClass('selected').data('state','down');
            selectParent.hide();
            $('.arrow_pic').attr('src', 'images/user/down_arrow.png');
        }
        //样式切换
        function styleChange(ele,state,index) {
            ele.siblings().removeClass('selected');
            ele.siblings().find('img').attr('src','images/user/down_arrow.png');
            ele.siblings().data('state','down');
            if(state=='down'){
                ele.find('img').attr('src','images/user/red_arrow.png');
                ele.data('state','red');
                bBtn = false;
            }else{
                ele.find('img').attr('src','images/user/down_arrow.png');
                ele.data('state','down');
                bBtn = true;
            }
            selectParent.eq(index).toggle();
        }
        //避免遮罩覆盖
        $('.left_warp').on('click',function () {
            reset();
        });
        //选项切换
        $('.userRegular_select').on('click',function () {
            var ele = $(this);
            var index = ele.index();
            var state = ele.data('state');
            ele.toggleClass('selected');
            if(index==0){
                selectParent.eq(1).hide();
                styleChange(ele,state,index);
            }else{
                selectParent.eq(0).hide();
                styleChange(ele,state,index);
            }
        });
        //子选项选择
        $('.userRegular_state').on('click','li',function () {
            var index = $(this).index();
            $(this).addClass('selected').siblings().removeClass('selected');
            reset();
            bBtn = true;
            var eleText = $(this).html();
            var num = $(this).siblings().length;
            if(num == 3){
                if(eleText=="全部"){
                    userSelect.eq(0).html('产品类型<img src="images/user/down_arrow.png" class="arrow_pic">');
                }else{
                    userSelect.eq(0).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
                }
            }else{
                if(eleText=="全部"){
                    userSelect.eq(1).html('产品状态<img src="images/user/down_arrow.png" class="arrow_pic">');
                }else{
                    userSelect.eq(1).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
                }
            }
        })
        //列表加载
        //下拉加载
        function  load() {
            GLOBAL.dyJs.pageLoad({
                'url': 'my/regular/list?type=' + hrefType + '&status='+status+'&pn=',
                'list': listEle,
                'callback':function (data) {
                    if(!data){
                        noMore.show();
                        $(window).off("scroll");
                    }
                    setTitle();
                }
            });
        }
        selectParent.children('ul:first-child').each(function (i,item_i) {
            $(item_i).children().each(function (j, item_j) {
                $(item_j).on('click', function () {
                    noMore.add(noData).hide();
                    listEle.children().remove();
                    if(i==0){
                        type =$(this).data('type');
                    }else{
                        status = $(this).data('status');
                    }
                    $('.loadingshow').show();
                    GLOBAL.dyJs.ajax({
                        'url': 'my/regular/list?type=' + type + '&status='+status+'&pn=',
                        loadingType: 1,
                        callback: function (data) {
                            $('.loadingshow').hide();
                            if(data){
                                noMore.add(noData).hide();
                                listEle.append(data).show();
                                setTitle();
                                if(listEle.children().length<20 && listEle.children().length>0){
                                    noMore.show();
                                }
                            }else if(type == 0 && status == 0){
                                noData.show().find('p').html('暂无记录');
                            }else{
                                listEle.add(noMore).hide();
                                noData.show().find('p').html('暂无符合条件的记录');
                            }
                            $(window).off("scroll");
                            if(listEle.children().length>=20){
                                load();
                            }
                        }
                    });
                });
            });
        });
        if (regularIndex == 0) {
            listEle.add(noMore).hide();
            noData.show();
        }
        if(listEle.children().length>=20){
            load();
        }
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.regular=regular;

    /**
     * 风险评估
     * mingchao_zh
     * */
    function risk(remote,riskScore,riskTime,activityType) {
        var userScore = 0;
        var oParent = $('#riskEvaluation');
        var scoreList = {};
        var iBtn = {};
        var iScore = 0;
        var oResultDateWarp = $(oParent).find('.resultDate');
        var oResultTextWarp = $(oParent).find('.resultText');
        if(remote == 'true' ){
            window.dyJsApi.setPgDialogShow(0);
        }
        /* riskEvaluationInit(); */
        function riskEvaluationInit() {
            $(oParent).find('.fore1').show();
        }
        /* riskEvaluationResult('平衡型','2016-09-20'); */
        function riskEvaluationResult(userType, time) {
            if(remote == 'true'){
                window.dyJsApi.setPgDialogShow(1);
            }
            $(oResultDateWarp).html('评估时间：' + time);
            $(oResultTextWarp).html(userType);
            $(oParent).find('.successPage').show();
            backIndex();
        }
        answer();
        function answer() {
            var imgSrc = 'images/user/riskCheckIcon.jpg';
            var imgSrc2 = 'images/user/riskCheckIcon2.jpg';
            var len = $(oParent).find('.item').not('.successPage').length;
            $(oParent).find('.item').each(function (i, item) {
                $(item).find('.answerWarp').children().each(function (j, value) {
                    $(value).on({
                        'click': function () {
                            iBtn[i] = true;
                            $(item).find('.answerWarp img').attr('src', imgSrc2);
                            $(this).find('img').attr('src', imgSrc);
                            iScore = $(this).data('score') * 1;
                            scoreList[i] = iScore;
                            if (i != len - 1) {
                                setTimeout(function () {
                                    $(item).hide();
                                    $(oParent).find('.item').eq(i + 1).show();
                                }, 100);
                            } else {
                                $(oParent).find('.tijiaoBtnWarp').css({'background': '#ff453b','background':'linear-gradient(#F1774E, #FF3C3B)','box-shadow':'0 2px .1rem rgba(187,1,1,.6)'});
                            }
                        }
                    })
                });
                $(item).find('.prevBtnWarp .btn').on({
                    'click': function () {
                        userScore = 0;
                        iBtn[len - 1] = false;
                        $(oParent).find('.tijiaoBtnWarp').removeAttr('style');
                        $(item).hide();
                        $(item).find('.answerWarp img').attr('src', imgSrc2);
                        $(oParent).find('.item').eq(i - 1).show();
                    }
                });
            });

            $(oParent).find('.tijiaoBtnWarp').on({
                'click': function () {
                    if(remote == 'true'){
                        window.dyJsApi.setPgDialogShow(1);
                    }
                    userScore = 0;
                    if (iBtn[len - 1]) {
                        for (i in scoreList) {
                            userScore += scoreList[i];
                        }
                        result(function () {
                            GLOBAL.dyJs.loading();
                            $.post('my/risk/evaluation/save', {userScore: userScore,sourceType:activityType}, function (result) {
                                GLOBAL.dyJs.closeLoading();
                                if (result.success) {
                                    var isGetMc = result.data.isGetMc;
                                    var desc1 = result.data.desc1;
                                    var desc2 = result.data.desc2;
                                    if(isGetMc==1){
                                        $('.look_warp').show();
                                        $('.look_left').html(desc2);
                                    }

                                    $(oParent).find('.item').eq(len - 1).hide();
                                    $(oParent).find('.successPage').show();
                                    if(result.data.sourceType == 1){
                                        var picH = $('#window_cash').height();
                                        var picW = $('#window_cash').width();
                                        var vh = $(window).height();
                                        var vw = $(window).width();
                                        $('#blackwrap').show();
                                        $('#window_cash').css({'top': (vh - picH) / 2, 'left': (vw - picW) / 2}).show();
                                    }
                                } else {
                                    if (typeof result.data.url != 'undefined') {
                                        window.location.href = result.data.url;
                                    } else {
                                        GLOBAL.dyJs.toast(result.msg);
                                    }
                                }
                            });
                        });
                    }
                }
            });
        }
        /* <=20保守型,21-45稳健型,46-70平衡型,71-85成长型,86-100进取型 */
        function getUserRisk(userScore) {
            if (userScore <= 20) {
                return "保守型";
            } else if (20 < userScore && userScore <= 45) {
                return "稳健型";
            } else if (45 < userScore && userScore <= 70) {
                return '平衡型';
            } else if (70 < userScore && userScore <= 85) {
                return '成长型';
            } else if (85 < userScore) {
                return '进取型';
            }
            return '';
        }
        function result(callBack) {
            var myDate = new Date();
            var nowDay = myDate.toLocaleDateString();
            var iNow = nowDay.replace(/\\/g, '-');
            var userRisk = getUserRisk(userScore);
            $(oResultTextWarp).html(userRisk);
            $(oResultDateWarp).html('评估时间：' + iNow);
            callBack && callBack();
            backIndex();
        }
        function backIndex() {
            var pid = $('.pid').text();
            var cid = $('.cid').text();
            var from = $('.from').text();
            if(cid == 0){
                cid = "";
            }
            if(pid==0){
                $('.gotouzi').hide();
            }
            $(oParent).find('.overBtnWarp').on({
                'click': function () {
                    if (remote == 'true') {
                        dyJsApi.closeWeb();
                    } else {
                        if(pid > 0){
                            if(from == 0){
                                window.location.href= 'my/product/buy/' + pid + cid;
                            }else{
                                window.location.href= 'my/intellect/buy/' + pid + cid;
                            }
                        }else{
                            window.location.href = '/my/index';
                        }

                    }
                }
            });
        }
        $(function () {
            if (riskScore != '' && riskScore >=0) {
                var userRisk = getUserRisk(riskScore);
                riskEvaluationResult(userRisk, riskTime);
            } else {
                riskEvaluationInit();
            }
        });
    }
    exports.risk = risk;

    /**
     * 银行卡页面判断是否绑卡
     * mingchao_zh
     * */
    function bind() {
        GLOBAL.dyJs.ajax({
            url:'my/bank',
            callback:function (result) {
                if(result.data.bind == 0){
                    $('.unbind').show();
                }else{
                    $('.bind').show();
                }
            }
        })
    }
    exports.bind = bind;

    /**
     * 点击非选择区域遮罩隐藏
     * btn:点击按钮
     * fadeEle:消失的元素节点
     * mingchao_zh
     * */
    function fade(btn,fadeEle) {
        btn.on('click',function () {
            fadeEle.hide();
        })
    }
    exports.fade = fade;

    /**
     * 用户智能理财记录信息-信息的加载和信息的类型切换
     * mingchao_zh
     * */
    function intellectList(regularIndex,length) {
        var userSelect = $('.userRegular_select');
        var regularType = $('.userRegular_type');
        var listEle = $('.userIntellect_list');
        var noMore = $('.no_more');
        var noData = $('.none_content');
        var type = 0;
        var status= 0;
        var order =0;
        var bBtn = true;
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        var hrefType = $('body').data('type');
        if(hrefType == 1){
            userSelect.eq(0).html('稳盈宝<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.wyb').addClass('selected').siblings().removeClass('selected');
        }else if(hrefType == 4){
            userSelect.eq(0).html('添盈宝<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.tyb').addClass('selected').siblings().removeClass('selected');
        }
        var textLength = 0;
        setTitle();
        function setTitle() {
            $('.buy_list').each(function (i,item) {
                var titleWarp = $(item).find('.buy_title');
                var icon = $(item).find('.buy_state');
                if(icon.length > 0){
                    titleWarp.find('p').css('max-width','80%');
                }
            });
        }
        //选择状态初始化
        function reset() {
            regularType.hide();
            $('.arrow_pic').attr('src', 'images/user/down_arrow.png');
            $('.sort').data('state','down').removeClass('selected');
            userSelect.removeClass('selected').data('state','down');
        }
        //空白隐藏选项
        $('.mask').on('click',function () {
            reset();
            bBtn = true;
        })
        //样式切换
        function styleChange(ele,state,index) {
            $('.sort').data('state','down').removeClass('selected');
            regularType.eq(2).hide();
            ele.siblings().removeClass('selected');
            ele.siblings().find('.arrow_pic').attr('src','images/user/down_arrow.png');
            ele.siblings().data('state','down');
            if(state=='down'){
                ele.find('img').attr('src','images/user/red_arrow.png');
                ele.data('state','red');
                bBtn = false;
            }else{
                ele.find('img').attr('src','images/user/down_arrow.png');
                ele.data('state','down');
                bBtn = true;
            }
            regularType.eq(index).toggle();
        }
        //    默认排序样式切换
        $('.sort').on('click',function () {
            $(this).toggleClass('selected');
            userSelect.removeClass('selected').data('state','down');
            userSelect.find('img').attr('src','images/user/down_arrow.png');
            regularType.eq(0).hide();
            regularType.eq(1).hide();
            regularType.eq(2).toggle();
            if($(this).data('state')=='down'){
                bBtn=false;
                $(this).data('state','red');
            }else{
                bBtn = true;
                $(this).data('state','down');
            }
        })
        //避免遮罩覆盖
        $('.left_warp').on('click',function () {
            reset();
        });
        //选项切换
        userSelect.on('click',function () {
            var ele = $(this);
            var index = ele.index();
            var state = ele.data('state');
            ele.toggleClass('selected');
            if(index==0){
                regularType.eq(1).hide();
                styleChange(ele,state,index);
            }else{
                regularType.eq(0).hide();
                styleChange(ele,state,index);
            }
        });
        //子选项选择
        $('.userRegular_state').on('click','li',function () {
            var index = $(this).index();
            $(this).addClass('selected').siblings().removeClass('selected');
            reset();
            bBtn = true;
            var eleText = $(this).data('name');
            var order = $(this).data('order');
            var num = $(this).data('select');
            if(num == 1){
                userSelect.eq(0).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
            }else if(num == 2){
                userSelect.eq(1).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
            }else{
                if(order==1 || order==3 || order == 5){
                    $('.sort').html(eleText + '<img src="images/user/red_paixu.png" class="sort_pic">');
                }else if(order==2 || order==4 || order == 6){
                    $('.sort').html(eleText + '<img src="images/user/red_up.png" class="sort_pic">');
                }else{
                    $('.sort').html(eleText + '<img src="images/user/paixu_icon.png" class="sort_pic">');
                }
            }
        })
        //列表加载
        regularType.children('ul:first-child').each(function (i,item_i) {
            $(item_i).children().each(function (j, item_j) {
                $(item_j).on('click', function () {
                    listEle.children().remove();
                    noMore.add(noData).hide();
                    if(i==0){
                        type =$(this).data('type');
                    }else if(i==1){
                        status = $(this).data('status');
                    }else if(i==2){
                        order = $(this).data('order');
                    }
                    $('.loadingshow').show();
                    GLOBAL.dyJs.ajax({
                        'url': 'my/intellect/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                        loadingType: 1,
                        callback: function (data) {
                            $('.loadingshow').hide();
                            if(data){
                                noMore.add(noData).hide();
                                listEle.append(data).show();
                                setTitle();
                                var dataLength = $('.userIntellect_list li').length;
                                if(dataLength<20 && dataLength>0){
                                    $('.no_more').show();
                                }else{
                                    $(window).off("scroll");
                                    GLOBAL.dyJs.pageLoad({
                                        'url': 'my/intellect/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                                        'list': listEle,
                                        'callback':function (data) {
                                            if(!data){
                                                noMore.show();
                                                $(window).off("scroll");
                                            }
                                            setTitle();
                                        }
                                    });
                                }
                            }else if(type == 0 && status == 0 && order ==0){
                                noData.show().find('p').html('暂无记录');
                            }else{
                                listEle.add(noMore).hide();
                                noData.show().find('p').html('暂无符合条件的记录');
                            }
                        }
                    });
                });
            });
        });
        if (regularIndex == 0) {
            listEle.add(noMore).hide();
            noData.show();
            $(window).off("scroll");
        }
        if(length >=20){
            GLOBAL.dyJs.pageLoad({
                'url': 'my/intellect/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                'list': listEle,
                'callback':function (data) {
                    if(!data){
                        noMore .show();
                        $(window).off("scroll");
                    }
                    setTitle();
                }
            });
        }
        //取消赎回弹窗
        $('.userIntellect_list').on('click','.quxiaoshuhui',function () {
            var orderid= $(this).data('id');
            cancleRedeem(orderid);
            return false;
        });
        //预约赎回判断用户是否绑卡
        $('.shuhui').on('click',function () {
            var mobile = $(this).data('mobile');
            var orderid = $(this).data('id');
            var ptype = $(this).data('type');
            redeemJudge(orderid,ptype,mobile);
        });
        /* 兼容Passive */
        function tryPassive() {
            var supportPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportPassive = true;
                    }
                });
                window.addEventListener("test", null, opts);
            } catch (e) {
            }
            return supportPassive ? {passive: false} : false;
        }
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.intellectList=intellectList;

    /**
     * 用户灵活理财记录信息-信息的加载和信息的类型切换
     * mingchao_zh
     * */
    function flexible(regularIndex,length) {
        var userSelect = $('.userRegular_select');
        var selectParent = $('.userRegular_type');
        var noMore = $('.no_more');
        var noData = $('.none_content');
        var listEle = $('.userRegular_list');
        var type = 0;
        var status= 0;
        var order =0;
        var bBtn = true;
        $('#pm_blackMask').on('click',function () {
            bBtn = true;
        });
        var hrefType = $('body').data('type');
        if(hrefType == 3){
            userSelect.eq(0).html('周周盈<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.zzy').addClass('selected').siblings().removeClass('selected');
        }else if(hrefType == 2){
            userSelect.eq(0).html('盈活宝<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.yhb').addClass('selected').siblings().removeClass('selected');
        }else if(hrefType==5){
            userSelect.eq(0).html('半月盈<img src="images/user/down_arrow.png" class="arrow_pic">');
            $('.byy').addClass('selected').siblings().removeClass('selected');
        }
        var textLength = 0;
        setTitle();
        function setTitle() {
            $('.buy_list').each(function (i,item) {
                var titleWarp = $(item).find('.buy_title');
                var icon = $(item).find('.buy_state');
                if(icon.length > 0){
                    titleWarp.find('p').css('max-width','80%');
                }
            });
        }
        //选择状态初始化
        function reset() {
            selectParent.hide();
            userSelect.removeClass('selected').data('state','down');
            $('.arrow_pic').attr('src', 'images/user/down_arrow.png');
            $('.sort').data('state','down').removeClass('selected');
        }
        //空白隐藏选项
        $('.mask').on('click',function () {
            reset();
            bBtn = true;
        })
        //样式切换
        function styleChange(ele,state,index) {
            $('.sort').data('state','down').removeClass('selected');
            selectParent.eq(2).hide();
            ele.siblings().removeClass('selected');
            ele.siblings().find('.arrow_pic').attr('src','images/user/down_arrow.png');
            ele.siblings().data('state','down');
            if(state=='down'){
                ele.find('img').attr('src','images/user/red_arrow.png');
                ele.data('state','red');
                bBtn = false;
            }else{
                ele.find('img').attr('src','images/user/down_arrow.png');
                ele.data('state','down');
                bBtn = true;
            }
            selectParent.eq(index).toggle();
        }
        //    点击默认排序
        $('.sort').on('click',function () {
            $(this).toggleClass('selected');
            userSelect.removeClass('selected').data('state','down');
            selectParent.eq(0).hide();
            selectParent.eq(1).hide();
            selectParent.eq(2).toggle();
            userSelect.find('img').attr('src','images/user/down_arrow.png');
            if($(this).data('state')=='down'){
                bBtn=false;
                $(this).data('state','red');
            }else{
                bBtn = true;
                $(this).data('state','down');
            }
        })
        //避免遮罩覆盖
        $('.left_warp').on('click',function () {
            reset();
        });
        //选项切换
        $('.userRegular_select').on('click',function () {
            var ele = $(this);
            var index = ele.index();
            var state = ele.data('state');
            ele.toggleClass('selected');
            if(index==0){
                selectParent.eq(1).hide();
                styleChange(ele,state,index);
            }else{
                selectParent.eq(0).hide();
                styleChange(ele,state,index);
            }
        });
        //子选项选择
        $('.userRegular_state').on('click','li',function () {
            var index = $(this).index();
            $(this).addClass('selected').siblings().removeClass('selected');
            reset();
            bBtn = true;
            var eleText = $(this).data('name');
            var order = $(this).data('order');
            var num = $(this).data('select');
            if(num == 1){
                userSelect.eq(0).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
            }else if(num == 2){
                userSelect.eq(1).html(eleText + '<img src="images/user/down_arrow.png" class="arrow_pic">');
            }else{
                if(order==1 || order==3 || order == 5){
                    $('.sort').html(eleText + '<img src="images/user/red_paixu.png" class="sort_pic">');
                }else if(order==2 || order==4 || order == 6){
                    $('.sort').html(eleText + '<img src="images/user/red_up.png" class="sort_pic">');
                }else{
                    $('.sort').html(eleText + '<img src="images/user/paixu_icon.png" class="sort_pic">');
                }
            }
        })
        //列表加载
        selectParent.children('ul:first-child').each(function (i,item_i) {
            $(item_i).children().each(function (j, item_j) {
                $(item_j).on('click', function () {
                    listEle.children().remove();
                    noMore.add(noData).hide();
                    if(i==0){
                        type =$(this).data('type');
                    }else if(i==1){
                        status = $(this).data('status');
                    }else if(i==2){
                        order = $(this).data('order');
                    }
                    noMore.hide();
                    $('.loadingshow').show();
                    GLOBAL.dyJs.ajax({
                        'url': 'my/intellect/flexible/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                        loadingType: 1,
                        callback: function (data) {
                            $('.loadingshow').hide();
                            noMore.hide();
                            if(data){
                                noData.add(noMore).hide();
                                listEle.append(data).show();
                                setTitle();
                                var dataLength = $('.userRegular_list li').length;
                                if(dataLength<20 && dataLength>0){
                                    noMore.show();
                                }else{
                                    $(window).off("scroll");
                                    GLOBAL.dyJs.pageLoad({
                                        'url': 'my/intellect/flexible/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                                        'list': listEle,
                                        'callback':function (data) {
                                            if(!data){
                                                noMore.show();
                                                $(window).off("scroll");
                                            }
                                            setTitle();
                                        }
                                    });
                                }
                            }else if(type == 0 && status == 0 && order ==0){
                                noData.show().find('p').html('暂无记录');
                            }else{
                                listEle.add(noMore).hide();
                                noData.show().find('p').html('暂无符合条件的记录');
                            }
                        }
                    });
                });
            });
        });
        if (regularIndex == 0) {
            listEle.add(noMore).hide();
            noData.show();
            $(window).off("scroll");
        }
        if(length >=20){
            GLOBAL.dyJs.pageLoad({
                'url': 'my/intellect/flexible/order/list?ptype=' + type + '&status='+status+'&order='+order+'&pn=',
                'list': listEle,
                'callback':function (data) {
                    if(!data){
                        noMore.show();
                        $(window).off("scroll");
                    }
                    setTitle();
                }
            });
        }
        //取消赎回
        $('.userRegular_list').on('click','.quxiaoshuhui',function () {
            var orderid= $(this).data('id');
            cancleRedeem(orderid);
            return false;
        });
        //预约赎回判断用户是否绑卡
        $('.shuhui').on('click',function () {
            var orderid = $(this).data('id');
            var ptype = $(this).data('type');
            redeemJudge(orderid,ptype);
        });
        /* 兼容Passive */
        function tryPassive() {
            var supportPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportPassive = true;
                    }
                });
                window.addEventListener("test", null, opts);
            } catch (e) {
            }
            return supportPassive ? {passive: false} : false;
        }
        document.addEventListener('touchmove', function (e) {if(!bBtn)e.preventDefault();}, tryPassive());
    }
    exports.flexible=flexible;

    /**
     * 周期列表数据加载
     * mingchao_zh
     * */
    function  cycle() {
        var listEle = $('.list_content');
        var listLenght = listEle.children().lenght;
        if(listLenght >=20){
            GLOBAL.dyJs.pageLoad({
                'url': 'my/intellect/order/period/list?pn=',
                'list': listEle,
                'callback':function (data) {
                    if(!data){
                        $(window).off("scroll");
                    }
                }
            });
        }
    }
    exports.cycle=cycle;

    /**
     * 智能理财订单详情页取消赎回功能
     * mingchao_zh
     * */
    function  intellectRedeem() {
        //取消赎回
        $('.lose_btn').on('click',function () {
            var orderid= $(this).data('id');
            cancleRedeem(orderid);
            return false;
        });
        //预约赎回判断是否绑卡
        $('.yuyue_btn').on('click',function () {
            var mobile = $(this).data('mobile');
            var orderid = $(this).data('id');
            var ptype = $(this).data('type');
            redeemJudge(orderid,ptype,mobile);
        })
    }
    exports.intellectRedeem=intellectRedeem;

    /**
     * 取消赎回功能
     * mingchao_zh
     * */
    function cancleRedeem(orderid) {
        GLOBAL.dyJs.ajax({
            url:'my/intellect/appointcall/cancel',
            data:{
                'orderId':orderid,
                'isCheck': 0
            },
            callback:function (result) {
                var msg = result.dialogModel.content;
                var btnLeftTxt = result.dialogModel.btnLeftTxt;
                var btnRightTxt = result.dialogModel.btnRightTxt;
                GLOBAL.dyJs.alert({
                    content:msg,
                    btn1:{
                        name:btnRightTxt,
                        callback:function () {
                            GLOBAL.dyJs.ajax({
                                url:'my/intellect/appointcall/cancel',
                                loadingType : 1,
                                data:{
                                    'orderId':orderid,
                                    'isCheck':1
                                },
                                callback:function () {
                                    GLOBAL.dyJs.closeAlert();
                                    GLOBAL.dyJs.toast('您已成功取消赎回');
                                    location.reload();
                                }
                            })
                        }
                    },
                    btn2:{
                        name:btnLeftTxt
                    }
                })
            }
        })
        // GLOBAL.dyJs.alert({
        //     content:'您确定要取消预约赎回吗?',
        //     btn1:{
        //         name:'确定',
        //         callback:function () {
        //             GLOBAL.dyJs.ajax({
        //                 url:'my/intellect/appointcall/cancel',
        //                 data:{
        //                     'orderId':orderid
        //                 },
        //                 callback:function () {
        //                     GLOBAL.dyJs.toast('您已成功取消赎回');
        //                     GLOBAL.dyJs.closeAlert();
        //                     location.reload();
        //                 }
        //             })
        //         }
        //     },
        //     btn2:{
        //         name:'取消'
        //     }
        // });
    }

    /**
     * 预约赎回判断绑卡
     * mingchao_zh
     * */
    function redeemJudge(orderid,ptype,mobile) {
        GLOBAL.dyJs.ajax({
            url:'my/bank',
            callback:function (result) {
                var isReturn = false;
                if(result.data.bind == 1){
                    checkMobile(mobile, function(result){
                        if(result.data.isFastUser == 0){
                            isReturn = true;
                            window.location.href=GLOBAL.dyAttr.baseUrl + 'index/setpwd?returnUrl='+ GLOBAL.dyAttr.baseUrl + 'my/intellect/order/appoint/call?orderId='+orderid + '&globalProductType=' + ptype;
                            return;
                        }
                    })
                    if(isReturn) return;
                    window.location.href = 'my/intellect/order/appoint/call?orderId='+orderid + '&globalProductType=' + ptype;
                }else{
                    GLOBAL.dyJs.alert({
                        content:'为了保障您的资金安全，请绑定银行卡确认实名信息',
                        btn1:{
                            name:'立即绑定',
                            callback:function () {
                                window.location.href = "my/bind/card";
                            }
                        },
                        btn2:{
                            name:'取消'
                        }
                    });
                }
            }
        })
    }

    /**
     * 用户设置个人资料
     * mingchao_zh
     * */
    function  setInfo(id,provinceName,cityName,districtName,AREADATA) {
        var blackBox = $('.blackBox');
        var sexBox = $('.sexBox');
        var sex = $('.sex');
        var setnameBox = $('.setname');
        var dh = $(document).height();
        var vh = $(window).height();
        var vw = $(window).width();
        var st = $(window).scrollTop();
        var sexHei = sexBox.height();
        var sexWid = sexBox.width();
        var nameHei = setnameBox.height();
        var nameWid = setnameBox.width();
        //设置性别
        sex.on('click',function () {
            sexBox.css({'top':(vh - sexHei)/2 + st, 'left':(vw - sexWid)/2});
            blackBox.add(sexBox).show();
        });
        blackBox.on('click',function () {
            blackBox.add(sexBox).hide();
        })
        $('.sexBox li').on('click',function () {
            blackBox.add(sexBox).hide();
            var sexText = $(this).text();
            var sexNum ;
            sexNum = (sexText == '女') ? 0 : 1;
			$('.loadingshow').show();
			settingInfo({
				url : 'my/setting/update',
				data : {
					sex : sexNum
				},
                msg : '保存成功!'
			});
			$('.sexName').text(sexText);
        });
        //设置昵称
        $('.nick').on('click',function () {
            var nameVal = $('.nickname').text();
            $('.nickInput').val(nameVal);
            setnameBox.css({'top':(vh - nameHei)/2 + st, 'left':(vw - nameWid)/2})
            blackBox.add(setnameBox).show();
        });
        $('.cancleBtn').add(blackBox).on('click',function () {
            blackBox.add(setnameBox).hide();
        });
        $('.sureBtn').on('click',function(){
            var nick = $('.nickInput').val();
            if(nick == ""){
                GLOBAL.dyJs.toast('昵称不能为空');
                return;
            }
            if(nick.toString().length > 8 ){
                GLOBAL.dyJs.toast('昵称不能超过8个字符');
                return;
            }
			$('.loadingshow').show();
			settingInfo({
				url : 'my/setting/update',
				data : {
					nick : nick
				},
                msg : '保存成功'
			});
			$('.nickname').text(nick);
			$('.setname').add('.blackBox').hide();
        });
        //设置头像

        //去设置收货地址
        $('.address').on('click',function () {
            window.location.href = '/my/setting/address/list'
        });
        //设置默认地址
        $('.default_address').on('click',function(){
			var addressId = $(this).data('id');
			$('.loadingshow').show();
			settingInfo({
				url : 'my/setting/address/'+addressId+'/default',
				msg : '设置成功!'
			});
			window.location.href = window.location.href;
        });
        //删除地址
		$('.delete_address').on('click',function(){
			var addressId = $(this).data('id');
            GLOBAL.dyJs.alert({
                content:'确认删除改地址吗?',
                btn1:{
                    name:'确定',
                    callback:function () {
                        $('.loadingshow').show();
                        settingInfo({
                            url : 'my/setting/address/'+addressId+'/delete',
                            msg : '删除成功!'
                        });
                        window.location.href = window.location.href;
                    }
                },
                btn2:{
                    name:'取消'
                }
            });
		});
        //添加地址
        var type = $('#userAddressPage').data('type');
        var pid = $('#userAddressPage').data('pid');
		$('.addAdress').on('click',function () {
		    var addressNum = $('.address_wrap').length;
            if(addressNum == 5){
                GLOBAL.dyJs.toast('最多保存5个地址');
            }else{
                window.location.href="/my/setting/address/-1/detail?type="+type + "&&pid="+pid;
            }
		})
		$('.user_Adress_info_default').on('click',function () {
            $('.black_mark').show();
            $('.select_city').css('opacity',1);
		})
        $('.sel_cancle').on('click',function () {
            $('.black_mark').hide();
            $('.select_city').css('opacity',0);
        })
        $('.sel_sure').on('click',function () {
            var sData = $('.p_chose .selected').data('value');
            var cData = $('.c_chose .selected').data('value');
            var qData = $('.d_chose .selected').data('value');
            if(qData == null){
                $('.address_end').text(sData+"  "+cData);
            }else{
                $('.address_end').text(sData+"  "+cData+"  "+qData);
            }
            $('.black_mark').hide();
            $('.select_city').css('opacity',0);
        });
		$('.edit_address').on('click',function () {
			var addressId = $(this).data('id');
			window.location.href='my/setting/address/'+addressId+'/detail?type=' + type + "&&pid="+pid;
		});
		$('.setDefault').on('click',function () {
			var adid= $(this).attr('data-id');
			var defaultId = (adid == 0)? id : 0 ;
			$(this).attr('data-id',defaultId);
			$(this).toggleClass('isDefault');
		});

		//设置用户信息ajax方法
		function settingInfo(json) {
        	var data = {};
			var url = json.url;
			var msg = "";
			if(json.msg)msg = json.msg;
			if(json.data)data = json.data;
			GLOBAL.dyJs.ajax({
				url : url,
				async:false,
				data :data,
				loadingType : 1,
				callback : function (result) {
					$('.loadingshow').hide();
					if(result.success){
						if(msg != ""){
							GLOBAL.dyJs.toast(msg);
						}
					}else{
						GLOBAL.dyJs.toast(result.msg);
					}
				}
			})
		}


        //省市区三级联动
        $(function () {
            var province = $('.p_chose');
            var city = $('.c_chose');
            var district = $('.d_chose');
            province.children().remove();
            var data = AREADATA;
            var p_positionStr="";
            var len=data.length;
            for (var i=0;i<len;i++){
                p_positionStr+="<li data-value="+data[i].name+">"+data[i].name+"</li>";
            }
            province.append(p_positionStr);
            city.children().remove();
            var provinceVal = province.find('li:nth-child(1)').text();
            var c_positionStr="";
            var len=data.length;
            for (var i=0;i<len;i++){
                if(provinceVal == data[i].name){
                    var cLen = data[i].c.length;
                    for(var j = 0 ; j < cLen ; j++){
                        c_positionStr+="<li data-value="+data[i].c[j].name+">"+data[i].c[j].name+"</li>";
                    }
                }
            }
            city.append(c_positionStr);
            district.children().remove();
            var citytVal = city.find('li:nth-child(1)').text();
            var d_positionStr="";
            var len=data.length;
            for (var i=0;i<len;i++){
                if(provinceVal == data[i].name){
                    var cLen = data[i].c.length;
                    for(var j = 0 ; j < cLen ; j++){
                        if(citytVal == data[i].c[j].name){
                            var disLen = data[i].c[j].a.length;
                            for(var k = 0;k<disLen;k++){
                                d_positionStr+="<li data-value="+data[i].c[j].a[k].name+">"+data[i].c[j].a[k].name+"</li>";
                            }
                        }
                    }
                }
            }
            district.append(d_positionStr);
            //添加地址初始化
            province.find('li:nth-child(1)').addClass('selected').siblings().removeClass('selected');
            city.find('li:nth-child(1)').addClass('selected').siblings().removeClass('selected');
            district.find('li:nth-child(1)').addClass('selected').siblings().removeClass('selected');
            //点击切换地址
            $(province).on('click','li',function(){
                city.children().remove();
                $(this).addClass('selected').siblings().removeClass('selected');
                var provinceVal = $(this).data('value');
                var positionStr="";
                var len=data.length;
                for (var i=0;i<len;i++){
                    if(provinceVal == data[i].name){
                        var cLen = data[i].c.length;
                        for(var j = 0 ; j < cLen ; j++){
                            positionStr+="<li data-value="+data[i].c[j].name+">"+data[i].c[j].name+"</li>";
                        }
                    }
                }
                city.append(positionStr);
                $(city).find('li:nth-child(1)').trigger('click');
            });
            $(city).on('click','li',function () {
                district.children().remove();
                $(this).addClass('selected').siblings().removeClass('selected');
                var citytVal = $(this).data('value');
                var provinceVal = $('.p_chose .selected').data('value');
                var positionStr="";
                var len=data.length;
                for (var i=0;i<len;i++){
                    if(provinceVal == data[i].name){
                        var cLen = data[i].c.length;
                        for(var j = 0 ; j < cLen ; j++){
                            if(citytVal == data[i].c[j].name){
                                var disLen = data[i].c[j].a.length;
                                for(var k = 0;k<disLen;k++){
                                    positionStr+="<li data-value="+data[i].c[j].a[k].name+">"+data[i].c[j].a[k].name+"</li>";
                                }
                            }
                        }
                    }
                }
                district.append(positionStr);
                $('.d_chose li:nth-child(1)').addClass('selected').siblings().removeClass('selected');
            });
            district.on('click','li',function () {
                $(this).addClass('selected').siblings().removeClass('selected');
            })
        });
        //编辑地址初始化
        var p_len = $('.p_chose li').length;
        var liH = $('.p_chose li').height();
        for(var i = 0;i<p_len;i++){
            var p_value = $('.p_chose li').eq(i).data('value');
            if(p_value == provinceName){
                $('.p_chose li').eq(i).trigger('click');
                $('.p_chose').scrollTop(liH*(i-3));
            }
        }
        var c_len = $('.c_chose li').length;
        for(var j = 0;j<c_len;j++){
            var c_value = $('.c_chose li').eq(j).data('value');
            if(c_value == cityName){
                $('.c_chose li').eq(j).trigger('click');
                $('.c_chose').scrollTop(liH*(j-3));
            }
        }
        var d_len = $('.d_chose li').length;
        for(var k = 0;k<d_len;k++){
            var d_value = $('.d_chose li').eq(k).data('value');
            if(d_value == districtName){
                $('.d_chose li').eq(k).trigger('click');
                $('.d_chose').scrollTop(liH*(k-3));
            }
        }
    }
    exports.setInfo=setInfo;

    /**
     * 新订单列表页 - 智能/定期
     * mingchao_zh
     * */
    function userProduct(productNum,isNext) {
        var listEle = $('.user_product_list');
        var productIng = $('.own_money');
        var productEnd = $('.back_money');
        var proType = $('#userProductListPage').data('type');
        var noContent = $('.no_content_wrap');
        var noMore = $('.no_more');
        var status = 1;
        if(productNum === 0){
            noContent.show();
        }
        if(isNext == false && productNum != 0){
            noMore.show()
        }
        $(productIng).on('click',function () {
            noMore.add(noContent).hide();
            $(this).addClass('selected');
            $(productEnd).removeClass('selected');
            status = 1;
            loadList(proType,status);
        });
        $(productEnd).on('click',function () {
            noMore.add(noContent).hide();
            $(this).addClass('selected');
            $(productIng).removeClass('selected');
            status = 2;
            loadList(proType,status);
        });
        function loadList(proType,status) {
            $(window).scrollTop(0);
            listEle.children().remove();
            $('.none_content').hide();
            $('.loadingshow').show();
            GLOBAL.dyJs.ajax({
                url: "my/product/order/list?pType="+proType+"&status="+status+"&pn=1",
                loadingType: 1,
                async : false,
                callback: function (data) {
                    $('.loadingshow').hide();
                    listEle.children().remove();
                    if(data){
                        listEle.append(data).show();
                        var productNum = $('.buy_title').data('num');
                        if(productNum > 0 && productNum <= 20 ){
                            noMore.show();
                        }else{
                            $(window).off("scroll");
                            pageLoad(proType,status);
                        }
                    }else{
                        noContent.show();
                    }
                }
            });
        };
        if(isNext == true && productNum != 0){
            pageLoad(proType,status);
        }
        function pageLoad(proType,status) {
            GLOBAL.dyJs.pageLoad({
                url: "my/product/order/list?pType="+proType+"&status="+status+"&pn=",
                list: listEle,
                callback:function (data) {
                    if(!data){
                        $(window).off("scroll");
                    }
                }
            });
        };
        //取消赎回
        $('.user_product_list').on('click','.quxiaoshuhui',function () {
            var orderid= $(this).data('id');
            cancleRedeem(orderid);
            return false;
        });
        //预约赎回判断用户是否绑卡
        $('.user_product_list').on('click','.shuhui',function () {
            var mobile = $(this).data('mobile');
            var orderid = $(this).data('id');
            var ptype = $(this).data('type');
            redeemJudge(orderid,ptype,mobile);
        });
    }
    exports.userProduct=userProduct;


});

