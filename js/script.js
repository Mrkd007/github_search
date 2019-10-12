function getUsersList(repositoryURL) {
    var apiData;
    $.ajax({
        type: 'GET',
        url: repositoryURL,
        success: function(data) {
            apiData = data;
            // console.log(apiData);
            return apiData;
        },
    });
}
var value;

$("#main_search").on('input',function(){
    $('.show-up-image').css('transform','translateY(0)');
    value = $('#main_search').val();
    if(value == '') {
        inputHasNoData();
        return;
    } else {
        inputHasData();
    }    
    // createDropDown(getUsersList('https://api.github.com/users/'+value));
    var userListURL = 'https://api.github.com/search/users?q='+value;
    // console.log('getUsersList(tempURL)',getUsersList(tempURL));
    // createDropDown(getUsersList(tempURL));
    var inputElement = '.main_search__input-field';
    $.ajax({
        type: 'GET',
        url: userListURL,
        success: function(data) {
            createDropDown(inputElement,data);
        },
    });
});

function createDropDown(inputElement,data) {
    var listString = '';
    for(key in data.items) {
        listString += `<li class="dropdown_list__list--item" onclick="getUserRepos('${data.items[key].login}')">${data.items[key].login}</li>`;
    }
    setTimeout(function() {
        var leftOfInput = $(inputElement).offset().left;
        var topOfInput = $(inputElement).offset().top;
        var widthOfInput = $(inputElement).width();
        var heightOfInput = $(inputElement).height();
        $('.dropdown_list').css({'height':'auto','top':(topOfInput + heightOfInput + 20)+'px','left':leftOfInput+'px','width':(widthOfInput+60) + 'px'});
        $('.dropdown_list__list').html(listString);
    },3e2);
}

function getUserRepos(userName) {
    $('.dropdown_list').css({'height':'0'});
    $('.dropdown_list__list').html('');
    var getrepoURL = 'https://api.github.com/users/'+userName+'/repos'
    $.ajax({
        type: 'GET',
        url: getrepoURL,
        success: function(data) {
            createCard(data);
        },
    });
}

function createCard(data) {
    $('.show-up-image').css('transform','translateY(-60vh)');
    $('.repo-list-container').css({'visibility':'visible'});
    console.log(data);
    var cardString = '';
    for(key in data) {
        // console.log(data[key]);
        cardString += `
        <div class="repo-list-card">
            <span class="title">${data[key].name}</span>
            <span class="clone-repo">${data[key].clone_url}<i class="material-icons card -copy-icon" title="Click here to copy the clone URL" onclick="copy()">file_copy</i></span>
            <span class="description">${data[key].description}</span>
            <span class="last-updated">${data[key].updated_at}</span>
        </div>`;
    }
    $('.repo-list-card-conatiner').html(cardString);
}

function inputHasData() {
    // $('.show-up-image').css('transform','translateY(-60vh)');
    $('.main_search-container').addClass('main_search-container--has-data');    
}

function inputHasNoData() {
    // $('.show-up-image').css('transform','translateY(0)');
    $('.main_search-container').removeClass('main_search-container--has-data');
    
    $('.dropdown_list').css({'height':'0'});
    $('.dropdown_list__list').html('');
    
    $('.repo-list-container').css({'visibility':'hidden'});
}