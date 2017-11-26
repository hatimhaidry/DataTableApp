function initTable( TblID )
{
    var tblItmLstElement = NSRtlr.GetASPNtClntJQryElmntByID(TblID);

    $.fn.dataTableExt.ofnSearch['html-input'] = function (value) {
        return $(value).val();
    };

    $.fn.dataTableExt.ofnSearch['html-input-num'] = function (value) {
        return parseFloat($(value).val());
    };

    /* Create an array with the values of all the input boxes in a column */
    $.fn.dataTable.ext.order['dom-text'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('input', td).val();
        });
    }

    /* Create an array with the values of all the input boxes in a column, parsed as numbers */
    $.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('input', td).val() * 1;
        });
    }

    /* Create an array with the values of all the select options in a column */
    $.fn.dataTable.ext.order['dom-select'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('select', td).val();
        });
    }

    /* Create an array with the values of all the checkboxes in a column */
    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            return $('input', td).prop('checked') ? '1' : '0';
        });
    }




    var TblObject = $(tblItmLstElement).DataTable({
        columnDefs: [
           { "orderable": false, "searchable": false, "targets": [0, 4] },
           { "type": "html-input-num", "orderDataType": "dom-checkbox", "targets": [1] },
           { "type": "html-input", "targets": [3, 5, 6] },
           { "type": "html-input-num", "orderDataType": "dom-text-numeric", "targets": [7] }
        ],
        fixedHeader: {
            header: true,
            footer: true
        },
        fixedColumns: {
            leftColumns: 4
        },
        scrollY: 150,
        scrollX: true,
        //autoWidth:true,
        paging: false,
        info: false,
        retrieve: true,
        "order": [[3, "asc"]]

        //scrollCollapse: true,
        //drawCallback: function () { // this gets rid of duplicate headers
        //    console.log("hatim");
        //    $('.dataTables_scrollBody thead tr').css({ display: 'none' });
        //    $('.dataTable fixedHeader-floating thead tr').css({ display: 'none' });
        //    $('dataTable fixedHeader-floating thead tr').css({ display: 'none' });
        //    $('.dataTable fixedHeader-floating').css({ display: 'none' });
        //    $('dataTable fixedHeader-floating').css({ display: 'none' });

        //},
    });

    return TblObject;
}

function pageLoad() {

    
    initTable();
   
    AddInitRows();

    //$('#' + NSRtlr.GetASPNtClntID("tblItmLst") +  ' td input').on('change', function () {
    //    alert(this.value);
    //    var $td = $(this).parent();
    //    $td.find('input').attr('value', this.value);

    //    var tblItmLstElement = NSRtlr.GetASPNtClntJQryElmntByID("tblItmLst");
    //    var t = $(tblItmLstElement).DataTable();

    //    t.cell($td).invalidate().draw();
    //});

    //$('#' + NSRtlr.GetASPNtClntID("tblItmLst") + ' td select').on('change', function () {
    //    alert(this.value);
    //    var $td = $(this).parent();
    //    var value = this.value;
    //    $td.find('option').each(function (i, o) {
    //        $(o).removeAttr('selected');
    //        if ($(o).val() == value) $(o).attr('selected', true);
    //    })
    //    table.cell($td).invalidate().draw();
    //});

    //$(tblItmLstElement).trigger("update");
}
function OnDataChangedOnEditedField(SndrNode, EvntObjct, ClbckPrmJSObjct) {

    alert("OnDataChangedOnEditedField");

    var iItmIndx = NSRtlr.FindElmntIndxByNode(document.getElementsByName(SndrNode.name), SndrNode);

    alert( parseFloat(NSRtlr.GetValByElmntNameAndIndx(SndrNode.name, iItmIndx)));

    alert(SndrNode.value);
    var $td = $(SndrNode).parent();
    $td.find('input').attr('value', SndrNode.value);

    var tblItmLstElement = NSRtlr.GetASPNtClntJQryElmntByID("tblItmLst");
    var t = $(tblItmLstElement).DataTable();

    t.cell($td).invalidate().draw();
}

function AddInitRows()
{
    var strReadOnlyField = " ";
    var IDListSize = 50;
    var CheckedChkBox = "";
    var tblItmLstElement = NSRtlr.GetASPNtClntJQryElmntByID("tblItmLst");
    var t = initTable("tblItmLst");
    var htmlrowstring = "" ;
    for (var iItmIndx = 1; iItmIndx <= IDListSize ; ++iItmIndx) {

        var htmlrow = '<tr>\n'
               + '<td class="CSSRtlrItmLstTblCell-Img" ><input type="image" name="imgItmListRowRemove" alt="Remove" onClick="return false;" value="Remove Row" src="/Images/Delete.png" class="clsItmListRowRemove CSSRtlrItmLstTblCellChldImg" width="20px" height="20px" /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-PrntBC" ><input type="checkbox" name="chkPrntBC" class="CSSRtlrItmLstTblCellChldElmnt" /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-SNo" ><input type="text" name="txtItemSrNo" value= "" class="CSSRtlrItmLstTblCellChldElmnt" readonly /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-Itm" ><input type="text" name="txtIName" value="' + 'row' + iItmIndx + 'col4' + '" class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-STK-QTY" ><input type="text" name="txtIStkQty" value="' + iItmIndx + '5' + '" class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-QT" ><input type="text" name="txtIQtyType" value="' + 'row' + iItmIndx + 'col6' + '" class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-Unt" ><input type="text" name="txtIUnitType" value="' + 'row' + iItmIndx + 'col7' + '" class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-QTY" ><input type="number" name="txtIQty" step="any" value="' + iItmIndx + '8' + '" min="0" max="' + iItmIndx + '8' + '" class="CSSRtlrItmLstTblCellChldElmnt" ' + strReadOnlyField + ' onchange="OnDataChangedOnEditedField( this, event, null )"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-Price" ><input type="number" name="txtIPrSP" step="any" value="' + iItmIndx + '9' + '" class="CSSRtlrItmLstTblCellChldElmnt"  onchange="OnDataChangedOnEditedField( this, event, null )" /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-Calc" ><input type="number" name="txtISubTot" step="any" value="' + iItmIndx + '10' + '" class="CSSRtlrItmLstTblCellChldElmnt"  onchange="OnDataChangedOnSubTotField( this, event, null )" /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-Price" ><input type="number" name="txtIPrEfctvSP" value="' + iItmIndx + '11' + '" class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'
               + '<td class="CSSRtlrItmLstTblCell-IncSz" ><input type="checkbox" name="chkIISzInCalcWithQty" ' + CheckedChkBox + ' class="CSSRtlrItmLstTblCellChldElmnt"  /></td>\n'

               + '<td class="CSSRtlrItmLstTblCell-Hdn" >\n'
                    + '<input type="hidden" name="hdIDcdBarcode" value="' + 'row' + iItmIndx + 'col9' + '" />\n'

               + '</td>\n'
           + '</tr>';

        var tblItmLstBodyElement = NSRtlr.GetASPNtClntJQryElmntByID("tblItmLstBody");
        //$(tblItmLstBodyElement).append(htmlrow);

        t.row.add($(htmlrow))
        //t.row.add($(htmlrow)).draw();
        //t.row.add($(htmlrow)).invalidate();
        htmlrowstring += htmlrow;
        

    }

    //t.rows.add($(htmlrowstring)).draw(true);
    //    t.rows.add($(htmlrowstring)).draw(true);
    t.rows().invalidate().draw(true);

}