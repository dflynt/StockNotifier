$(document).ready(function() {
    /*
    var address = "https://api.iextrading.com/1.0//stock/market/batch?symbols=aapl,fb,tsla,P,I,J,Q,U,W&types=quote";
    $.get(address, function(data) {
        console.log(data);
        $("#output").text(data);
    })
    */
   var url = window.location.pathname; //returns /dashboard/User's Token
   var token = url.split("/")[2];
   console.log(token);
   $.ajax({
        url: "/getStockListForUser",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({"token": token}),
        success: function(response) {
            console.log(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
    $("#autoCompleteInput").on("keyup", function(event){ 
        //keypress didn't print first value so use keyup
        var currentInput = $("#autoCompleteInput").val();
        if(currentInput.length > 0) {
            $.ajax({
                url: "/queryDBForSecurity",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({"input":currentInput}),
                success: function(response) {
                    $("#searchResultsList").css("display", "inline");
                    $("#searchResultsList").empty();
                    for(var x = 0; x < response.length; x++) {
                        var aTag = "<li class='stockResult_li'><a href='#' id='response[x][0]'>" + response[x][1] + " (" + response[x][0] + ")</a></li>"; 
                        $("#searchResultsList").append(aTag);
                        console.log(aTag);
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            })
        }
        else {
            console.log("display, none");
            $("#searchResultsList").css("display", "none");
            
        }
    })
    $(".stockSearchContainer ul").on("click", "li", function() {
        var value = $(this).text().split("(");
        var symbol = value[1];
        symbol = symbol.replace(")","");
        console.log(symbol);
        $.ajax({
            url: "/addStockToWatchList",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({"symbol": symbol}),
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        })
    });
});
