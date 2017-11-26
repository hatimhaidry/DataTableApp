<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DataTableApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

   <div ID="divHomeFrm" class="CSSDfltFrm" >

       <div ID="divSlItmList" runat="server" class="CSSSlFrmItmLst CSSRtlrTblFixHdrBdyFtrSlFrmItmLst" >
           <table ID="tblItmLst" >
                <thead class="CSSRtlrTblHdr">
                    <tr>
                        <th class="CSSRtlrItmLstTblCell-Img">
                            <img src="/Images/Delete.png" width="20" height="20" />
                        </th>
                        <th class="CSSRtlrItmLstTblCell-PrntBC" >
                            <input type="checkbox" ID="chkPrntAllBC" class="CSSRtlrItmLstTblCellChldElmnt" onchange="OnDataChangedOnPrntAllBCField( this, event, null )" />
                        </th>
                        <th class="CSSRtlrItmLstTblCell-SNo" >
                            <label>S.No</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Itm" >
                            <label>Item Name</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-STK-QTY" >
                            <label>Stk Qty</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-QT" >
                            <label>Q.T</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Unt" >
                            <label>Unit</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-QTY" >
                            <label>Qty</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Price" >
                            <label>Sell Price</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Calc" >
                            <label>Sub Total</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Price" >
                            <label>Efctv SP</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-IncSz" >
                            <label>IS</label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Hdn">
                            <%-- For Hidden Variables --%>
                        </th>
                    </tr>
                </thead>
                <tfoot class="CSSRtlrTblFtr">
                    <tr>
                        <th class="CSSRtlrItmLstTblCell-Img">
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-PrntBC" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-SNo" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Itm" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-STK-QTY" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-QT" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Unt" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-QTY" >
                            <asp:TextBox ID="txtAccuQty" runat="server" class="CSSRtlrItmLstTblCellChldElmnt CSSRtlrReadOnlyTextBoxForHeader" ></asp:TextBox>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Price" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Calc" >
                            <asp:TextBox ID="txtAccuSubTot" runat="server" class="CSSRtlrItmLstTblCellChldElmnt CSSRtlrReadOnlyTextBoxForHeader" ></asp:TextBox>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-Price" >
                            <label></label>
                        </th>
                        <th class="CSSRtlrItmLstTblCell-IncSz" >
                            <label></label>
                        </th>
                                                                         
                                                                     
                        <th class="CSSRtlrItmLstTblCell-Hdn">
                            <%-- For Hidden Variables --%>
                        </th>
                    </tr>
                </tfoot>
                <tbody ID="tblItmLstBody" class="CSSRtlrTblBdy" >
                </tbody>
            </table>
       </div>

   </div>

    <script src="<%= Page.ResolveClientUrl("~/Content/DefaultCSS.css")%>" type="text/css"></script>
    <%--<script src="<%= Page.ResolveClientUrl("~/Content/DataTables/css/jquery.dataTables.min.css")%>" type="text/css"></script>--%>
    <script src="<%= Page.ResolveClientUrl("~/Scripts/DataTables/jquery.dataTables.min.js")%>" type="text/javascript"></script>
    <script src="<%= Page.ResolveClientUrl("~/Scripts/DataTables/dataTables.fixedHeader.min.js")%>" type="text/javascript"></script>
    <script src="<%= Page.ResolveClientUrl("~/Scripts/DataTables/dataTables.fixedColumns.min.js")%>" type="text/javascript"></script>
    <script src="<%= Page.ResolveClientUrl("~/Scripts/RtlrGnrlScrpt.js")%>" type="text/javascript"></script>
    <script src="<%= Page.ResolveClientUrl("~/Scripts/DefaultScript.js")%>" type="text/javascript"></script>
    
</asp:Content>
