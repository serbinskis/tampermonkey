// ==UserScript==
// @name         Presto Autoschool Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip online lessons in Presto autoschool
// @author       Serbinskis
// @match        https://presto.lv/profils/teorijas-nodarbibas-grafiks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=presto.lv
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        none
// @require      https://www.example.com/some/js/GM_fetch.js
// ==/UserScript==

async function waitElement(cb) {
    while (!cb()) { await new Promise(resolve => setTimeout(resolve, 10)); }
    return cb();
}

async function register_time(event, time_id, video_id, seen_now, video_duration) {
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: "/js/video_learning.php",
            data: {
                action: 'register_event',
                event: event,
                lesson_time_id:	time_id,
                br_id: br_id,
                video_id: video_id,
                seen: seen_now,
                video_duration:	video_duration,
                lang: lang
            },
            dataType: 'json',
            cache: false,
            async: true,
            success: resolve
        });
    });
}

async function getVideoData() {
    var lesson_time_id = $(".shedule_user.active").attr('time_id');
    var video = document.querySelector("div.video_frame > video");

    var active_lesson_video_id = (await (await fetch("https://presto.lv/js/video_learning.php", {
      "headers": { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
      "body": `action=get_video_lesson_content&lesson_time_id=${lesson_time_id}&video_id=0&br_id=${br_id}&lang=lv`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })).json())["active_lesson_video_id"];

    return { active_lesson_video_id: active_lesson_video_id, currentTime: Math.floor(video.currentTime), duration: Math.floor(video.duration) }
}

async function skipLesson() {
    var video = document.querySelector("div.video_frame > video");
    var { active_lesson_video_id, currentTime, duration } = await getVideoData();
    var lesson_time_id = $(".shedule_user.active").attr('time_id');
    $("div.video_frame > video").replaceWith($("div.video_frame > video").clone());

    register_event('play', lesson_time_id, active_lesson_video_id, currentTime, duration);
    await new Promise(resolve => setTimeout(resolve, 1000))

    for (var i = currentTime; i < duration; i++) {
        await register_time('seen', lesson_time_id, active_lesson_video_id, i, duration);
        document.querySelector("div.video_frame > video").currentTime = i;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    register_event('ended', lesson_time_id, active_lesson_video_id, duration, duration);
}

(async () => {
    await waitElement(() => document.querySelector('.botton_slide_title.call_calculator'));
    await new Promise(resolve => setTimeout(resolve, 100));
    $('.botton_slide_title.call_calculator').off()
    $('.botton_slide_title.call_calculator span')[0].innerText = "SKIP THIS SHIT";
    $('.botton_slide_title.call_calculator').on('click', skipLesson);
})();
