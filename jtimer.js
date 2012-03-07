/**
 * @author Don Vawter
 */
(function($){
	$.fn.extend({
  		jTimer:function(method,_options){
  			var options={};
			var config={
				interval:1000,
				countdown:false,
				initialCountdown:0,
				showDays:false,
				showButtons:true,
				displayClass:"",
				autoStart:false,
				draggable:false,
				callback:null,
				callbackHandle:null,
				callbackInterval:1000,
				timerVals:{timerHandle:null,elapsedTime:0,isPaused:false,startTime:0}
			}
	 		$.extend(options,config);
			var init=function (_options,me){
				options=$.extend(options,_options);
				me.data("timerpluginoptions",options);
				makeHtml(me);
				if (options.draggable) {
					me.draggable();
				}
				if(!options.showButtons){
					me.children(".timerButtonGroup").hide();
				}
				if(options.autoStart){
					me.find(".timerStart").click();
				}
				
			}
			var initCallback=function(me){
				if(typeof (options.callback)==='function'){
					options.callbackHandle=setInterval(function(){
						me.data("timerpluginoptions").callback(me.jTimer("getElapsedTime"));
					},options.callbackInterval);
					
				}
			}
			var timerGuts = function(me){
				var options=me.data("timerpluginoptions");
				var elapsedTime = options.timerVals.elapsedTime;
				if (!options.timerVals.isPaused) {
					elapsedTime = options.timerVals.elapsedTime + (new Date()).getTime() - options.timerVals.startTime;
					options.timerVals.elapsedTime = elapsedTime;
	 			}
				options.timerVals.startTime = (new Date()).getTime();
				me.data("timerpluginoptions", options);	
				if(options.countdown){
					elapsedTime=options.initialCountdown*1000 -elapsedTime;
				}
				var et=Math.round(Math.abs(elapsedTime/1000));
				var dys=Math.floor(et/24/60/60);
				var hrs=Math.floor((et-dys*24*60*60)/60/60);		
				var mins=Math.floor((et-dys*24*60*60 -hrs*60*60)/60);
				var secs= et-dys*24*60*60 -hrs*60*60 -mins*60;	
				var st=options.showDays?dys+":":"";
				st+=(hrs>=10?(""+hrs):"0"+hrs)+":";	
				st+=(mins>=10?(""+mins):"0"+mins)+":";
				st+=(secs>=10?(""+secs):"0"+secs);
				if(elapsedTime <0 && options.countdown){
					st="-"+ st;
				}
				me.find(".timerDisplay").html(st);
			}
			var makeHtml = function(me){
				var st = "";
				st = '<div class ="timerDisplay"></div>';
				me.children(".timerDisplay,.timerButtonGroup").remove();
				me.append(st);
				me.find(".timerDisplay").html(options.showDays ? "0:00:00:00" : "0:00:00");
				if (options.displayClass) {
					me.children(".timerDisplay").addClass(options.displayClass);
				}
				st = '<div class="btn-group  timerButtonGroup"></div>';
				me.append(st);
				st = '<a href="#" class="btn timerStart"><i class="icon-play"></i></a>';
				st += '<span class="spacer">&nbsp;</span>';
				st += '<a href="#" class="btn timerPause"><i class="icon-pause"></i></a>';
				st += '<span class="spacer">&nbsp;</span>';
				st += '<a href="#" class="btn timerStop"><i class="icon-stop"></i></a>';
				me.children(".timerButtonGroup").append(st);
				me.find(".timerPause").attr("disabled", true);
				me.find(".timerStop").attr("disabled", true);
				me.find(".timerStart").bind("click touchstart", function(){
					var options = me.data("timerpluginoptions");
					//console.log(options);
					if (!$(this).attr("disabled")) {
						me.find(".timerStop").attr("disabled", false);
						me.find(".timerPause").attr("disabled", false);
						$(this).attr("disabled", true);
						var timerHandle = options.timerVals.timerHandle;
						var timerIsPaused = options.timerVals.isPaused;
						if (!timerHandle) {
							initCallback(me);
							me.find(".timerDisplay").html("0:00:00");
							options.timerVals.startTime = (new Date()).getTime();
							options.timerVals.elapsedTime = 0;
							options.timerVals.timerHandle = setInterval(function(){
								me.data("timerpluginoptions", options);
								timerGuts(me);
							}, options.interval);
							options.timerVals.isPaused = false;
							me.data("timerpluginoptions", options);
						}
						else 
							if (options.timerVals.isPaused) {
								options.timerVals.isPaused = false;
								me.data("timerpluginoptions", options);
							}
					}
				});
				me.find(".timerPause").bind("click touchstart", function(){
					var options = me.data("timerpluginoptions");
					//console.log(options);
					if (!$(this).attr("disabled")) {
						me.find(".timerStop").attr("disabled", false);
						me.find(".timerStart").attr("disabled", false);
						$(this).attr("disabled", true);
						options.timerVals.isPaused = true;
						me.data("timerpluginoptions", options);
					}
				});
				me.find(".timerStop").bind("click touchstart", function(){
					var options = me.data("timerpluginoptions");
					if (!$(this).attr("disabled")) {
						me.find(".timerStart").attr("disabled", false);
						me.find(".timerPause").attr("disabled", true);
						$(this).attr("disabled", true);
						clearInterval(options.timerVals.timerHandle)
						options.timerVals.timerHandle = null;
						me.data("timerpluginoptions", options);
					}
				});
			}
			if(method=="getElapsedTime"){
				return Math.round(this.data("timerpluginoptions").timerVals.elapsedTime/1000);
				}
			return this.each(function(){
				var me=$(this);
				if(method=="init"){
					init(_options,me);
				}
				if(method=="remove"){
					me.children(".timerDisplay,.timerButtonGroup").remove();
					clearInterval(me.data("timerpluginoptions").timerVals.timerHandle);
					clearInterval(me.data("timerpluginoptions").callbackHandle);
				}
				if(method=="setCountdownTime"){
					var options=me.data("timerpluginoptions");
					options.initialCountdown=_options;
					options.timerVals.elapsedTime=0;
					options.timerVals.startTime=(new Date()).getTime();
					me.data("timerpluginoptions",options);
					
				}
				
			});
		}
	})
})(jQuery);
