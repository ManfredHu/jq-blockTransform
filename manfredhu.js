/**
 * 
 * @authors Manfred Hu (ManfredHuFE@gmail.com)
 * @date    2015-10-17 03:43:26
 * @version $Id$
 */
(function($) {
	$(function() {
		$('html').css('overflow','hidden');
		$('body :first-child').before('<div class="jq-blo"></div>');
		
		var $insertWhere = $('.jq-blo').eq(0), //插件动画插入的位置，这里是插入到body的第一个子元素中
			i, j,
			$win = $(window),
			height = $win.height(), //获取视口长和宽
			width = $win.width(),
			//小块的属性
			blockWidth = 88, //小块的长度
			blockMargin = 6, //小块的外边距，间距
			blockRadius = "50%", //小块的圆角半径
			blockOpacity = 0.2 //小块的透明度
			blockColor = '#fff',
			//背景图片的属性
			pictureUrl = "./manfredHu.png", //背景图片的URL
			pictureBgColor = "#3369C8",
			picturePosition = "50%",
			pictureRepeat = "no-repeat",
			pictureSize = "90% auto",
			picWidth = 1920,
			picHeight = 1080;

		$insertWhere.append($('<div id="blockSet"></div><div id="blockBgDiv"></div>'));

		var blockNum = Math.floor(width / (blockWidth + blockMargin)), //记录小块的数目
			blockRemain = width % (blockWidth + blockMargin),
			blockNum2 = Math.floor(height / (blockWidth + blockMargin)), //记录小块的数目
			blockRemain2 = height % (blockWidth + blockMargin),
			$blockBgDiv = $('#blockBgDiv'),
			$blockDiv = $('#blockSet');

		//修复右边有剩余边界的问题
		blockWidth += (blockRemain - blockMargin) / blockNum;

		//如果行多了则加上
		if (blockRemain2 >= blockWidth / 3) {
			blockNum2++;
		} else {
			//没有大于四分之一则向下平移
			$blockDiv.css({
				"margin-top": (blockRemain2 / 2) + "px"
			});
		}

		var fragment = document.createDocumentFragment(); //创建文档仓库

		for (j = 0; j < blockNum2; j++) {
			for (i = 0; i < blockNum; i++) { //循环创建小块
				var span = document.createElement('span');
				fragment.appendChild(span);
			}
		}

		$blockDiv.get(0).appendChild(fragment);

		// //在背景层上添加img
		// $blockBgDiv.append('<img />');
		// var $bgImg = $blockBgDiv.find('img');
		// $bgImg.attr('src',pictureUrl);
		
		//切换滚动条状态(没有用到，还没做完)
		// function toggleScroll(){
		// 	var isSee = true; //默认为显示滚动条
		// 	if(isSee){
		// 		$('html').css({
		// 			'overflow-x':'hidden',
		// 			'overflow-y':'hidden'
		// 		});
		// 		$('body').css({
		// 			'overflow-x':'hidden',
		// 			'overflow-y':'hidden'
		// 		});
		// 	}else{	
		// 		$('html').css({
		// 			'overflow-y':'auto'
		// 		});
		// 		$('body').css({
		// 			'overflow-y':'auto'
		// 		});
		// 	}
		// }

		//添加动画keyframe
		$('head').append('<style>' 
			+ '@keyframes blockRotate{' //小块的动画
			+ '0%   {transform:rotate3d(1,1,1,0deg);border-radius:50%;}' 
			+ '100% {transform:rotate3d(1,1,1,360deg);border-radius:0%;}' 
			+ '}' 
			+ '.blockMove{transform:translate3d(' + width / 2 + 'px,' + height + 'px,0px)}' //小块向上排列的动画
			+ '.blockAnimation{animation:blockRotate 15s linear infinite alternate}' //小块排列完成后旋转的动画
			+ '</style>');

		/*--------------------------------------------------------------------------------------------------*/
		//后面可以分割为CSS样式，但是这里做成插件就没分开

		//@test
		//$blockDiv.empty();
		// $blockDiv.append('<span></span>')

		$blockDiv.parent().css({
			'position': 'fixed',
			'z-index': '888',
			'height': height,
			'width': width,
			'overflow': 'hidden',
			'background-color': pictureBgColor
		});
		
		//对图片进行宽度长度等比例修复
		// var divideWidth = picWidth/width, //根据屏幕和图片的长度比例换算
		// 	divideHeight = picHeight/height;

		// if( divideWidth > divideHeight ) { //取小比例的进行
		// 	picHeight = picHeight*width/picWidth;
		// 	picWidth = width;
		// } else {
		// 	picHeight = height;
		// 	picWidth = picWidth*height/picHeight;
		// }
		var bgSizeString = width+'px';
		// bgSizeString += ' ' + picHeight +'px';

		//设置全屏背景的CSS
		$blockBgDiv.css({
			'height': height,
			'width': width,
			'background-color': pictureBgColor,
			'background-image': "url('" + pictureUrl + "')",
			'background-position': picturePosition,
			'position': 'position',
			'z-index': '999',
			'overflow': 'hidden',
			'background-size': bgSizeString,
			'background-repeat': pictureRepeat
		});
		//小块层
		$blockDiv.css({
			'position': 'absolute',
			'z-index': '1000',
			'overflow':'hidden',
			'width':width,
			'height':height
		});

		//缓存小块集合
		var $blockSpan = $blockDiv.find('span');
		//设置小块的CSS
		$blockSpan.css({
			'width': blockWidth,
			'height': blockWidth,
			'background': blockColor,
			'display': 'block',
			'float': 'left',
			'margin-left': blockMargin + 'px',
			'margin-top': blockMargin + 'px',
			'border-radius': blockRadius,
			'opacity': blockOpacity,
			'transition': 'all 0.1s ease-in-out',
		});
		/*--------------------------------------------------------------------------------------------------*/
		//添加小块移动
		$blockSpan.addClass('blockMove');

		var iNum = 0,
			len = $blockSpan.length;

		// setTimeout(function(){
		// 	$blockSpan.eq(iNum).removeClass('blockMove');
		// },1000);

		var speed = 66; //小块上升的速度

		if(width>1500) { //如果屏幕过大则加快小块载入速度
			speed /= 2;
		}

		//背景图片的样式，修复背景图片居中问题，上面设置了src
		// var bgImgWidth = $bgImg.width(),
		// 	bgImgHeight = $bgImg.height();

		// console.log(bgImgWidth)
		// console.log(bgImgHeight)

		// $bgImg.css({
		// 	'height':height,
		// 	'position':'absolute',
		// 	'left':'50%',
		// 	'margin-left': '-' +  +'px'
		// });

		//设置向上排列和旋转动画
		setTimeout(function() {
			if (iNum < len) {
				$blockSpan.eq(iNum).removeClass('blockMove');
				// $blockSpan.eq(len-iNum).removeClass('blockMove');
				iNum++;
				setTimeout(arguments.callee, speed);
			}else{
				setTimeout(function(){
					$blockSpan.addClass('blockAnimation');		
				},1000)
			}
		}, 200);

	});
})(jQuery);