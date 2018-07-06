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
            $("#clientName").html(response[0]);
            if(response != false) {
                for(var stock = 1; stock < response.length; stock++){ //response is an array here, NOT a json object
                    stockList+=response[stock] + ",";
                }
                //remove last comma
                stockList = stockList.substring(0, stockList.length - 1); 
                helperInfo.stockList = stockList; //make first api call when user logs in
                APICall(); //method in priceGrabberHelper.js
                recursiveAPICall(); //method in priceGrabberHelper.js
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
            $(".stockSearchContainer").css("display", "block");
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
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            })
        }
        else {
            $(".stockSearchContainer").css("display", "none");
        }
    })

    //add symbol to watch list
    $(".stockSearchContainer ul").on("click", "li", function() {
        var value = $(this).text().split("(");
        console.log("Value after split '(': " + value);
        var symbol = value[1];
        var stockSymbol = symbol.replace(")","");
        console.log("stockSymbol after replace ')'" + stockSymbol);
        $.ajax({
            url: "/addStockToWatchList",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({"symbol": stockSymbol}),
            success: function(response) {
                if(helperInfo.stockList == "") { //if new list 
                    $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                    "" + stockSymbol + ": $ ...  </button>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList = response;
                    recursiveAPICall(); //method in priceGrabberHelper.js
                }
                else if (!helperInfo.stockList.includes(stockSymbol)){ //if symbol isn't already listed
                    $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                    "" + stockSymbol + ": $ ... </button>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList += "," + response;
                    recursiveAPICall(); //method in priceGrabberHelper.js
                }
            },
            error: function(response) {
                console.log(response);
            }
        })
    });
    
    $(document).on('click', "button .btn btn-primary", function() {
        MakeChart(this.id);
        //show form to set buy/sell threshold
    });
    $(document).on('click', 'a', function() {
        $.ajax({
            url: "/priceThresholdMet_sendEmail",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({"token": token, "reason": "Sell FB"}),
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
    })
});
