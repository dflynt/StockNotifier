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
            var stockList = ""
            if(response != false) {
                for(var stock = 0; stock < response.length; stock++){
                    stockList+=response[stock] + ",";
                }
                //remove last comma
                stockList = stockList.substring(0, stockList.length - 1); 
                helperInfo.stockList = stockList; //make first api call when user logs in
                APICall();
                recursiveAPICall();
            }
        },
        error: function(response) {
            console.log(response);
        }
    });

    //function for autocomplete when searching for new stocks
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

            
        }
    })

    //add symbol to watch list
    $(".stockSearchContainer ul").on("click", "li", function() {
        var value = $(this).text().split("(");
        var symbol = value[1];
        symbol = symbol.replace(")","");
        $.ajax({
            url: "/addStockToWatchList",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({"symbol": symbol}),
            success: function(response) {
                if(helperInfo.stockList == "") {
                    $("#userStockList").append("<a href='#' class = stock id = " + symbol + ">" + 
                    "" + symbol + "$ ... </a><br>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList = response;
                    recursiveAPICall();
                }
                else {
                    $("#userStockList").append("<a href='#' class = stock id = " + symbol + ">" + 
                    "" + symbol + ": $  ... </a><br>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList += "," + response;
                    recursiveAPICall();
                }
            },
            error: function(response) {
                console.log(response);
            }
        })
    });

});
