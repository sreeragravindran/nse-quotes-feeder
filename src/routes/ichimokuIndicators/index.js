const MODULE_ID = "SRC/ROUTES/ICHIMOKUINDICATORS/"; 
const db = require('../../db');
const ViewModels = require('../../views/models')

// server is an express server object 
function registerRoutes(server){
    server.get("/stocks/ichimoku", function(req, res){
        var viewModels = new Array();

        db.models.IntradayQuotes.getIchimokuIndicators()
        .then(stocksWithIndicators => {
            stocksWithIndicators.forEach(element => {
                var vm = new ViewModels.IchimokuCloudViewModel().mapFrom(element);
                viewModels.push(vm);
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