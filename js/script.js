// var gitAccountList = {};
// var repodetails = [];
    $("#main_search").keyup(function(){
        var value = $('#main_search').val();
        var repositoryURL = 'https://api.github.com/users/'+value+'/repos';
        $.ajax({
            type: 'GET',
            url: repositoryURL,
            success: function(data) {
                createCard(data); 
            },
        });
    });

    function createCard(data) {
        //console.log(data);
        for(key in data) {
            console.log(key);
        }
    }