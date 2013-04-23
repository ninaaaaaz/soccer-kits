/*
 *		Infostory js module:
 *			infostory.js
 *
 *		desc:
 *			Controls behavior of the timeline infographic.
 *
 *		requires:
 *			jQuery
 */

var athletics = (function( app, $ ) {
	
	/* define new module */
	app.infostory = (function($){
		
		// private vars
		var _initialized = false,
			$obj = null,
			$bgs = null,
			$controls = null,
			$border = null,
			$credit = null,
			$datapoints = null,
			$labelpoints = null,
			_cur_color_scheme = null,
			_datapoint_body_padding = 10,
			_img_path = '',
			_img_sprite = _img_path + 'assets/img/sprite_infostory.png';
			
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init() {

			$obj = $('div.athletics.infostory[data-infostory-name="gopro_timeline"]');
			
			$datapoints = $obj.find('div.i_s_datapoints');
			$labelpoints = $obj.find('div.i_s_labelpoints');
			
			if ($obj.length != 1) return false;

			// set img_path
			if ($obj.data('img-path')) _img_path = $obj.data('img-path');
			
			_init_controls();
			_init_data_points();
			_init_bgs();
			_init_border();
			_init_label_points();
			_init_credit();
			_reveal_first_datapoint();

			
			// basic styling
			$obj.css({
				'position' : 'relative',
				'width' : $obj.data('width'),
				'left': -10,
				'height' : $obj.data('height'),
				'overflow' : 'hidden',
				'font-size' : 0,
				'background-color' : '#ffffff'
			});
			
			$obj.find('.i_s_header').css({
				'width': '100%',
				'text-align': 'center',
				'padding-bottom': '12px',
				'border-bottom': '4px double #ccc'
			});
			
			$obj.find('.i_s_header span.i_s_timeline_label').css({
				'display':'inline-block',
				'font': 'normal 11px/14px Verdana, sans-serif',
				'text-transform': 'uppercase',
				'letter-spacing' : '1px',
				'color': '#fff',
				'padding': '3px 6px',
				'background' : '#000',
				'margin-bottom' : '5px'
			});
			
			$obj.find('.i_s_header h2').css({
				'font': 'normal 32px/36px Georgia, serif',
				'margin': '10px 0'
			});
			
			$obj.find('.i_s_header h4').css({
				'font': 'italic 16px/20px Georgia, serif',
				'color':'#666',
				'margin': '10px 0 0',
				'padding':'0 80px'
			});
			
			$obj.show();
			
			//_init_video_inview();
			

			
			_initialized = true;
			
			

		}
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_video_inview() {
		
		
			//play inview video
			$inviewvid = $obj.find('div.i_s_visible_video');
			$vidframe = $inviewvid.find('div.i_s_video_frame');
			$vidstill = $inviewvid.find('div.i_s_video_still');
			
			var _vid_cont_w = $inviewvid.data('width');
			var _vid_cont_h = $inviewvid.data('height');

			var _vid_player_w = $vidframe.data('width');
			var _vid_player_h = $vidframe.data('height');


			
			var _img_still = $vidstill.data('src');
			
			if (screen.width < 480) {
				var _vid_cont_w = 300;
				var _vid_cont_h = 235;
				var _vid_player_w = 300;
				var _vid_player_h = 169;
				var _img_still = 'assets/img/still_frame_300x169.png';
			}

			
			$inviewvid.css({
				'width' : _vid_cont_w,
				'height' : _vid_cont_h,
				'position': 'absolute',
				'left': '45px',
				'bottom': 100,
				//'background': '#fff',
				'z-index': '1'
			});

			if (screen.width < 480) {
				$inviewvid.css({
					'left': 0,
					'bottom': 281
				});
			}

			$inviewvid.find('h2').css({
				'font': 'normal 28px/28px Georgia, serif',
				'margin': '0 0 5px'
			});
			
			$inviewvid.find('h4').css({
				'font': 'normal 16px/25px Georgia, serif',
				'margin': '0 0 5px'
			});


			//$vidframe.hide();
			
			$vidstill.css({
				//'opacity': 0.5,
				'width': _vid_player_w,
				'height': _vid_player_h,
				'background': 'url("'+ _img_still +'") no-repeat 0px 0px #fff'
			});


			$vidframe.each(function(){
				var $this = $(this);
				var video_url = $this.data('video-url'),
					video_html = '';
				
				$this.css({
					'width': _vid_player_w,
					'height': _vid_player_h,
					'position': 'absolute',
					'bottom': '-14px',
					'z-index': 3
				});
				
				video_html += '<iframe width="' + _vid_player_w + '" height="' + _vid_player_h + '" src="' + video_url + '" frameborder="0" allowfullscreen></iframe>'

				$this.delay(1000).html(video_html);
			});
			
			
			/* * * * * SCROLL IN-VIEW TO PLAY: DOESNT WORK WITH IFRAME * * * * */
			
// 			$inviewvid.bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
// 				if (isInView) {
// 					// element is now visible in the viewport
// 					if (visiblePartY == 'top') {
// 					
//       					// top part of element is visible
//       					$vidstill.delay(300).animate(
//       						{'opacity' : 1},
//       						{'duration' : 250}
//       					);
//       				
//     				} else if (visiblePartY == 'bottom') {
//     				
//       					// bottom part of element is visible
//       				
//     				} else {
//        					// element is fully visible
//    				
//     					if ( $obj.find('.i_s_detail_window').hasClass('window_open') ) {
// 							//check if detail window is open
// 							return false
// 						} else {
//     					//$vidstill.fadeOut(100);
//     					$vidframe.fadeIn(800);
//     				
// 						$vidframe.each(function(){
// 							var $this = $(this);
// 							var video_url = $this.data('video-url'),
// 								video_html = '';
// 							
// 							$this.css({
// 								'width': _vid_player_w,
// 								'height': _vid_player_h,
// 								'position': 'absolute',
// 								'bottom': 1,
// 								'z-index': 3
// 							});
// 							
// 							video_html += '<iframe width="552" height="311" src="' + video_url + '" frameborder="0" allowfullscreen></iframe>'
// 
// 							$this.delay(1000).html(video_html);
// 						});
// 						}
// 
//     				}
//   				} else {
//        				// element is scrolled out of view
//     				$vidframe.html('').hide();
//   				}
// 			});
		}




		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _re_init_video() {
			$inviewvid = $obj.find('div.i_s_visible_video');
			$vidframe = $inviewvid.find('div.i_s_video_frame');
			$vidstill = $inviewvid.find('div.i_s_video_still');

			var _vid_player_w = $vidframe.data('width');
			var _vid_player_h = $vidframe.data('height');
			
			var button_top = $vidstill.data('button-x');
			var button_left = $vidstill.data('button-y');

			if (screen.width < 480) {
				var _vid_player_w = 300;
				var _vid_player_h = 169;
				var button_top = 59;
				var button_left = 122;
			}
			
		
			if (('.play_button').length > 1)  {
				$('.play_button').remove();
			}
		
			$vidstill.css({
				'opacity': 1,
			});
			
			$vidstill.append('<div class="play_button"><span></span></div>');
		
			$('.play_button').css({
				'position': 'absolute',
				'width': _vid_player_w,
				'height': _vid_player_h,
				'cursor':'pointer'
			});
			$('.play_button span').css({
				'position': 'absolute',
				'top': button_top,
				'left': button_left,
				'width': 49,
				'height': 49,
				'background' : 'url("http://i.forbesimg.com/assets/img/sprites/sprite_video_buttons.png") no-repeat 0px 0'
			});
			$(".play_button").hover(
				function () {
					$('.play_button span').css({'background' : 'url("http://i.forbesimg.com/assets/img/sprites/sprite_video_buttons.png") no-repeat -60px 0'});
				},
				function () {
					$('.play_button span').css({'background' : 'url("http://i.forbesimg.com/assets/img/sprites/sprite_video_buttons.png") no-repeat 0 0'});
				}
			);
			
			$('.play_button').on('click',function(){
					var $vidframe = $(this).parent().parent().find('.i_s_video_frame');
					var video_url = $vidframe.data('video-url'),
						video_html = '';
					//alert(video_url);
					//$vidstill.fadeOut(100);
					$vidframe.fadeIn(800);
					$vidframe.css({
						'width': _vid_player_w,
						'height': _vid_player_h,
						'position': 'absolute',
						'bottom': '-14px',
						'z-index': 3
					});
					
					video_html += '<iframe width="' + _vid_player_w + '" height="' + _vid_player_h + '" src="' + video_url + '&autoplay=1" frameborder="0" allowfullscreen></iframe>'

					$vidframe.delay(1000).html(video_html);
			});

		}


		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_border() {
			
			if (!$obj.data('use-border')) return false;
			
			$border = $obj.find('div.i_s_border');
			
			$border.css({
				'border' : '1px solid #ccc',
				'width' : $obj.data('width') - 2,
				'height' : $obj.data('height') - 2,
				'position' : 'absolute',
				'top' : 0,
				'left' : 0,
				'z-index' : 2
			});
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_controls() {
			
			$controls = $obj.find('div.i_s_controls');
			
			// basic styling
			$controls.css({
				'position' : 'absolute',
				'z-index' : 4,
				'top' : '155px',
				'left' : '135px',
				'font-size' : '14px'
			});
			
			// general styling on controls
			$controls.find('div.i_s_option').css({
				'color' : '#666',
				'font-size' : '12px',
				'font-family' : 'Verdana',
				'font-weight' : 'normal',
				'text-decoration': 'underline',
				'cursor' : 'pointer'
			});
			
			$controls.find('div.i_s_option span.i_s_label').css({
				'padding' : '3px 10px',
				'display' : 'block'
			});
			
			$controls.find('span.i_s_downarrow').css({
				'display': 'none',
				'position' : 'absolute',
				'bottom' : '-5px',
				'left': '50%',
				'margin-left': '-6px',
				'background' : 'url("'+ _img_sprite +'") no-repeat -70px 0',
				'width' : '12px',
				'height' : '5px'
			});
			
			// position controls
			$controls.find('div.i_s_option').css({
				'float' : 'left',
				'margin-right' : '5px'
			});
			
			// attach events
			$controls.find('div.i_s_option').on('click',function(){
				var $this = $(this);

				if ($this.hasClass('i_s_active')) return false;

 				_change_bg(
 					$this.data('id')
 				);
			});
	
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_label_points() {
						
			$label_point = $labelpoints.find('span.i_s_labelpoint');
				
			$label_point.each(function(){
				
				//setting up variables for position
				var $this = $(this),
					type = $this.data('type'),
					pos_left = $this.data('x'),
					pos_top = $this.data('y');
				
				$this.css({
					'display':'inline-block',
					'font': 'normal 11px/14px Verdana, sans-serif',
					'text-align': 'center',
					'text-transform': 'uppercase',
					'letter-spacing' : '1px',
					'color': '#fff',
					'padding': '3px 4px',
					'width': '38px',
					'background' : '#000',
					'border' : '1px solid #000',
					'position' : 'absolute',
					'z-index' : 100,
					'top' : pos_top + 'px',
					'left' : pos_left + 'px'
				});
				
			});
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_data_points() {
						
			//styling for datapoint set
			$datapoints.css({
				'position': 'absolute',
				'top': 0,
				'left': '0px',
				'z-index': 3,
				'width': '100%'
			});
			
			
			
			$datapoints.find('div.i_s_datapoint').each(function(){
				

				// setting variables for position and measurements
				var $this = $(this),
					point_html = '',
					$plotter = null,
					pos_left = $this.data('x'),
					pos_top = $this.data('y'),
					offset = $this.data('offset'),
					bg_image = $this.data('src'),
					bg_pos = $this.data('bg-pos'),
					line_length = 15,
					line_width = 1,
					point_diameter = 10;
				

				// create point
				point_html += '<div class="i_s_point_plotter">';
				point_html +=	'<span class="i_s_point"></span>';
				point_html +=	'<div class="i_s_line_container">';
				point_html +=		'<div class="i_s_line i_s_left"></div>';
				point_html +=		'<div class="i_s_line i_s_center"></div>';
				point_html +=		'<div class="i_s_line i_s_right"></div>';
				point_html +=	'</div>';
				point_html += '</div>';
				
				//append plotter to each data point
				$this.append( point_html );

				// set pointer
				$plotter = $this.find('.i_s_point_plotter');
									
				//style and position point plotter
				if ( pos_left <= 68 ) {
					$plotter.css({
						'position': 'absolute',
						'left': 0,
						'top': 0
					});
				} else {
					$plotter.css({
						'position': 'absolute',
						'left': -20,
						'top': 0
					});
				}

				$plotter.find('span.i_s_point').css({
					'width': point_diameter + 'px',
					'height': point_diameter + 'px',
					'border-radius': '50%',
					'background': '#000',
					'position': 'absolute',
					'left': 0,
					'top': 0
				});
				
				$plotter.find('.i_s_line_container').css({
					'position': 'absolute',
					'top': Math.floor(point_diameter/2) +'px',
					'left': point_diameter + 'px'
				});
				
				if ( pos_left <= 68 ) {
					var offset_w = line_length,
						max_width = 490;
				} else {
					var offset_w = line_length + 10,
						max_width = 467;
				}
				
				$plotter.find('.i_s_line').css({
					'height': line_width + 'px',
					'width': offset_w + 'px',
					'background': '#000000',
					'position': 'absolute',
					'top': '0',
					'left': '0'
				});

				
				
				$plotter.find('.i_s_line.i_s_center').css({
					'left': offset_w + 'px',
					'width': line_width + 'px',
					'height': Math.abs(offset) + 'px'
				});
				
				if (offset < 0) {
					$plotter.find('.i_s_line.i_s_center').css({
						'top': offset + line_width + 'px'
					});
				} else {
					$plotter.find('.i_s_line.i_s_center').css({
						'top': 0
					});
				}

				$plotter.find('.i_s_line.i_s_right').css({
					'left': offset_w + 'px',
					'top': offset + 'px'
				});
			
				//set up basic styling for default view
				$this.css({
					'display':'block',
					'position': 'absolute',
					'left': pos_left + 'px',
					'top': pos_top + 'px',
					'width': '100%',
					'z-index':'1',
					'cursor': 'pointer'
				});


				
				$this.find('.i_s_body').css({
				
					'position': 'absolute',
					'padding' : _datapoint_body_padding +  'px',
					'left': (2 * line_length) + point_diameter + 'px',
					'top': offset - _datapoint_body_padding + 'px',
					'max-width': max_width + 'px',
					//'background-image': 'url("' + bg_image + '")',
					//'background-repeat': 'no-repeat',
					//'background-position': 'right ' + bg_pos + 'px',
					'z-index':'2'
					
				});
				
				if ( $this.data('src').length > 1 ) {
					$this.find('.i_s_body').css({
						'padding-right' : '5px',
						'background-image': 'url("' + bg_image + '")',
						'background-repeat': 'no-repeat',
						'background-position': 'right ' + bg_pos + 'px',
					});
				}
								
				$this.find('.i_s_body h3').css({
					'font': 'normal 16px/20px Georgia, serif',
					'margin': '2px 0 0'
				});
				
				$this.find('.i_s_body h5').css({
					'font': 'normal 11px/13px Verdana, arial, sans-serif',
					'text-transform':'uppercase',
					'color': '#999',
					'margin': 0
				});
				
				//make sure we're not showing the details of each point
				$this.find('.i_s_detail').css({
					'display':'none'
				});

				var $thisbody = $this.find('.i_s_body');

				
				// attach mouseenter
				$this.off('mouseenter').on('mouseenter', function(){

					if ($this.hasClass('i_s_active')) return false;
					
					$this.css('z-index', '20');
					$this.find('.i_s_body').addClass('i_s_hovering');
					
					$this.find('.i_s_body.i_s_hovering').css({
						'background-color': '#fff',
						'-moz-box-shadow': '0 0 5px #666',
						'-webkit-box-shadow': '0 0 5px #666',
						'box-shadow': '0 0 5px #666',
						'z-index':'3',
						'cursor': 'pointer'
					});

					$plotter.find('.i_s_line, .i_s_point').css({
						'background': _cur_color_scheme
					});

				});
				
				//attach mouseleave
				$this.off('mouseleave').on('mouseleave', function(){

					$this.css('z-index', '1');
					$this.find('.i_s_body').removeClass('i_s_hovering');
					
					$this.find('.i_s_body').css({
						'background-color': 'transparent',
						'-moz-box-shadow': 'none',
						'-webkit-box-shadow': 'none',
						'box-shadow': 'none',
						'z-index':'3'
					});

					if (!$this.hasClass('i_s_active')) {
						$plotter.find('.i_s_line, .i_s_point').css({
							'background': '#000000'
						});

						$plotter.find('.i_s_point').css({
							'width' : '10px',
							'height' : '10px',
							'top' : '0',
							'left' : '0'
						});
					}
					
				});


				// attach click event
				$this.off('click').on('click', function(){

					_launch_datapoint_details.call( this );

					$plotter.find('.i_s_line, .i_s_point').css({
						'background': _cur_color_scheme
					});

					$plotter.find('.i_s_point').css({
						'width' : '16px',
						'height' : '16px',
						'top' : '-4px',
						'left' : '-4px'
					});
					//alert('click');

				});
				

				
			});

			// attach keyboard navigation

			// keyboard arrows
			$(document).keydown(function(e){
				
				if (e.keyCode == 37) { // left arrow
					_goto_prev_datapoint();
					return false;

				} else if (e.keyCode == 39) { // right arrow
					_goto_next_datapoint();
					return false;

				} else if (e.keyCode == 27) { // escape key
					_close_datapoint();
				}
			});
			
		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _reveal_first_datapoint() {

			var $cur = $datapoints.find('div.i_s_datapoint.i_s_first');

			if ($cur.length < 1) return false;

			$cur.trigger('click');

		}
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _goto_next_datapoint() {

			var $cur = $datapoints.find('div.i_s_datapoint.i_s_active');

			if ($cur.length < 1) return false;

			var $next = $cur.next();

			if ($next.length < 1) return false;

			$next.trigger('click');

		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _goto_prev_datapoint() {

			var $cur = $datapoints.find('div.i_s_datapoint.i_s_active');

			if ($cur.length < 1) return false;

			var $prev = $cur.prev();

			if ($prev.length < 1) return false;

			$prev.trigger('click');

		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _launch_datapoint_details() {

						
			var $this = $(this),
				datapoint_content = $this.find('.i_s_body').html(),
				detail_window_html = '',
				$detail_window = $obj.find('.i_s_detail_window'),
				pos_left = $this.data('x'),
				//pos_top = $this.data('y'),
				offset = $this.data('offset'),
				$vidframe = $obj.find('div.i_s_visible_video').find('div.i_s_video_frame')
				;
				if ($this.hasClass('i_s_bottom')) {
					var pos_top = $this.data('y-alt'),
						arrow_pos = 'bottom'
					;
				} else {
					var pos_top = $this.data('y'),
						arrow_pos = 'top'
					;
				}

			// add another wrapper around body content
			datapoint_content = '<div class="i_s_content_wrapper">' + datapoint_content + '</div>';


			// add datapoint content
			$detail_window.find('.i_s_detail_contents').html( datapoint_content );

			// swap img src
			$detail_window.find('img').each(function(){
				var $img = $(this);

				if ($img.attr('src').length < 1 && $img.data('src').length > 1) {
					$img.attr('src', _img_path + $img.data('src'));
				}

				if ( $img.data('caption').length > 1) {

					$detail_window.find('.i_s_full_size_img').css({
						'font': 'normal 10px/12px Verdana,Arial,sans-serif',
						'padding-top': 5,
						'color': '#666',
						'text-align' : 'left'
					});
					$detail_window.find('.i_s_full_size_img').find('img').css({
						'width': '470px'
					});

				
					var caption_text = $img.data('caption'),
						caption_html = '<span style="padding-top: 3px;display: block;">' + caption_text + '</span>';
						
					$img.after(caption_html);

				}
			});

			// make sure all links are target blank
			$detail_window.find('a').each(function(){
				var $link = $(this);
				$link.attr('target','_blank');
			});
			
			//init tweets
			_init_tweets( $detail_window );

			//load youtube embeds (for autoplay)
			_init_video_frame( $detail_window );

			//style contents
			_style_detail_window();

			// attach click events to close_btn
			$detail_window.find('.i_s_close_btn').off('click').on('click', _close_datapoint );
			
			// attach click events to prev_next_buttons
			$detail_window.find('.i_s_timeline_nav .i_s_next').off('click').on('click', _goto_next_datapoint );
			$detail_window.find('.i_s_timeline_nav .i_s_prev').off('click').on('click', _goto_prev_datapoint );
			
			// hide prev_next_buttons for first or last datapoint
			if ( $this.hasClass('i_s_last') ) { 
				$detail_window.find('.i_s_timeline_nav .i_s_next').hide(); 
			} else {
				$detail_window.find('.i_s_timeline_nav .i_s_next').show(); 
			}
			if ( $this.hasClass('i_s_first') ) { 
				$detail_window.find('.i_s_timeline_nav .i_s_prev').hide(); 
			} else {
				$detail_window.find('.i_s_timeline_nav .i_s_prev').show(); 
			}


			// mark all other datapoints as inactive
			$datapoints.find('div.i_s_datapoint').removeClass('i_s_active');

			// mark this datapoint as being active
			$this.addClass('i_s_active');

			if ( !$detail_window.hasClass('window_open') ) {
				_reveal_datapoint( $this, $detail_window, arrow_pos );
			} else {
				_change_datapoint( $this, $detail_window, arrow_pos );
			}

			// trigger mouseleave on all the datapoints
			$datapoints.find('div.i_s_datapoint').each(function(){
				$(this).trigger('mouseleave');
			});
			
			$vidframe.html('').hide();
		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _close_datapoint() {
		
			
			var $detail_window = $obj.find('.i_s_detail_window');

			$detail_window.parent().find('img.i_s_thumbnail').show();
			$detail_window
				.removeClass('window_open')
				.hide();

			$detail_window.find('.i_s_detail_contents').html('');

			// mark all other datapoints as inactive
			$datapoints.find('div.i_s_datapoint').removeClass('i_s_active');

			// trigger mouseleave on all the datapoints
			$datapoints.find('div.i_s_datapoint').each(function(){
				$(this).trigger('mouseleave');
			});
			
			//_re_init_video();
		}



		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _get_expanded_datapoint_properties( $this, $detail_window ) {

			if ($this.hasClass('i_s_bottom')) {
				var pos_top = $this.data('y-alt');
			} else {
				var pos_top = $this.data('y');
			}
			
			var obj = {},
				//pos_top = $this.data('y'),
				pos_left = $this.data('x'),
				new_body_position = $this.find('.i_s_body').position(),
				new_content_height = $detail_window.find('.i_s_detail_contents').height(),
				container_height = $obj.height(),
				top_offset = 0;

			// determine height
			obj.height = new_content_height;

			// determine left
			obj.left = pos_left + new_body_position.left;

			// determine top
			obj.top = pos_top + new_body_position.top;

			// determine arrow top
			obj.arrow_top = 3;

			// determine destination top

			obj.dest_top = obj.top;

			top_offset = container_height - (obj.top + obj.height);

			if ( top_offset < 80 ) {
				obj.dest_top = obj.top + top_offset - 80;
				obj.arrow_top = (top_offset - 80 - 3) * -1;
			}

			return obj;

		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _change_datapoint( $this, $detail_window, arrow_pos ) {

			var properties = _get_expanded_datapoint_properties( $this, $detail_window, arrow_pos );

			$detail_window.stop();

			//hide old contents
			$detail_window.find('.i_s_detail_contents').css({
				'opacity': 0
			});
			
			$detail_window
				.stop()
				.animate({
					'top' : ( properties.dest_top - 5 ) + 'px'
					//'height' : properties.height + 'px'
				},
				{
					'duration' : 150,
					'complete' : function () {

						$detail_window.css('overflow','visible');
						_center_datapoint_vertically( $detail_window );

					}
				});
				
			//reveal new contents
			$detail_window.find('.i_s_detail_contents')
				.stop()
				.animate({
					'opacity' : 1
				},
				{
					'duration' : 150
				});

			$detail_window.find('.i_s_close_btn').show();

			var pos_arrow = {};
			pos_arrow[arrow_pos] = '7px';

 			if ($this.hasClass('i_s_bottom')) {
				$detail_window.find('span.i_s_arrow').css('top','')
 			} else {
				$detail_window.find('span.i_s_arrow').css('bottom','')
 			}

			$detail_window.find('span.i_s_arrow')
				.stop()
				.css('opacity', 0)
				.css(pos_arrow)
				.animate({
					arrow_pos : '7px'
				},{
					'duration' : 150,
					'complete' : function () {
						$detail_window.find('span.i_s_arrow')
							.stop()
							.animate({'opacity':1},{'duration':300});
					}
				});
		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _reveal_datapoint( $this, $detail_window, arrow_pos ) {

			// find initial heights & positions
			var initial_height = $this.find('.i_s_body').height(),
				initial_width = $this.find('.i_s_body').width(),
				properties = _get_expanded_datapoint_properties( $this, $detail_window, arrow_pos );

			$detail_window.stop();

			if ($this.hasClass('i_s_first')) {
				var detail_top = '290px';
			} else {
				var detail_top = ( properties.top - 5 ) +'px';
			
			}

			// position detail window
			$detail_window.css({
				'display': 'block',
				'width': '490px',
				//'height': '658px',
				//'height': initial_height + 'px',
				'top' : detail_top,
				'left' : '115px'
			});

			properties = _get_expanded_datapoint_properties( $this, $detail_window, arrow_pos );

			// animate window
			$detail_window
				.stop()
				.animate({
					'width' : '490px',
					//'height': '658px',
					//'height' : properties.height + 'px',
					'top' : detail_top
				},
				{
					'duration' : 150,
					'complete' : function () {

						$detail_window.addClass('window_open');
						$detail_window.find('.i_s_close_btn').css({
							'display': 'block'
						});

						_center_datapoint_vertically( $detail_window );
					}
				});

			var pos_arrow = {};
			pos_arrow[arrow_pos] = '7px';

 			if ($this.hasClass('i_s_bottom')) {
				$detail_window.find('span.i_s_arrow').css('top','')
 			} else {
				$detail_window.find('span.i_s_arrow').css('bottom','')
 			}

			$detail_window.find('span.i_s_arrow')
				.stop()
				.css('opacity', 0)
				.css(pos_arrow)
				.animate({
					arrow_pos : '7px'
				},{
					'duration' : 150,
					'complete' : function () {
						$detail_window.find('span.i_s_arrow')
							.stop()
							.animate({'opacity':1},{'duration':300});
					}
				});
		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		function _center_datapoint_vertically( $jquery_obj ) {

			return false;

			// vars
			var total_height = $jquery_obj.outerHeight(),
				window_height = $(window).height(),
				$header = $('header.global'),
				header_offset = 0,
				duration = 200,
				new_scrolltop = 0;
			
			// is there a header on the page?
			if ($header.length > 0) header_offset = $header.height() + 20;
			
			// vertically align?
			if (total_height < window_height) {
				
				// scroll page so that module will be vertically centered
				new_scrolltop = ($jquery_obj.offset().top - Math.round((window_height - total_height) / 2)) - header_offset;

			} else {
				
				// scroll page so that module begins at top of page
				new_scrolltop = $jquery_obj.offset().top - header_offset;
			}
			
			// animate scroll
			$('html,body').stop().animate(
				{
					'scrollTop' : new_scrolltop
				},
				{
					'duration' : duration
				}
			);

		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _style_detail_window() {
			
			var $detail_window = $obj.find('.i_s_detail_window');

			$detail_window.css({
				'width' : '490px',
				'z-index': 10,
				'position' : 'absolute',
				'background' : "#fff",
				'-moz-box-shadow': '0 0 5px #666',
				'-webkit-box-shadow': '0 0 5px #666',
				'box-shadow': '0 0 5px #666',
				'border': '1px solid #ddd'
			});

			$detail_window.find('.i_s_content_wrapper').css({
				'padding' : _datapoint_body_padding + 'px'
			});
			
			$detail_window.find('span.i_s_arrow').css({
				'width': '20px',
				'height': '26px',
				'position': 'absolute',
				'left': '-20px',
				//'top': '7px',
				'background': 'url("'+ _img_sprite +'") no-repeat 3px 0px'
			});

// 			if ($('div.i_s_datapoint').hasClass('i_s_bottom')) {
// 				$detail_window.find('span.i_s_arrow').css({'bottom' : '7px'});
// 			} else {
// 				$detail_window.find('span.i_s_arrow').css({'top' : '7px'});
// 			}
			
			$detail_window.find('.i_s_detail_contents').css({
				'width' : '490px',
				'overflow': 'hidden'
			});
			
			$detail_window.find('.i_s_detail').css({
				'display': 'block',
				'width' : '480px',
				'overflow': 'hidden',
				'font': 'normal 14px/17px Georgia, serif'
			});
			
			$detail_window.find('.i_s_detail a').css({
				'color': '#0F2D5F'
			});
			
			$detail_window.find('h3').css({
				'font': 'bold 18px/22px Georgia, serif',
				'margin': '10px 0 0'
			});
			
			$detail_window.find('.i_s_copy img').css({
				'float': 'right',
				//'border': '3px solid #ededed',
				'margin': '0 0 0 10px',
				'padding-right': '10px',
				'width':'200px'
			});
			
			$detail_window.find('ul.i_s_product_specs').css({
				'list-style-type':'none',
				'padding': '0',
				'margin-top': '10px'
			});
			$detail_window.find('ul.i_s_product_specs li h5').css({
				'margin': '0px 0 5px'
			});
			
			$detail_window.find('ul.i_s_product_specs li').css({
				'font': '12px/13px Georgia, serif',
				'margin': '3px 0'
			});
			
			
			$detail_window.find('ul.i_s_related_links').css({
				'list-style-type':'none',
				'padding': '0',
				'margin-top': '20px'
			});
			
			$detail_window.find('ul.i_s_related_links li').css({
				'font': 'bold 13px/15px Georgia, serif',
				'margin': '10px 0'
			});
			$detail_window.find('ul.i_s_related_links li a').css({
				'text-decoration': 'none'
			});
			
			$detail_window.find('ul.i_s_related_links li a:hover').css({
				'text-decoration': 'underline'
			});
			
			$detail_window.find('ul.i_s_tweets').css({
				'display': 'none'
			});
			
			$detail_window.find('.clear').css({
				'clear': 'both'
			});
			
			// style prev/next nav
			$detail_window.find('.i_s_timeline_nav').css({
				'font': 'normal 11px/14px Verdana, serif',
				'text-transform': 'uppercase',
				'color': '#999',
				'float': 'right',
				'margin-right' : '30px',
				'position' : 'absolute',
				'top': '7px',
				'right': '-10px'
			});
			
			$detail_window.find('.i_s_timeline_nav .i_s_prev').css({
				//float: 'right',
				//'margin-right': '5px',
				'cursor': 'pointer'
			});
			
			$detail_window.find('.i_s_timeline_nav .i_s_next').css({
				//float: 'right',
				'cursor': 'pointer'
			});
			
			$detail_window.find('.i_s_timeline_nav span.i_s_nav_arrow').css({
				'background': 'url("'+ _img_sprite +'") no-repeat -30px 0',
				'width':'9px',
				'height':'12px',
				'display': 'inline-block',
				'margin-top': '3px'
			});
			
			$detail_window.find('.i_s_timeline_nav .i_s_next span.i_s_nav_arrow').css({
				'background-position': '-50px 0'
			});
			
			// style close_btn
			$detail_window.find('.i_s_close_btn').css({
				'display': 'none',
				'position': 'absolute',
				'width': '28px',
				'height': '28px',
				'background': 'url("'+ _img_sprite +'") no-repeat 0 -40px',
				'top': '-9px',
				'right': '-13px',
				'-webkit-border-radius': '50%',
				'-moz-border-radius': '50%',
				'border-radius': '50%',
				'cursor':'pointer'
			});
			
		}
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_video_frame( $detail_window ) {
			if ( $detail_window.find('.i_s_video').length < 1 ) return false;

			$detail_window.find('.i_s_video').css({
				'height': '273px',
				'background': '#fff'
			});


			$detail_window.find('.i_s_video').each(function(){
				var $this = $(this);
				
				var video_url = $this.data('video-url'),
					video_html = '';
				
				video_html += '<iframe width="480" height="270" src="' + video_url + '" frameborder="0" allowfullscreen></iframe>'

				$this.append(video_html);
			});
		
		}
			
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_tweets( $detail_window ) {
			
			//are there any tweets associated with this data point?
			
			// no, don't continue
			if ( $detail_window.find('ul.i_s_tweets').length < 1 ) return false;
			
			// yes, create structure for tweets
			var tweet_html = '',
				avatars_html = '';
								
			//add an avatar for each tweet
			$detail_window.find('ul.i_s_tweets li').each(function(){
				
				var $this = $(this);
				
				avatars_html += '<a href="'+ $this.data('tweet-url') +'" target="_blank">';
				avatars_html += '<img class="i_s_avatar" src="'+ $this.data('avatar-src') +'" alt="">';
				avatars_html += '</a>';
				
			});
		
			//create basic shell for tweets
			tweet_html += '<div class="i_s_tweet_previews">';
			tweet_html +=	'<h5>From around the web</h5>';
			tweet_html +=	'<div class="i_s_avatars">';
			tweet_html +=		avatars_html;
			tweet_html +=		'<div class="clear"></div>';
			tweet_html +=	'</div>';
			tweet_html +=	'<div class="i_s_tweet_detail"></div>';
			tweet_html += '</div>';
						
			// add this html to the detail window
			$detail_window.find('.i_s_detail_contents').append(tweet_html);
				
			//style tweet
			$detail_window.find('.i_s_tweet_previews').css({
				'display': 'block',
				'background': '#ededed',
				'list-style-type': 'none',
				'padding': '10px',
				'font': 'normal 12px/16px verdana, sans-serif',
				'color': '#000'
			});
			
			$detail_window.find('.i_s_tweet_previews h5').css({
				'font': 'normal 11px/13px Verdana, arial, sans-serif',
				'text-transform':'uppercase',
				'color': '#999',
				'margin': 0
			});
			
			$detail_window.find('.i_s_detail span.i_s_content a').css({
				'color': '#000'
			});
			
			//style avatars
			$detail_window.find('img.i_s_avatar').css({
				'width': '30px',
				'height': '30px',
				'float': 'left',
				'margin': '10px 5px 10px 0',
				'border' : '2px solid #ededed'
			});
		
			//attach mouseenter
			$detail_window.find('img.i_s_avatar').each(function(){
				
				var $this = $(this),
					src = $this.attr('src');
					
				$this.unbind('mouseenter').bind('mouseenter', function(){
					_change_tweet ( $detail_window, src );
					
				});
			});
			
			//attach leave
			$detail_window.find('img.i_s_avatar').unbind('mouseleave').bind('mouseleave', function(){
				console.log('leave');
			});
			
			
			// by default, show first tweet
			var src= $detail_window.find('ul.i_s_tweets li:first').data('avatar-src');
			
			_change_tweet( $detail_window, src );
			
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _reset_tweet( $detail_window ) {
			
			$detail_window.find('img.i_s_avatar').removeClass('i_s_active');
			
			$detail_window.find('img.i_s_avatar').css({
				'border' : '2px solid #ededed'
			});
			
			$detail_window.find('.i_s_tweet_detail').html('');
			
		}

		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _change_tweet( $detail_window, src ){
						
			//reset styling
			_reset_tweet( $detail_window );
			
			//change tweet
			
			//if desired tweet already visible, stop.
			
			// else
			
			//get variables
			var $target_tweet = $detail_window.find('ul.i_s_tweets li[data-avatar-src="'+ src +'"]'),
				$tweet_detail = $detail_window.find('.i_s_tweet_detail'),
				tweet_text = $target_tweet.html(),
				tweet_name = $target_tweet.data('tweet-name'),
				twitter_handle = $target_tweet.data('tweet-username'),
				datetime = $target_tweet.data('datetime'),
				tweet_url = $target_tweet.data('tweet-url'),
				tweet_detail_html = '';
						
			//set up selected tweet
			tweet_detail_html += '<p class="i_s_tweet_name">';
			tweet_detail_html +=	'<span class="i_s_tweet_name"><a href="http://twitter.com/' + twitter_handle + '" target="_blank">' + tweet_name + '</a></span>';
			tweet_detail_html +=	'<span class="i_s_twitter_handle"><a href="http://twitter.com/' + twitter_handle + '" target="_blank"> @' + twitter_handle + '</a></span>';
			tweet_detail_html += '</p>';
			tweet_detail_html += tweet_text;
			tweet_detail_html += '<p class="i_s_tweet_time">' + datetime + '</p>';
			
			var new_date = new Date(datetime);
			
			console.log( new_date );
			
			// add target tweet
			$detail_window.find('.i_s_tweet_detail').html(tweet_detail_html);
			
			//add active class to avatar shown
			$detail_window.find('img.i_s_avatar[src="'+ src +'"]').addClass('i_s_active');
			
			//style tweet
			$tweet_detail.find('p.i_s_tweet_name').css({
				'font-size': '12px',
				'color': '#000',
				'margin': 0,
				'font-weight' : 'bold'
			});
			
			$tweet_detail.find('p.i_s_tweet_name a').css({
				'text-decoration': 'none',
				'color': '#000'
			});
			
			$tweet_detail.find('span.i_s_content').css({
				'margin': '5px 0',
				'display': 'block'
			});
			
			$detail_window.find('.i_s_detail span.i_s_content a').css({
				'color': '#000'
			});
			
			$tweet_detail.find('span.i_s_twitter_handle').css({
				'font-size': '10px',
				'color': '#999',
				'font-weight': 'normal'
			});
			
			$tweet_detail.find('span.i_s_twitter_handle a').css({
				'color': '#999'
			});
			
			$tweet_detail.find('p.i_s_tweet_time').hide();

			$detail_window.find('img.i_s_avatar.i_s_active').css({
				'border': '2px solid #069EEC'
			});
			
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_bgs() {
			
			$bgs = $obj.find('div.i_s_backgrounds');
			
			$bgs.find('span.i_s_bg').each(function(){

				var $this = $(this),
					bg_html = '';
				
				if (!$this.hasClass('i_s_bg_initialized')) {
					
					bg_html += '<img src="' + _img_path + $this.data('img-src') +'" alt="">';
					
					$this
						.html( bg_html )
						.addClass('i_s_bg_initialized');
				}
			});
			
			// add styling
			$bgs.css({
				'position' : 'absolute',
				'z-index' : 1,
				'top' : '190px',
				'left' : 0
			});
			
			$bgs.find('span.i_s_bg').css({
				'position' : 'absolute',
				'top' : 0,
				'left' : 0
			});
			
			// reveal default bg
			_change_bg(
				$bgs.find('span.i_s_bg.i_s_default').data('id')
			);
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _change_bg( id ) {
			
			$bgs.find('span.i_s_bg')
				.show()
				.stop()
				.animate({
					'opacity' : 0
				},{
					'duration' : 300
				});
			
			var $target = $bgs.find('span.i_s_bg[data-id="'+ id +'"]');

			// set color scheme
			_cur_color_scheme = $target.data('color-scheme');
			
			$target
				.show()
				.stop()
				.css('opacity',0)
				.animate({
					'opacity' : 1
				},{
					'duration' : 300
				});
			
			_change_bg_control( id );
			
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _reset_bg_controls() {
			$controls.find('div.i_s_option')
				.removeClass('i_s_active')
				.css({
					'background-color' : '#fff',
					'color': '#666',
					'font-weight': 'normal',
					'text-transform': 'none',
					'text-decoration' : 'underline'
				});
				
			$controls.find('span.i_s_downarrow').hide();
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _change_bg_control( id ) {
			
			_reset_bg_controls();

			_close_datapoint();
			
			var $target = $controls.find('div.i_s_option[data-id="'+ id +'"]');
			
			$target.css({
				'background-color' : _cur_color_scheme,
				'color': '#fff',
				'font-weight': 'bold',
				'font-size': '10px',
				'text-transform': 'uppercase',
				'text-decoration' : 'none',
				'position': 'relative',
				'-webkit-border-radius': '3px',
				'-moz-border-radius': '3px',
				'border-radius': '3px'
			});

			$target.addClass('i_s_active');
			
			// determine which image sprite to use
			$target.find('span.i_s_downarrow').css({
				'background' : 'url("'+ _img_sprite +'") no-repeat '+ $target.find('span.i_s_downarrow').data('sprite-x') +'px 0'
			});

			$target.find('span.i_s_downarrow').show();
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		function _init_credit() {
			
			$credit = $obj.find('div.i_s_credit');
			
			$credit.css({
				'width' : $obj.data('width'),
				'height' : 30,
				'background-color' : '#fff',
				'position' : 'absolute',
				'left' : 0,
				'bottom' : 0,
				'z-index' : 3,
				'text-align' : 'right',
				'font-family' : 'Helvetica Neue, Helvetica, Arial',
				'font-size' : '11px',
				'line-height' : '18px',
				'color' : '#666666'
			});
			
			$credit.find('span.i_s_copy').css({
				'display' : 'block',
				'padding-top' : '5px',
				'padding-right' : '10px'
			});
			
			$credit.find('span.i_s_copy a').css({
				'color':'#666'
			});
		}
		
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

			return {
				init : _init
			};
		
	}($));
	
	return app; /* return augmented app object */
	
}( athletics || {}, jQuery )); /* import app if exists, or create new; import jQuery */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

jQuery(document).ready(function(){
	athletics.infostory.init();
});
