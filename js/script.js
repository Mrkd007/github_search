var value,serachedUserList = [];
$('.error_message-container').fadeOut();

$("#main_search").on('input',function(){
    $('.repo-list-container').css({'transform':'translateY(60vh)','visibility':'hidden'});
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
    }).fail(function (jqXHR, textStatus, error) {
        // Handle error here
        var errMessage = JSON.parse(jqXHR.responseText).message + '<br><br> Please refresh the page to continue';
        $('.err_message').html(errMessage);
        $('.error_message-container').fadeIn();
    });
});

$("#main_search").on("keypress", function(e) {
    if (e.keyCode == 13) {
        checkValidUser();
    }
});

function checkValidUser() {
    value = $('#main_search').val();
    if(serachedUserList.indexOf(value) != -1) {
        getUserRepos(value);
    } else {
        var errMessage = 'Please enter a valid github username(case sensitive) or choose from the dropdown';
        $('.err_message').html(errMessage);
        $('.error_message-container').fadeIn();
    }
}

function createDropDown(inputElement,data) {
    $('.repo-list-container').css({'transform':'translateY(60vh)','visibility':'hidden'});
    $('.show-up-image').css('transform','translateY(0)');
    if(value == '') {
        inputHasNoData();
        return;
    } else {
        inputHasData();
    }
    
    var listString = '';
    serachedUserList = [];
    for(key in data.items) {
        serachedUserList.push(data.items[key].login);
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
    $('#main_search').val(userName);
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
    $('.repo-list-container').css({'transform':'translateY(0vh)','visibility':'visible'});
    // console.log(data);
    var cardString = '';
    for(key in data) {
        // console.log(data[key]);
        cardString += `
        <div class="repo-list-card">
            <span class="title">${data[key].name}</span>
            <span class="clone-repo-wrapper">
                <span class="clone-repo" id=clone_repo_${key}>${data[key].clone_url}</span>
                <i class="material-icons card-copy-icon" title="Click here to copy the clone URL" onclick="copy('clone_repo_${key}')">file_copy</i>
            </span>
            <span class="description">${checkValidDesp(data[key].description)}</span>
            <span class="last-updated">Last Updated at : ${convertLocalDate(data[key].updated_at)}</span>
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
    
    $('.repo-list-container').css({'transform':'translateY(60vh)','visibility':'hidden'});
}

function checkValidDesp(description) {
    if(description != null) {
        return description;
    } else {
        return 'No description available';
    }
}

function convertLocalDate(oldDate) {
    var date = new Date(oldDate);
    date = date.toLocaleString();
    return date;
}

function copy(element_id) {
    var aux = document.createElement("div");
    aux.setAttribute("contentEditable", true);
    aux.innerHTML = document.getElementById(element_id).innerHTML;
    aux.setAttribute("onfocus", "document.execCommand('selectAll',false,null)"); 
    document.body.appendChild(aux);
    aux.focus();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert('url copied');
}

function hideError() {
    $('#main_search').val('');
    $('.error_message-container').fadeOut();
    inputHasNoData();
}