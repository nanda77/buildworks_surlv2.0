var totalPages;
var currentPageCount;
function loadSlick() {
    $(".slides,.imgSlides").slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: false,
        cssEase: "linear",
        arrows: false,
    });
    
}
function getData(data, apiUrl) {
    $.ajax({
        type: "POST",
       // url: "http://www.share.buildworks.in/a8762fdb5d7bf561b832a358c22e9994",
        url: apiUrl,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        success: function (data, status, jqXHR) {
            totalPages = parseInt(data.data.pagelimit);
            currentPageCount = data.data.pagecount;
            console.log(data);
            setTitleData(data.data.work_data);
            setDataInBody(data.data.results);
            setSliderData(data.data.work_data);
            loadSlick();

        },

        error: function (jqXHR, status) {
            console.log(jqXHR);
            alert("fail" + " "+ status.code);
        },
    });

}

function setTitleData(data) {
    var element = $("<div class='element'></div>");
    element.append(`<div><p>${data.work_name}</p></div>`);
    $(".title").append(element)


}


function setDataInBody(data) {
    console.log("data", data);
    for (var i = 0; i < data.length; i++) {
        var section = $("<div>").addClass("section");
        setStatusRelatedToIssue(section, parseInt(data[i].is_issue));
        section.append(`
        <div class="card">
            <div class="cardHeader">
            <h1>${data[i].name}</h1>
            <p class="dueDate">${data[i].updates_time}  |  ${data[i].updates_date}</p>
            <img src="./images/ellipsis.png">
            </div>
            <p id="notes">${data[i].notes}</p>
        </div>`);
        if (parseInt(data[i].is_issue) == 1) {
            setIssueImages(section.find(".card"), data[i].updates_assets)
        }
        else if (parseInt(data[i].is_issue) == 2) {
            setIssueImagesResolved(section.find(".card"), data[i].updates_assets)
        }
        else if (parseInt(data[i].is_issue) == 3) {
            setPollImages(section.find(".card"), data[i].updates_assets);
        }
        else if (parseInt(data[i].is_issue) == 4) {
            setFileImages(section.find(".card"), data[i].updates_assets);
        }
        // else if (parseInt(data[i].updates_assets) == []) {
        //         setPollImages(section.find(".card"), data[i].updates_assets);
        //         alert ("no img");             
        // }
        else {
            setNormalImages(section.find(".card"), data[i].updates_assets, data[i]);
        }
        $(".comments").append(section);
    }
    if (currentPageCount < totalPages) {
        $(".comments").append(` <button  id="load" onClick='loadMoreData()'>Load More</button>`)
    }
}
function setSliderData(data) {
    var element = $("<div class='element'></div>");
    element.append(`<div>
    <p>Progress</p>
    <p>${data.total_progress}%</p>
   </div>`)
    element.append(`<div>
    <p>Start Date</p>
    <p>${new Date(data.start_date_plan).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
   </div>`)
    element.append(`<div>
    <p>End Date</p>
    <p>${new Date(data.end_date_plan).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
   </div>`)
    element.append(`<div>
    <p>Date Started</p>
    <p>${new Date(data.date_started).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
   </div>`)
    element.append(`<div>
    <p>Date Completed</p>
    <p>${new Date(data.date_ended).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
   </div>`);
    $(".slides").append(element)
}
function setStatusRelatedToIssue(section, issueId) {
    console.log(issueId);
    if (issueId == 0) {
        section.addClass("normal");
    } else if (issueId == 1) {
        section.addClass("issue");
    } else if (issueId == 2) {
        section.addClass("issue");
    } else if (issueId == 3) {
        section.addClass("poll");
    }else if (issueId == 4) {
        section.addClass("normal");
    }
}
function setPollImages(card, images) {
    var pollImageSection = $(`<div class="imgSection"> <div class="issueImgs"> </div> </div>`);
    images.map(item => {
        pollImageSection.find(".issueImgs").append(`<div class="issueImg">
        <div class="thumbnail">
            <p>POLL</p>
        </div>
        </div>`);
        pollImageSection.find('.issueImg').last().css('background-image', 'url(' + item.file_path + ')');
        
    });
    card.append(pollImageSection);
}
// function setIssueNotes(card, images) {
//     var issueNoImageSection = $(`<div class="noIssuesimg"><div class="imgSlides"></div>`)
//     issueNoImageSection.append(`<img id="issueIcon" src="images/Issue.png">`)
//     //card.append(issueImageSection)

// }
function setFileImages(card, images) {
    var fileImageSection = $(`<div class="imgSection"> <div class="fileImgs"> </div> </div>`);
    images.map(item => {
        fileImageSection.find(".fileImgs").append(`<div class="fileImg">
        <div class="thumbnail">
            <p>Download File: ${item.type}</p>
        </div>
        </div>`);
        fileImageSection.find('.issueImg').last().css('background-image', 'url(' + item.file_path + ')');
        
    });
    card.append(fileImageSection);
}

function setIssueImages(card, images) {
    var issueImageSection = $(`<div class="noIssues">
    <div class="imgSlides"></div>
    </div>`)
    images.map((item, index) => {
        issueImageSection.find(".imgSlides").append(` <div class="element ${index}">
            <img src="${item.file_path}">
            <div class="thumbnail" style="width:100%;background-color:#FEECEC">
            <p style="color: #594D77;
            float: left;
            width: 100%;">Issue Pending</p>
            </div>
         </div>`)// <img src="images/edit.svg" style="width:25px;    position: relative;//top: 10px;//left: 14px;" line182
         
    });
    
    issueImageSection.append(`<img id="issueIcon" src="images/Issue.png">`)
    card.append(issueImageSection)

}
function setIssueImagesResolved(card, images) {
    var issueImageSection = $(`<div class="noIssues">
    <div class="imgSlides"></div>
    </div>`)
    images.map((item, index) => {
        issueImageSection.find(".imgSlides").append(` <div class="element ${index}">
            <img src="${item.file_path}">
            <div class="thumbnail" style="width:100%;background-color:#EBFDF9">
            <p style="color: #594D77;
            float: left;
            width: 100%;">Resolved</p>
            </div>
         </div>`)// <img src="images/edit.svg" style="width:25px;    position: relative;//top: 10px;//left: 14px;" line182
         
    });
    issueImageSection.append(`<img id="issueIcon" src="images/Issue.png">`)
    card.append(issueImageSection)

}
function setNormalImages(card, images, data) {
    var imageSection = $(`<div class="noIssues">
    <div class="imgSlides"></div>
    </div>`)
    images.map(item => {

        item.type == "PANORAMA" ?
            setPanaroma(imageSection, item.file_path) :

            imageSection.find(".imgSlides").append(` <div class="element">
         <img src="${item.file_path}">  </div>`);

    })

    imageSection.append(`<div class="progressDetails">
    <img id="progress" src="images/progress.png">
    <p id="progressTxt">${data.progress}</p>
    <img id="users"  src="images/users.png">
    <p id="progressTxt">${data.no_workers}</p>
      </div>`)


    card.append(imageSection)
}

function setPanaroma(imageSection, imgPath) {
    console.log("paranomodsvj")
    imageSection.find(".imgSlides").append(` <div class="element">
    <div id="panorama"></div> </div>`);
    setTimeout(() => {
        pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": imgPath
        });
    }, 1000)
}


function getToken() {
        surl = window.location.href; //window.location.href;
        var id =  surl.substring(surl.lastIndexOf('/') + 1);
        //alert (surl);
        return id;
        
     
    }
getData({ pagecount: 1, token: getToken() }, "https://api.buildworks.in/v1/web-work-updates");
function loadMoreData() {
    console.log(currentPageCount, totalPages);
    if (currentPageCount < totalPages) {
        getData({ pagecount: currentPageCount + 1, token: getToken() }, "https://api.buildworks.in/v1/web-work-updatess");
        currentPageCount += 1;
        $("#load").hide()
    }  
    
// getData({ pagecount: 1, token: "a8762fdb5d7bf561b832a358c22e9994" }, "http://65.0.163.16/v1/web-work-updates");
// function loadMoreData() {
//     console.log(currentPageCount, totalPages);
//     if (currentPageCount < totalPages) {
//         getData({ pagecount: currentPageCount + 1, token: "a8762fdb5d7bf561b832a358c22e9994" }, "http://65.0.163.16/v1/web-work-updates");
//         currentPageCount += 1;
//         $("#load").hide()
//     }

}
