function getThumbnails() {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function() {
        if ( xmlHttpRequest.readyState == XMLHttpRequest.DONE && xmlHttpRequest.status == 200 ) {
            console.log(xmlHttpRequest.responseText);
            let response = JSON.parse(xmlHttpRequest.responseText);
            for (let index = 0; index < response.length; index++) {
                const element = response[index];
                console.log(element.image_url)
                let name = element.name.split('.').slice(0, -1).join('.')
                addImage(element.image_url, name);
            }
        }
    };
    xmlHttpRequest.open('GET', '/thumbnails', true);
    xmlHttpRequest.send();
}

function addImage(src, name) { 
    let el = document.createElement('li');
    let divElement = '<div class="details"><h3><a href="#">'+name+'</a></h3></div>';
    el.innerHTML = '<a href="#" style="background-image: url('+src+');"></a>'+divElement;
    let ul = document.getElementById('thumbnails-ul').appendChild(el);
}
getThumbnails();