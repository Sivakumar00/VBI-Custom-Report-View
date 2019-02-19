
var result = null;
var testCasePassed=0;
var testCaseFailed =0;
var testCaseTotal =0;

function getURLParamater(sParam){
    
    let params = (new URL(document.location)).searchParams;
    let name = params.get(sParam);
  //  console.log(name);
    jQuery.ajax({
        url: "http://10.0.1.112:3000/report?"+name,
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function(resultData) {
           
           console.log(resultData.data[0].suiteId);
            result = JSON.stringify(resultData.data);
            console.log(JSON.stringify(result));
            generateTable(resultData.data);
          
        },
        error : function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },

        timeout: 120000,
    });

    jQuery.ajax({
        url: "http://10.0.1.112:3000/lastsummary",
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function(resultData) {
           
         //   console.log(resultData.data[0].suiteId);
            result = JSON.stringify(resultData.data);
            //console.log(result)
            generateSummaryTable(resultData.data);
        },
        error : function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },

        timeout: 120000,
    });
    
}
$( document ).ready(function() {
    console.log( "ready!" );
    getURLParamater("id");
});



var table;
var subTable;
var summaryTable;
function generateTable(json){
     table = new Tabulator("#example-table", {
        index:"runId",
        selectable:true,
        height:"fillRows",
        layout:"fitColumns",
        resizableColumns:false,
        dataTree:true,
        dataTreeStartExpanded:true,
        groupBy:function(data){
            //data - the data object for the row being grouped
        
            return data.suiteId + " - " + data.suiteDate; //groups by data and age
        },
        groupToggleElement:"header",
        groupStartOpen:false,
        //groupStartOpen:false,
        pagination:"local",
        paginationSize:100,
        reactiveData:true,
        tooltips:function(cell){
           return cell.getValue();
        },
        data:json,
    
        columns:[
            {title:"Run ID",field:"runId",  headerFilter:"input",headerFilterPlaceholder:"RunID",align:"center"},    
            {title:"Employee Id", field:"hostName",headerFilter:"input",headerFilterPlaceholder:"Employee ID",align:"center"},
            {title:"Browser", field: "browser", headerFilter:"input", headerFilterPlaceholder:"Browser",align:"center"},
            {title:"Testsuite Id", field:"suiteId",headerFilter:"input",headerFilterPlaceholder:"suiteId",align:"center"},
            {title:"Testsuite Status", field:"suiteStatus",headerFilter:"input",headerFilterPlaceholder:"suiteStatus",align:"center"},
            {title:"Testsuite Start Time", field:"suiteStartTime", sorter:"date",headerFilter:"input",align:"center",headerFilterPlaceholder:"suiteStartTime"},
            {title:"Testsuite End Time", field:"suiteEndTime",headerFilter:"input",headerFilterPlaceholder:"suiteEndTime",align:"center"},
            {title:"Elapsed Time", field:"suiteTotalTime",headerFilter:"input",headerFilterPlaceholder:"suiteTotalTime",align:"center"},
            {title:"Date", field:"suiteDate",headerFilter:"input",headerFilterPlaceholder:"Date",align:"center"},
            {title:"Passed TestCases", field: "passedOutOf",headerFilter:"input",headerFilterPlaceholder:"passedOutOf",align:"center"}
        ],
        rowFormatter:function(row){
            //create and style holder elements
           var holderEl = document.createElement("div");
           var tableEl = document.createElement("div");
    
           holderEl.style.boxSizing = "border-box";
           holderEl.style.padding = "10px 30px 10px 10px";
           holderEl.style.borderTop = "1px solid #333";
           holderEl.style.borderBotom = "1px solid #333";
           holderEl.style.background = "#ddd";
            
            
           tableEl.style.border = "1px solid #333";
    
           holderEl.appendChild(tableEl);
    
           row.getElement().appendChild(holderEl);
            var flag=false;
                subTable = new Tabulator(tableEl, {
            
               layout:"fitColumns",
               scrollToColumnIfVisible: true,
               tooltips:function(cell){
                return cell.getValue();
             },
               data:row.getData().testCases,
               columns:[
               {title:"Testcase ID", field:"testCaseID"},
               {title:"Testcase Start Time", field:"testCaseStart", sorter:"date"},
               {title:"Testcase End Time", field:"testCaseEnd"},
               {title:"Testcase Message", field:"testCaseMessage" ,formatter:"_textArea_"},
               {title:"Testcase Status", field:"testCaseStatus", align:"center", formatter:"tickCross" }
               ]
           })
        },
    });
  
 
}

function myFunction() {
    
    var x = document.getElementById("summary-table");
    x.style.borderWidth="5px"
   
    
    if (x.style.display === "none") {
      x.style.display = "block";

    } else {
      x.style.display = "none";
      
    }
  }
function generateSummaryTable(json){

    summaryTable = new Tabulator('#summary-table',{
        height:"150px",
        layout:"fitColumns",
        resizableColumns:false,
        tooltips:function(cell){
            return cell.getValue();
         },
         data:json,
         
         columns:[
             {title:"Run ID", field:"runId",cellClick:function(e,cell){
                table.setHeaderFilterValue("runId", cell.getValue()); 
             } },
             {title:"Test Suite ID", field:"suiteId"},
             {title:"Browser", field:"browser"},
             {title:"Total Testcases", field: "totalTestCase"},
             {title:"Passed", field:"testCasePassed"},
             {title:"Failed", field:"testCaseFailed"},
             {title:"Elapsed Time", field:"suiteTotalTime"}
         ]
    });
}

