/*function giveGoodSource(type)
{
    var songSource = document.getElementById('lyricSource');
    songSource.src += '.' + type;
}*/

function formatStringTime(stringTime){
    var arrayMinuteSecond = stringTime.split(':');
    var nbMinute = parseFloat(arrayMinuteSecond[0]);
    var arraySecondMillisecond = arrayMinuteSecond[1].split('.');
    var nbSecond = parseFloat(arraySecondMillisecond[0]);
    var nbMillisecond = parseFloat(arraySecondMillisecond[1]);

    //console.log(nbMinute, nbSecond, nbMillisecond);

    return parseFloat(60*nbMinute + nbSecond + parseFloat(nbMillisecond/1000));
}

function addTimeSpeech(line) {
    var time = line.match(/\[.+?(?=])/)[0];
    time = time.replace(/\[/, '');
    var lyrics = line.replace(/\[.+?(?=])/, '');
    lyrics = lyrics.replace(/]/, '');

    var intTime = formatStringTime(time);

    arrayTime[intTime] = lyrics;
}

function fileIsLoaded(fileTxt){
    var arrayTxt = fileTxt.split('\n');

    arrayTxt.map(addTimeSpeech);

    console.log(arrayTime);

    document.getElementById('song').addEventListener('timeupdate', function (e) {
        //console.log(this.currentTime);
        changeLyrics(this.currentTime);
    })

    //giveGoodSource(arrayTxt[0]);
}

function changeTextOrLyrics(newText){
    var lyrics;

    if (newText.search(/\[music]/) !== -1){
        newText = newText.replace('[music]', '');
        lyrics = document.getElementById('lyrics');
    }else{
        lyrics = document.getElementById('songUndertitle');
    }

    lyrics.innerHTML = newText;
}

function changeLyrics(songTime){
    var currentLyrics = '';
    //var elderKey;
    for (var key in arrayTime){
        if (songTime > key){
            currentLyrics = arrayTime[key];
        }else{
            break;
        }
        //elderKey = key;
    }

    //console.log(currentLyrics, currentLyrics.search(/\[music]/));
    currentLyrics.split('[both]').map(changeTextOrLyrics);
}

function getTxtFile(){
    var request = new XMLHttpRequest();
    request.open("GET", 'web/karaokeFiles/lyrics.txt');//
    request.onload = function(e) {
        ret = request.responseText;
        fileIsLoaded(ret);
    };
    request.send();
    return ret;
}

var ret ='';
var arrayTime = {};

window.onload = function () {
    getTxtFile();

    document.addEventListener('keypress', function (e) {
        if (e.charCode === 32){
            var song = document.getElementById('song');
            if (song.paused){
                song.play();
            }else{
                song.pause();
            }
        }
    })
};