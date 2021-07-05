var prev = 0;
var next = 0;
var npp = 2;
function getThumbnails(page) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function() {
        if ( xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200 ) {
            console.log(xmlHttpRequest.responseText);
            let response = JSON.parse(xmlHttpRequest.responseText);
            console.log(response);
            for (let index = 0; index < response.results.length; index++) {
                const element = response.results[index];
                console.log(element.image_url)
                let name = element.name.split('.').slice(0, -1).join('.')
                addImage(element.image_url, name);
            }
            let paginate = response.pagination;
            if(typeof paginate !== 'undefined'){
                if(typeof paginate.next !== 'undefined'){
                    next = paginate.next;
                    document.getElementById("btn_next").style.display = "block";
                    // nextPage(next);
                } else document.getElementById("btn_next").style.display = "none";
                if (typeof paginate.previous !== 'undefined'){
                    prev = paginate.previous;
                    // document.getElementById("btn_next").style.display = "none";
                    document.getElementById("btn_prev").style.display = "block";
                    // prevPage(prev);
                } else document.getElementById("btn_prev").style.display = "none";
                    
            }
        }
    };
    xmlHttpRequest.open('GET', '/thumbnails?npp='+npp+'&page='+page, true);
    xmlHttpRequest.send();
}

function addImage(src, name) { 
    let el = document.createElement('li');
    let divElement = '<div class="details"><h3><a href="#">'+name+'</a></h3></div>';
    el.innerHTML = '<a href="#" style="background-image: url('+src+');"></a>'+divElement;
    let ul = document.getElementById('thumbnails-ul').appendChild(el);
}
getThumbnails(0);    

function prevPage(){
    document.getElementById('thumbnails-ul').innerHTML = '';
    getThumbnails(prev);    
}

function nextPage(){
    document.getElementById('thumbnails-ul').innerHTML = '';
    getThumbnails(next);    
}