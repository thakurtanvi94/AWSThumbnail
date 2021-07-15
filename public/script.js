/**
 * Srcipt for making api call and updating elements on html page.
 */
var prev = 0; //previous page 
var next = 0; // next page
var npp = 5; //no of results per page.

/**
 * This method fetches the results of thumbnails informaiton. 
 * @param {*} page 
 */
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
                addImage(element.image_url.replace(/ /g, '%20'), name);
            }
            let paginate = response.pagination;
            if(typeof paginate !== 'undefined'){
                if(typeof paginate.next !== 'undefined'){
                    next = paginate.next;
                    document.getElementById("btn_next").style.display = "block";
                } else document.getElementById("btn_next").style.display = "none";
                if (typeof paginate.previous !== 'undefined'){
                    prev = paginate.previous;
                    document.getElementById("btn_prev").style.display = "block";
                } else document.getElementById("btn_prev").style.display = "none";
                    
            }
        }
    };
    xmlHttpRequest.open('GET', '/thumbnails?npp='+npp+'&page='+page, true);
    xmlHttpRequest.send();
}

/**
 * Add images to the thumbnail div
 * @param {string} src 
 * @param {string} name 
 */
function addImage(src, name) { 
    let thumbnailDiv = '<div class="col-lg-4 col-sm-6"><img class="img-thumbnail" src='+src+' alt="" style="width:100%;max-height: 100%;height:250px"><div class="figure-caption text-center" style="margin-top:4%"><p>'+name+'</p></div></div>'; 
    document.getElementById('thumbnails-div').innerHTML +=  thumbnailDiv;
}
getThumbnails(0);    

/**
 * Go to previous page
 */
function prevPage(){
    document.getElementById('thumbnails-div').innerHTML = '';
    getThumbnails(prev);    
}

/**
 * Go to next page
 */
function nextPage(){
    document.getElementById('thumbnails-div').innerHTML = '';
    getThumbnails(next);    
}
