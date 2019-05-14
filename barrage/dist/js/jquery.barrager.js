
(function ($) {
	$.fn.barrager = function (barrage) {
		barrage = $.extend({
			close: true,
			bottom: 0,
			max: 10,
			speed: 6,
			color: '#fff',
			old_ie_color: '#000000',
			isshow: "#right",
			odd: true
		}, barrage || {});

		var time = new Date().getTime();
		var barrager_id = 'barrage_' + time;
		var id = '#' + barrager_id;
		var div_barrager = $("<div class='barrage' id='" + barrager_id + "'></div>").appendTo($(barrage.isshow));
		var window_height = $(window).height() - 300;
		var bottom = (barrage.bottom == 0) ? Math.floor(Math.random() * window_height + 200) : barrage.bottom;
		div_barrager.css("bottom", bottom + "px");
		div_barrager_box = $("<div class='barrage_box cl'></div>").appendTo(div_barrager);

		if (barrage.name) {

			div_barrager_box.append("<a class='portrait z' href='javascript:;'></a>");
			var name = $("<div class='user-name'></div>").appendTo(id + " .barrage_box .portrait");
			name.html(barrage.name + " :");
		}

		div_barrager_box.append(" <div class='z p'></div>");
		if (barrage.close) {

			div_barrager_box.append(" <div class='close z'>x</div>");

		}

		var content = $("<a title='' target='_blank'></a>").appendTo(id + " .barrage_box .p");
		content.attr({
			'href': barrage.href,
			'id': barrage.id
		}).empty().append(barrage.info);
		if (navigator.userAgent.indexOf("MSIE 6.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0) {

			content.css('color', barrage.old_ie_color);

		} else {

			content.css('color', barrage.color);

		}
		var i = -500;
		div_barrager.css('margin-right', i);
		var looper = setInterval(barrager, barrage.speed);

		function barrager() {
			var window_width = '';
			if (barrage.odd) {
				window_width = $(window).width() + 300;
			} else {
				window_width = $(window).width() / 2 + 300;
			}
			if (i < window_width) {
				i += 1;
				$(id).css('margin-right', i);
			} else {
				$(id).remove();
				return false;
			}
			// $(id).css('margin-right', i);
			// return false;
		}



		div_barrager_box.mouseover(function () {
			clearInterval(looper);
		});

		div_barrager_box.mouseout(function () {
			looper = setInterval(barrager, barrage.speed);
		});

		$(id + '.barrage .barrage_box .close').click(function () {

			$(id).remove();

		})

	}

	$.fn.barrager.removeAll = function () {

		$('.barrage').remove();

	}

})(jQuery);