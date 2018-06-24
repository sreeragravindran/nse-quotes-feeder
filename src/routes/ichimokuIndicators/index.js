const MODULE_ID = "SRC/ROUTES/ICHIMOKUINDICATORS/"; 
const db = require('../../db');
const ViewModels = require('../../views/models')

// server is an express server object 
function registerRoutes(server){
    server.get("/stocks/ichimokuindicators", function(req, res){
        var viewModels = new Array();

        db.models.IntradayQuotes.getIchimokuIndicators()
        .then(stocksWithIndicators => {
            stocksWithIndicators.forEach(element => {
                viewModels.push(new ViewModels.IchimokuCloudViewModel().mapFrom(element)) 
            });
            res.send(viewModels);            
        })
        .catch(error => {
            console.error(MODULE_ID, error);
            res.status(500).send("internal server error");
        })
    })
}

module.exports = registerRoutes;