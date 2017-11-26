"use strict";

//<script>
//    alert(location.pathname);  // /tmp/test.html
//    alert(location.hostname);  // localhost
//    alert(location.search);    // ?blah=2
//    alert(document.URL);       // http://localhost/tmp/test.html?blah=2#foobar
//    alert(location.href);      // http://localhost/tmp/test.html?blah=2#foobar
//    alert(location.protocol);  // http:
//    alert(location.host);      // localhost
//    alert(location.origin);    // http://localhost
//    alert(location.hash);      // #foobar
//</script>  

// AJAX Function Working Prototype

//$.ajax({
//    url: "http://www.example.org",
//    data: { "a": 1, "b": 2, "c": 3 },
//    dataType: "xml",
//    complete: function () {
//        alert(this.url)
//    },
//    success: function (xml) {
//    }
//});

var CashAcntName = "CASH A/C";
var BankAcntName = "BANK A/C";
var InvtryAcntName = "INVENTORY A/C";
var InvtryRtnAcntName = "INVENTORY RETURN A/C";
var SaleAcntName = "SALE A/C";
var SaleRtnAcntName = "SALE RETURN A/C";
var COGSAcntName = "COST OF GOODS SOLD A/C";
var DcntRevenueAcntName = "DISCOUNT REVENUE A/C";
var DcntExpenseAcntName = "DISCOUNT EXPENSE A/C";
var LostInvtryAcntName = "LOST INVENTORY A/C";

//var ApplianceAcntName = "APPLIANCES A/C";
//var GoodMaterialsAcntName = "GOOD MATERIALS A/C";
//var BillAndChargesAcntName = "BILL AND CHARGES A/C";


var GSTPaidAcntName = "GST PAID";
var LBTPaidAcntName = "LBT PAID";
var STaxPaidAcntName = "SERVICE TAX PAID";
var GSTPaidAcntName = "GST PAID";
var GSTClctdAcntName = "GST COLLECTED";
var LBTClctdAcntName = "LBT COLLECTED";
var STaxClctdAcntName = "SERVICE TAX COLLECTED";
var GSTClctdAcntName = "GST COLLECTED";

var OtrChrgsAcntName = "OTHER CHARGES A/C";
var RoundOffAcntName = "ROUND OFF A/C";
var CashRfndAcntName = "CASH REFUND A/C";

var Zro = "0.000" ;
var Dcml = 3 ;

var NSRtlr =
{
    OnHSNDataChangedField: function(SndrNode, EvntObjct, ClbckPrmJSObjct)
    {
        NSRtlr.SetMsg("");

        var HSNVal = NSRtlr.GetValByID("txtHSN");

        if (NSRtlr.IsEmpty(HSNVal) == true)
            return;

        var CPVal = parseFloat(NSRtlr.GetValByID("txtCP"));

        if (NSRtlr.IsEmpty(CPVal) == true) {
            NSRtlr.SetErr("Cost Price Not Defined")
            NSRtlr.GetASPNtClntJSElmntByID("txtCP").focus();
            return;
        }

        if (CPVal <= 0) {
            NSRtlr.SetErr("Cost Price Not Defined")
            NSRtlr.GetASPNtClntJSElmntByID("txtCP").focus();
            return;
        }

        var SPVal = parseFloat(NSRtlr.GetValByID("txtSP"));

        if (NSRtlr.IsEmpty(SPVal) == true) {
            NSRtlr.SetErr("Sell Price Not Defined")
            NSRtlr.GetASPNtClntJSElmntByID("txtSP").focus();
            return;
        }

        if (SPVal <= 0) {
            NSRtlr.SetErr("Sell Price Not Defined")
            NSRtlr.GetASPNtClntJSElmntByID("txtSP").focus();
            return;
        }

        document.body.style.cursor = 'wait';

        var ClbckPrmJSObjct = GetCallbackParam();

        var GetInRtlrHSNData = {};
        GetInRtlrHSNData.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetInRtlrHSNData.pHSNData = {};
        GetInRtlrHSNData.pHSNData.HSNSCode = HSNVal;
        GetInRtlrHSNData.pHSNData.FAmt = CPVal;

        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetRtlrHSNData", true,
                "application/json; charset=utf-8", JSON.stringify(GetInRtlrHSNData), false,
                "json",
                NSRtlr.OnInputHSNDataRcvd, NSRtlr.OnHSNErrRcvd,
                0);

        var GetOutRtlrHSNData = {};
        GetOutRtlrHSNData.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetOutRtlrHSNData.pHSNData = {};
        GetOutRtlrHSNData.pHSNData.HSNSCode = HSNVal;
        GetOutRtlrHSNData.pHSNData.FAmt = SPVal;

        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetRtlrHSNData", true,
                "application/json; charset=utf-8", JSON.stringify(GetOutRtlrHSNData), false,
                "json",
                NSRtlr.OnOutputHSNDataRcvd, NSRtlr.OnHSNErrRcvd,
                0);
    },

    OnHSNErrRcvd: function(ClbckPrmJSObjct, xhr, status, error) 
    {
        NSRtlr.SetMsg("");

        NSRtlr.SetErr(error);

        document.body.style.cursor = 'default';
    },

    OnInputHSNDataRcvd: function(ClbckPrmJSObjct, xhr, status, data) 
    {
        NSRtlr.SetMsg("");

        console.log(data);

        var HSNData = data.d;

        NSRtlr.SetValByID("txtIGSTPrct", HSNData.GSTRate.toFixed(Dcml));

        document.body.style.cursor = 'default';
    },

    OnOutputHSNDataRcvd: function(ClbckPrmJSObjct, xhr, status, data) 
    {
        NSRtlr.SetMsg("");

        console.log(data);

        var HSNData = data.d;

        NSRtlr.SetValByID("txtOGSTPrct", HSNData.GSTRate.toFixed(Dcml));

        document.body.style.cursor = 'default';
    },

    NoMvmtFilterHandler: function(tblElmnt, event, data)
    {
        NSRtlr.SetMsg("");

        console.log(data);

        var theform = document.forms['RtlrForm'];
        theform.__EVENTTARGET.value = "RtlrForm";
        theform.__EVENTARGUMENT.value = data.lastCombinedFilter;
        theform.submit();

        tblElmnt.trigger('filterReset');
    },

    OnClientPrintBarcode: function(SndrNode, EvntObjct)
    {
        NSRtlr.SetMsg("");

        var TabCntnrElmnt = NSRtlr.FindMSAjxElmntByID("tcTabCntnr");

        var TabPnlsLst = TabCntnrElmnt.get_tabs();

        var ClbckPrmJSObjct = GetCallbackParam();

        var ItmLst = [];
        
        for (var TabPnlIndx in TabPnlsLst) {

            var TabPnlElmnt = TabCntnrElmnt._tabs[TabPnlIndx];
            //console.log(TabPnlElmnt.get_headerText() + ' ' + TabPnlElmnt.get_id());
           
            var SfxIDElmnt = NSRtlr.GetASPNtClntJSElmntByID("hdElementSuffixID_" + TabPnlElmnt.get_id());
            var ItmLstBodyElmnt = null;
            var ElmntSfxID = "";
            if (SfxIDElmnt != null)
            {
                ElmntSfxID = SfxIDElmnt.value;
                ItmLstBodyElmnt = NSRtlr.GetASPNtClntJSElmntByID("tblItmLstBody_" + ElmntSfxID)
            }
            else if (TabPnlElmnt.get_id().indexOf("tpItmList") != -1)
            {
                ItmLstBodyElmnt = NSRtlr.GetASPNtClntJSElmntByID("tblItmLstBody");
            }

            if (ItmLstBodyElmnt == null)
                continue;

            var NoOfRowsInItmLst = NSRtlr.GetTblBdyRowCnt(ItmLstBodyElmnt.id);
            //console.log(NoOfRowsInItmLst);

            for (var iIndx = 0; iIndx < NoOfRowsInItmLst ; ++iIndx) {

                var bPrntBC = false;

                if (ElmntSfxID == "")
                {
                    bPrntBC = NSRtlr.GetASPNtClntJSElmntByNameAndIndx("chkPrntBC", iIndx).checked;
                }
                else
                {
                    bPrntBC = NSRtlr.GetASPNtClntJSElmntByNameAndIndx("chkPrntBC_" + ElmntSfxID, iIndx).checked;
                }

                if (bPrntBC == false)
                    continue;

                var ItmSeqNo = 0;

                if(     (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_PURCHASE")
                     || (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONSIGNMENT")
                )
                {
                    ItmSeqNo = parseInt(NSRtlr.GetValByElmntNameAndIndx("txtItemSeqNo", iIndx));
                }
                else if (ElmntSfxID == "")
                {
                    ItmSeqNo = parseInt(NSRtlr.GetValByElmntNameAndIndx("txtITrnsSeqNo", iIndx));
                }
                else
                {
                    ItmSeqNo = parseInt(NSRtlr.GetValByElmntNameAndIndx("txtITrnsSeqNo_" + ElmntSfxID, iIndx));
                }

                if (ItmSeqNo <= 0)
                    continue;

                ItmLst.push(ItmSeqNo);
            }
        }

        var IDList = [];
        var ITDList = [];

        if(    (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_PURCHASE")
            || (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONSIGNMENT")
        )
        {
            IDList = ItmLst;
        }
        else
        {
            ITDList = ItmLst;
        }

        console.log(IDList);

        console.log(ITDList);

        if (    (IDList.length <= 0)
             && (ITDList.length <= 0)
        )
        {
            NSRtlr.SetWrn("No Item Selected for Barcode Printing");
            return false;
        }

        var RptPrmData = {};
        RptPrmData.RptTCode = "REPORT_TYPE_BARCODE";
        RptPrmData.IDList = IDList;
        RptPrmData.ITDList = ITDList;

        var RptPrmJsonStringData = JSON.stringify(RptPrmData);

        var AncrTag = document.createElement('a');

        AncrTag.href = "~/../../RtlrReports/RtlrReportDetails.aspx?RptPrmJsonData=" + RptPrmJsonStringData;
        AncrTag.target = '_blank'; // now it will open new tab/window and bypass any popup blocker

        NSRtlr.FireClickEvent(AncrTag);

        return false ;
    },

    OnClientPrint: function(SndrNode, EvntObjct)
    {
        NSRtlr.SetMsg("");

        var ClbckPrmJSObjct = GetCallbackParam();

        var pRptPrmData = {};
        pRptPrmData.RptTCode = "";

        var strMvmtSNo = NSRtlr.GetInrHTMLByID("lblMvmtSeqNo");
        if ((!NSRtlr.IsEmpty(strMvmtSNo)) && (NSRtlr.IsNumeric(strMvmtSNo)))
            pRptPrmData.MSNo = parseInt(strMvmtSNo);

        pRptPrmData.MType = ClbckPrmJSObjct.strPageTypeCode;

        pRptPrmData.bSprsFld = true ;
        pRptPrmData.bSprsSctn = true ;
        pRptPrmData.bPrntRpt = true ;
        pRptPrmData.bFrmRqst = true ;

        
        if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_PURCHASE")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_PURCHASE";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_PURCHASE_RETURN")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_PURCHASE_RETURN";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONSIGNMENT")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_CONSIGNMENT";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONSIGNMENT_RETURN")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_CONSIGNMENT_RETURN";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_SALE")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_SALE";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_SALE_RETURN")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_SALE_RETURN";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_LOST_INVENTORY")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_LOST_INVENTORY";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_RECOVER_INVENTORY")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_INVENTORY_BILL_RECOVER_INVENTORY";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CUSTOMER_ADVANCE")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_ADVANCE_CUSTOMER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_SUPPLIER_ADVANCE")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_ADVANCE_SUPPLIER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_SUPPLIER_PAYMENT")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_PAYMENT_SUPPLIER";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CUSTOMER_RECEIPT")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_PAYMENT_CUSTOMER";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXPENSES_DONATION")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXPENSES_GOOD_MATERIALS")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXPENSES_LABOUR_AND_TRANSPORT")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXPENSES_BILL_AND_CHARGES")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_LOST_CASH")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXTRA_CASH")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONTRA_BANK_TO_CASH")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_CONTRA_CASH_TO_BANK")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_INDUCE_FUND")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_WITHDRAW_FUND")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_ASSET_ACQUISITION")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        else if (ClbckPrmJSObjct.strPageTypeCode == "MOVEMENT_TYPE_EXPENSES_FOOD")
        {
            pRptPrmData.RptTCode = "REPORT_TYPE_ACCOUNT_LEDGER_OTHER";
            pRptPrmData.PprName = "RtlrPrintFormA4By2";
        }
        
        //MOVEMENT_TYPE_TRANSFER
        //MOVEMENT_TYPE_TRANSFER_RETURN        
        //MOVEMENT_TYPE_SALE_ON_APPROVAL
        //MOVEMENT_TYPE_PACKING_SLIP        
        //MOVEMENT_TYPE_TAX_CHANGED
        //MOVEMENT_TYPE_SELL_PRICE_CHANGED
        //MOVEMENT_TYPE_COMMISSION_CHANGED 
        //MOVEMENT_TYPE_CONVERT_UNIT
        //MOVEMENT_TYPE_UNIT_CONVERTED

        if (NSRtlr.IsEmpty(pRptPrmData.RptTCode))
        {
            NSRtlr.SetWrn("Printing not Supported");
            return false;
        }

        document.body.style.cursor = 'wait';

        var GetRtlrReportPath = {};
        GetRtlrReportPath.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetRtlrReportPath.pRptPrmData = {};
        GetRtlrReportPath.pRptPrmData = pRptPrmData;
    
        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetRtlrReportPath", true,
                "application/json; charset=utf-8", JSON.stringify(GetRtlrReportPath), false,
                "json",
                NSRtlr.OnCientPrintDataRcvd, NSRtlr.OnCientPrintErrRcvd,
                0);

        return false;
    },

    OnCientPrintErrRcvd: function(ClbckPrmJSObjct, xhr, status, error) 
    {
        NSRtlr.SetMsg("");

        NSRtlr.SetErr(error);

        document.body.style.cursor = 'default';
    },

    OnCientPrintDataRcvd: function(ClbckPrmJSObjct, xhr, status, data) 
    {
        NSRtlr.SetMsg("");

        var PDFFileToPrint = data.d
        if (NSRtlr.IsEmpty(PDFFileToPrint)) {
            NSRtlr.SetWrn("Error in Printing Document");
            return;
        }

        NSRtlr.PrintPDF(PDFFileToPrint);

        document.body.style.cursor = 'default';
    },

    PrintPDF: function( PDFURL )
    {
        var iframe = this._printIframe ;
        if (!this._printIframe) 
        {
            iframe = this._printIframe = document.createElement( 'iframe' );
            document.body.appendChild(iframe) ;

            iframe.style.display = 'none';
            iframe.onload = function() 
            {
                setTimeout( function() 
                {
                    iframe.focus();
                    iframe.contentWindow.print();
                },
                1 ) ;
            };
        }

        iframe.src = PDFURL ;
    },

    InterchangeFromAndToParty: function(MvmtData)
    {
        var MFrmPSNo = MvmtData.MFrmPSNo;
        var MFrmPrtyName = MvmtData.MFrmPrtyName;
        var MFrmPrtyType = MvmtData.MFrmPrtyType;

        var MToPSNo = MvmtData.MToPSNo;
        var MToPrtyName = MvmtData.MToPrtyName;
        var MToPrtyType = MvmtData.MToPrtyType;

        var IntrChngMvmtData = {};
        IntrChngMvmtData = MvmtData;

        IntrChngMvmtData.MFrmPSNo = MToPSNo;
        IntrChngMvmtData.MFrmPrtyName = MToPrtyName;
        IntrChngMvmtData.MFrmPrtyType = MToPrtyType;

        IntrChngMvmtData.MToPSNo = MFrmPSNo;
        IntrChngMvmtData.MToPrtyName = MFrmPrtyName;
        IntrChngMvmtData.MToPrtyType = MFrmPrtyType;

        return IntrChngMvmtData;
    },

    Evl: function (Expr)
    {
        //return parseFloat((Expr).toFixed(Dcml));
        //return parseFloat((Expr));

        // Calculate Expression and return upto 6 digits after decimal places for getting accuracy
        return parseFloat((Expr).toFixed(6)); 
    },

    AcntPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr )
    {
        var GetAcntPrtyLstArgmnt = {};
        GetAcntPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetAcntPrtyLstArgmnt.strFilterOnSearchTerm = "";

        return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetAccountPartyList", false, "POST", true,
                                        "application/json; charset=utf-8", GetAcntPrtyLstArgmnt, "strFilterOnSearchTerm",
                                        false,
                                        "json",
                                        true, "Value", "Text",
                                        1, 1000,
                                        2, 50,
                                        CntnrCSSClsName, DrpdwnCSSClsName,
                                        "No Result Found", "", null,
                                        false );

    },

    CstmrPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        var GetPrtyLstArgmnt = {};
        GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_CUSTOMER";

        var NoRsltHndlrName = "";
        var NoRsltHndlrPrmObjct = {};
        
        if (bInclNoRsltHndlr == true)
        {
            NoRsltHndlrName = "NSRtlr.OnAddParty" ;

            NoRsltHndlrPrmObjct.strPartyTypeCode = "PARTY_TYPE_CUSTOMER";
            NoRsltHndlrPrmObjct.strAccountNatureTypeCode = "ACCOUNT_NATURE_PERSONAL";
            NoRsltHndlrPrmObjct.strAccountTypeCode = "ACCOUNT_TYPE_ASSET_CURRENT_DEBTORS";
            $.extend(NoRsltHndlrPrmObjct, ClbckPrmJSObjct);
        }
               
        return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", false, "POST", true,
                                        "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
                                        false,
                                        "json",
                                        true, "Value", "Text",
                                        1, 1000,
                                        2, 50,
                                        CntnrCSSClsName, DrpdwnCSSClsName,
                                        "No Result Found", NoRsltHndlrName, NoRsltHndlrPrmObjct,
                                        false );

    },

    OnAddParty: function ( SndrNode, EvntObjct, ClbckPrmJSObjctJSNStrng, Slct2ID, SearchTermVal )
    {
        NSRtlr.SetMsg("");

        var PrtyDtlsAry = SearchTermVal.split(",");
        if (PrtyDtlsAry.length <= 0) {
            NSRtlr.SetErr("Invalid Party Name");
            return ;
        }

        var ClbckPrmJSObjct = JSON.parse(unescape(ClbckPrmJSObjctJSNStrng));

        var AddPrtyArgmnt = {};
        AddPrtyArgmnt.strPartyTypeCode = ClbckPrmJSObjct.strPartyTypeCode;
        AddPrtyArgmnt.strAccountNatureTypeCode = ClbckPrmJSObjct.strAccountNatureTypeCode;
        AddPrtyArgmnt.strAccountTypeCode = ClbckPrmJSObjct.strAccountTypeCode;
        AddPrtyArgmnt.PartyName = PrtyDtlsAry[0];
        AddPrtyArgmnt.PartyOtherDetails = "";
        if (PrtyDtlsAry.length == 2) {
            AddPrtyArgmnt.PartyOtherDetails = PrtyDtlsAry[1];
        }

        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/AddParty", true,
                "application/json; charset=utf-8", JSON.stringify(AddPrtyArgmnt), false,
                "json",
                NSRtlr.OnAddPrtyDataRcvd, NSRtlr.OnAddPrtyErrRcvd,
                Slct2ID);
    },

    OnAddPrtyErrRcvd: function (ClbckPrmJSObjct, xhr, status, error)
    {
        NSRtlr.SetMsg("");

        NSRtlr.SetErr(error);
    },

    OnAddPrtyDataRcvd: function (ClbckPrmJSObjct, xhr, status, data)
    {
        NSRtlr.SetMsg("");

        var Slct2ID = ClbckPrmJSObjct;

        console.log(data.d);

        NSRtlr.SetMsg(status);

        NSRtlr.AddItmsToCBorDDL(Slct2ID, data.d, "Text", "Value", true, false);

       // $(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct)).trigger('change');

        NSRtlr.SetCBorDDLIndxByVal(Slct2ID, data.d[0].Text)

        //var CorDItmBarcode = {};
        //if ((CorDItmBarcode = NSRtlr.GetCBorDDLSlctdItm(Slct2ID, "Customer", true, true, false, false)) == null)
        //    return false;

        //alert(CorDItmBarcode.Text);
        //alert(CorDItmBarcode.Data);

    },

    AgntPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        //var GetPrtyLstArgmnt = {};
        //GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        //GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        //GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_AGENT";

        //return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", true, "POST", true,
        //                                "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
        //                                false,
        //                                "json",
        //                                true, "Value", "Text",
        //                                5, 1000,
        //                                2, 50,
        //                                CntnrCSSClsName, DrpdwnCSSClsName,
        //                                "No Result Found", "", null,
        //                                false );

        return NSRtlr.CmnWOURLInitSclt2(Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr);

    },

    CFBPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        return NSRtlr.CmnWOURLInitSclt2(Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr);
    },

    TrptPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        //var GetPrtyLstArgmnt = {};
        //GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        //GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        //GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_TRANSPORT";

        //return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", true, "POST", true,
        //                                "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
        //                                false,
        //                                "json",
        //                                true, "Value", "Text",
        //                                5, 1000,
        //                                2, 50,
        //                                CntnrCSSClsName, DrpdwnCSSClsName,
        //                                "No Result Found", "", null,
        //                                false );

        return NSRtlr.CmnWOURLInitSclt2(Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr);

    },

    BnkPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        //var GetPrtyLstArgmnt = {};
        //GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        //GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        //GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_BANK";

        //return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", true, "POST", true,
        //                                "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
        //                                false,
        //                                "json",
        //                                true, "Value", "Text",
        //                                5, 1000,
        //                                2, 50,
        //                                CntnrCSSClsName, DrpdwnCSSClsName,
        //                                "No Result Found", "", null,
        //                                false );

        return NSRtlr.CmnWOURLInitSclt2(Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr);

    },

    SplrPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        var GetPrtyLstArgmnt = {};
        GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_SUPPLIER";

        return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", false, "POST", true,
                                        "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
                                        false,
                                        "json",
                                        true, "Value", "Text",
                                        1, 1000,
                                        2, 50,
                                        CntnrCSSClsName, DrpdwnCSSClsName,
                                        "No Result Found", "", null,
                                        false );

    },

    CtgryInitSclt2: function (Slct2ID, PrntCtgryTypeCode, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        //var GetCtgryLstArgmnt = {};
        //GetCtgryLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        //GetCtgryLstArgmnt.strFilterOnSearchTerm = "";
        //GetCtgryLstArgmnt.strParentCategoryTypeCode = PrntCtgryTypeCode;

        //return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetCategoryList", true, "POST", true,
        //                                "application/json; charset=utf-8", GetCtgryLstArgmnt, "strFilterOnSearchTerm",
        //                                false,
        //                                "json",
        //                                true, "Value", "Text",
        //                                5, 1000,
        //                                2, 50,
        //                                CntnrCSSClsName, DrpdwnCSSClsName,
        //                                "No Result Found", "", null,
        //                                false );

        return NSRtlr.CmnWOURLInitSclt2(Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)

    },

    CmnWOURLInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        return NSRtlr.InitSclt2(Slct2ID, "", false, "POST", true,
                                    "application/json; charset=utf-8", null, "",
                                    false,
                                    "json",
                                    true, "Value", "Text",
                                    5, 1000,
                                    2, 50,
                                    CntnrCSSClsName, DrpdwnCSSClsName,
                                    "No Result Found", "", null,
                                    false );
    },

    ItmInitSclt2: function (Slct2ID, ItmFldsName, bInclItmsIrRpctvOfMvmts, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        var GetItmLstArgmnt = {};
        GetItmLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetItmLstArgmnt.strFilterOnSearchTerm = "";
        GetItmLstArgmnt.strItemFieldsNamesWithTableAlias = ItmFldsName;
        GetItmLstArgmnt.bInclItmsIrRpctvOfMvmts = bInclItmsIrRpctvOfMvmts;
               
        return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetItemList", false, "POST", true,
                                        "application/json; charset=utf-8", GetItmLstArgmnt, "strFilterOnSearchTerm",
                                        false,
                                        "json",
                                        true, "Value", "Text",
                                        1, 1000,
                                        2, 50,
                                        CntnrCSSClsName, DrpdwnCSSClsName,
                                        "No Result Found", "", null,
                                        false );

    },

    BrcdInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        var GetBrcdLstArgmnt = {};
        GetBrcdLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetBrcdLstArgmnt.strItemFieldsNamesWithTableAlias = "";
        if ((ClbckPrmJSObjct.ItmFldsNm != null) && (ClbckPrmJSObjct.ItmFldsNm != undefined))
        {
            GetBrcdLstArgmnt.strItemFieldsNamesWithTableAlias = ClbckPrmJSObjct.ItmFldsNm;
        }
        GetBrcdLstArgmnt.strSelectedItemName = "";
        GetBrcdLstArgmnt.strFilterOnSearchTerm = "";

        //NSRtlr.RemoveItmsFrmCBorDDL(ClbckPrmJSObjct.cbBarcodeID);

        var AjxURL = "";
        var bBrcdScn = NSRtlr.GetASPNtClntJSElmntByID("chkBrcdScn").checked;
        if (bBrcdScn == true)
        {
            AjxURL = "../RetailerWebService/RtlrWebServiceASMX.asmx/GetItemBarcodeList";
        }

        return NSRtlr.InitSclt2(Slct2ID,
                                    AjxURL,
                                    false, "POST", true,
                                    "application/json; charset=utf-8", GetBrcdLstArgmnt, "strFilterOnSearchTerm",
                                    false,
                                    "json",
                                    true, "Value", "Text",
                                    0, 1000,
                                    2, 50,
                                    CntnrCSSClsName, DrpdwnCSSClsName,
                                    "No Result Found", "", null,
                                    true );
    },

    SlsmnPrtyInitSclt2: function (Slct2ID, CntnrCSSClsName, DrpdwnCSSClsName, ClbckPrmJSObjct, bInclNoRsltHndlr)
    {
        var GetPrtyLstArgmnt = {};
        GetPrtyLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
        GetPrtyLstArgmnt.strFilterOnSearchTerm = "";
        GetPrtyLstArgmnt.strPartyTypeCode = "PARTY_TYPE_EMPLOYEE";

        return NSRtlr.InitSclt2(Slct2ID, "../RetailerWebService/RtlrWebServiceASMX.asmx/GetPartyList", true, "POST", true,
                                        "application/json; charset=utf-8", GetPrtyLstArgmnt, "strFilterOnSearchTerm",
                                        false,
                                        "json",
                                        true, "Value", "Text",
                                        5, 1000,
                                        2, 50,
                                        CntnrCSSClsName, DrpdwnCSSClsName,
                                        "No Result Found", "", null,
                                        false );

    },

    InitSclt2: function (Slct2ID, AjxURL, bCallOnce, CallType, bAsyncload,
                                    RqstDataType, RqstPrmObjct, SrchTrmFldNameToAddInRqst,
                                    bTrnsfrmRqstDataToQryStrng,
                                    RspnsDataType,
                                    bPrseJSN, IDFldName, TextFldName, 
                                    MinRsltForSrchBx, CallDlyInMSec,
                                    MinInptLngth, MaxInptLnght,
                                    CntnrCSSClsName, DrpdwnCSSClsName,
                                    NoRsltMSg, NoRsltHndlrName, NoRsltHndlrPrmObjct,
                                    AutoSlctSnglItmMtchWthSrchTrm )
    {
        var Slct2Elmnt = NSRtlr.GetASPNtClntJQryElmntByID(Slct2ID);

        if ((Slct2Elmnt[0] == null) || (Slct2Elmnt[0] == undefined))
        {
            NSRtlr.SetErr(" Element Not Found for ID " + Slct2ID);
            return false;
        }

        var bAsyncCall = true;

        if ((bAsyncload != null) && (bAsyncload != undefined)) {
            bAsyncCall = bAsyncload;
        }

        var Slct2MndtryOptions = {};

        Slct2MndtryOptions = 
        {
            language:
                 {
                     noResults: function (term) {
                         //alert(term);
                         //alert(event);
                         //alert(event.target);
                         //alert(event.target.value);
                         //return 'No results Found <a href="#" onclick="return myOnClickEvent(\'' + event.target.value + '\');">Link</a>';
                         
                         var strNoRsltHndlrHTML = "";
                         if (!NSRtlr.IsEmpty(NoRsltHndlrName))
                         {
                             var NoRsltHndlrPrmObjctJSNStrng = "";
                             if( (NoRsltHndlrPrmObjct != null) && (NoRsltHndlrPrmObjct != undefined) )
                             {
                                 NoRsltHndlrPrmObjctJSNStrng = escape(NSRtlr.ObjectStringify(NoRsltHndlrPrmObjct));
                             }

                             //var SearchTermVal = event.target.value;
                             var SearchTermVal = $(".select2-search__field").val();
                             
                             strNoRsltHndlrHTML = ' <input type="button" id= "' + Slct2ID + '_NoRslt_Btn" value="Add" onclick="return ' + NoRsltHndlrName + '( this, event, \'' + NoRsltHndlrPrmObjctJSNStrng + '\',\'' + Slct2ID + '\',\'' + SearchTermVal + '\');"/>';
                         }
                             
                         return NoRsltMSg + strNoRsltHndlrHTML;
                     },
                     //inputTooShort: function(args) {
                     //    // args.minimum is the minimum required length
                     //    // args.input is the user-typed text
                     //    return "Type more stuff";
                     //},
                     inputTooLong: function(args) {
                         // args.maximum is the maximum allowed length
                         // args.input is the user-typed text
                         return "You typed too much";
                     },
                     errorLoading: function() {
                         return "Error loading results";
                     },
                     loadingMore: function() {
                         return "Loading more results";
                     },
                     searching: function() {
                         return "Searching...";
                     },
                     maximumSelected: function(args) {
                         // args.maximum is the maximum number of items the user may select
                         //return "Error loading results";
                         return "Maximum results Limit Exceeded";
                     }

                 },

            minimumResultsForSearch: MinRsltForSrchBx,
            containerCssClass: CntnrCSSClsName,
            dropdownCssClass: DrpdwnCSSClsName,

            escapeMarkup: function (markup) {
                return markup;
            }
        };

        var Slct2Optns = {};
        Slct2Optns = $.extend({}, Slct2MndtryOptions);


        if (!NSRtlr.IsEmpty(AjxURL)) 
        {
            if (bCallOnce == true)
            {
                var ClbckPrmJSObjct = {};
                ClbckPrmJSObjct.Slct2ID = Slct2ID;
                //ClbckPrmJSObjct.Slct2Optns = Slct2MndtryOptions;
                ClbckPrmJSObjct.bPrseJSN = bPrseJSN ;
                //ClbckPrmJSObjct.IDFldName = IDFldName ;
                //ClbckPrmJSObjct.TextFldName = TextFldName;

                var RqstPrmStrng = "";
                if ( (RqstPrmObjct != null) && (RqstPrmObjct != undefined) ) {
                    RqstPrmStrng = JSON.stringify(RqstPrmObjct);
                }

                NSRtlr.CallWebSrvcMthd(CallType, AjxURL, bAsyncCall,
                        RqstDataType, RqstPrmStrng, bTrnsfrmRqstDataToQryStrng,
                        RspnsDataType,
                        NSRtlr.OnSlct2AjxCallDataRcvd, NSRtlr.OnSlct2AjxCallErrRcvd,
                        ClbckPrmJSObjct);
            }
            else
            {
                var Slct2AjxOptns = {};

                Slct2AjxOptns = 
                {
                    minimumInputLength: MinInptLngth,
                    maximumInputLength: MaxInptLnght,

                    ajax:
                        {
                            url: AjxURL,
                            type: CallType,
                            async: bAsyncCall,
                            contentType: RqstDataType,
                            dataType: RspnsDataType,
                            delay: CallDlyInMSec,
                            processData: bTrnsfrmRqstDataToQryStrng,
                            success: function (result, status, xhr) {
                                //alert('haidry');
                            },
                            complete:
                                function (xhr, status) {

                                    console.log(xhr);
                                },
                            data: function (params) {

                                console.log(params);

                                if ( (RqstPrmObjct != null) && (RqstPrmObjct != undefined) ) 
                                {
                                    if (!NSRtlr.IsEmpty(SrchTrmFldNameToAddInRqst)) {
                                        RqstPrmObjct[SrchTrmFldNameToAddInRqst] = params.term;
                                    }
                                    return JSON.stringify(RqstPrmObjct);
                                }
                                else
                                {
                                    return "";
                                }
                            },

                            //transport: function (params, success, failure) {

                            //    console.log('test');
                            //    var GetBrcdLstArgmnt = {};
                            //    GetBrcdLstArgmnt.strMovementTypeCode = "test";
                            //    GetBrcdLstArgmnt.strSelectedItemName = "test";
                            //    GetBrcdLstArgmnt.strFilterOnSearchTerm = "" ;

                            //    NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetItemList", true,
                            //            "application/json; charset=utf-8", JSON.stringify(GetBrcdLstArgmnt), false,
                            //            "json",
                            //            null, null,
                            //            null);


                            //},

                            processResults: function (data) {
                                console.log(data);
                                var JSNData = {};
                                if (!NSRtlr.IsEmpty(data.d))
                                {
                                    if (bPrseJSN == true)
                                    {
                                        JSNData = JSON.parse(data.d);
                                    }
                                    else
                                    {
                                        JSNData = data.d;
                                    }
                                }                                

                                var DataRslt = [];
                                $.each(JSNData, function (Indx, JSNItm) {
                                    console.log(JSNItm);
                                    DataRslt.push({ id: JSNItm[IDFldName], text: JSNItm[TextFldName] });
                                });

                                if (AutoSlctSnglItmMtchWthSrchTrm == true)
                                {
                                    var searchTerm = $(Slct2Elmnt).data("select2").$dropdown.find("input").val();
                                    if ((DataRslt.length == 1) && (searchTerm != "") && (DataRslt[0].text.indexOf(searchTerm) != -1))
                                    {
                                        $(Slct2Elmnt).append($("<option />").attr("value", DataRslt[0].id).html(DataRslt[0].text))
                                            .val(DataRslt[0].id).trigger("change").select2("close");
                                    }
                                }

                                return { results: DataRslt };
                            }
                        }                    
                }

                Slct2Optns = $.extend(Slct2Optns, Slct2AjxOptns);
            }
        }

        $(Slct2Elmnt).select2(Slct2Optns);
        
        return true;
    },

    OnSlct2AjxCallErrRcvd: function(ClbckPrmJSObjct, xhr, status, error)
    {
        NSRtlr.SetMsg("");

        NSRtlr.SetErr("Error in Loading " + ClbckPrmJSObjct.Slct2ID + " Control - " + error);
    },

    OnSlct2AjxCallDataRcvd: function (ClbckPrmJSObjct, xhr, status, data)
    {    
        NSRtlr.SetMsg("");

        console.log(data);

        var JSNData = {};
        if (!NSRtlr.IsEmpty(data.d))
        {
            if (ClbckPrmJSObjct.bPrseJSN == true)
            {
                JSNData = JSON.parse(data.d);
            }
            else
            {
                JSNData = data.d;
            }
        }

        //var DataRslt = [];
        //$.each(JSNData, function (Indx, JSNItm)
        //{
        //    console.log(JSNItm);
        //    DataRslt.push({ id: JSNItm[ClbckPrmJSObjct.IDFldName], text: JSNItm[ClbckPrmJSObjct.TextFldName] });
        //});

        //var Slct2DataOption =
        //{
        //    data: DataRslt
        //};

        //var Slct2Optns = $.extend({}, ClbckPrmJSObjct.Slct2Optns, Slct2DataOption);
        //$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.Slct2ID)).select2(Slct2Optns);

        NSRtlr.AddItmsToCBorDDL(ClbckPrmJSObjct.Slct2ID, JSNData, "Text", "Value", true, true);

        //$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.Slct2ID)).trigger('change');
    },

    CreateNrmlzdLdgrListData: function( LdgrListType )
    {
        var NrmlzdLdgrListData = {} ;

        NrmlzdLdgrListData.LdgrListType = LdgrListType ;
        NrmlzdLdgrListData.DbtLdgrList = [] ;
        NrmlzdLdgrListData.CrtLdgrList = [] ;

        return NrmlzdLdgrListData ;   
    },

    CreateLdgrData: function()
    {
        var LdgrData = {} ;

        LdgrData.LdgrSNo = 0 ;
        LdgrData.CFBSNo = 0 ;
        LdgrData.LPSNo = 0 ;

        LdgrData.MSNo = 0;
        LdgrData.MType = "";

        LdgrData.ForMSNo = 0;
        LdgrData.ForMType = "";

        LdgrData.LDAmt = 0.0 ;
        LdgrData.LCAmt = 0.0 ;

        LdgrData.CPSNo = 0;
        LdgrData.CMSNo = 0;

        LdgrData.LRmrk = "";

        LdgrData.LRV = "" ;

        return LdgrData ;
    },

    GetVrtlAcntLstJSNObjct: function()
    {
        var VrtlAcntJSNStrng = NSRtlr.GetValByID("hdVirtualAccountList") ;
        if( NSRtlr.IsEmpty( VrtlAcntJSNStrng ) )
        {
            NSRtlr.SetErr("Virtual Account List Is Empty");
            return null;
        }

        var VirtualAccountList = JSON.parse(VrtlAcntJSNStrng);
        if ((VirtualAccountList == null) || (VirtualAccountList == undefined))
        {
            NSRtlr.SetErr("Virtual Account List JSON Object is Invalid");
            return null;
        }

        return VirtualAccountList ;
    },
    
    ValidateLdgrData: function (MSNo, DbtLdgrDataList, CrtLdgrDataList, MutuallyDisjointDbtCrt, TotDbtLdgrData, TotCrtLdgrData)
    {
        NSRtlr.GetLedgerTotalDebitAndCreditAmountByLdgrPartySeqNo(DbtLdgrDataList, 0, TotDbtLdgrData);
        NSRtlr.GetLedgerTotalDebitAndCreditAmountByLdgrPartySeqNo(CrtLdgrDataList, 0, TotCrtLdgrData);

        //alert(TotDbtLdgrData.LDAmt + " " + TotDbtLdgrData.LCAmt);
        //alert(TotCrtLdgrData.LDAmt + " " + TotCrtLdgrData.LCAmt);

        if (MutuallyDisjointDbtCrt == true)
        {
            if( ( TotDbtLdgrData.LDAmt != 0 ) && ( TotDbtLdgrData.LCAmt != 0 ) )
            {
                NSRtlr.SetErr("The Debit Ledger List is not a Mutually Disjoint List and has Total Debit Amount ( " + TotDbtLdgrData.LDAmt + " ) and Total Credit Amount ( " + TotDbtLdgrData.LCAmt + " )");
                return false ;
            }

            if ((TotCrtLdgrData.LDAmt != 0) && (TotCrtLdgrData.LCAmt != 0))
            {
                NSRtlr.SetErr("The Credit Ledger List is not a Mutually Disjoint List and has Total Debit Amount ( " + TotCrtLdgrData.LDAmt + " ) and Total Credit Amount ( " + TotCrtLdgrData.LCAmt + " )");
                return false;
            }
        }

        //alert(Math.abs(TotDbtLdgrData.LDAmt - TotCrtLdgrData.LCAmt));

        if (TotDbtLdgrData.LDAmt != TotCrtLdgrData.LCAmt)
        {
            var ErrStrng = "Total Debit Ledger List Amount ( " + TotDbtLdgrData.LDAmt + " ) is  Not Equal to Total Credit Ledger List Amount ( " + TotCrtLdgrData.LCAmt + " )";
            
            NSRtlr.SetWrn(ErrStrng);

            var ThrshldDataCrctngFctr = parseFloat(NSRtlr.GetValByID("hdThrshldDataCrctngFctr"));
            if (NSRtlr.Evl(Math.abs(TotDbtLdgrData.LDAmt - TotCrtLdgrData.LCAmt)) >= ThrshldDataCrctngFctr)
            {
                NSRtlr.SetErr(ErrStrng);
                return false;
            }
        }

        //if (NSRtlr.Evl( Math.abs( TotDbtLdgrData.LDAmt - TotCrtLdgrData.LCAmt ) ) >= ThrshldDataCrctngFctr)
        //{
        //    NSRtlr.SetErr("Total Debit Ledger List Amount ( " + TotDbtLdgrData.LDAmt + " ) is  Not Equal to Total Credit Ledger List Amount ( " + TotCrtLdgrData.LCAmt + " )");
        //    return false ;
        //}

        return true ;
    },

    GetLedgerTotalDebitAndCreditAmountBySearchLdgrData: function (LdgrList, LdgrDataToSearch, TotalDbtCrtLdgrData)
    {
        console.log(LdgrDataToSearch);

        var LdgrListSize = LdgrList.length;

        for (var iIndx = 0 ; iIndx < LdgrListSize ; ++iIndx)
        {
            var lLdgrData = LdgrList[iIndx];
            if( ( lLdgrData == null ) || ( lLdgrData == undefined ) )
                continue ;

            if (
                    (   (LdgrDataToSearch.LPSNo == 0)   || (LdgrDataToSearch.LPSNo == lLdgrData.LPSNo)      )
                &&  (   (LdgrDataToSearch.MSNo == 0)    || (LdgrDataToSearch.MSNo == lLdgrData.MSNo)        )
                &&  (   (LdgrDataToSearch.ForMSNo == 0) || (LdgrDataToSearch.ForMSNo == lLdgrData.ForMSNo)  )
                &&  (   (LdgrDataToSearch.CPSNo == 0)   || (LdgrDataToSearch.CPSNo == lLdgrData.CPSNo)      )
                &&  (   (LdgrDataToSearch.CMSNo == 0)   || (LdgrDataToSearch.CMSNo == lLdgrData.CMSNo)      )
            ) 
            {
                TotalDbtCrtLdgrData.LDAmt = NSRtlr.Evl( TotalDbtCrtLdgrData.LDAmt + lLdgrData.LDAmt );
                TotalDbtCrtLdgrData.LCAmt = NSRtlr.Evl( TotalDbtCrtLdgrData.LCAmt + lLdgrData.LCAmt );
            }
        }
    },

    GetLedgerTotalDebitAndCreditAmountByLdgrPartySeqNo: function (LdgrList, AccountPartySeqNo, TotalDbtCrtLdgrData)
    {
        var LdgrDataToSearch = NSRtlr.CreateLdgrData();
        LdgrDataToSearch.LPSNo = AccountPartySeqNo;

        return NSRtlr.GetLedgerTotalDebitAndCreditAmountBySearchLdgrData(LdgrList, LdgrDataToSearch, TotalDbtCrtLdgrData);
    },

    NormalizeLdgrDataList: function (LdgrList, NrmlzdLdgrListData)
    {
        NrmlzdLdgrListData.DbtLdgrList = [];
        NrmlzdLdgrListData.CrtLdgrList = [];

        var LdgrListSize = LdgrList.length;

        for (var iIndx = 0 ; iIndx < LdgrListSize ; ++iIndx)
        {
            var lLdgrData = LdgrList[iIndx];
            if ((lLdgrData == null) || (lLdgrData == undefined))
                continue ;

            //alert(lLdgrData.LDAmt + " " + lLdgrData.LCAmt);


            if( ( lLdgrData.LDAmt != 0 ) && ( lLdgrData.LCAmt != 0 ) )
            {
                NSRtlr.SetErr("The Ledger Data has both Debit Amount ( " + TotDbtAmt + " ) and Credit Amount ( " + TotCrtAmt + " ). Which is Invalid" ) ;
                return false ;
            }

            if ((lLdgrData.LDAmt >= 0) && (lLdgrData.LCAmt >= 0))
            {
                NrmlzdLdgrListData[NrmlzdLdgrListData.LdgrListType].push(lLdgrData);
                continue;
            }                

            var NrmLzdLdgrData = NSRtlr.CreateLdgrData();

            NrmLzdLdgrData.LdgrSNo = lLdgrData.LdgrSNo;
            NrmLzdLdgrData.CFBSNo = lLdgrData.CFBSNo;
            NrmLzdLdgrData.LPSNo = lLdgrData.LPSNo;

            NrmLzdLdgrData.MSNo = lLdgrData.MSNo;
            NrmLzdLdgrData.ForMSNo = lLdgrData.ForMSNo;

            NrmLzdLdgrData.CPSNo = lLdgrData.CPSNo;
            NrmLzdLdgrData.CMSNo = lLdgrData.CMSNo;

            NrmLzdLdgrData.LRmrk = lLdgrData.LRmrk;

            NrmLzdLdgrData.LRV = lLdgrData.LRV;

            if (lLdgrData.LDAmt < 0)
            {
                NrmLzdLdgrData.LCAmt = -lLdgrData.LDAmt;
                NrmlzdLdgrListData.CrtLdgrList.push(NrmLzdLdgrData);
            }

            if (lLdgrData.LCAmt < 0)
            {
                NrmLzdLdgrData.LDAmt = -lLdgrData.LCAmt;
                NrmlzdLdgrListData.DbtLdgrList.push(NrmLzdLdgrData);
            }
        }

        //console.log(NrmlzdLdgrListData);

        return true ;
    },

    PrepareNrmlzdLdgrData: function (MSNo, DbtLdgrDataList, CrtLdgrDataList, LdgrList, MutuallyDisjointDbtCrt, MvmtData)
    {
        MvmtData.LDList = [];
        
        var TotDbtLdgrData = NSRtlr.CreateLdgrData();
        var TotCrtLdgrData = NSRtlr.CreateLdgrData();

        if (NSRtlr.ValidateLdgrData(MSNo, DbtLdgrDataList, CrtLdgrDataList, MutuallyDisjointDbtCrt, TotDbtLdgrData, TotCrtLdgrData) != true)
            return false;

        var NrmlzdDbtLdgrListData = NSRtlr.CreateNrmlzdLdgrListData("DbtLdgrList")
        if (NSRtlr.NormalizeLdgrDataList(DbtLdgrDataList, NrmlzdDbtLdgrListData ) != true)
            return false;

        var NrmlzdCrtLdgrListData = NSRtlr.CreateNrmlzdLdgrListData("CrtLdgrList")
        if (NSRtlr.NormalizeLdgrDataList(CrtLdgrDataList, NrmlzdCrtLdgrListData) != true)
            return false;

        var NrmlzdDbtLdgrDataList = NrmlzdDbtLdgrListData.DbtLdgrList.concat(NrmlzdCrtLdgrListData.DbtLdgrList);
        var NrmlzdCrtLdgrDataList = NrmlzdCrtLdgrListData.CrtLdgrList.concat(NrmlzdDbtLdgrListData.CrtLdgrList);

        if (NSRtlr.PrepareLdgrData(MSNo, NrmlzdDbtLdgrDataList, NrmlzdCrtLdgrDataList, LdgrList, MutuallyDisjointDbtCrt, MvmtData) == false)
            return false;

        return true;
    },

    PrepareLdgrData: function (MSNo, DbtLdgrDataList, CrtLdgrDataList, LdgrList, MutuallyDisjointDbtCrt, MvmtData)
    {

        MvmtData.LDList = [];

        var TotDbtLdgrData = NSRtlr.CreateLdgrData();
        var TotCrtLdgrData = NSRtlr.CreateLdgrData();

        if (NSRtlr.ValidateLdgrData(MSNo, DbtLdgrDataList, CrtLdgrDataList, MutuallyDisjointDbtCrt, TotDbtLdgrData, TotCrtLdgrData) != true)
            return false;

        //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt);

        //alert(TotDbtLdgrData.LDAmt + " " + TotDbtLdgrData.LCAmt);
        //alert(TotCrtLdgrData.LDAmt + " " + TotCrtLdgrData.LCAmt);

        var DbtLdgrListSize = DbtLdgrDataList.length;
        var CrtLdgrListSize = CrtLdgrDataList.length;

        var PrprdDbtLdgrDataList = [] ;
        var PrprdCrtLdgrDataList = [] ;


        for (var iDbtLdgrIndx = 0 ; iDbtLdgrIndx < DbtLdgrListSize ; ++iDbtLdgrIndx) {
            var lDbtLdgrData = DbtLdgrDataList[iDbtLdgrIndx];
            if ((lDbtLdgrData == null) || (lDbtLdgrData == undefined))
                continue;

            //alert(lDbtLdgrData.LDAmt + ' ' + lDbtLdgrData.LCAmt );

            if (lDbtLdgrData.LDAmt == 0)
                continue;

            for (var iCrtLdgrIndx = 0 ; iCrtLdgrIndx < CrtLdgrListSize ; ++iCrtLdgrIndx) {
                var lCrtLdgrData = CrtLdgrDataList[iCrtLdgrIndx];
                if ((lCrtLdgrData == null) || (lCrtLdgrData == undefined))
                    continue;

                //alert(lCrtLdgrData.LDAmt + ' ' + lCrtLdgrData.LCAmt);

                //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt + ' ' + lDbtLdgrData.LDAmt + ' ' + lCrtLdgrData.LCAmt);

                if (lCrtLdgrData.LCAmt == 0)
                    continue;

                var NewDbtLdgrData = NSRtlr.CreateLdgrData();
                var NewCrtLdgrData = NSRtlr.CreateLdgrData();

                NewDbtLdgrData.MSNo = MSNo;
                NewDbtLdgrData.LPSNo = lDbtLdgrData.LPSNo;

                NewDbtLdgrData.CPSNo = lCrtLdgrData.LPSNo;


                NewCrtLdgrData.MSNo = MSNo;
                NewCrtLdgrData.LPSNo = lCrtLdgrData.LPSNo;
                NewCrtLdgrData.CPSNo = lDbtLdgrData.LPSNo;

                if ((lDbtLdgrData.ForMSNo == 0) && (lCrtLdgrData.ForMSNo == 0)) {
                    NewDbtLdgrData.ForMSNo = MSNo;
                    NewCrtLdgrData.ForMSNo = MSNo;
                }
                else if ((lDbtLdgrData.ForMSNo == 0) && (lCrtLdgrData.ForMSNo != 0)) {
                    NewDbtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
                    NewCrtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
                }
                else if ((lDbtLdgrData.ForMSNo != 0) && (lCrtLdgrData.ForMSNo == 0)) {
                    NewDbtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
                    NewCrtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
                }
                else if ((lDbtLdgrData.ForMSNo != 0) && (lCrtLdgrData.ForMSNo != 0)) {
                    if (NewDbtLdgrData.CPSNo == NewCrtLdgrData.CPSNo) {
                        NewDbtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
                        NewCrtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
                    }
                    else {
                        NSRtlr.SetErr("Error in assigning  For Movement Seq Number. Because Debit Ledger Data contains as ( "
                                            + lDbtLdgrData.ForMSNo + " for CPSNo " + NewDbtLdgrData.CPSNo +
                                            " ) and Credit Ledger Data contains as ( " + lCrtLdgrData.ForMSNo + " for CPSNo " + NewCrtLdgrData.CPSNo + " ).");
                        return false;
                    }
                }

                NewDbtLdgrData.CMSNo = NewCrtLdgrData.ForMSNo;
                NewCrtLdgrData.CMSNo = NewDbtLdgrData.ForMSNo;


                var DbtLdgrData = NSRtlr.FindMvmtLdgrData(LdgrList, NewDbtLdgrData)
                if (DbtLdgrData == null)
                    DbtLdgrData = NewDbtLdgrData;

                var CrtLdgrData = NSRtlr.FindMvmtLdgrData(LdgrList, NewCrtLdgrData)
                if (CrtLdgrData == null)
                    CrtLdgrData = NewCrtLdgrData;

                DbtLdgrData.LRmrk = lDbtLdgrData.LRmrk;
                CrtLdgrData.LRmrk = lCrtLdgrData.LRmrk;

                PrprdDbtLdgrDataList.push(DbtLdgrData);
                PrprdCrtLdgrDataList.push(CrtLdgrData);

                //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
                //    + lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);

                if (lDbtLdgrData.LDAmt <= lCrtLdgrData.LCAmt) {
                    DbtLdgrData.LDAmt = lDbtLdgrData.LDAmt;
                    CrtLdgrData.LCAmt = lDbtLdgrData.LDAmt;

                    //alert(DbtLdgrData.LPSNo + " " + DbtLdgrData.MSNo + " " + DbtLdgrData.CPSNo + " " + DbtLdgrData.LDAmt + " " + DbtLdgrData.LCAmt + "\r\n"
                    //+ CrtLdgrData.LPSNo + " " + CrtLdgrData.MSNo + " " + CrtLdgrData.CPSNo + " " + CrtLdgrData.LDAmt + " " + CrtLdgrData.LCAmt);


                    lCrtLdgrData.LCAmt = NSRtlr.Evl( lCrtLdgrData.LCAmt - lDbtLdgrData.LDAmt );

                    //TotDbtLdgrData.LDAmt -= lDbtLdgrData.LDAmt;
                    TotDbtLdgrData.LDAmt = NSRtlr.Evl( TotDbtLdgrData.LDAmt - lDbtLdgrData.LDAmt );
                    //TotCrtLdgrData.LCAmt -= lDbtLdgrData.LDAmt;
                    TotCrtLdgrData.LCAmt = NSRtlr.Evl( TotCrtLdgrData.LCAmt - lDbtLdgrData.LDAmt );

                    lDbtLdgrData.LDAmt = 0;

                    //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
                    //+ lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);

                    break;
                }
                else {
                    DbtLdgrData.LDAmt = lCrtLdgrData.LCAmt;
                    CrtLdgrData.LCAmt = lCrtLdgrData.LCAmt;

                    //alert(DbtLdgrData.LPSNo + " " + DbtLdgrData.MSNo + " " + DbtLdgrData.CPSNo + " " + DbtLdgrData.LDAmt + " " + DbtLdgrData.LCAmt + "\r\n"
                    //+ CrtLdgrData.LPSNo + " " + CrtLdgrData.MSNo + " " + CrtLdgrData.CPSNo + " " + CrtLdgrData.LDAmt + " " + CrtLdgrData.LCAmt);


                    lDbtLdgrData.LDAmt = NSRtlr.Evl( lDbtLdgrData.LDAmt - lCrtLdgrData.LCAmt );

                    //TotDbtLdgrData.LDAmt -= lCrtLdgrData.LCAmt;
                    TotDbtLdgrData.LDAmt = NSRtlr.Evl( TotDbtLdgrData.LDAmt - lCrtLdgrData.LCAmt );
                    //TotCrtLdgrData.LCAmt -= lCrtLdgrData.LCAmt;
                    TotCrtLdgrData.LCAmt = NSRtlr.Evl( TotCrtLdgrData.LCAmt - lCrtLdgrData.LCAmt );

                    lCrtLdgrData.LCAmt = 0;

                    //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
                    //+ lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);
                }
            }
        }

        //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt);

        if ((TotDbtLdgrData.LDAmt != 0) || (TotCrtLdgrData.LCAmt != 0))
        {
            var ErrStrng = "Ledger List has prepared in which Remaining Total Debit Amount has ( " + TotDbtLdgrData.LDAmt + " ) and Remaining Total Credit Amount has ( " + TotCrtLdgrData.LCAmt + " ). Which is Invalid" ;

            NSRtlr.SetWrn(ErrStrng);

            var ThrshldDataCrctngFctr = parseFloat( NSRtlr.GetValByID("hdThrshldDataCrctngFctr") ) ;
            if (NSRtlr.Evl(Math.abs(TotDbtLdgrData.LDAmt - TotCrtLdgrData.LCAmt)) >= ThrshldDataCrctngFctr)
            {
                NSRtlr.SetErr(ErrStrng);
                return false;
            }
        }

        var PrprdTotDbtLdgrData = NSRtlr.CreateLdgrData();
        var PrprdTotCrtLdgrData = NSRtlr.CreateLdgrData();
        if (NSRtlr.ValidateLdgrData(MSNo, PrprdDbtLdgrDataList, PrprdCrtLdgrDataList, MutuallyDisjointDbtCrt, PrprdTotDbtLdgrData, PrprdTotCrtLdgrData) != true)
            return false;        

        console.log(PrprdDbtLdgrDataList);
        console.log(PrprdCrtLdgrDataList);

        MvmtData.LDList = MvmtData.LDList.concat(PrprdDbtLdgrDataList);
        MvmtData.LDList = MvmtData.LDList.concat(PrprdCrtLdgrDataList);

        console.log(MvmtData.LDList);

        return true;
    },

    //PrepareLdgrData: function (MSNo, DbtLdgrDataList, CrtLdgrDataList, LdgrList, MutuallyDisjointDbtCrt, MvmtData)
    //{

    //    MvmtData.LDList = [];

    //    var TotDbtLdgrData = NSRtlr.CreateLdgrData();
    //    var TotCrtLdgrData = NSRtlr.CreateLdgrData();

    //    if (NSRtlr.ValidateLdgrData(MSNo, DbtLdgrDataList, CrtLdgrDataList, MutuallyDisjointDbtCrt, TotDbtLdgrData, TotCrtLdgrData) != true)
    //        return false;

    //    //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt);

    //    //alert(TotDbtLdgrData.LDAmt + " " + TotDbtLdgrData.LCAmt);
    //    //alert(TotCrtLdgrData.LDAmt + " " + TotCrtLdgrData.LCAmt);

    //    var DbtLdgrListSize = DbtLdgrDataList.length;
    //    var CrtLdgrListSize = CrtLdgrDataList.length;

    //    for (var iDbtLdgrIndx = 0 ; iDbtLdgrIndx < DbtLdgrListSize ; ++iDbtLdgrIndx) {
    //        var lDbtLdgrData = DbtLdgrDataList[iDbtLdgrIndx];
    //        if ((lDbtLdgrData == null) || (lDbtLdgrData == undefined))
    //            continue;

    //        //alert(lDbtLdgrData.LDAmt + ' ' + lDbtLdgrData.LCAmt );

    //        if (lDbtLdgrData.LDAmt == 0)
    //            continue;

    //        for (var iCrtLdgrIndx = 0 ; iCrtLdgrIndx < CrtLdgrListSize ; ++iCrtLdgrIndx) {
    //            var lCrtLdgrData = CrtLdgrDataList[iCrtLdgrIndx];
    //            if ((lCrtLdgrData == null) || (lCrtLdgrData == undefined))
    //                continue;

    //            //alert(lCrtLdgrData.LDAmt + ' ' + lCrtLdgrData.LCAmt);

    //            //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt + ' ' + lDbtLdgrData.LDAmt + ' ' + lCrtLdgrData.LCAmt);

    //            if (lCrtLdgrData.LCAmt == 0)
    //                continue;

    //            var NewDbtLdgrData = NSRtlr.CreateLdgrData();
    //            var NewCrtLdgrData = NSRtlr.CreateLdgrData();

    //            NewDbtLdgrData.MSNo = MSNo;
    //            NewDbtLdgrData.LPSNo = lDbtLdgrData.LPSNo;

    //            NewDbtLdgrData.CPSNo = lCrtLdgrData.LPSNo;


    //            NewCrtLdgrData.MSNo = MSNo;
    //            NewCrtLdgrData.LPSNo = lCrtLdgrData.LPSNo;
    //            NewCrtLdgrData.CPSNo = lDbtLdgrData.LPSNo;

    //            if ((lDbtLdgrData.ForMSNo == 0) && (lCrtLdgrData.ForMSNo == 0)) {
    //                NewDbtLdgrData.ForMSNo = MSNo;
    //                NewCrtLdgrData.ForMSNo = MSNo;
    //            }
    //            else if ((lDbtLdgrData.ForMSNo == 0) && (lCrtLdgrData.ForMSNo != 0)) {
    //                NewDbtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
    //                NewCrtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
    //            }
    //            else if ((lDbtLdgrData.ForMSNo != 0) && (lCrtLdgrData.ForMSNo == 0)) {
    //                NewDbtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
    //                NewCrtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
    //            }
    //            else if ((lDbtLdgrData.ForMSNo != 0) && (lCrtLdgrData.ForMSNo != 0)) {
    //                if (NewDbtLdgrData.CPSNo == NewCrtLdgrData.CPSNo) {
    //                    NewDbtLdgrData.ForMSNo = lDbtLdgrData.ForMSNo;
    //                    NewCrtLdgrData.ForMSNo = lCrtLdgrData.ForMSNo;
    //                }
    //                else {
    //                    NSRtlr.SetErr("Error in assigning  For Movement Seq Number. Because Debit Ledger Data contains as ( "
    //                                        + lDbtLdgrData.ForMSNo + " for CPSNo " + NewDbtLdgrData.CPSNo +
    //                                        " ) and Credit Ledger Data contains as ( " + lCrtLdgrData.ForMSNo + " for CPSNo " + NewCrtLdgrData.CPSNo + " ).");
    //                    return false;
    //                }
    //            }

    //            NewDbtLdgrData.CMSNo = NewCrtLdgrData.ForMSNo;
    //            NewCrtLdgrData.CMSNo = NewDbtLdgrData.ForMSNo;


    //            var DbtLdgrData = NSRtlr.FindMvmtLdgrData(LdgrList, NewDbtLdgrData)
    //            if (DbtLdgrData == null)
    //                DbtLdgrData = NewDbtLdgrData;

    //            var CrtLdgrData = NSRtlr.FindMvmtLdgrData(LdgrList, NewCrtLdgrData)
    //            if (CrtLdgrData == null)
    //                CrtLdgrData = NewCrtLdgrData;

    //            DbtLdgrData.LRmrk = lDbtLdgrData.LRmrk;
    //            CrtLdgrData.LRmrk = lCrtLdgrData.LRmrk;

    //            MvmtData.LDList.push(DbtLdgrData);
    //            MvmtData.LDList.push(CrtLdgrData);

    //            //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
    //            //    + lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);

    //            if (lDbtLdgrData.LDAmt <= lCrtLdgrData.LCAmt) {
    //                DbtLdgrData.LDAmt = lDbtLdgrData.LDAmt;
    //                CrtLdgrData.LCAmt = lDbtLdgrData.LDAmt;

    //                //alert(DbtLdgrData.LPSNo + " " + DbtLdgrData.MSNo + " " + DbtLdgrData.CPSNo + " " + DbtLdgrData.LDAmt + " " + DbtLdgrData.LCAmt + "\r\n"
    //                //+ CrtLdgrData.LPSNo + " " + CrtLdgrData.MSNo + " " + CrtLdgrData.CPSNo + " " + CrtLdgrData.LDAmt + " " + CrtLdgrData.LCAmt);


    //                //lCrtLdgrData.LCAmt = lCrtLdgrData.LCAmt - lDbtLdgrData.LDAmt;
    //                lCrtLdgrData.LCAmt = parseFloat((lCrtLdgrData.LCAmt - lDbtLdgrData.LDAmt).toFixed(Dcml));

    //                //TotDbtLdgrData.LDAmt -= lDbtLdgrData.LDAmt;
    //                TotDbtLdgrData.LDAmt = parseFloat((TotDbtLdgrData.LDAmt - lDbtLdgrData.LDAmt).toFixed(Dcml));
    //                //TotCrtLdgrData.LCAmt -= lDbtLdgrData.LDAmt;
    //                TotCrtLdgrData.LCAmt = parseFloat((TotCrtLdgrData.LCAmt - lDbtLdgrData.LDAmt).toFixed(Dcml));

    //                lDbtLdgrData.LDAmt = 0;

    //                //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
    //                //+ lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);

    //                break;
    //            }
    //            else {
    //                DbtLdgrData.LDAmt = lCrtLdgrData.LCAmt;
    //                CrtLdgrData.LCAmt = lCrtLdgrData.LCAmt;

    //                //alert(DbtLdgrData.LPSNo + " " + DbtLdgrData.MSNo + " " + DbtLdgrData.CPSNo + " " + DbtLdgrData.LDAmt + " " + DbtLdgrData.LCAmt + "\r\n"
    //                //+ CrtLdgrData.LPSNo + " " + CrtLdgrData.MSNo + " " + CrtLdgrData.CPSNo + " " + CrtLdgrData.LDAmt + " " + CrtLdgrData.LCAmt);


    //                //lDbtLdgrData.LDAmt = lDbtLdgrData.LDAmt - lCrtLdgrData.LCAmt;
    //                lDbtLdgrData.LDAmt = parseFloat((lDbtLdgrData.LDAmt - lCrtLdgrData.LCAmt).toFixed(Dcml));

    //                //TotDbtLdgrData.LDAmt -= lCrtLdgrData.LCAmt;
    //                TotDbtLdgrData.LDAmt = parseFloat((TotDbtLdgrData.LDAmt - lCrtLdgrData.LCAmt).toFixed(Dcml));
    //                //TotCrtLdgrData.LCAmt -= lCrtLdgrData.LCAmt;
    //                TotCrtLdgrData.LCAmt = parseFloat((TotCrtLdgrData.LCAmt - lCrtLdgrData.LCAmt).toFixed(Dcml));

    //                lCrtLdgrData.LCAmt = 0;

    //                //alert(lDbtLdgrData.LPSNo + " " + lDbtLdgrData.MSNo + " " + lDbtLdgrData.CPSNo + " " + lDbtLdgrData.LDAmt + " " + lDbtLdgrData.LCAmt + "\r\n"
    //                //+ lCrtLdgrData.LPSNo + " " + lCrtLdgrData.MSNo + " " + lCrtLdgrData.CPSNo + " " + lCrtLdgrData.LDAmt + " " + lCrtLdgrData.LCAmt);
    //            }
    //        }
    //    }

    //    //alert(TotDbtLdgrData.LDAmt + ' ' + TotCrtLdgrData.LCAmt);

    //    if ((TotDbtLdgrData.LDAmt != 0) || (TotCrtLdgrData.LCAmt != 0)) {
    //        NSRtlr.SetErr("Ledger List has prepared in which Remaining Total Debit Amount has ( " + TotDbtLdgrData.LDAmt + " ) and Remaining Total Credit Amount has ( " + TotCrtLdgrData.LCAmt + " ). Which is Invalid");
    //        return false;
    //    }

    //    //console.log(MvmtData.LDList);

    //    return true;
    //},


    FindMvmtLdgrData: function (LdgrList, LdgrDataToSearch)
    {
        var LdgrListSize = LdgrList.length;
        for (var iLdgrIndx = 0 ; iLdgrIndx < LdgrListSize ; ++iLdgrIndx)
        {
            var lLdgrData = LdgrList[iLdgrIndx];

            if (
                    (   (LdgrDataToSearch.LPSNo == 0)   || (LdgrDataToSearch.LPSNo == lLdgrData.LPSNo)      )
                &&  (   (LdgrDataToSearch.MSNo == 0)    || (LdgrDataToSearch.MSNo == lLdgrData.MSNo)        )
                &&  (   (LdgrDataToSearch.ForMSNo == 0) || (LdgrDataToSearch.ForMSNo == lLdgrData.ForMSNo)  )
                &&  (   (LdgrDataToSearch.CPSNo == 0)   || (LdgrDataToSearch.CPSNo == lLdgrData.CPSNo)      )
                &&  (   (LdgrDataToSearch.CMSNo == 0)   || (LdgrDataToSearch.CMSNo == lLdgrData.CMSNo)      )
            )
            {
                return lLdgrData;
            }        
        }

        return null;
    },

    FillLdgrLstIntoArray: function (PrevMvmtDataArray, LdgrElemSuffixID, tblLdgrLstBodyID, MvmtData, LdgrAdjstmntMvmtData,
                            FieldNameToUpdateLdgrAmt)
    {
        var NoOfRowsInLdgrLst = NSRtlr.GetTblBdyRowCnt(tblLdgrLstBodyID);

        for (var iLdgrIndx = 0; iLdgrIndx < NoOfRowsInLdgrLst ; ++iLdgrIndx) {
            var LdgrAmt = parseFloat(NSRtlr.GetValByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iLdgrIndx));

            // If LdgrAmt is 0 Then Do not add Ledger Data into the LDList 
            if ((NSRtlr.IsEmpty(LdgrAmt)) || (LdgrAmt == 0.0))
                continue;

            var LPSNo = parseInt(NSRtlr.GetValByElmntNameAndIndx("hdLPSNo_" + LdgrElemSuffixID, iLdgrIndx));
            var ForMSNo = parseInt(NSRtlr.GetValByElmntNameAndIndx("hdForMSNo_" + LdgrElemSuffixID, iLdgrIndx));
            var LdgrRmrk = NSRtlr.GetValByElmntNameAndIndx("txtLdgrRmrk_" + LdgrElemSuffixID, iLdgrIndx);

            var LdgrData = NSRtlr.CreateLdgrData();

            LdgrData.LPSNo = LPSNo;
            LdgrData.MSNo = MvmtData.MSNo;
            LdgrData.ForMSNo = ForMSNo;
            LdgrData.LRmrk = LdgrRmrk;

            if (FieldNameToUpdateLdgrAmt == "LDAmt") {
                LdgrData.LDAmt = LdgrAmt;
                LdgrData.LCAmt = 0.0;
            }

            if (FieldNameToUpdateLdgrAmt == "LCAmt") {
                LdgrData.LDAmt = 0.0;
                LdgrData.LCAmt = LdgrAmt;
            }

            if ((LdgrData.LDAmt == 0.0) && (LdgrData.LCAmt == 0.0)) {
                NSRtlr.SetErr("Ledger Data has both Debit Amount and Credit Amount is Zero, Which is Invalid");
                return false;
            }

            LdgrAdjstmntMvmtData.LDList.push(LdgrData);

            //console.log(LdgrData);
        }

        console.log(LdgrAdjstmntMvmtData.LDList);

        return true;
    },

    FillLdgrJSONDataIntoLdgrLstTable: function (LdgrLstJSONData, MvmtDataArray, EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct)
    {
        if (NSRtlr.IsEmpty(LdgrLstJSONData))
        {
            return false;
        }

        var LdgrDataArray = JSON.parse(LdgrLstJSONData);

        if (NSRtlr.FillLdgrLstFromArray(LdgrDataArray, MvmtDataArray,
                EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct) == false) {
            return false;
        }

        return true;
    },

    FillLdgrLstFromArray: function (LdgrDataArray, MvmtDataArray, EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct)
    {
        var tblDuesInvBodyList = ClkbkPrmObjct.strtblDuesInvID + "Body";
        var tblInvRtnBodyList = ClkbkPrmObjct.strtblInvRtnID + "Body";
        var tblAdvBodyList = ClkbkPrmObjct.strtblAdvID + "Body";

        var tblDuesInvBodyElement = NSRtlr.GetASPNtClntJQryElmntByID(tblDuesInvBodyList);
        $(tblDuesInvBodyElement).children().remove();
        var tblInvRtnBodyElement = NSRtlr.GetASPNtClntJQryElmntByID(tblInvRtnBodyList);
        $(tblInvRtnBodyElement).children().remove();
        var tblAdvBodyElement = NSRtlr.GetASPNtClntJQryElmntByID(tblAdvBodyList);
        $(tblAdvBodyElement).children().remove();

        NSRtlr.SetInrHTMLByID("lblAccuNotes_INV", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuAdjstd_INV", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuLdgrAmt_INV", Zro);

        NSRtlr.SetInrHTMLByID("lblAccuNotes_GR", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuAdjstd_GR", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuLdgrAmt_GR", Zro);

        NSRtlr.SetInrHTMLByID("lblAccuNotes_ADV", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuAdjstd_ADV", Zro);
        NSRtlr.SetInrHTMLByID("lblAccuLdgrAmt_ADV", Zro);

        var LdgrDataArraySize = LdgrDataArray.length;

        if (NSRtlr.IsEmpty(LdgrDataArraySize)) {
            return false;
        }

        if (LdgrDataArraySize <= 0) {
            return false;
        }

        var tblDuesInvList = ClkbkPrmObjct.strtblDuesInvID;
        var tblInvRtnList = ClkbkPrmObjct.strtblInvRtnID;
        var tblAdvList = ClkbkPrmObjct.strtblAdvID;

        

        var txtDuesInvAmtID = ClkbkPrmObjct.strtxtDuesInvAmtID;
        var txtGRRtnID = ClkbkPrmObjct.strtxtGRRtnID;
        var txtAdvAmtID = ClkbkPrmObjct.strtxtAdvAmtID;
      
        for (var iIndx = 0; iIndx < LdgrDataArraySize; ++iIndx) {

            var LdgrData = LdgrDataArray[iIndx];

            console.log(LdgrData);

            var lLdgrData = LdgrData;
            // lLdgrData.CPSNo = 0;

            var NoteFieldName = "" ;
            var AdjustedFieldName = "";

            if (           (LdgrData.ForMType == "PI") || (LdgrData.ForMType == "CI")
                        || (LdgrData.ForMType == "SR")
                        || (LdgrData.ForMType == "CADV")
            )
            {
                NoteFieldName = "LCAmt";
                AdjustedFieldName = "LDAmt";
            }
            else if (      (LdgrData.ForMType == "SL") || (LdgrData.ForMType == "PR")
                        || (LdgrData.ForMType == "CR")
                        || (LdgrData.ForMType == "SADV")
            )
            {
                NoteFieldName = "LDAmt";
                AdjustedFieldName = "LCAmt";
            }

            if( (LdgrData.ForMType == "PI") || (LdgrData.ForMType == "CI") || (LdgrData.ForMType == "SL") )
            {
                if (NSRtlr.FillLdgrLstFromJSONObject(LdgrDataArray, lLdgrData, "INV", tblDuesInvList, tblDuesInvBodyList, txtDuesInvAmtID,
                                            MvmtDataArray, NoteFieldName, AdjustedFieldName,
                                            EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct) == false) {
                    return false;
                }
            }
            else if ((LdgrData.ForMType == "PR") || (LdgrData.ForMType == "CR") || (LdgrData.ForMType == "SR"))
            {
                if (NSRtlr.FillLdgrLstFromJSONObject(LdgrDataArray, lLdgrData, "GR", tblInvRtnList, tblInvRtnBodyList, txtGRRtnID,
                                            MvmtDataArray, NoteFieldName, AdjustedFieldName,
                                            EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct) == false) {
                    return false;
                }
            }
            else if ((LdgrData.ForMType == "CADV") || (LdgrData.ForMType == "SADV") )
            {
                if (NSRtlr.FillLdgrLstFromJSONObject(LdgrDataArray, lLdgrData, "ADV", tblAdvList, tblAdvBodyList, txtAdvAmtID,
                                            MvmtDataArray, NoteFieldName, AdjustedFieldName,
                                            EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct) == false) {
                    return false;
                }
            }
        }

        return true;
    },

    GenerateMvmtLink: function(MType, MSNo, bVldtMSNoChk, LdgrData)
    {
        var MvmtLink = '';         

        if (bVldtMSNoChk == true)
        {
            if (LdgrData.ForMSNo == LdgrData.MSNo)
                return MvmtLink;
        }

        if (MType == "PI")
        {
            MvmtLink = '<a href="~/../../Inventory/InventoryDetails.aspx?MVMT_TP=PI&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "CI")
        {
            MvmtLink = '<a href="~/../../Inventory/InventoryDetails.aspx?MVMT_TP=CI&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "PR")
        {
            MvmtLink = '<a href="~/../../Inventory/InventoryReturnDetails.aspx?MVMT_TP=PR&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "CR")
        {
            MvmtLink = '<a href="~/../../Inventory/InventoryReturnDetails.aspx?MVMT_TP=CR&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "SL")
        {
            MvmtLink = '<a href="~/../../Billing/SaleDetails.aspx?MVMT_TP=SL&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "SR")
        {
            MvmtLink = '<a href="~/../../Billing/SaleReturnDetails.aspx?MVMT_TP=SR&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "CRCPT")
        {
            MvmtLink = '<a href="~/../../RtlrAccount/AccountDetails.aspx?MVMT_TP=CRCPT&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "SPYMT")
        {
            MvmtLink = '<a href="~/../../RtlrAccount/AccountDetails.aspx?MVMT_TP=SPYMT&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "SADV")
        {
            MvmtLink = '<a href="~/../../RtlrAccount/AcntDbtCrtDetails.aspx?MVMT_TP=SADV&LDGR_TP=DBT&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }
        else if (MType == "CADV")
        {
            MvmtLink = '<a href="~/../../RtlrAccount/AcntDbtCrtDetails.aspx?MVMT_TP=CADV&LDGR_TP=CRT&SNo=' + MSNo + '" target="_blank" >' + MSNo + '  </a>'
        }

        return MvmtLink ;
    },

    FillLdgrLstFromJSONObject: function (LdgrDataArray, LdgrData, LdgrElemSuffixID, tblLdgrLstID, tblLdgrLstBodyID, txtboxLdgrFldID,
                                            MvmtDataArray, NoteFieldName, AdjustedFieldName,
                                            EdtdFldClbckFncName, OtrFldClbckFncName, ClkbkPrmObjct) {
        console.log(LdgrData);

        if (NoteFieldName == AdjustedFieldName) {
            NSRtlr.SetErr("Note Field and Adjusted Field is having the same Name as " + NoteFieldName);
            return false;
        }

        var ClkbkPrmObjctString = "";
        if ( (ClkbkPrmObjct != null) && (ClkbkPrmObjct != undefined) )
        {
            ClkbkPrmObjctString = escape(NSRtlr.ObjectStringify(ClkbkPrmObjct));
        }
            
        //var ClkbkPrmObjctString = "";

        var MvmtLink = NSRtlr.GenerateMvmtLink(LdgrData.MType, LdgrData.MSNo, true, LdgrData);

        var iItmIndx = NSRtlr.FindElmntIndxByValue(document.getElementsByName("hdForMSNo_" + LdgrElemSuffixID), LdgrData.ForMSNo)
        if (iItmIndx == -1)
        {
            var LdgrDataToSearch = NSRtlr.CreateLdgrData();
            LdgrDataToSearch.LPSNo = LdgrData.LPSNo;
            LdgrDataToSearch.ForMSNo = LdgrData.ForMSNo;
            
            var LdgrAmt = 0.0;
            var LdgrRmrk = "";

            if (MvmtDataArray.length != 0)
            {
                LdgrDataToSearch.MSNo = MvmtDataArray[0].MSNo;

                var TotAdjstdLdgrByMvmtData = NSRtlr.CreateLdgrData();
                NSRtlr.GetLedgerTotalDebitAndCreditAmountBySearchLdgrData(MvmtDataArray[0].LDList, LdgrDataToSearch, TotAdjstdLdgrByMvmtData);
                LdgrAmt = TotAdjstdLdgrByMvmtData[AdjustedFieldName];
                
                var FndLdgrData = NSRtlr.FindMvmtLdgrData(MvmtDataArray[0].LDList, LdgrDataToSearch)
                if (FndLdgrData != null) {
                    LdgrRmrk = FndLdgrData.LRmrk;
                }
            }

            LdgrDataToSearch.MSNo = 0;
            var TotAdjstdLdgrData = NSRtlr.CreateLdgrData();
            NSRtlr.GetLedgerTotalDebitAndCreditAmountBySearchLdgrData(LdgrDataArray, LdgrDataToSearch, TotAdjstdLdgrData);

            var ForMvmtLink = NSRtlr.GenerateMvmtLink(LdgrData.ForMType, LdgrData.ForMSNo, false, LdgrData);

            var htmlrow = '<tr>\n'
                   + '<td class="CSSRtlrItmLstTblCell-Calc" > ' + ForMvmtLink + ' </td>\n'
                   + '<td class="CSSRtlrItmLstTblCell-130" ><input type="text" name="txtPrty_' + LdgrElemSuffixID + '" value="' + LdgrData.LPrtyName + '" class="CSSRtlrItmLstTblCellChldElmnt" readonly /></td>\n'
                   + '<td class="CSSRtlrItmLstTblCell-Calc" ><input type="number" name="txtNotes_' + LdgrElemSuffixID + '" step="any" value="' + TotAdjstdLdgrData[NoteFieldName].toFixed(Dcml) + '" class="CSSRtlrItmLstTblCellChldElmnt" readonly /></td>\n'
                   + '<td class="CSSRtlrItmLstTblCell-Calc" ><input type="number" name="txtAdjstd_' + LdgrElemSuffixID + '" step="any" value="' + TotAdjstdLdgrData[AdjustedFieldName].toFixed(Dcml) + '"class="CSSRtlrItmLstTblCellChldElmnt" readonly /></td>\n'

                   + '<td class="CSSRtlrItmLstTblCell-Calc" ><input type="number" name="txtLdgrAmt_' + LdgrElemSuffixID + '" step="any" value="' + LdgrAmt.toFixed(Dcml)
                            + '" lastvalue="' + LdgrAmt.toFixed(Dcml)
                            + '" min="0" max="' + NSRtlr.Evl( TotAdjstdLdgrData[NoteFieldName] - TotAdjstdLdgrData[AdjustedFieldName] + LdgrAmt ).toFixed(Dcml)
                            + '" class="CSSRtlrItmLstTblCellChldElmnt" onchange=" NSRtlr.OnLdgrDataChangedOnLdgrAmtField( this, event, \'' + ClkbkPrmObjctString + '\',\'' + LdgrElemSuffixID + '\',\'' + tblLdgrLstID + '\',\'' + tblLdgrLstBodyID + '\',\'' + txtboxLdgrFldID + '\',\'' + EdtdFldClbckFncName + '\')" /></td>\n'
                   + '<td class="CSSRtlrItmLstTblCell-250" ><input type="text" name="txtLdgrRmrk_' + LdgrElemSuffixID + '" value="' + LdgrRmrk
                            + '" class="CSSRtlrItmLstTblCellChldElmnt" onchange=" NSRtlr.OnLdgrDataChangedOnOtherLdgrEditedField( this, event, \'' + ClkbkPrmObjctString + '\',\'' + LdgrElemSuffixID + '\',\'' + tblLdgrLstID + '\',\'' + tblLdgrLstBodyID + '\',\'' + txtboxLdgrFldID + '\',\'' + OtrFldClbckFncName + '\')" /></td>\n'
                   + '<td name="txtMvmtLink_' + LdgrElemSuffixID + '" class="CSSRtlrItmLstTblCell-250" > '
                            + MvmtLink
                   + '</td>\n'
                   + '<td>\n'

                        + '<input type="hidden" name="hdLPSNo_' + LdgrElemSuffixID + '" value="' + LdgrData.LPSNo + '" />\n'
                        + '<input type="hidden" name="hdForMSNo_' + LdgrElemSuffixID + '" value="' + LdgrData.ForMSNo + '" />\n'

                   + '</td>\n'
               + '</tr>\n';

            var tblLdgrLstBodyIDElement = NSRtlr.GetASPNtClntJQryElmntByID(tblLdgrLstBodyID);
            $(tblLdgrLstBodyIDElement).append(htmlrow);
        }
        else
        {            
            MvmtLink = NSRtlr.GetInrHTMLByElmntNameAndIndx("txtMvmtLink_" + LdgrElemSuffixID, iItmIndx) + MvmtLink;
            NSRtlr.SetInrHTMLByElmntNameAndIndx("txtMvmtLink_" + LdgrElemSuffixID, iItmIndx, MvmtLink);
        }

        var AccuNotes = NSRtlr.Evl(parseFloat(NSRtlr.GetInrHTMLByID("lblAccuNotes_" + LdgrElemSuffixID)) + LdgrData[NoteFieldName]);
        NSRtlr.SetInrHTMLByID("lblAccuNotes_" + LdgrElemSuffixID, AccuNotes.toFixed(Dcml));
        var AccuAdjstd = NSRtlr.Evl(parseFloat(NSRtlr.GetInrHTMLByID("lblAccuAdjstd_" + LdgrElemSuffixID)) + LdgrData[AdjustedFieldName]);
        NSRtlr.SetInrHTMLByID("lblAccuAdjstd_" + LdgrElemSuffixID, AccuAdjstd.toFixed(Dcml));
        var AccuLdgrAmt = NSRtlr.Evl(AccuNotes - AccuAdjstd);
        NSRtlr.SetInrHTMLByID("lblAccuLdgrAmt_" + LdgrElemSuffixID, AccuLdgrAmt.toFixed(Dcml));

        NSRtlr.RefreshTable(tblLdgrLstID);

        NSRtlr.DsblMouseWhlEvntOnSlctr(":input[type=number]");

        return true;
    },

    OnLdgrDataChangedOnLdgrAmtField: function (SndrNode, EvntObjct, ClbckPrmJSObjct,
                                        LdgrElemSuffixID, tblLdgrLstID, tblLdgrLstBodyID, txtboxLdgrFldID,
                                        EdtdFldClbckFncName)
    {
        var iItmIndx = NSRtlr.FindElmntIndxByNode(document.getElementsByName(SndrNode.name), SndrNode);
        var LdgrAmt = parseFloat(NSRtlr.GetValByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx));
        var MaxLdgrAmt = parseFloat(NSRtlr.GetAttribByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx, "max"));
        var LastLdgrAmt = parseFloat(NSRtlr.GetAttribByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx, "lastvalue"));

        if (NSRtlr.IsEmpty(LdgrAmt))
        {
            if (LdgrAmt != 0)
            {
                NSRtlr.SetErr("Amount is Invalid");
                NSRtlr.SetValByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx, LastLdgrAmt.toFixed(Dcml));
                NSRtlr.GetASPNtClntJSElmntByNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx).focus();
                return;
            }
        }

        if ((LdgrAmt < 0) || (LdgrAmt > MaxLdgrAmt)) {
            NSRtlr.SetErr("Amount should be in Between 0 and " + MaxLdgrAmt);
            NSRtlr.SetValByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx, LastLdgrAmt.toFixed(Dcml));
            NSRtlr.GetASPNtClntJSElmntByNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx).focus();
            return;
        }

        NSRtlr.SetAttribByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iItmIndx, "lastvalue", LdgrAmt.toFixed(Dcml));

        NSRtlr.CalcLdgrFieldFromLdgrList(LdgrElemSuffixID, tblLdgrLstBodyID, txtboxLdgrFldID);

        if ((EdtdFldClbckFncName != null) && (EdtdFldClbckFncName != undefined) && !NSRtlr.IsEmpty(EdtdFldClbckFncName))
        {
            var ClbckPrmObjct = {};
            if (!NSRtlr.IsEmpty(ClbckPrmJSObjct))
                ClbckPrmObjct = JSON.parse(unescape(ClbckPrmJSObjct));

            var ClbckFncStrng = '( ' + EdtdFldClbckFncName + '(SndrNode, EvntObjct, ClbckPrmObjct))'
            var FncObjct = eval(ClbckFncStrng);  // return a function
            if ((FncObjct != null) && (FncObjct != undefined))
            {
                FncObjct(SndrNode, EvntObjct, ClbckPrmObjct);
            }
                
        }
    },

    OnLdgrDataChangedOnOtherLdgrEditedField: function (SndrNode, EvntObjct, ClbckPrmJSObjct,
                                                    LdgrElemSuffixID, tblLdgrLstID, tblLdgrLstBodyID, txtboxLdgrFldID,
                                                    OtrFldClbckFncName)
    {
        if ((OtrFldClbckFncName != undefined) && (OtrFldClbckFncName != null) && !NSRtlr.IsEmpty(OtrFldClbckFncName))
        {
            var ClbckPrmObjct = {};
            if (!NSRtlr.IsEmpty(ClbckPrmJSObjct))
                ClbckPrmObjct = JSON.parse(unescape(ClbckPrmJSObjct));

            var ClbckFncStrng = '( ' + OtrFldClbckFncName + '(SndrNode, EvntObjct, ClbckPrmObjct))'
            var FncObjct = eval(ClbckFncStrng);  // return a function
            if ((FncObjct != null) && (FncObjct != undefined)) {
                FncObjct(SndrNode, EvntObjct, ClbckPrmObjct);
            }
        }
    },


    CalcLdgrFieldFromLdgrList: function (LdgrElemSuffixID, tblLdgrLstBodyID, txtboxLdgrFldID)
    {

        var NoOfRowsInLdgrLst = NSRtlr.GetTblBdyRowCnt(tblLdgrLstBodyID);

        var AccuLdgrAmt = 0.0;

        for (var iLdgrIndx = 0; iLdgrIndx < NoOfRowsInLdgrLst ; ++iLdgrIndx) {

            var LdgrAmt = parseFloat(NSRtlr.GetValByElmntNameAndIndx("txtLdgrAmt_" + LdgrElemSuffixID, iLdgrIndx));
            AccuLdgrAmt = NSRtlr.Evl( AccuLdgrAmt + LdgrAmt );
        }

        NSRtlr.SetValByID(txtboxLdgrFldID, AccuLdgrAmt.toFixed(Dcml));
    },

    PopulateMvmtData: function(MvmtData, SfxSptr, ElmntSfxID)
    {
        MvmtData.MSNo = 0;

        var strMvmtSNo = NSRtlr.GetInrHTMLByID("lblMvmtSeqNo");
        if ((!NSRtlr.IsEmpty(strMvmtSNo)) && (NSRtlr.IsNumeric(strMvmtSNo)))
            MvmtData.MSNo = parseInt(strMvmtSNo);

        //MvmtData.MSNo = parseInt(NSRtlr.GetValByID("txtMvmtSeqNo" + SfxSptr + ElmntSfxID));

        MvmtData.MRefID = NSRtlr.GetInrHTMLByID("lblMvmtRefID");


        MvmtData.MFrmRefID = NSRtlr.GetValByID("txtFrmRefID");
        MvmtData.MFrmDate = NSRtlr.GetValByID("txtFrmDate");

        var CorDItmTrpt = {};
        if ((CorDItmTrpt = NSRtlr.GetCBorDDLSlctdItm("cbTransport", "Transport Party", true, true, true, true)) == null) {
            return false;
        }
        MvmtData.MTrptPSNo = parseInt(CorDItmTrpt.Data);

        MvmtData.MLRNo = NSRtlr.GetValByID("txtLRNumber");
        MvmtData.MLRDate = NSRtlr.GetValByID("txtLRDate");

        var CorDItmMvmtStsType = NSRtlr.GetCBorDDLSlctdItm("cbMvmtStatusType", "Movement Status Type", false, true, true, true)
        if ((CorDItmMvmtStsType != null) && (CorDItmMvmtStsType != undefined))
        {
            MvmtData.MSTypeSNo = parseInt(CorDItmMvmtStsType.Data);

            MvmtData.MSDate = NSRtlr.GetValByID("txtMvmtStatusDate");
        }
                

        var CorDItmAgnt = {};
        if ((CorDItmAgnt = NSRtlr.GetCBorDDLSlctdItm("cbAgent", "Agent Party", true, true, true, true)) == null) {
            return false;
        }
        MvmtData.MAgntPSNo = parseInt(CorDItmAgnt.Data);

        var AccuQty = NSRtlr.GetASPNtClntJSElmntByID("txtAccuQty" + SfxSptr + ElmntSfxID);
        if ((AccuQty != null) && (AccuQty != undefined))
        {
            MvmtData.MQty = parseFloat(NSRtlr.GetValByID("txtAccuQty" + SfxSptr + ElmntSfxID));
        }

        var AccuSubTot = NSRtlr.GetASPNtClntJSElmntByID("txtAccuSubTot" + SfxSptr + ElmntSfxID);
        if ((AccuSubTot != null) && (AccuSubTot != undefined))
        {
            MvmtData.MSubTot = parseFloat(NSRtlr.GetValByID("txtAccuSubTot" + SfxSptr + ElmntSfxID));
        }

        var AccuPrcDcnt = NSRtlr.GetASPNtClntJSElmntByID("txtAccuPrcDcnt" + SfxSptr + ElmntSfxID);
        if ((AccuPrcDcnt != null) && (AccuPrcDcnt != undefined))
        {
            MvmtData.MPrcDcnt = parseFloat(NSRtlr.GetValByID("txtAccuPrcDcnt" + SfxSptr + ElmntSfxID));
        }
               

        MvmtData.MBilDcntPrct = parseFloat(NSRtlr.GetValByID("txtBilDcntPrct" + SfxSptr + ElmntSfxID));
        MvmtData.MBilDcnt = parseFloat(NSRtlr.GetValByID("txtBilDcnt" + SfxSptr + ElmntSfxID));

        MvmtData.MOtrChrgs = parseFloat(NSRtlr.GetValByID("txtOtrChrgs" + SfxSptr + ElmntSfxID));

        MvmtData.MTot = parseFloat(NSRtlr.GetValByID("txtBilTot" + SfxSptr + ElmntSfxID));

        MvmtData.MInclGST = NSRtlr.GetASPNtClntJSElmntByID("chkInclGST" + SfxSptr + ElmntSfxID).checked;
        MvmtData.MGST = parseFloat(NSRtlr.GetValByID("txtGST" + SfxSptr + ElmntSfxID));

        MvmtData.MInclLBT = NSRtlr.GetASPNtClntJSElmntByID("chkInclLBT" + SfxSptr + ElmntSfxID).checked;
        MvmtData.MLBT = parseFloat(NSRtlr.GetValByID("txtLBT" + SfxSptr + ElmntSfxID));

        MvmtData.MInclSTax = NSRtlr.GetASPNtClntJSElmntByID("chkInclSTax" + SfxSptr + ElmntSfxID).checked;
        MvmtData.MSTaxPrct = parseFloat(NSRtlr.GetValByID("txtSTaxPrct" + SfxSptr + ElmntSfxID));
        MvmtData.MSTax = parseFloat(NSRtlr.GetValByID("txtSTax" + SfxSptr + ElmntSfxID));

        MvmtData.MRndOff = parseFloat(NSRtlr.GetValByID("txtRoundOff" + SfxSptr + ElmntSfxID));
        MvmtData.MAmt = parseFloat(NSRtlr.GetValByID("txtBillAmt" + SfxSptr + ElmntSfxID));

        //MvmtData.MRV = NSRtlr.GetValByID("txtMvmtRV" + SfxSptr + ElmntSfxID) ;

        //MvmtData.MRmrk = NSRtlr.GetValByID("txtRemarks" + SfxSptr + ElmntSfxID) ;
        MvmtData.MRmrk = NSRtlr.GetValByID("txtRemarks");

        return true;
    },

    PopulateBnkData: function (MvmtData, BnkData, SfxSptr, ElmntSfxID)
    {
        var strBnkSNo = NSRtlr.GetInrHTMLByID("lblBnkSeqNo");
        if ((!NSRtlr.IsEmpty(strBnkSNo)) && (NSRtlr.IsNumeric(strBnkSNo)))
            BnkData.BnkSNo = parseInt(strBnkSNo);

        BnkData.MSNo = MvmtData.MSNo;

        var CorDItmBnk = {};
        if ((CorDItmBnk = NSRtlr.GetCBorDDLSlctdItm("cbBank", "Bank Party", true, true, true, true)) == null) {
            return false;
        }
        BnkData.BPSNo = parseInt(CorDItmBnk.Data);

        var CorDItmPymtModeType = NSRtlr.GetCBorDDLSlctdItm("cbPymtModeType", "Payment Mode Type", false, true, true, true)
        if ((CorDItmPymtModeType != null) && (CorDItmPymtModeType != undefined)) {
            BnkData.PymtMdTypeSNo = parseInt(CorDItmPymtModeType.Data);
        }

        BnkData.TrnsDate = NSRtlr.GetValByID("txtTrnsDate");

        BnkData.TrnsNo = NSRtlr.GetValByID("txtTrnsNo");        

        BnkData.TrnsAmt = parseFloat(NSRtlr.GetValByID("txtTrnsAmt"));

        var CorDItmBnkTrnsStsType = NSRtlr.GetCBorDDLSlctdItm("cbBnkTrnsStsType", "Transaction Status Type", false, true, true, true)
        if ((CorDItmBnkTrnsStsType != null) && (CorDItmBnkTrnsStsType != undefined)) {
            BnkData.TrnsStsTypeSNo = parseInt(CorDItmBnkTrnsStsType.Data);
        }

        BnkData.BRmrk = NSRtlr.GetValByID("txtTrnsRmrk");

        BnkData.BRV = NSRtlr.GetValByID("hdBnkRV" + SfxSptr + ElmntSfxID) ;

        return true;
    },

    FireClickEvent: function( ClckblElmnt )
    {
        var evnt = new window.MouseEvent('click',
            {
                view: window,
                bubbles: true,
                cancelable: true
            }) ;

        ClckblElmnt.dispatchEvent( evnt ) ;
    },

    InitializePymtListTableSorter: function (tblElmnt, StckyHdrCSSClsName ) {

        try {
            $.tablesorter.addParser({
                id: "input_numeric_parser",
                is: function (s) {
                    return false;
                },
                format: function (s, tblElmnt, cell) {
                    return $("input", cell).val();
                },
                type: "numeric"
            });

            $.tablesorter.addParser({
                id: "input_text_parser",
                is: function (s) {
                    return false;
                },
                format: function (s, tblElmnt, cell) {
                    return $("input", cell).val();
                },
                type: "text"
            });

            $.tablesorter.addParser({
                id: "anchor_numeric_parser",
                is: function (s) {
                    return false;
                },
                format: function (s, tblElmnt, cell) {
                    return $("a", cell).text();
                },
                type: "numeric"
            });

            NSRtlr.FxGrdVwTblHdr(tblElmnt).tablesorter(
            {
                widgets: ['zebra', 'resizable', 'stickyHeaders', 'filter'],
                widgetOptions: {
                    stickyHeaders_attachTo: StckyHdrCSSClsName
                },

                headers:
                    {
                        0: {
                            //sorter: "anchor_numeric_parser"
                            extractor: "anchor_numeric_parser", sorter: "inputs", filter: "parsed"
                        },
                        1: {
                            //sorter: "input_text_parser",
                            extractor: "input_text_parser", sorter: "inputs", filter: "parsed"
                        },
                        2: {
                            //sorter: "input_numeric_parser"
                            extractor: "input_numeric_parser", sorter: "inputs", filter: "parsed"
                        },
                        3: {
                            //sorter: "input_numeric_parser"
                            extractor: "input_numeric_parser", sorter: "inputs", filter: "parsed"
                        },
                        4: {
                            //sorter: "input_numeric_parser"
                            extractor: "input_numeric_parser", sorter: "inputs", filter: "parsed"
                        },
                        5: {
                            //sorter: "input_text_parser",
                            extractor: "input_text_parser", sorter: "inputs", filter: "parsed"
                        },
                        6: {
                            //sorter: "input_text_parser",
                            extractor: "input_text_parser", sorter: "inputs", filter: "parsed"
                        },
                        7: {
                            sorter: false,
                            resizable: false
                        }
                    },

                sortMultiSortKey: "ctrlKey",
                //debug: true,
            });

            NSRtlr.ResetTableColumnResize(tblElmnt);
        }
        catch (err) {
            NSRtlr.SetErr(err.message);
        }
    },

    InitializeGridViewTableSorter: function (tblElmnt, NoRowfltrHndlrName) {

        try
        {

            NSRtlr.FxGrdVwTblHdr(tblElmnt).tablesorter(
            {
                widgets: ["zebra", "stickyHeaders", "filter"],
                widgetOptions: {
                    stickyHeaders_attachTo: '.CSSRtlrGVFixHdrBdyFtr',
                    filter_saveFilters : true
                },

                sortMultiSortKey: "ctrlKey",
                //debug: true,


                //// define an overall custom text extraction function
                //textExtraction: function(node, table, cellIndex) {
                //  return $(node).text();
                //}


                // Define a custom text extraction function for each column
                // In this example, textExtraction 1-5 functions don't really need to
                // be defined, since they can also be obtained using `$(node).text()`
                //textExtraction: {
                //    0: function (node, table, cellIndex) { return $(node).find("input").val(); },
                //    1: function (node, table, cellIndex) { return $(node).find("input").val(); },
                //    2: function (node, table, cellIndex) { return $(node).find("input").val(); },
                //    3: function (node, table, cellIndex) { return $(node).find("input").val(); },
                //    4: function (node, table, cellIndex) { return $(node).find("input").val(); },
                //    5: function (node, table, cellIndex) { return $(node).find("input").val(); }
                //}
            }) ;
            
            if ((NoRowfltrHndlrName != null) && (NoRowfltrHndlrName != undefined))
            {

                tblElmnt.bind('filterEnd', function (event, data) {

                    if (data.filteredRows <= 0)
                        NoRowfltrHndlrName(tblElmnt, event, data);
                });                
            }

        }
        catch (err) {
            NSRtlr.SetErr(err.message);
        }
    },

    ValidateFromToPartiesCB: function (cbFrmPrtyID, FrmPrtyName, cbToPrtyID, ToPrtyName) {

        if (!NSRtlr.IsEmpty(cbFrmPrtyID))
        {
            var CorDItmFrmPrty = {};
            if ((CorDItmFrmPrty = NSRtlr.GetCBorDDLSlctdItm(cbFrmPrtyID, FrmPrtyName, true, true, true, true)) == null)
                return false;
        }
        
        if (!NSRtlr.IsEmpty(cbToPrtyID))
        {

            var CorDItmToPrty = {};
            if ((CorDItmToPrty = NSRtlr.GetCBorDDLSlctdItm(cbToPrtyID, ToPrtyName, true, true, true, true)) == null)
                return false;
        }

        return true;
    },

    ValidateFromToPartiesTB: function (txtFrmPrtySeqNoID, txtFrmPrtyNameID, FrmPrtyName, txtToPrtySeqNoID, txtToPrtyNameID, ToPrtyName) {

        if (!NSRtlr.IsEmpty(txtFrmPrtySeqNoID))
        {
            var FrmPSNoVal = NSRtlr.GetValByID(txtFrmPrtySeqNoID);
            if (NSRtlr.IsEmpty(FrmPSNoVal))
            {
                NSRtlr.SetErr(FrmPrtyName + " Not Defined/Selected");
                return false;
            }
        }

        if (!NSRtlr.IsEmpty(txtFrmPrtyNameID))
        {
            var FrmPrtyNameVal = NSRtlr.GetValByID(txtFrmPrtyNameID);

            if (NSRtlr.IsEmpty(FrmPrtyNameVal)) {
                NSRtlr.SetErr(FrmPrtyName + " Not Defined/Selected");
                return false;
            }
        }

        if (!NSRtlr.IsEmpty(txtToPrtySeqNoID))
        {
            var ToPSNoVal = NSRtlr.GetValByID(txtToPrtySeqNoID);
            if (NSRtlr.IsEmpty(ToPSNoVal))
            {
                NSRtlr.SetErr(ToPrtyName + " Not Defined/Selected");
                return false;
            }
        }

        if (!NSRtlr.IsEmpty(txtToPrtyNameID))
        {
            var ToPrtyNameVal = NSRtlr.GetValByID(txtToPrtyNameID);

            if (NSRtlr.IsEmpty(ToPrtyNameVal))
            {
                NSRtlr.SetErr(ToPrtyName + " Not Defined/Selected");
                return false;
            }
        }       

        return true;
    },

    //GetTaxInclItmPricePerQty: function(ItmQty, ItmPrice, ItmDcntPrct, BilDcntPrct, ItmTotAmt, ItmOtrChrgs, bIncludeGST, ItmGSTPrct, bIncludeLBT, ItmLBTPrct, bIncludeSTax, ItmSTaxPrct)
    //{
    //    //alert(ItmQty + ' ' + ItmPrice + ' ' + ItmDcntPrct + ' ' + BilDcntPrct + ' ' + ItmTotAmt + ' ' + ItmOtrChrgs + ' ' + bIncludeGST + ' ' + ItmGSTPrct + ' ' + bIncludeLBT + ' ' + ItmLBTPrct + ' ' + bIncludeSTax + ' ' + ItmSTaxPrct);
    
    //    if ((bIncludeGST == false) && (bIncludeLBT == false) && (bIncludeSTax == false))
    //    {
    //        // All Taxes are Excluded from Item Price
    //        //return ItmPrice;

    //        ItmPrice = NSRtlr.Evl((ItmTotAmt - ItmOtrChrgs) / ((1) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))));

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == false) && (bIncludeLBT == false) && (bIncludeSTax == true))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))) / ((1 + (ItmSTaxPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == false) && (bIncludeLBT == true) && (bIncludeSTax == false))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - ItmOtrChrgs) / ((1 + (ItmLBTPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == false) && (bIncludeLBT == true) && (bIncludeSTax == true))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))) / ((1 + (ItmLBTPrct / 100) + (ItmSTaxPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == true) && (bIncludeLBT == false) && (bIncludeSTax == false))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - ItmOtrChrgs) / ((1 + (ItmGSTPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == true) && (bIncludeLBT == false) && (bIncludeSTax == true))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))) / ((1 + (ItmGSTPrct / 100) + (ItmSTaxPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == true) && (bIncludeLBT == true) && (bIncludeSTax == false))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - ItmOtrChrgs) / ((1 + (ItmGSTPrct / 100) + (ItmLBTPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );

    //        return ItmPrice;
    //    }
    //    else if ((bIncludeGST == true) && (bIncludeLBT == true) && (bIncludeSTax == true))
    //    {
    //        ItmPrice = NSRtlr.Evl( (ItmTotAmt - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))) / ((1 + (ItmGSTPrct / 100) + (ItmLBTPrct / 100) + (ItmSTaxPrct / 100)) * (1 - (ItmDcntPrct / 100)) * (1 - (BilDcntPrct / 100))) );
   
    //        return ItmPrice;
    //    }
    //    else
    //    {
    //        return ItmPrice;
    //    }
    //},

    GetTaxInclItmPricePerQty: function (ItmQty, ItmPrice, ItmDcntPrct, BilDcntPrct, ItmTotAmt, ItmOtrChrgs, bIncludeGST, ItmGSTPrct, bIncludeLBT, ItmLBTPrct, bIncludeSTax, ItmSTaxPrct)
    {
        //alert(ItmQty + ' ' + ItmPrice + ' ' + ItmDcntPrct + ' ' + BilDcntPrct + ' ' + ItmTotAmt + ' ' + ItmOtrChrgs + ' ' + bIncludeGST + ' ' + ItmGSTPrct + ' ' + bIncludeLBT + ' ' + ItmLBTPrct + ' ' + bIncludeSTax + ' ' + ItmSTaxPrct);

        if ((bIncludeGST == false) && (bIncludeLBT == false) && (bIncludeSTax == false))
        {
            // All Taxes are Excluded from Item Price
            //return ItmPrice;

            ItmPrice = NSRtlr.Evl(
                                        (ItmTotAmt - ItmOtrChrgs)
                                        /
                                        (
                                              1
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                 );

            return ItmPrice;
        }
        else if ((bIncludeGST == false) && (bIncludeLBT == false) && (bIncludeSTax == true))
        {
            ItmPrice = NSRtlr.Evl(
                                        (
                                               ItmTotAmt
                                            - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))
                                        )
                                        /
                                        (
                                              (1 + (ItmSTaxPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                 );

            return ItmPrice;
        }
        else if ((bIncludeGST == false) && (bIncludeLBT == true) && (bIncludeSTax == false))
        {
            ItmPrice = NSRtlr.Evl(
                                        (ItmTotAmt - ItmOtrChrgs)
                                        /
                                        (
                                              (1 + (ItmLBTPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                 );

            return ItmPrice;
        }
        else if ((bIncludeGST == false) && (bIncludeLBT == true) && (bIncludeSTax == true))
        {
            ItmPrice = NSRtlr.Evl(
                                        (
                                              ItmTotAmt
                                            - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))
                                        )
                                        /
                                        (
                                              (1 + (ItmLBTPrct / 100) + (ItmSTaxPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                );

            return ItmPrice;
        }
        else if ((bIncludeGST == true) && (bIncludeLBT == false) && (bIncludeSTax == false))
        {
            ItmPrice = NSRtlr.Evl(
                                        (ItmTotAmt - ItmOtrChrgs)
                                        /
                                        (
                                              (1 + (ItmGSTPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                );

            return ItmPrice;
        }
        else if ((bIncludeGST == true) && (bIncludeLBT == false) && (bIncludeSTax == true))
        {
            ItmPrice = NSRtlr.Evl(
                                        (
                                              ItmTotAmt
                                            - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))
                                        )
                                        /
                                        (
                                              (1 + (ItmGSTPrct / 100) + (ItmSTaxPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                );

            return ItmPrice;
        }
        else if ((bIncludeGST == true) && (bIncludeLBT == true) && (bIncludeSTax == false))
        {
            ItmPrice = NSRtlr.Evl(
                                        (ItmTotAmt - ItmOtrChrgs)
                                        /
                                        (
                                              (1 + (ItmGSTPrct / 100) + (ItmLBTPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                );

            return ItmPrice;
        }
        else if ((bIncludeGST == true) && (bIncludeLBT == true) && (bIncludeSTax == true))
        {
            ItmPrice = NSRtlr.Evl(
                                        (
                                              ItmTotAmt
                                            - (ItmOtrChrgs * (1 + (ItmSTaxPrct / 100)))
                                        )
                                        /
                                        (
                                              (1 + (ItmGSTPrct / 100) + (ItmLBTPrct / 100) + (ItmSTaxPrct / 100))
                                            * (1 - (ItmDcntPrct / 100))
                                            * (1 - (BilDcntPrct / 100))
                                        )
                                );

            return ItmPrice;
        }
        else
        {
            return ItmPrice;
        }
    },

    OnItemNameSelectedIndexChangedEvent: function(SndrNode, EvntObjct, ClbckPrmJSObjct) 
    {
        NSRtlr.SetMsg("") ;

        var GetBrcdLstArgmnt = {};
        GetBrcdLstArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;

        GetBrcdLstArgmnt.strItemFieldsNamesWithTableAlias = "";
        if ((ClbckPrmJSObjct.ItmFldsNm != null) && (ClbckPrmJSObjct.ItmFldsNm != undefined))
        {
            GetBrcdLstArgmnt.strItemFieldsNamesWithTableAlias = ClbckPrmJSObjct.ItmFldsNm;
        }

        var CorDItmName = {};
        if ((CorDItmName = NSRtlr.GetCBorDDLSlctdItm(ClbckPrmJSObjct.cbItemNameID, "Item Name", true, true, true, false)) == null)
            return;

        GetBrcdLstArgmnt.strSelectedItemName = CorDItmName.Text;
        GetBrcdLstArgmnt.strFilterOnSearchTerm = "";

        NSRtlr.RemoveItmsFrmCBorDDL(ClbckPrmJSObjct.cbBarcodeID);
        
        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetItemBarcodeList", true,
                "application/json; charset=utf-8", JSON.stringify(GetBrcdLstArgmnt), false,
                "json",
                NSRtlr.OnItemNameSelectedIndexDataReceived, NSRtlr.OnItemNameSelectedIndexErrorReceived,
                ClbckPrmJSObjct);
    },

    OnItemNameSelectedIndexErrorReceived: function(ClbckPrmJSObjct, xhr, status, error)
    {
        NSRtlr.SetMsg("");

        NSRtlr.SetErr(error);

        var CorDItmName = {};
        if ((CorDItmName = NSRtlr.GetCBorDDLSlctdItm(ClbckPrmJSObjct.cbItemNameID, "Item Name", true, true, true, false)) == null)
            return;

        CorDItmName.TxtBoxElement.focus();
    },

    OnItemNameSelectedIndexDataReceived: function (ClbckPrmJSObjct, xhr, status, data)
    {    
        NSRtlr.SetMsg("");

        console.log(data.d);

        if (NSRtlr.IsEmpty(data.d))
        {
            NSRtlr.SetErr("No Barcode Found");
            return;
        }

        NSRtlr.AddItmsToCBorDDL(ClbckPrmJSObjct.cbBarcodeID, JSON.parse(data.d), "Text", "Value", true, true);

        //var response = [];
        //response.push({ id: 'hatim', text: 'hatim' });
        //response.push({ id: 'juzer', text: 'juzer' });

        ////$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.cbBarcodeID)).select2().val(response).trigger('change');

        //var control = $(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.cbBarcodeID)).data('select2');
        //var adapter = control.dataAdapter;
        //adapter.addOptions(adapter.convertToOptions(response));
        ////$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.cbBarcodeID)).trigger('change');

        ////$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.cbBarcodeID)).trigger('refresh');
        ////$(NSRtlr.GetASPNtClntJQryElmntByID(ClbckPrmJSObjct.cbBarcodeID)).select2('update');

        NSRtlr.ResetCBorDDLValue(ClbckPrmJSObjct.cbBarcodeID);
    },

    OnBarcodeSelectedIndexChangedEvent: function(SndrNode, EvntObjct, ClbckPrmJSObjct)
    {
        NSRtlr.ProcessEnteredBarcode(ClbckPrmJSObjct);

        console.log('OnBarcodeSelectedIndexChangedEvent');
    },

    ProcessEnteredBarcode: function(ClbckPrmJSObjct) 
    {
        NSRtlr.SetMsg("");

        var BCItmTrnsDataArgmnt = {};
        if (NSRtlr.GetBCItmTrnsDataArgmnt(ClbckPrmJSObjct.cbBarcodeID, BCItmTrnsDataArgmnt) == false)
            return false;

        var CorDPrty = {};
        if ((CorDPrty = NSRtlr.GetCBorDDLSlctdItm(ClbckPrmJSObjct.cbBCPrtyID, ClbckPrmJSObjct.cbBCPrtyNm, true, true, true, true)) == null)
            return false;

        if ((ClbckPrmJSObjct.cbBCSlsMnID != null) && (ClbckPrmJSObjct.cbBCSlsMnID != undefined))
        {
            if( !NSRtlr.IsEmpty(ClbckPrmJSObjct.cbBCSlsMnID))
            {
                var CorDItmSalesman = {};
                if ((CorDItmSalesman = NSRtlr.GetCBorDDLSlctdItm(ClbckPrmJSObjct.cbBCSlsMnID, ClbckPrmJSObjct.cbBCSlsMnNm, true, true, true, true)) == null)
                    return false;
            }
        }

        //var ClbckPrmJSObjct = GetCallbackParam();

        BCItmTrnsDataArgmnt.llItemWithPartySeqNo = parseInt(CorDPrty.Data);
        BCItmTrnsDataArgmnt.strMovementTypeCode = ClbckPrmJSObjct.strPageTypeCode;
    
        console.log(BCItmTrnsDataArgmnt);
        NSRtlr.CallWebSrvcMthd("POST", "../RetailerWebService/RtlrWebServiceASMX.asmx/GetItemTrnsData", true,
            "application/json; charset=utf-8",
            JSON.stringify(BCItmTrnsDataArgmnt),
            false,
            "json",
            NSRtlr.OnBarcodeItemDataReceived, NSRtlr.OnBarcodeItemDataErrorReceived, ClbckPrmJSObjct);

        return true;

    },

    OnBarcodeItemDataReceived: function(ClbckPrmJSObjct, xhr, status, data)
    {
        var CorDItmBarcode = {};
        if ((CorDItmBarcode = NSRtlr.GetCBorDDLSlctdItm(ClbckPrmJSObjct.cbBarcodeID, "Barcode", true, false, false, false)) == null)
            return false;

        var EnteredBarcode = CorDItmBarcode.Text;

        //alert(xhr.responseText);

        if ((xhr.responseText == null) || (xhr.responseText == undefined) || (NSRtlr.IsEmpty(xhr.responseText) == true)) {
            NSRtlr.SetErr("Item not Found of Barcode " + EnteredBarcode);

            return;
        }

        var MvmtListJSONData = JSON.parse(xhr.responseText);
        if ((MvmtListJSONData == null) || (MvmtListJSONData == undefined)) {
            NSRtlr.SetErr("Error in Parsing Mvmt Data Item Barcode " + EnteredBarcode + ". Please Contact System Administrator ");
            return;
        }

        //if ((data.d == null) || (data.d == undefined))
        //{
        //    NSRtlr.SetErr("Item not Found of Barcode " + EnteredBarcode);

        //    return;
        //}
        //var MvmtListJSONData = JSON.parse(data.d);
        // alert(MvmtListJSONData.Text);

        OnBarcodeItemDataReceived(ClbckPrmJSObjct, xhr, status, data, MvmtListJSONData);

        NSRtlr.ResetCBorDDLValue(ClbckPrmJSObjct.cbBarcodeID);

        var bBrcdScn = NSRtlr.GetASPNtClntJSElmntByID("chkBrcdScn").checked;
        if (bBrcdScn == true)
        {
            NSRtlr.FocusCBorDDL(ClbckPrmJSObjct.cbBarcodeID);
        }
    },

    OnBarcodeItemDataErrorReceived: function(ClbckPrmJSObjct, xhr, status, error) 
    {
        NSRtlr.SetErr(error);

        var bBrcdScn = NSRtlr.GetASPNtClntJSElmntByID("chkBrcdScn").checked;
        if (bBrcdScn == true)
        {
            NSRtlr.FocusCBorDDL(ClbckPrmJSObjct.cbBarcodeID);
        }
    },

    GetBCItmTrnsDataArgmnt: function (cbBarcodeID, BCItmTrnsDataArgmnt)
    {
        var CorDItmBarcode = {};
        if ((CorDItmBarcode = NSRtlr.GetCBorDDLSlctdItm(cbBarcodeID, "Barcode", true, false, false, false )) == null)
            return false;

        var EnteredBarcode = CorDItmBarcode.Text;

        var ItemTransactionSeqNo = 0;

        if (    (CorDItmBarcode.SlctdIndx == -1)
              &&
                ((EnteredBarcode == null) || (EnteredBarcode == undefined) || NSRtlr.IsEmpty(EnteredBarcode))
        )
        {
            NSRtlr.SetErr("Barcode not Defined");
            return false;
        }

        if (CorDItmBarcode.SlctdIndx != -1)
        {
            var SelectedBarcodeName = CorDItmBarcode.InnerHtml;
            if (SelectedBarcodeName != EnteredBarcode)
            {

                // Since Selected Barcode and Entered Barcode is different. Hence Process will be continue with EnteredBarcode
                // by setting ItemTransactionSeqNo to 0 ;

                ItemTransactionSeqNo = 0;

                // return false;
            }
            else
            {
                ItemTransactionSeqNo = parseInt(CorDItmBarcode.Data);
                if( (ItemTransactionSeqNo == null) || (ItemTransactionSeqNo == undefined) ) {

                    NSRtlr.SetErr("Item Transaction Seq No not Defined for Selected Barcode");
                    return false;
                }
            }
        }

        if (ItemTransactionSeqNo == 0)
        {
            var MinBarcodeLength = parseInt(NSRtlr.GetValByID("hdMinBarcodeLengthToSearch"));
            if (NSRtlr.IsEmpty(MinBarcodeLength)) {
                NSRtlr.SetErr("Minimum Barcode Lengh Field is not Defined");
                return false;
            }

            if (EnteredBarcode.length < MinBarcodeLength) {
                NSRtlr.SetErr("Minimum Barcode Field Length to Search Should be " + MinBarcodeLength + " Digits");
                return false;
            }
        }

        if (ItemTransactionSeqNo != 0)
        {
            BCItmTrnsDataArgmnt.llItemTransactionSeqNo = ItemTransactionSeqNo;
            BCItmTrnsDataArgmnt.strItemBarcode = "";
        }
        else
        {
            BCItmTrnsDataArgmnt.llItemTransactionSeqNo = 0;
            BCItmTrnsDataArgmnt.strItemBarcode = EnteredBarcode;
        }

        return true;
    },

    ProcessPrntAllBCChkBox: function(ElmntSfxID, TableID, TableBdyID, ChkBoxPrntAllBCID, ChkBoxPrntBCID)
    {
        var bChkAllPrntBC = NSRtlr.GetASPNtClntJSElmntByID(ChkBoxPrntAllBCID).checked;

        var NoOfRowsInItmLst = NSRtlr.GetTblBdyRowCnt(TableBdyID);

        for (var iItmIndx = 0; iItmIndx < NoOfRowsInItmLst ; ++iItmIndx)
        {
            NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ChkBoxPrntBCID, iItmIndx).checked = bChkAllPrntBC;
        }
    },

    ResetTableColumnResize: function (tblElmnt)
    {
        var bRstRszClmn = NSRtlr.GetASPNtClntJSElmntByID("chkRstRszClmn").checked;
        if (bRstRszClmn == true)
        {
            NSRtlr.FxGrdVwTblHdr(tblElmnt).trigger("resizableReset");
        }
    },


    RefreshTable: function (TableID)
    {
        var resort = true;
        $(NSRtlr.GetASPNtClntJQryElmntByID(TableID)).trigger("update", [resort]);

        //$(NSRtlr.GetASPNtClntJQryElmntByID(TableID)).trigger("update");
        //$('#' + NSRtlr.GetASPNtClntID(TableID) + '.tablesorter').trigger("update");

        //$(NSRtlr.GetASPNtClntJQryElmntByID(TableID)).trigger("updateAll", [resort]);

        
    },

    GetTblBdyRowCnt: function (TblBdyID)
    {
        return NSRtlr.GetASPNtClntJSElmntByID(TblBdyID).rows.length;

        //return $('#' + NSRtlr.GetASPNtClntID(TblBdyID) + ' tbody tr:not(.remove-me)').length;
    },

    GetTblRowCnt: function (TblID)
    {
        return $('#' + NSRtlr.GetASPNtClntID(TblID) + ' tbody tr:not(.remove-me)').length;
    },

    SetMsg: function( strMsg )
    {
        NSRtlr.SetFtrMsgCtrlTxt('<center><font size="3"><b>', strMsg, '</b></font></center>');
    },

    SetWrn: function( strWrn )
    {
        console.warn(strWrn);

        NSRtlr.SetFtrMsgCtrlTxt('<center><font size="3" color = "blue">', strWrn, '</font><center>');
    },

    SetErr: function( strErr )
    {
        console.error(strErr);

        if (strErr == "Cannot read property 'addParser' of undefined")
            debugger;
        NSRtlr.SetFtrMsgCtrlTxt('<center><font size="3" color = "red">', strErr, '</font><center>');
    },

    SetFtrMsgCtrlTxt: function( strHtmlBgnTags, strTxt, strHtmlEndTags )
    {
        if (strTxt == "")
        {
            NSRtlr.SetInrHTMLByID( "htmlCtrlGenMsg", "" ) ;
        }
        else
        {
            var strPrevMsgs = NSRtlr.GetInrHTMLByID("htmlCtrlGenMsg");
            if (strPrevMsgs == "undefined")
                strPrevMsgs = "";

            NSRtlr.SetInrHTMLByID("htmlCtrlGenMsg", strHtmlBgnTags + strTxt + strHtmlEndTags + "<br/>" + strPrevMsgs);
        }

        //NSRtlr.SetInrHTMLByID(strHtmlBeginTags + strText + strHtmlEndTags);
        
    },

    ProcessTransactionButtons: function()
    {
        var btnInsertElmnt = NSRtlr.GetASPNtClntJSElmntByID("btnRcdInsert");
        var btnUpdateElmnt = NSRtlr.GetASPNtClntJSElmntByID("btnRcdUpdate");
        var btnDeleteElmnt = NSRtlr.GetASPNtClntJSElmntByID("btnRcdDelete");
        var btnPrintElmnt = NSRtlr.GetASPNtClntJSElmntByID("btnRcdPrint");
        var btnPrntBCElmnt = NSRtlr.GetASPNtClntJSElmntByID("btnRcdPrntBC");

        if ((btnInsertElmnt.disabled == true)
            && (btnUpdateElmnt.disabled == true)
            && (btnDeleteElmnt.disabled == true)
           // && (btnPrintElmnt.disabled == true)
           // && (btnPrntBCElmnt.disabled == true)
        )
        {
            btnInsertElmnt.className += " CSSRtlrAnimatedButton";
            btnUpdateElmnt.className += " CSSRtlrAnimatedButton";
            btnDeleteElmnt.className += " CSSRtlrAnimatedButton";
            btnPrintElmnt.className += " CSSRtlrAnimatedButton";
            btnPrntBCElmnt.className += " CSSRtlrAnimatedButton";
        }
    },

    GetQryStrngPrmValue: function( PrmName )
    { 
        var RequestURLPrmsAry = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

        var NoOfPrms = RequestURLPrmsAry.length;
        for (var iPrmIndx = 0; iPrmIndx < NoOfPrms ; iPrmIndx++)
        {
            var URLPrm = RequestURLPrmsAry[iPrmIndx].split("=");
            if (URLPrm[0] == PrmName)
            {
                return URLPrm[1];
            }  
        }

        return "";
    },

    SetValByID: function (ElmntID, Vlue) {

        if (Vlue == "NaN")
        {
            NSRtlr.SetErr("NaN value set for ElmntID " + ElmntID);
            return false;
        }
            
        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByID(ElmntID);
        if( (ElmntObj == null) || (ElmntObj == undefined) )
        {
            NSRtlr.SetErr("Element Object not Found for ElmntID " + ElmntID);
            return false;
        }

        ElmntObj.value = Vlue;

        return true;
    },

    GetValByID: function (ElmntID) {

        return NSRtlr.GetASPNtClntJSElmntByID(ElmntID).value;
    },

    SetAttribByID: function (ElmntID, AttribName, AttrbVlue ) {

        if (AttrbVlue == "NaN")
        {
            NSRtlr.SetErr("NaN attribute value set for ElmntID " + ElmntID + " for Attribute " + AttribName);
            return false;
        }

        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByID(ElmntID);
        if ((ElmntObj == null) || (ElmntObj == undefined))
        {
            NSRtlr.SetErr("Element Object not Found for ElmntID " + ElmntID + " for Attribute " + AttribName);
            return false;
        }

        ElmntObj.setAttribute(AttribName, AttrbVlue);

        return true;

    },

    GetAttribByID: function (ElmntID, AttribName) {

        return NSRtlr.GetASPNtClntJSElmntByID(ElmntID).getAttribute(AttribName);

    },

    SetInrHTMLByID: function (ElmntID, InrHtml)
    {
        if (InrHtml == "NaN")
        {
            NSRtlr.SetErr("NaN text set for ElmntID " + ElmntID);
            return false;
        }

        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByID(ElmntID);
        if ((ElmntObj == null) || (ElmntObj == undefined))
        {
            NSRtlr.SetErr("Element Object not Found for ElmntID " + ElmntID);
            return false;
        }

        ElmntObj.innerHTML = InrHtml;

        return true;
    },

    GetInrHTMLByID: function (ElmntID)
    {
        return NSRtlr.GetASPNtClntJSElmntByID(ElmntID).innerHTML;
    },

    SetValByElmntNameAndIndx: function (ElmntName, ItmIndx, Vlue) {

        if (Vlue == "NaN")
        {
            NSRtlr.SetErr("NaN value set for ElmntName " + ElmntName + " at Index " + ItmIndx);
            return false;
        }

        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx);
        if ((ElmntObj == null) || (ElmntObj == undefined))
        {
            NSRtlr.SetErr("Element Object not Found for ElmntName " + ElmntName + " at Index " + ItmIndx);
            return false;
        }

        ElmntObj.value = Vlue;

        return true;
    },

    GetValByElmntNameAndIndx: function (ElmntName, ItmIndx) {

        return NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx).value
    },

    SetAttribByElmntNameAndIndx: function (ElmntName, ItmIndx, AttribName, AttrbVlue) {

        if (AttrbVlue == "NaN")
        {
            NSRtlr.SetErr("NaN attribute value set for ElmntID " + ElmntID + " for Attribute " + AttribName + " at Index " + ItmIndx);
            return false;
        }

        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx);
        if ((ElmntObj == null) || (ElmntObj == undefined))
        {
            NSRtlr.SetErr("Element Object not Found for ElmntID " + ElmntID + " for Attribute " + AttribName + " at Index " + ItmIndx);
            return false;
        }

        ElmntObj.setAttribute(AttribName, AttrbVlue);

        return true;

    },

    GetAttribByElmntNameAndIndx: function (ElmntName, ItmIndx, AttribName)
    {
        return NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx).getAttribute(AttribName);
    },

    SetInrHTMLByElmntNameAndIndx: function (ElmntName, ItmIndx, InrHtml )
    {
        if (InrHtml == "NaN")
        {
            NSRtlr.SetErr("NaN value set for ElmntName " + ElmntName + " at Index " + ItmIndx);
            return false;
        }

        var ElmntObj = NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx);
        if ((ElmntObj == null) || (ElmntObj == undefined))
        {
            NSRtlr.SetErr("Element Object not Found for ElmntName " + ElmntName + " at Index " + ItmIndx);
            return false;
        }

        ElmntObj.innerHTML = InrHtml;

        return true;

    },

    GetInrHTMLByElmntNameAndIndx: function (ElmntName, ItmIndx)
    {
        return NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, ItmIndx).innerHTML;
    },

    FindElmntIndxByNode: function (ElmntLst, ElmntNode) {

        var ElmntLstSize = ElmntLst.length;
        for( var iElementIndex = 0 ; iElementIndex < ElmntLstSize ; ++iElementIndex)
        {
            if( ElmntLst[iElementIndex] == ElmntNode )
                return iElementIndex ;
        }
        return -1 ;
    },

    FindElmntIndxByValue: function (ElmntLst, ElementValue ) {

        var ElmntLstSize = ElmntLst.length;
        for( var iElementIndex = 0 ; iElementIndex < ElmntLstSize ; ++iElementIndex)
        {
            if (ElmntLst[iElementIndex].value == ElementValue)
                return iElementIndex ;
        }
        return -1 ;
    },

    FindMSAjxElmntByID: function (ElmntID) {

        return $find(NSRtlr.GetASPNtClntID(ElmntID));
    },

    GetASPNtClntID: function (ElmntID) {

        return NSRtlr.GetASPNtClntJQryElmntByID(ElmntID).attr("id");
    },

    GetASPNtClntName: function (ElmntName) {

        return NSRtlr.GetASPNtClntJQryElmntByName(ElmntName).attr("name");
    },

    GetASPNtClntJSElmntByID: function (ElmntID) {

        return document.getElementById(NSRtlr.GetASPNtClntID(ElmntID));

        //return NSRtlr.GetASPNtClntJQryElmntByID(ElmntID)[0];
    },

    GetASPNtClntJSElmntByName: function (ElmntName) {

        return NSRtlr.GetASPNtClntJSElmntByNameAndIndx(ElmntName, 0);

        //return NSRtlr.GetASPNtClntJQryElmntByName(ElmntName)[0];
    },

    GetASPNtClntJQryElmntByID: function (ElmntID) {

        return $("[id$=" + ElmntID + "]");
    },

    GetASPNtClntJQryElmntByName: function (ElmntName) {

        return $("[name$=" + ElmntName + "]");
    },

    GetASPNtClntJSElmntByNameAndIndx: function (ElmntName, ItmIndx) {

        return document.getElementsByName(NSRtlr.GetASPNtClntName(ElmntName)).item(ItmIndx);
        //return document.getElementsByName(NSRtlr.GetASPNtClntName(ElmntName))[ItmIndx];
    },

    FxGrdVwTblHdr: function (tblElmnt) {

        if ((jQuery(tblElmnt).is("table")) && (tblElmnt.find("thead").length == 0)) {
            // No "thead" section
            tblElmnt.prepend("<thead></thead>"); // add thead
            tblElmnt.find("tbody tr:first").remove().appendTo(tblElmnt.find("thead")); // remove first row from tbody, add it to thead
        }

        return tblElmnt;
    },

    LoadFile: function (FilePathToLoad, bAsyncload, ClbckFncName, ErrClbckFncName, ClbckPrmJSObjct)
    {
        var bAsyncCall = true;

        //try {
        //    var head = document.getElementsByTagName("head")[0];

        //    script = document.createElement("script");
        //    script.src = FilePathToLoad;
        //    script.type = "text/javascript";

        //    head.appendChild(script);
        //}
        //catch (err) {
        //    alert( err.message );
        //}

        ////////////////////////////////////////////////////////////////////

        //$.getScript(FilePathToLoad)
        //    .done(function (data, textStatus, jqxhr) {
        //        // console.log(data); // Data returned
        //        console.log(textStatus); // Success
        //        console.log(jqxhr.status); // 200
        //        console.log("Load was performed.");

        //        if (ClbckFncName != undefined) {
        //            ClbckFncName( ClbckPrmJSObjct );
        //        }
        //    })
        //    .fail(function (jqxhr, settings, exception) {
        //        console.log(exception);
        //    });

        ////////////////////////////////////////////////////////////////////

        //if( ( bAsyncload != undefined ) && (bAsyncload == false) ) {
        //    $.ajaxSetup({ async: false });
        //}
        //$.getScript(FilePathToLoad, function (data, textStatus, jqxhr) {

        //    // console.log(data); // Data returned

        //    if (jqxhr.status != 200) {
        //        NSRtlr.SetErr("Loading File Failed for " + FilePathToLoad + " LOAD STATUS: " + textStatus + " ERR CODE: " + jqxhr.status);
        //    }
        //    else {
        //        console.log("Loading File Success for " + FilePathToLoad + " LOAD STATUS: " + textStatus + " ERR CODE: " + jqxhr.status);

        //        if (ClbckFncName != undefined) {
        //            ClbckFncName(ClbckPrmJSObjct);
        //        }
        //    }
        //});

        //if ((bAsyncload != undefined) && (bAsyncload == false)) {
        //    $.ajaxSetup({ async: true });
        //}

        ////////////////////////////////////////////////////////////////////

        if ((bAsyncload != null) && (bAsyncload != undefined))
        {
            bAsyncCall = bAsyncload;
        }

        $.ajax({

            url: FilePathToLoad,

            async: bAsyncCall,

            success: function(result, status, xhr){
                console.log("Loading File Success for " + FilePathToLoad + " LOAD STATUS: " + status + " ERR CODE: " + xhr.status);
            },

            error: function(xhr, status, error){
                NSRtlr.SetErr("Loading File Failed for " + FilePathToLoad + " LOAD STATUS: " + status + " ERR CODE: " + xhr.status + " ERR MSG: " + error);
                if ((ErrClbckFncName != null) && (ErrClbckFncName != undefined))
                {
                    ErrClbckFncName(ClbckPrmJSObjct, xhr, status, error);
                }
            },

            complete: function (xhr, status){
                if(xhr.status == 200)
                {
                    if ((ClbckFncName != null) && (ClbckFncName != undefined))
                    {
                        ClbckFncName(ClbckPrmJSObjct);
                    }
                }
            },

        });

    },

    CallWebSrvcMthd: function (CallType, WebSrvcMthdURL,
            bAsyncload,
            SrvcRqstDataType, SrvcMthdPrmObjct,
            bTrnsfrmRqstDataToQryStrng,
            SrvcRspnsDataType,
            ClbckFncName, ErrClbckFncName, ClbckPrmJSObjct)
    {
        var bAsyncCall = true;

        if ((bAsyncload != null) && (bAsyncload != undefined))
        {
            bAsyncCall = bAsyncload;
        }

        var SrvcRqstCntntType = false;
        if ((SrvcRqstDataType != null) && (SrvcRqstDataType != undefined))
        {
            SrvcRqstCntntType = SrvcRqstDataType;
        }
       
        $.ajax({

            type: CallType,

            url: WebSrvcMthdURL,

            async: bAsyncCall,

            contentType: SrvcRqstCntntType,

            data: SrvcMthdPrmObjct,
            
            processData: bTrnsfrmRqstDataToQryStrng,

            dataType: SrvcRspnsDataType,

            success: function(result, status, xhr){
                console.log("Calling Web Service Method for " + WebSrvcMthdURL + " LOAD STATUS: " + status + " ERR CODE: " + xhr.status);
                if (xhr.status == 200)
                {
                    if ((ClbckFncName != null) && (ClbckFncName != undefined))
                    {
                        ClbckFncName(ClbckPrmJSObjct, xhr, status, result);
                    }
                }
            },

            error: function(xhr, status, error){
                NSRtlr.SetErr("Calling Web Service Method for " + WebSrvcMthdURL + " LOAD STATUS: " + status + " ERR CODE: " + xhr.status + " ERR MSG: " + error);
                if ((ErrClbckFncName != null) && (ErrClbckFncName != undefined))
                {
                    ErrClbckFncName(ClbckPrmJSObjct, xhr, status, error);
                }
            },

            complete: function (xhr, status, data) {
                if(xhr.status == 200)
                {
                    //if( (ClbckFncName != null) && (ClbckFncName != undefined) ){
                        //ClbckFncName(ClbckPrmJSObjct, xhr, status, data);
                    //}
                }
            },

        });

    },

    //RgstrCntrlEvnt: function (CntrlID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    //{
    //    var ElmntNode = NSRtlr.GetASPNtClntJSElmntByID(CntrlID);
        

    //    //$(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).on(EvntName, function (EvntObjct) {
    //    //    ClbckFncName(ElmntNode, EvntObjct)
    //    //});

    //    // First Unregister the event on CntrlID for the given EvntName using .off
    //    // And then register using .on
    //    // Hence, the event will be triggered only once respective to CntrlID for given EvntName
    //    $(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).off(EvntName).on(EvntName, function (EvntObjct) {
    //        ClbckFncName(ElmntNode, EvntObjct, ClbckPrmJSObjct)
    //    });
    //},

    UnRgstrCntrlEvnt: function (CntrlID, EvntName)
    {
        var ElmntNode = NSRtlr.GetASPNtClntJSElmntByID(CntrlID);

        // First Unregister the event on CntrlID for the given EvntName using .off
        // And then register using .on
        // Hence, the event will be triggered only once respective to CntrlID for given EvntName
        $(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).off(EvntName);
    },

    RgstrCntrlEvnt: function (CntrlID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        var ElmntNode = NSRtlr.GetASPNtClntJSElmntByID(CntrlID);


        $(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).on(EvntName, function (EvntObjct) {
            ClbckFncName(ElmntNode, EvntObjct, ClbckPrmJSObjct);
        });

        //// First Unregister the event on CntrlID for the given EvntName using .off
        //// And then register using .on
        //// Hence, the event will be triggered only once respective to CntrlID for given EvntName
        //$(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).off(EvntName).on(EvntName, function (EvntObjct) {
        //    ClbckFncName(ElmntNode, EvntObjct, ClbckPrmJSObjct)
        //});
    },

    DsblMouseWhlEvntOnSlctr: function( SlctrID )
    {
        $(SlctrID).on('mousewheel', function (e) {
             e.preventDefault();
        });
    },

    RgstrTxtBxEvnt: function (TxtBxID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        NSRtlr.RgstrCntrlEvnt(TxtBxID, EvntName, ClbckFncName, ClbckPrmJSObjct);
    },

    RgstrBtnEvnt: function (BtnID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        NSRtlr.RgstrCntrlEvnt(BtnID, EvntName, ClbckFncName, ClbckPrmJSObjct);
    },

    RgstrChkBxEvnt: function (ChkBxID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        NSRtlr.RgstrCntrlEvnt(ChkBxID, EvntName, ClbckFncName, ClbckPrmJSObjct);
    },

    RgstrCntrlEvntOnClass: function (CntrlID, EvntName, ClsName, ClbckFncName, ClbckPrmJSObjct)
    {
        // First Unregister the event on CntrlID for the given EvntName and ClsName using .off
        // And then register using .on
        // Hence, the event will be triggered only once respective to CntrlID for given EvntName and ClsName

        //$(NSRtlr.GetASPNtClntJQryElmntByID(CntrlID)).off(EvntName, ClsName).on(EvntName, ClsName, ClbckFncName);

        //var ElmntNode = NSRtlr.GetASPNtClntJSElmntByID(CntrlID);

        var JQueryElmntNode = NSRtlr.GetASPNtClntJQryElmntByID(CntrlID);
        $(JQueryElmntNode).off(EvntName, ClsName).on(EvntName, ClsName, null,
                function (EvntObjct) {
                    ClbckFncName(this, EvntObjct, ClbckPrmJSObjct)
                });
    },

    RgstrTblEvntOnClass: function (TableID, EvntName, ClsName, ClbckFncName, ClbckPrmJSObjct)
    {
        NSRtlr.RgstrCntrlEvntOnClass(TableID, EvntName, ClsName, ClbckFncName, ClbckPrmJSObjct);
    },

    //RgstrCBorDDLEvnt: function (CBID, EvntName, ClbckFncName)
    //{
    //    $find(CBID).add_propertyChanged(function (sender, evt) {
    //        if (evt.get_propertyName() == EvntName) {
    //            ClbckFncName(sender, evt)
    //        }
    //    })
    //},

    AlertParamObjectName: function (SndrNode, EvntObjct, ClbckPrmJSObjct)
    {
        alert(SndrNode);
        alert(SndrNode.name);
        alert(SndrNode.id);
        alert(EvntObjct);
        alert(ClbckPrmJSObjct);
        alert(EvntObjct.type);
        alert(EvntObjct.target.id);
        alert(EvntObjct.keyCode);
    },

    UnRgstrCBEvent: function (CBID, EvntName, ClbckFncName)
    {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if( (cbElmnt == null) || (cbElmnt == undefined) ) {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }

        //cbElmnt.remove_propertyChanged(ClbckFncName);

        if (EvntName == "selectedIndex") {
            NSRtlr.GetASPNtClntJSElmntByID(CBID).removeEventListener("selectedIndex", ClbckFncName);
            cbElmnt.remove_propertyChanged(ClbckFncName);
            //cbElmnt.remove_selectedIndexChanged(ClbckFncName);
            //$clearHandlers(cbElmnt);
            alert('hatim');
        }        
    },

    UnRgstrDDLEvent: function (DDLID, EvntName, ClbckFncName)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined)) {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        if (EvntName == "selectedIndex") {
            EvntName = "change";
        }

        NSRtlr.UnRgstrCntrlEvnt(DDLID, EvntName);

        return true;
    },

    RgstrCBEvent: function (CBID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        // First Unregister the event on CBID for the given EvntName using remove_propertyChanged
        // And then register using add_propertyChanged
        // Hence, the event will be triggered only once respective to CBID for given EvntName and ClbckFncName

        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined))
        {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }

        cbElmnt.remove_propertyChanged(ClbckFncName);
        
        cbElmnt.add_propertyChanged(function (ElmntNode, EvntObjct) {
            if (EvntObjct.get_propertyName() == EvntName) {
                ClbckFncName(ElmntNode, EvntObjct, ClbckPrmJSObjct)
            }
        });

        return true;
    },

    RgstrDDLEvent: function (DDLID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {
        // First Unregister the event on DropDownID for the given EvntName using remove_propertyChanged
        // And then register using add_propertyChanged
        // Hence, the event will be triggered only once respective to DropDownID for given EvntName and ClbckFncName

        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined))
        {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        if (EvntName == "selectedIndex") {
            EvntName = "change";
        }

        NSRtlr.RgstrCntrlEvnt(DDLID, EvntName, ClbckFncName, ClbckPrmJSObjct)

        return true;
    },

    //selected index:         $find("<%=cboName.ClientID%>").get_hiddenFieldControl().value;
    //selected index (again): $find("<%=cboName.ClientID%>").get_selectedIndex();
    //selected text:          $find("<%=cboName.ClientID%>").get_textBoxControl().value;

    ResetCB: function (cbElmnt)
    {
        if (cbElmnt)
        {
            //ComboBoxCtrl._optionListHeight = null ;
            //ComboBoxCtrl._optionListWidth = null ;
            cbElmnt._highlightedIndex = -1;

            //ComboBoxCtrl._buttonControl.style.height = "" ;
            //ComboBoxCtrl._buttonControl.style.width = "" ;
            //ComboBoxCtrl._buttonControl.style.margin = "" ;
            //ComboBoxCtrl._buttonControl.style.padding = "" ;

            cbElmnt.get_textBoxControl().value = "";
            cbElmnt.set_selectedIndex(-1);
        }
    },

    InitCB: function (cbElmnt)
    {
        if (cbElmnt)
        {
            Sys.Application.removeComponent(cbElmnt._popupBehavior);
            cbElmnt.initializeOptionList();
            cbElmnt.initializeButton();
            cbElmnt._popupBehavior._visible = false;
        }
    },

    AddItmsToCB: function (CBID, ItmsList, TxtFldName, ValFldName, bAddAtrrb, bRmveExtngItms)
    {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined)) {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }

        // You need to reset the Control
        NSRtlr.ResetCB(cbElmnt);

        if (bRmveExtngItms == true)
        {
            //while (cbElmnt._optionListControl.hasChildNodes()) {
            //    cbElmnt._optionListControl.removeChild(cbElmnt._optionListControl.lastChild);
            //}

            NSRtlr.RemoveItmsFrmCB(CBID);
        }        

        var NoOfItms = ItmsList.length;

        for (var indx = 0; indx < NoOfItms; ++indx) {

            //console.log("Text: " + DataItemsList[indx].Text);
            //console.log("Value: " + DataItemsList[indx].Value);

            var LIItm = document.createElement("LI");

            LIItm.innerHTML = ItmsList[indx][TxtFldName];

            if (bAddAtrrb == true) {
                LIItm.setAttribute("DTATR", ItmsList[indx][ValFldName]);
            }

            cbElmnt._optionListControl.appendChild(LIItm);
        }

        // You need to reinitialize the Control
        NSRtlr.InitCB(cbElmnt);

        cbElmnt._buttonControl.disabled = false;
        cbElmnt._optionListControl.disabled = false;
        cbElmnt._textBoxControl.disabled = false;

        return true;
    },

    AddItmsToDDL: function (DDLID, ItmsList, TxtFldName, ValFldName, bAddAtrrb, bRmveExtngItms)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined))
        {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        if (bRmveExtngItms == true) {
            //$(ddlElmnt).find('option').remove();
            NSRtlr.RemoveItmsFrmDDL(DDLID);
        }

        var docfrag = document.createDocumentFragment();

        var NoOfItms = ItmsList.length;

        for (var indx = 0; indx < NoOfItms; ++indx) {

            //console.log("Text: " + DataItemsList[indx].Text);
            //console.log("Value: " + DataItemsList[indx].Value);

            var Opt = new Option(ItmsList[indx][TxtFldName], ItmsList[indx][ValFldName]);

            if (bAddAtrrb == true) {
                Opt.setAttribute("DTATR", ItmsList[indx][ValFldName]);
            }

            docfrag.appendChild(Opt);
        }

        ddlElmnt.appendChild(docfrag);

        return true;
    },

    RemoveItmsFrmCB: function (CBID) {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined)) {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }

        while (cbElmnt._optionListControl.hasChildNodes()) {
            cbElmnt._optionListControl.removeChild(cbElmnt._optionListControl.lastChild);
        }

        return true;
    },

    RemoveItmsFrmDDL: function (DDLID) {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined)) {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        $(ddlElmnt).find('option').remove();

        return true;
    },

    ResetCBValue: function (CBID) {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined)) {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }

        cbElmnt.get_textBoxControl().value = "";
        cbElmnt.set_selectedIndex(-1);

        return true;
    },

    ResetDDLValue: function (DDLID)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined)) {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        ddlElmnt.selectedIndex = -1;
        ddlElmnt.value = '';
        ddlElmnt.text = '';

        return true;
    },

    GetDDLSlctdItm: function (DDLID, DDLName, bVldtIndx, bVldtTxt, bVldtData) {
        var DDLItm = NSRtlr.CreateCBorDDLItem();

        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined)) {

            NSRtlr.SetErr(DDLName + " DropDown Not Found for ID " + DDLID);

            return null;
        }


        var SlctdIndx = ddlElmnt.selectedIndex;
        var TxtBoxElement = ddlElmnt;

        if ((bVldtIndx == true) && (SlctdIndx < 0)) {

            NSRtlr.SetErr(DDLName + " DropDown Index Not Defined/Selected");

            return null;
        }

        //alert(DDLID + ' ' + SlctdIndx);

        var opt = ddlElmnt.options[SlctdIndx];

        var ddlText = "";
        var ddlData = "";
        var ddlInnerHtml = "";

        if (SlctdIndx >= 0) {

            ddlText = opt.text;

            ddlData = opt.value;

            ddlInnerHtml = opt.innerHTML;
        }

        if ((bVldtTxt == true) && (NSRtlr.IsEmpty(ddlText))) {

            NSRtlr.SetErr(DDLName + " DropDown Index Not Defined/Selected");
            return null;
        }

        if ((bVldtData == true) && (((ddlData == null) || (ddlData == undefined) || NSRtlr.IsEmpty(ddlData)))) {

            NSRtlr.SetErr(DDLName + " DropDown Data Not Defined/Selected");

            return null;
        }

        DDLItm.Element = ddlElmnt;
        DDLItm.Text = ddlText;
        DDLItm.Data = ddlData;
        DDLItm.SlctdIndx = SlctdIndx;
        DDLItm.InnerHtml = ddlInnerHtml;
        DDLItm.TxtBoxID = TxtBoxElement.id;
        DDLItm.TxtBoxElement = TxtBoxElement;

        return DDLItm;
    },

    GetCBSlctdItm: function (CBID, CBName, bVldtIndx, bVldtTxt, bVldtData) {
        var CorDItm = NSRtlr.CreateCBorDDLItem();

        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined)) {

            NSRtlr.SetErr(CBName + " ComboBox Not Found for ID " + CBID);

            return null;
        }

        var SlctdIndx = cbElmnt.get_selectedIndex();
        var TxtBoxElement = cbElmnt.get_textBoxControl();

        if ((bVldtIndx == true) && (SlctdIndx < 0)) {

            NSRtlr.SetErr(CBName + " ComboBox Index Not Defined/Selected");

            return null;
        }

        var cbText = TxtBoxElement.value;

        if ((bVldtTxt == true) && (NSRtlr.IsEmpty(cbText))) {
            NSRtlr.SetErr(CBName + " ComboBox Text Field is Empty");
            return null;
        }

        var cbData = "";
        var cbInnerHtml = "";
        if (SlctdIndx >= 0) {
            cbData = cbElmnt._optionListControl.getElementsByTagName("li")[SlctdIndx].getAttribute("DTATR");

            cbInnerHtml = cbElmnt._optionListControl.getElementsByTagName("li")[SlctdIndx].innerHTML;

        }

        if ((bVldtData == true) && (((cbData == null) || (cbData == undefined) || NSRtlr.IsEmpty(cbData)))) {

            NSRtlr.SetErr(CBName + " ComboBox Data Not Defined/Selected");

            return null;
        }

        CorDItm.Element = cbElmnt;
        CorDItm.Text = cbText;
        CorDItm.Data = cbData;
        CorDItm.SlctdIndx = SlctdIndx;
        CorDItm.InnerHtml = cbInnerHtml;
        CorDItm.TxtBoxID = TxtBoxElement.id;
        CorDItm.TxtBoxElement = TxtBoxElement;

        return CorDItm;
    },

    SetCBIndxByVal: function (CBID, txtVal)
    {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        var cbItmCnt = cbElmnt._optionListControl.childNodes.length ;
        var cbHiddenCtrl = cbElmnt._hiddenFieldControl;

        for (var iIndx = 0; iIndx < cbItmCnt; ++iIndx)
        {
            if (cbElmnt._optionListControl.childNodes[iIndx].innerText == txtVal)
            {
                //debugger;
                cbHiddenCtrl.value = iIndx ;
                cbElmnt.get_textBoxControl().value = txtVal;
                return true ;
            }
        }

        return false ;
    },

    SetDDLIndxByVal: function (DDLID, txtVal)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        var ddlItmCnt = ddlElmnt.options.length;
        
        for (var iIndx = 0; iIndx < ddlItmCnt; ++iIndx)
        {
            if (ddlElmnt.options[iIndx].innerText == txtVal) {
                //debugger;
                ddlElmnt.selectedIndex = iIndx;
                return true;
            }
        }

        return false;
    },

    SetCBIndxByDta: function (CBID, txtDta)
    {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        var cbItmCnt = cbElmnt._optionListControl.childNodes.length;
        var cbHiddenCtrl = cbElmnt._hiddenFieldControl;

        for (var iIndx = 0; iIndx < cbItmCnt; ++iIndx)
        {
            var cbData = cbElmnt._optionListControl.getElementsByTagName("li")[iIndx].getAttribute("DTATR");

            if (cbData == txtDta)
            {
                //debugger;
                cbHiddenCtrl.value = iIndx;
                cbElmnt.get_textBoxControl().value = cbElmnt._optionListControl.childNodes[iIndx].innerText;
                return true;
            }
        }

        return false;
    },

    SetDDLIndxByDta: function (DDLID, txtDta)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        var ddlItmCnt = ddlElmnt.options.length;
        
        for (var iIndx = 0; iIndx < ddlItmCnt; ++iIndx)
        {
            var opt = ddlElmnt.options[iIndx];

            if (opt.value == txtDta) {
                //debugger;
                ddlElmnt.value = txtDta;
                //ddlElmnt.text = opt.text;
                ddlElmnt.options[iIndx].selected = true;

                ddlElmnt.selectedIndex = iIndx;

                $(NSRtlr.GetASPNtClntJQryElmntByID(DDLID)).val(txtDta).trigger('change');

                return true;
            }
        }

        return false;
    },

    FocusCB: function (CBID)
    {
        var cbElmnt = NSRtlr.FindMSAjxElmntByID(CBID);
        if ((cbElmnt == null) || (cbElmnt == undefined)) {
            NSRtlr.SetErr("ComboBox Not Found for ID " + CBID);
            return false;
        }
        cbElmnt.get_textBoxControl().focus() ;

        return true;
    },

    FocusDDL: function (DDLID)
    {
        var ddlElmnt = NSRtlr.GetASPNtClntJSElmntByID(DDLID);
        if ((ddlElmnt == null) || (ddlElmnt == undefined)) {
            NSRtlr.SetErr("DropDown Not Found for ID " + DDLID);
            return false;
        }

        $(NSRtlr.GetASPNtClntJQryElmntByID(DDLID)).select2('open');

        return true;
    },
    
    CreateCBorDDLItem: function () {
        var CBOrDDLItem = {};

        CBOrDDLItem.Element = null;
        CBOrDDLItem.Text = "";
        CBOrDDLItem.Data = "";
        //CBOrDDLItem.SlctdIndx = 1;
        CBOrDDLItem.SlctdIndx = -1;
        CBOrDDLItem.TxtBoxID = "";
        CBOrDDLItem.TxtBoxElement = null;

        return CBOrDDLItem;
    },

    AddItmsToCBorDDL: function (CBorDDLID, ItmsList, TxtFldName, ValFldName, bAddAtrrb, bRmveExtngItms) {

        //for (var i = 0; i < DataItemsList.length; ++i) {
        //    for (var name in DataItemsList[i]) {
        //        console.log("Item name: " + name);
        //        console.log("Target: " + DataItemsList[i][name]);
        //    }
        //}

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID) ;
        if (CBorDDLType == "SELECT") {
            return NSRtlr.AddItmsToDDL(CBorDDLID, ItmsList, TxtFldName, ValFldName, bAddAtrrb, bRmveExtngItms);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.AddItmsToCB(CBorDDLID, ItmsList, TxtFldName, ValFldName, bAddAtrrb, bRmveExtngItms);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    RemoveItmsFrmCBorDDL: function (CBorDDLID) {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.RemoveItmsFrmDDL(CBorDDLID);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.RemoveItmsFrmCB(CBorDDLID);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    ResetCBorDDLValue: function (CBorDDLID) {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.ResetDDLValue(CBorDDLID);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.ResetCBValue(CBorDDLID);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    SetCBorDDLIndxByVal: function (CBorDDLID, txtVal)
    {
        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.SetDDLIndxByVal(CBorDDLID, txtVal);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.SetCBIndxByVal(CBorDDLID, txtVal);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    SetCBorDDLIndxByDta: function (CBorDDLID, txtDta)
    {
        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.SetDDLIndxByDta(CBorDDLID, txtDta);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.SetCBIndxByDta(CBorDDLID, txtDta);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    RgstrCBorDDLEvnt: function (CBorDDLID, EvntName, ClbckFncName, ClbckPrmJSObjct)
    {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.RgstrDDLEvent(CBorDDLID, EvntName, ClbckFncName, ClbckPrmJSObjct) ;
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.RgstrCBEvent(CBorDDLID, EvntName, ClbckFncName, ClbckPrmJSObjct) ;
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    UnRgstrCBorDDLEvnt: function (CBorDDLID, EvntName, ClbckFncName)
    {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.UnRgstrDDLEvent(CBorDDLID, EvntName, ClbckFncName);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.UnRgstrCBEvent(CBorDDLID, EvntName, ClbckFncName);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    GetCBorDDLSlctdItm: function (CBorDDLID, CBorDDLName, bVldtElmnt, bVldtIndx, bVldtTxt, bVldtData)
    {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.GetDDLSlctdItm(CBorDDLID, CBorDDLName, bVldtIndx, bVldtTxt, bVldtData);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.GetCBSlctdItm(CBorDDLID, CBorDDLName, bVldtIndx, bVldtTxt, bVldtData);
        }

        if (bVldtElmnt == true)
        {
            NSRtlr.SetErr(CBorDDLName + " Element Not Found for ID " + CBorDDLID);
        }
        
        return null;
    },

    FocusCBorDDL: function (CBorDDLID) 
    {

        var CBorDDLType = NSRtlr.GetCBorDDLType(CBorDDLID);
        if (CBorDDLType == "SELECT") {
            return NSRtlr.FocusDDL(CBorDDLID);
        }
        else if (CBorDDLType == "DIV") {
            return NSRtlr.FocusCB(CBorDDLID);
        }

        NSRtlr.SetErr("Element Not Found for ID " + CBorDDLID);

        return false;
    },

    GetCBorDDLType: function (CBorDDLID)
    {
        //console.log(NSRtlr.GetASPNtClntJSElmntByID('DropDownList1').nodeName + ' ' + NSRtlr.GetASPNtClntJSElmntByID('DropDownList1').tagName + ' ' + NSRtlr.GetASPNtClntJSElmntByID('DropDownList1').type);
        //console.log(NSRtlr.GetASPNtClntJSElmntByID('ComboBox1').nodeName + ' ' + NSRtlr.GetASPNtClntJSElmntByID('ComboBox1').tagName + ' ' + NSRtlr.GetASPNtClntJSElmntByID('ComboBox1').type);

        var CBorDDLType = "";

        var CBorDDLElmnt = NSRtlr.GetASPNtClntJSElmntByID(CBorDDLID);
        if ((CBorDDLElmnt != null) && (CBorDDLElmnt != undefined))
        {
            CBorDDLType = CBorDDLElmnt.nodeName;
        }

        return CBorDDLType;
    },

    // If Tab Container ID is "tcTabCntnr" and Tab Panel ID is "MyPanel1" Then
    // alert(NSRtlr.GetASPNtClntID("MainContent_tcInvtryRtn_MyPanel1")); 
    //      returns "__tab_MainContent_tcInvtryRtn_MyPanel1
    //
    // var tabPanel = NSRtlr.GetTabContainerTabPanel(NSRtlr.GetASPNtClntID("tcTabCntnr"), "MyTab1");
    //      returns tabPanel element of Tab Panel Name "MyTab1" inside Tab Container of ID "tcTabCntnr"
    //
    // tabPanel._tab.id() 
    //      returns "MainContent_tcInvtryRtn_MyPanel1_tab"
    //
    // tabPanel.get_id() 
    //      returns "MainContent_tcInvtryRtn_MyPanel1"

    GetTabCntnrTabPnlUsngHeaderName: function (TabCntnrID, TabHeaderName)
    {
        var TabCntnrElmnt = NSRtlr.FindMSAjxElmntByID(TabCntnrID);
        if ((TabCntnrElmnt == null) || (TabCntnrElmnt == undefined))
        {
            return null;
        }

        var TabPnlsLst = TabCntnrElmnt.get_tabs();

        for (var TabPnlIndx in TabPnlsLst)
        {
            var TabPnlElmnt = TabCntnrElmnt._tabs[TabPnlIndx];

            if (TabPnlElmnt.get_headerText() == TabHeaderName) {
                return TabPnlElmnt;
            }
        }

        return null;
    },

    GetTabCntnrTabPnlUsngTabPnlID: function (TabCntnrID, TabPnlID, IDDelimiter )
    {
        //alert(TabCntnrID);
        //alert(TabPnlID);

        var TabCntnrElmnt = NSRtlr.FindMSAjxElmntByID(TabCntnrID);
        if ((TabCntnrElmnt == null) || (TabCntnrElmnt == undefined)) {
            return null;
        }

        var TabPnlsLst = TabCntnrElmnt.get_tabs();

        for (var TabPnlIndx in TabPnlsLst) {

            var TabPnlElmnt = TabCntnrElmnt._tabs[TabPnlIndx];
            
            if (TabPnlElmnt.get_id() == TabCntnrID + IDDelimiter + TabPnlID) {
                
                return TabPnlElmnt;
            }
        }

        return null;
    },

    CreateTabCntnrTabPnl: function (TabCntnrID, TabPnlID, IDDelimiter, TabIndex, HeaderName, TabPnlBdyHtml)
    {
        //create header
        var TabCntnrHdrID = TabCntnrID + "_header";
        var TabCntnrHdrElmnt = $get( TabCntnrHdrID ) ;
        
        var TabCntnrTabPnlID = TabCntnrID + IDDelimiter + TabPnlID;

        var TabPnlHdrID = "__tab_" + TabCntnrTabPnlID ;

        var TabPnlHdrHTML =     '<span id="' + TabCntnrTabPnlID + '_tab" class="ajax__tab">'
                                    +    '<span class="ajax__tab_outer">'
                                    +        '<span class="ajax__tab_inner">'
                                    +            '<a class="ajax__tab_tab" id="' + TabPnlHdrID + '" href="#" style="text-decoration:none;">'
//                                    +                '<span>' + HeaderName + '</span>'
                                    +                   HeaderName
                                    +            '</a>'
                                    +        '</span>'
                                    +    '</span>'
                                    +'</span>'

        //$("[id$=" + TabCntnrHdrID + "]").append( TabPnlHdrHTML ) ;
        $("#" + TabCntnrHdrID).append(TabPnlHdrHTML);
        

        var TabCntnrBdyID = TabCntnrID + "_body";
        var TabCntnrBdyElmnt = $get(TabCntnrBdyID);

        if ((TabPnlBdyHtml == null) || (TabPnlBdyHtml == undefined))
        {
            TabPnlBdyHtml = "";
        }

        var PanelBodyHTML =           '<div id="' + TabCntnrTabPnlID + '" class="ajax__tab_panel">'
                                    +       TabPnlBdyHtml
                                    + '</div>';

        //$("[id$=" + TabCntnrBdyID + "]").append(PanelBodyHTML);
        $("#" + TabCntnrBdyID).append(PanelBodyHTML);
                
        //$create(Sys.Extended.UI.TabPanel, { "headerTab": $get("__tab_" + TabCntnrTabPnlID), "ownerID": TabCntnrID, "wasLoadedOnce": false }, null, { "owner": tabContainerID }, $get(TabCntnrTabPnlID));
        //$create(Sys.Extended.UI.TabPanel, { "headerTab": $get("__tab_MainContent_tcInvtry_tpInvtryList"), "ownerID": "MainContent_tcInvtry", "wasLoadedOnce": false }, null, { "owner": "MainContent_tcInvtry" }, $get("MainContent_tcInvtry_tpInvtryList"));
        //$create(Sys.Extended.UI.TabPanel, { "headerTab": $get("__tab_MainContent_tcInvtry_tpInvtryDtls"), "ownerID": "MainContent_tcInvtry", "wasLoadedOnce": false }, null, { "owner": "MainContent_tcInvtry" }, $get("MainContent_tcInvtry_tpInvtryDtls"));
        $create(Sys.Extended.UI.TabPanel, { "headerTab": $get(TabPnlHdrID), "ownerID": TabCntnrID, "wasLoadedOnce": false }, null, { "owner": TabCntnrID }, $get(TabCntnrTabPnlID));

        //Set New Tab Panel To Active
        var TabCntnrElmnt = NSRtlr.FindMSAjxElmntByID(TabCntnrID);
        TabCntnrElmnt.set_activeTabIndex(TabIndex);

        return NSRtlr.GetTabCntnrTabPnlUsngTabPnlID(TabCntnrID, TabPnlID, IDDelimiter);
    },


    IsEmpty: function(InputData)
    {
        return (Boolean)(!InputData || (!/[^\s]+/.test(InputData)));
    },

    //IsNumeric: function(InputData)
    //{
    //    return ( Boolean ) ( ( !isNaN(parseFloat( InputData ) ) ) && ( isFinite( InputData ) ) ) ;
    //}

    IsNumeric: function (InputData)
    {
        var RegExpression = /^-{0,1}\d*\.{0,1}\d+$/;

        ///^ match beginning of string
        //-{0,1} optional negative sign
        //\d* optional digits
        //\.{0,1} optional decimal point
        //\d+ at least one digit
        //$/ match end of string

        return (Boolean)(RegExpression.test(InputData));
    },

    TestIsNumeric: function () {
        var Rslt = "";
        Rslt += (IsNumeric('-1') ? "Pass" : "Fail") + ": IsNumeric('-1') => true\n";
        Rslt += (IsNumeric('-1.5') ? "Pass" : "Fail") + ": IsNumeric('-1.5') => true\n";
        Rslt += (IsNumeric('0') ? "Pass" : "Fail") + ": IsNumeric('0') => true\n";
        Rslt += (IsNumeric('0.42') ? "Pass" : "Fail") + ": IsNumeric('0.42') => true\n";
        Rslt += (IsNumeric('.42') ? "Pass" : "Fail") + ": IsNumeric('.42') => true\n";
        Rslt += (!IsNumeric('99,999') ? "Pass" : "Fail") + ": IsNumeric('99,999') => false\n";
        Rslt += (!IsNumeric('0x89f') ? "Pass" : "Fail") + ": IsNumeric('0x89f') => false\n";
        Rslt += (!IsNumeric('#abcdef') ? "Pass" : "Fail") + ": IsNumeric('#abcdef') => false\n";
        Rslt += (!IsNumeric('1.2.3') ? "Pass" : "Fail") + ": IsNumeric('1.2.3') => false\n";
        Rslt += (!IsNumeric('') ? "Pass" : "Fail") + ": IsNumeric('') => false\n";
        Rslt += (!IsNumeric('blah') ? "Pass" : "Fail") + ": IsNumeric('blah') => false\n";

        return Rslt;
    },

    ObjectStringify: function ( PrmObjct )
    {
        var simpleObject = {};

        for (var prop in PrmObjct)
        {
            if (!PrmObjct.hasOwnProperty(prop))
            {
                continue;
            }

            if (typeof (PrmObjct[prop]) == 'object')
            {
                continue;
            }

            if (typeof (PrmObjct[prop]) == 'function')
            {
                continue;
            }

            simpleObject[prop] = PrmObjct[prop];
        }

        return JSON.stringify(simpleObject); // returns cleaned up JSON
    }

};