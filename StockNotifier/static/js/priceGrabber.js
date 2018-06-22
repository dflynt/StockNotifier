$(document).ready(function() {
    /*
    var address = "https://api.iextrading.com/1.0//stock/market/batch?symbols=aapl,fb,tsla,P,I,J,Q,U,W&types=quote";
    $.get(address, function(data) {
        console.log(data);
        $("#output").text(data);
    })
    */
    $("#autoCompleteInput").on("keyup", function(event){ 
        //keypress didn't print first value so use keyup
        var currentInput = $("#autoCompleteInput").val();
        if(currentInput.length != 0) {
            $.ajax({
                url: "/queryDBForSecurity",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({"input":currentInput}),
                success: function(response) {
                    $("#searchResultsList").empty();
                    for(var x = 0; x < response.length; x++) {
                        var aTag = "<li class='stockResult_li'><a href='#'>" + response[x][1] + " (" + response[x][0] + ")</a></li>"; 
                        $("#searchResultsList").append(aTag);
                        console.log(aTag);
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            })
        }
    })
    $(".stockResult_li").on("click", function(event) {
        
    })
});
