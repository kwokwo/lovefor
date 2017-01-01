/**
 * Created by kwokwo on 2014/5/16.
 */

//背景对象
var back_bg = {};

//repeat obj init
back_bg.repeat = {
    delayJudge: false, //延时判断操作,
    repeatDetailNums: 0, //初始化定义背景个数
    repeatDivs: [],
    repeatObj: null,
    options: null,
    imageObj_options: null,
    childCheck: false,//moveObj 是否点击
    canEvent: true,//enter事件是否可以执行
    repeatTempNum: {tempCount: 0}, //用于背景计算 tempWidthNum-临时计算宽度个数  tempHeightNum-临时计算高度个数 tempNeedsNum-临时计算总个数 objX-对象运动限制宽度个数 objY-对象运动限制高度个数 //tempCount背景计算个数
    repeatObjInit: function (obj, isRandom, option, callback) {//初始化div层
        var options = {//初始配置 options
            base_length: 100,
            opacity: 0.05,
            borderRadius: 5,
            status: true,
            background: '#7091AF'
        }

        options = $.extend(options, option);
        //合并options
        var backGrounds = null;
        if (isRandom) {//是否随机产生颜色
            backGrounds = ["#7091AF", "#B95FB2", "#5FB995", "#B9715F", "#A29E9D"];
            options.background = backGrounds[Math.floor(Math.random() * 4)];
        }
        this.repeatObj = $("#" + obj);
        this.options = options;
        this.creatRepeatDivs($("#" + obj), options, callback);

    },
    repeatResizeEvent: function () {
        //        if (!this.delayJudge) {
        //            this.delayJudge = true;
        //            this.creatRepeatDivs(this.repeatObj, this.options);
        //        }
        //
        this.creatRepeatDivs(this.repeatObj, this.options);

    },
    creatRepeatDivs: function (obj, options, callback) {//定义重复背景类

        var tempNum = {
            tempWidthNum: 0,
            tempHeightNum: 0,
            tempNeedsNum: 0
        }//定义宽度和高度上的div临时个数
        //获取需要定义的div个数
        this.needsDivNum(options.base_length, tempNum);
        this.repeatTempNum = $.extend(this.repeatTempNum, tempNum);


        //设置容器的宽度和高度  -------不管是否添加都要重新计算宽和高
        obj.width(tempNum.tempWidthNum * options.base_length);
        obj.height(tempNum.tempHeightNum * options.base_length);
        //判断是否需要添加容器的div个数
        if (tempNum.tempNeedsNum <= this.repeatDetailNums) {//当需要个数少于已经存在的个数时 不进行添加操作
            back_bg.repeat.delayJudge = false;
            return
        }
        ;

        //判断是否是第一次载入 设置变化效果
        if (this.repeatDetailNums != 0) {
            $(".repeatDiv").css('opacity', '0');
            //移除事件

        }
        /*//当需要个数大于已经存在的个数时，添加div个数*/
        //计算需要添加的div个数
        var new_nums = tempNum.tempNeedsNum - this.repeatDetailNums;
        /*设置页面对象已经存在的div个数*/
        this.repeatDetailNums = tempNum.tempNeedsNum;

        for (var i = 0; i < new_nums; i++) {

            this.addRepeatDiv(i + back_bg.repeat.repeatTempNum.tempCount);
        }
        //分时加载数据
        this.repeatTimeLoad(this.repeatDivs, 100, 10, function () {
            $(".repeatDiv").delay(800).animate({

                opacity: back_bg.repeat.options.opacity
            }, 2000);
            back_bg.repeat.repeatTempNum.tempCount = back_bg.repeat.repeatTempNum.tempNeedsNum;

            back_bg.repeat.delayJudge = false;
            if (callback)
                callback();

        });

    },
    /*分时加载 防止卡死
     * @parms data-数据 maxtime-每个处理进程的最大毫秒数 delay-表示每个程序块之间的毫秒数 process-回调参数
     * */
    repeatTimeLoad: function (data, maxtime, delay, callback) {

        setTimeout(function () {
            var endtime = new Date() + maxtime;
            do {
                for (var x = 0; x < 10; x++) {
                    back_bg.repeat.repeatObj.append(data.shift());

                }
                //                process.call(context, todo.shift());
            } while (data.length > 0 && endtime > new Date());
            if (data.length > 0) {
                setTimeout(arguments.callee, delay);
            } else {
                if (callback)
                    callback();
            }
        }, delay);
    },
    addRepeatDiv: function (num) {
        if (typeof (this.conuntNumW) == undefined) this.conuntNumW = 0;
        if (typeof (this.conuntNumH) == undefined) this.conuntNumH = 0;


        var obj = back_bg.repeat.repeatObj;
        var options = back_bg.repeat.options;
        var div = $("<div class='repeatDiv' id='repeatDiv" + num + "'></div>");
        div.css({
            'background': options.background,
//            'background': '#bbb',
            'width': options.base_length - 1, //考虑margin的边距占用
            'height': options.base_length - 1,
            'opacity': 0,
            'border-radius': options.borderRadius
        });
        div.on("mouseenter", function () {
            //事件判断
            if (!back_bg.repeat.canEvent) return;
            $(this).finish().animate({
                opacity: options.opacity + 0.1
            });
        }).on("mouseleave", function () {//注册事件
            //事件判断
            if (!back_bg.repeat.canEvent) return;
            $(this).finish().animate({
                opacity: options.opacity
            });
        });

        this.repeatDivs.push(div);

    },
    needsDivNum: function (width, tempNum) {//判断可视区域内需要的div个数
        //获取可视窗口高度和宽度
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        //获取余数
        var remainderWidth = windowWidth % width;
        var remainderHeight = windowHeight % width;
        //计算容器适应长度和高度
        if (remainderWidth == 0) {
            tempNum.objX = windowWidth / width;
            tempNum.objWidthNum = windowWidth / width;
        } else {
            tempNum.objX = Math.floor(windowWidth / width);
            tempNum.tempWidthNum = Math.floor(windowWidth / width) + 1;
        }
        /*---------------------*/
        if (remainderHeight == 0) {
            tempNum.objY = windowHeight / width;
            tempNum.tempHeightNum = windowHeight / width;
        } else {
            tempNum.objY = Math.floor(windowHeight / width);
            tempNum.tempHeightNum = Math.floor(windowHeight / width) + 1;

        }
        //计算总共需要个数
        tempNum.tempNeedsNum = tempNum.tempHeightNum * tempNum.tempWidthNum;

    },
    //点击螺旋矩阵切换图片
    changeBackGround: function (now_x, now_y, obj) {
        var tempNum = 0;//定义变化完成的个数
        var totalTempNum = this.repeatTempNum;//获取实时的页面排列数据
        var now_X = now_x;
        var now_Y = now_y;//定义实时位置
        this.checkNowX = now_X;
        this.checkNowY = now_Y
        //消除children 的事件
        $(".repeatDiv").css({
            "left": function (index, value) {
                return $(this).position().left
            },
            "top": function (index, value) {
                return $(this).position().top
            },
            "position": "absolute"
        });
        //
        //点击图片 预加载图片完成后进行操作
        var src = $(obj).find("img")[0].src;
        src = src.split("/");
        src = src[src.length - 1];
//        var baseUrl = $.fn.getBaseUrl()+"/isYou/base";
//        $.fn.loadImage("/resources/images/org_back/" + src, Matrix)
        $.fn.loadImage("./resources/images/org_back/" + src, Matrix)


        function Matrix() {
            var options = back_bg.repeat.imageObj_options = back_bg.repeat.getBackgroundSize("main_base", this);//获取当前的图片对象

            back_bg.repeat.getFloatChildren(now_X, now_Y, tempNum, options);//设置原点位置的图片
            var x = 0, y = 0;//定义圆心
            while (tempNum <= totalTempNum.tempNeedsNum - 2) {  //螺旋矩阵算法
                if (x <= -y - 1 && x >= y) {
                    now_X += 100
                    x++;
                }
                else if (x > -y - 1 && x > y) {
                    now_Y += 100;
                    y++;
                }
                else if (x > -y - 1 && x <= y) {

                    now_X -= 100;
                    x--;

                }
                else if (x <= -y - 1 && x < y) {
                    now_Y -= 100;
                    y--;
                }


                if (now_X < 0 || now_Y < 0)  continue;
                if (now_X >= totalTempNum.tempWidthNum * 100 || now_Y >= totalTempNum.tempHeightNum * 100) continue;

                back_bg.repeat.getFloatChildren(now_X, now_Y, tempNum, options);
//                console.debug(tempNum);
                tempNum++;
            }


        }


    },
    /*
     * 根据位置参数获取对应元素
     * */
    getFloatChildren: function (left, top, time, imgObj_options) {
        var childrenId = Math.floor(left / 100 + (top / 100 * this.repeatTempNum.tempWidthNum));
        var divId = "repeatDiv" + childrenId;

        $("#" + divId).delay(time * 9).animate({
            "opacity": 0.15
        }, function () {
            $(this).css({
                "opacity": 1,
                "background-color": "transparent",
                "background-image": "url('" + imgObj_options.image.src + "')",
                "background-repeat": "no-repeat",
                "background-size": imgObj_options.width + "px " + imgObj_options.height + "px",
                "background-position": -(left + imgObj_options.left) + "px " + -(top + imgObj_options.top) + "px"

            });
//            console.debug(time);
            if (time == back_bg.repeat.repeatTempNum.tempNeedsNum - 2) {
//                console.debug(time+"__"+back_bg.repeat.repeatTempNum.tempNeedsNum);
                back_bg.moveObj.childCheck = false;
            }

        });


    },
    /*
     * 计算需要的背景大小
     * */
    getBackgroundSize: function (targetDiv, imageObj) {
        var returnOptions = {
            width: 0, //图片对象宽度
            height: 0,//对象高度
            origin_width: imageObj.width,
            origin_height: imageObj.height,
            image: null,//对象
            left: 0,//上移数据
            top: 0,//下移数据
            //比例改变依据
            changeBy: null
        };//返回对象数据

        var targetObj = $("#" + targetDiv);
        //获取宽度比
        var scale_w = targetObj.width() / imageObj.width;
        //获取高度比
        var scale_h = targetObj.height() / imageObj.height;
        //宽度比和高度比比较获取相对尺寸
        if (scale_w < scale_h) {//宽度比大于高度比按照 宽度进行计算
            returnOptions.width = imageObj.width = targetObj.width();
            returnOptions.height = imageObj.height = scale_w * imageObj.height;
            returnOptions.image = imageObj;
            returnOptions.left = 0;
            returnOptions.top = (returnOptions.height - targetObj.height()) / 2;
            returnOptions.changeBy ="W";

        } else {//高度比大于宽度比按照高度进行计算
            returnOptions.width = imageObj.width = scale_h * imageObj.width;
            returnOptions.height = imageObj.height = targetObj.height();
            returnOptions.image = imageObj;
            returnOptions.left = (returnOptions.width - targetObj.width()) / 2;
            returnOptions.top = 0;
            returnOptions.changeBy = "H";

        }
        return returnOptions;


    },
    setOriginSize: function () {

    }

}
//dragObj
back_bg.moveObj = {
    windowHeight: 0,
    windowWidth: 0,
    moveObjs: null, //定义运动对象合集
    mouseInterval: null, //定义鼠标运动时的变量
    clickObj: false, //定义是否已经点击状态，防止用户误操作
    initMoveObjs: function (id) {
        this.windowWidth = $(window).width();
        this.windowHeight = $(window).height();
        var _$ = $("." + id);
        this.moveObjs = _$;
        //初始化 位置
        setTimeout(function () {
            back_bg.moveObj.setRandomPosition(_$, back_bg.repeat.repeatTempNum);
            back_bg.moveObj.dragMove(_$);
            //初始化拖动
        }, 2000);

        /*
         * --初始化 moveObj其它对象
         * */
        this.initEvent();

    },
    setRandomPosition: function (objs, options) {//获取
        this.randomArray = [];
        //定义二维数组

        this.getRadnomNum = function () {//获取随机不同的数组
            var randomAx = [];
            var randomAy = [];

            for (var i = 0; i < objs.length; i++) {
                var val_x = getOnlyRandom(options.objX - 1, randomAx);
                var val_y = parseInt(Math.random() * ((options.objY - 1) - 2 + 1) + 2);
                var tempArray = [];
                tempArray.push(val_x, val_y);
                this.randomArray.push(tempArray);
            }

            function getOnlyRandom(num, array) {//定义获取无重复的随机数

                var temp = parseInt(Math.random() * (num - 2 + 1) + 2);
                if (array.indexOf(temp) > -1) {
                    return getOnlyRandom(num, array);
                } else {
                    array.push(temp);
                    return temp;
                }
            }

        }

        this.setPosition = function () {
            //            var backGrounds = ["#9cafb6", "#d0dbd3", "#dc9989", "#d6b194", "#C59F70", "#BCE2AD"];
            var backGrounds = ["#E2D9CA", "#A1DBE7", "#BBDF7F", "#FE8975", "#805E5F", "#BCE2AD"];
            for (var i = 0; i < objs.length; i++) {
                $(objs[i]).css({
                    left: (this.randomArray[i][0] - 1) * 100,
                    top: (this.randomArray[i][1] - 1) * 100
                    //                    opacity: 0,
                }).fadeTo("slow", 1);
                $($(objs[i]).children()).css({
                    background: backGrounds[i]

                });
            }
        }

        this.getRadnomNum();
        this.setPosition();
    },
    dragMove: function (obj) {//拖动函数
        var widthX = 0;
        //定义移动水平距离
        var heightY = 0;
        //定义移动水平距离
        var isDown = false;
        //判断是否按下
        var X_movespeed = 0;
        var Y_movespeed = 0;
        var dx = 1;
        //移动方向
        var dy = 1;
        var mousePosLastX = 0;
        var mousePosLastY = 0;
        var old_left = 0;
        var old_top = 0;
        var self;
        var clickStart;
        var clickEnd;
        obj.children(".move_obj_top").mousedown(function (e) {
            //            clickStart = new Date();
            old_left = parseInt($(this).parent().css("left"));
            old_top = parseInt($(this).parent().css("top"));
            widthX = e.pageX - parseInt($(this).parent().css("left"));
            heightY = e.pageY - parseInt($(this).parent().css("top"));
            isDown = true;
            X_movespeed = 0;
            //水平方向速度
            Y_movespeed = 0;
            //垂直方向速度

            $(this).parent().css("z-index", "999");
            self = this;
            back_bg.moveObj.mouseInterval = setInterval(function () {//按下时实时计算鼠标速度--时间差直接忽略
                X_movespeed = parseInt($(self).parent().css("left")) - mousePosLastX;
                //计算距离差
                Y_movespeed = parseInt($(self).parent().css("top")) - mousePosLastY;
                mousePosLastX = parseInt($(self).parent().css("left"));
                //获取现在的位置
                mousePosLastY = parseInt($(self).parent().css("top"));
            }, 10);
        });
        $(document).mousemove(function (e) { //全局鼠标滑动

            if (isDown) {//判断是否拖动
                var moveX = e.pageX - widthX;
                //水平移动数据
                var moveY = e.pageY - heightY;
                //垂直移动数据
                //限制对象移动边距
                if (moveX > back_bg.moveObj.windowWidth - 100) {
                    moveX = back_bg.moveObj.windowWidth - 100;
                } else if (moveX < 0) {
                    moveX = 0;
                }
                if (moveY > back_bg.moveObj.windowHeight - 100) {
                    moveY = back_bg.moveObj.windowHeight - 100;
                } else if (moveY < 0) {
                    moveY = 0;
                }
                $(self).parent().css({//设置位置
                    'left': moveX,
                    'top': moveY
                });
            }
            back_bg.moveObj.clearSlct();
            //去除选择区域
            e.stopPropagation();
        }).mouseup(function (e) {//放开鼠标时的动作
            if (isDown) {//判断是都拖动
                isDown = false;
                var new_left = parseInt($(self).parent().css("left"));
                var new_top = parseInt($(self).parent().css("top"));
                if (new_left == old_left && new_top == old_top) {//判断是否是点击
                    clearInterval(back_bg.moveObj.mouseInterval);//消除鼠标速度计算
                    //消除实时速度计算
                    back_bg.moveObj.clickMoveObj(self.parentNode);//点击事件
                } else {
                    clearInterval(back_bg.moveObj.mouseInterval);
                    //判断实时速度计算
                    if (X_movespeed == 0 && Y_movespeed == 0) { //速度为零 ，只进行位置判断
                        back_bg.moveObj.moveStopAction(self.parentNode, 0, 0);

                    } else {
                        mouseUpMove(self.parentNode, 20);//动画延迟
                        //回调判断对象所在的格子
                    }
                }
            }

        });

        //释放鼠标时缓动
        var mouseUpMove = function (obj, dualTime, callback) {
            //匀减速计算
            var dx = 1;
            //设置初始方向
            var dy = 1;
            var t = 0;
            //            设置减速度
            var a = 5;
            var h;
            var _X_movespeed = X_movespeed;
            var _Y_movespeed = Y_movespeed;
            var x_b = parseInt($(obj).css("left"));
            //获取初始位置
            var y_b = parseInt($(obj).css("top"));

            h = setInterval(function () {//运动动作
                var move_x = 0;
                var move_y = 0;
                move_x = x_b + _X_movespeed * a * 0.1;
                move_y = y_b + _Y_movespeed * a * 0.1;

                a -= 0.1;

                //方向和位置处理 ------------------------------------------
                if (move_x <= 0) {
                    move_x *= -1;
                    _X_movespeed *= -1;
                } else if (move_x > back_bg.moveObj.windowWidth - 100) {
                    move_x = 2 * (back_bg.moveObj.windowWidth - 100) - move_x;
                    _X_movespeed *= -1;
                }
                ;
                if (move_y <= 0) {
                    move_y *= -1
                    _Y_movespeed *= -1;
                } else if (move_y >= back_bg.moveObj.windowHeight - 100) {
                    move_y = 2 * (back_bg.moveObj.windowHeight - 100 ) - move_y;
                    _Y_movespeed *= -1;
                }
                ;
                //                ------------------------------------------

                $(obj).css({//设置位置
                    'left': move_x,
                    'top': move_y
                });

                //设置位置返回数据
                x_b = move_x;
                y_b = move_y;

                if (t < dualTime) {//动画持续时间判断
                    t++;

                } else {

                    clearInterval(h);
                    //设置对象停止时的位置
                    back_bg.moveObj.moveStopAction(obj, X_movespeed, Y_movespeed);

                    //                    X_movespeed = 0;
                    //                    Y_movespeed = 0;

                }
            }, 10)

            /*
             t: current time（当前时间）；
             b: beginning value（初始值）；
             c: change in value（变化量）；
             d: duration（持续时间）。*/
            var easeOut = function (t, b, c, d) {//位置匀减速处理函数
                return c * (( t = t / d - 1) * t * t + 1) + b;
            }
        };

    },
    //定义动作初始化方法
    initEvent: function () {
        /*
         * ---绑定子元素的动作
         * */
        $(".move_obj_children").on("mouseenter", function (e) {
            $(this).children(".div_back").finish().animate({
                width: 85,
                height: 85,
                'margin-left': 7,
                'margin-top': 7
            }, 200);
            e.stopPropagation();
        }).on("mouseleave", function (e) {
            $(this).children(".div_back").finish().animate({
                width: 97,
                height: 97,
                'margin-left': 1,
                'margin-top': 1
            }, 200);
            e.stopPropagation();
        });

        /*
         * 绑定close元素的动作
         * */
        $(".move_obj_close").on("click", function (e) {
            if (back_bg.moveObj.childCheck) return;//判断子图片展开时不能操作
            //设置repeat_div 事件状态
            back_bg.repeat.canEvent = true;

            $(this).finish().animate({
                'bottom': -30
            }, function () {
                var childrens = $(this).parents(".move_obj").children(".move_obj_children");
                childrens.removeClass("move_obj_children_active").finish().animate({//子节点的收回
                    left: 0,
                    top: 0
                }, 200);

                $(".move_obj").not($(this).parents(".move_obj")).finish().delay(1000).show().fadeTo(500, 1, function () { //设置移动对象的显示
                    back_bg.moveObj.clickObj = false;

                });
            });


            $(".repeatDiv").delay(200).animate({
                'opacity': back_bg.repeat.options.opacity
            }, function () {
                $(this).css({"position": "relative", "display": "block", "left": 0, "top": 0, "background": back_bg.repeat.options.background});
            })

        });

        /*
         * 绑定子元素的动作
         * */
        $(".move_obj_children").on("click", function () {
            if (!back_bg.moveObj.childCheck) {
                back_bg.moveObj.childCheck = true;
                back_bg.repeat.canEvent = false;//取消背景鼠标移入事件
                var thisPosition = $(this).position();
                var thisParentPosition = $(this).parent().position();
                back_bg.repeat.changeBackGround(thisParentPosition.left + thisPosition.left, thisParentPosition.top + thisPosition.top, this);
            }

        });


    },
    clickMoveObj: function (obj) {
        if (this.clickObj)
            return;

        this.clickObj = true;
        //设置点击状态 --true已经点击
        var nineSquared = [//定义出现位置
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [1, -1],
            [0, -1],
            [-1, -1]
        ];

        /*
         * 设定为只点击一个元素时的控制（不使用）
         * */
        /* var isOpen = $(obj).data("isClick") == undefined ? false : $(obj).data("isClick");
         //获取 点击打开或者点击关闭信息状态
         if (isOpen) {
         $(obj).data("isClick", false);
         //在元素上绑定数据  false--设置没有点击展开
         $($(obj).children(".move_obj_children")).finish().animate({//子节点的收回
         left: 0,
         top: 0
         }, 200);
         $(".move_obj").not(obj).finish().show().fadeTo(500, 1, function () {
         back_bg.moveObj.clickObj = false;
         });
         //设置移动对象的显示

         } else {
         $(obj).data("isClick", true);
         //在元素上绑定数据  false--设置点击展开

         var childrens = $(obj).children(".move_obj_children");
         //获取所有的子节点
         var num = ("ActiveXObject" in window) ? 99 : 100;
         for (var i = 0; i < childrens.length; i++) {//子节点的展开
         $(childrens[i]).finish().animate({
         'left': -nineSquared[i][0] * num,
         'top': -nineSquared[i][1] * num
         }, 200)
         }

         $(".move_obj").not(obj).finish().fadeTo(500, 0, function () {
         $(this).hide();
         back_bg.moveObj.clickObj = false;
         });
         //设置其他移动对象的消失

         }*/
        /*
         *  设定为点击展开 ----- close元素关闭
         * */

        $($(obj).find(".move_obj_close")).finish().animate({
            'bottom': 0
        }, function () {
            var childrens = $(obj).children(".move_obj_children");
            var limitArray = $.fn.getOnlyRandom(7, 0, childrens.length);
            //获取所有的子节点
            var num = 100;
            for (var i = 0; i < childrens.length; i++) {//子节点的展开
                $(childrens[i]).addClass("move_obj_children_active").finish().animate({
                    'left': -nineSquared[limitArray[i]][0] * num,
                    'top': -nineSquared[limitArray[i]][1] * num
                }, 200)
            }

            $(".move_obj").not(obj).finish().fadeTo(500, 0, function () {  //设置其他移动对象的消失
                $(this).hide();

            });
        });


    },
    moveResizeEvent: function () {//控制浏览器窗口变化时的动作
        this.windowWidth = $(window).width();
        this.windowHeight = $(window).height();
    },
    /*
     * --判断动画停止时，对象的位置
     *
     * */
    moveStopAction: function (obj, x_v, y_v) {
        var nineSquared = [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 1],
            [-1, 1],
            [-1, -1],
            [1, -1]
        ];
        var _this = $(obj);
        var computeX = 0;
        //计算时数据位置
        var computeY = 0;
        var computeX_num = 0;
        //计算时所占格子
        var computeY_num = 0;
        var judgeX = 0//位置差计算
        var judgeY = 0//位置差计算

        computeX = _this.position().left + 100;
        //获取元素右下角的位置数据
        computeY = _this.position().top + 100;
        computeX_num = Math.floor(computeX / 100);
        //计算所占格子
        computeY_num = Math.floor(computeY / 100);
        judgeX = computeX - computeX_num * 100;
        //计算格子位置数据差
        judgeY = computeY - computeY_num * 100;

        computeX_num = judgeX >= 50 ? computeX_num + 1 : computeX_num;
        //判断格子所在位置和 程序逻辑处理数据对比
        computeY_num = judgeY >= 50 ? computeY_num + 1 : computeY_num;
        var tempNum = back_bg.repeat.repeatTempNum;
        //获取 外部repeat数据最大有效格子数据
        computeX_num = tempNum.objX > computeX_num ? computeX_num : tempNum.objX;
        //判断格子和外部数据
        computeY_num = tempNum.objY > computeY_num ? computeY_num : tempNum.objY;
        //判断元素位置是否重复
        judgePosition(0);
        _this.animate({
            left: (computeX_num - 1) * 100,
            top: (computeY_num - 1) * 100
        }, 100, function () {//回调判断词组 显示
            back_bg.moveObj.judgeWord();
        }).css("z-index", "1");
        /*
         * 设置判断
         * */


        //设置元素移动
        /*
         * 递归判断元素位置function
         * */
        function judgePosition(directionNum) {
            //处理越界判断
            if (computeX_num == 1) {
                computeX_num = 2
            }
            if (computeX_num == tempNum.objX) {
                computeX_num -= 1;
            }
            if (computeY_num == 1) {
                computeY_num = 2;
            }
            if (computeY_num == tempNum.objY) {
                computeY_num -= 1;
            }
            //------------------------------------------------
            var computeX_num_temp = computeX_num - nineSquared[directionNum][0];
            //处理占格子判断
            var computeY_num_temp = computeY_num - nineSquared[directionNum][1];
            back_bg.moveObj.moveObjs = $(".move_obj");
            //获取其他的对象
            for (var obj = 0; obj < back_bg.moveObj.moveObjs.length; obj++) {
                var _$ = $(back_bg.moveObj.moveObjs[obj]);
                if (_$ == _this)
                    continue;
                //排除自身判断
                tempNumX = (parseInt(_$.css("left")) / 100) + 1;
                //获取对象所在位置X的格子数
                tempNumY = (parseInt(_$.css("top")) / 100) + 1;
                //获取对象所在位置Y的格子数
                if (tempNumX == computeX_num_temp && tempNumY == computeY_num_temp) {
                    judgePosition(directionNum + 1);
                    return;
                }
                if (computeX_num_temp == 1) {
                    judgePosition(directionNum + 1);
                    return;
                }
                if (computeX_num_temp == tempNum.objX) {
                    judgePosition(directionNum + 1);
                    return;
                }
                if (computeY_num_temp == 1) {
                    judgePosition(directionNum + 1);
                    return;
                }
                if (computeY_num_temp == tempNum.objY) {
                    judgePosition(directionNum + 1);
                    return;
                }

            }

            computeX_num = computeX_num_temp;
            computeY_num = computeY_num_temp;
        }

    },
    /*
     * 判断词组拼写
     * */
    judgeWord: function () {
        var tempX, tempY, isComplete = true;
        var positionX, positionY;
        var objs = back_bg.moveObj.moveObjs;
        for (var i = 0; i < objs.length; i++) {
            if (i == 0) {
                tempX = objs[i].offsetLeft + 100;
                tempY = objs[i].offsetTop;

                positionX = tempX;
                positionY = tempY + 100;
            } else {
                if (objs[i].offsetLeft != tempX || objs[i].offsetTop != tempY) {
                    isComplete = false;
                    break;
                } else {
                    tempX = objs[i].offsetLeft + 100;
                }
            }
        }

        if (isComplete) {
            //获取位置信息
            $("#main_heart").css({
                "left": positionX,
                "top": positionY,
                "opacity": 1
            }).fadeIn("slow");
        } else {
            $("#main_heart").fadeOut("slow");
        }
    },
    /*
     * 消除拖动时的选择事件
     * */
    clearSlct: function () {
        if ("getSelection" in window) {
            window.getSelection().removeAllRanges();

        } else {
            document.selection.empty();

        }
    }
};

//jquery 扩展
$.fn.extend({

    getOnlyRandom: function (max, min, limitNum) {
        var num = 0;
        var array = [];
        var onlyRandom = function (num, array) {
            if (num == limitNum) return;
            var temp = parseInt(Math.random() * (max - min + 1) + min);
            if (array.indexOf(temp) > -1) {
                onlyRandom(num, array);
            } else {
                array.push(temp);
                num++;
                onlyRandom(num, array);
            }
        }

        //调用
        onlyRandom(num, array);
        return array;
    },
    loadImage: function (url, callback) {
        var img = new Image(); //创建一个Image对象，实现图片的预下载
        img.src = url;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            callback.call(img);
            return; // 直接返回，不用再处理onload事件
        }
        img.onload = function () { //图片下载完毕时异步调用callback函数。
            callback.call(img);//将回调函数的this替换为Image对象
        };


    },
    getBaseUrl: function () {
        var href = document.location.host;
        return href;
    }

});

