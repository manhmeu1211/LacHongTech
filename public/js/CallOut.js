$(document).ready(function () {
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").not(":nth-child(2)").each(function () {
        let title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });
    initPopup();
    let example = $('#example').DataTable({
        "scrollY": "375px",
        "pagingType": "full_numbers",
        "lengthChange": false,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: [],
        dom: 'Bfrtip',
        buttons: [
            'copy', 'excel', 'csv',
        ],
        "order": [[2, "desc"]],
        columns: [
            {title: ""},
            {title: "STT"},
            {title: "Số điện thoại"},
            {title: "IvrName"}
        ],
        columnDefs: [{
            orderable: false,
            "width": "5%",
            "className": 'select-checkbox',
            "defaultContent": "-",
            "targets": 0
        },
            {
                orderable: false,
                "width": "5%",
                "targets": 1
            },
            {
                "width": "15%",
                "targets": 2
            },
            {
                "width": "15%",
                "targets": 3
            }]
    });
    example.columns().eq(0).each(function (colIdx) {
        $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('keyup change', function () {
            example
                .column(colIdx)
                .search(this.value)
                .draw();
            $('#header th:nth-child(1)').removeClass('sorting_asc');
            $('#header th:nth-child(1)').addClass('sorting_disabled');
        });
    });
    example.on('order.dt search.dt', function () {
        example.column(1, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $.get(`excel`, function (results) {

        let arr = results.map((item, i) => ["", i + 1, item.phone, item.ivr]);
        example.clear().rows.add(arr).draw();
    });
    $('#btnSummit').click(function (e) {
        console.log("he")
        $("#sumitpopup").modal();

    });

});

function initPopup() {
    $.get('ivr', result => {
        $('#page-popup').html(`<div id="sumitpopup" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="frmAddUserWeb" class="form-horizontal" method="post" action="startcall">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title">Setup cuộc gọi</h2>
                    </div>
                    <div class="modal-body">
                        <div class="form-group col-xs-12">
                            <label for="name" class="control-label" style="margin-top: 8px">Tên IVR <span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                // <select name="slIVR" id="slIVR" class="form-control">
                                //    ${result.map(item => `<option>${item}</option>`)}
                                // </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" id="btnSave" data-toggle="tooltip"
                                data-placement="bottom" title="Gọi">
                            Bắt đầu gọi
                        </button>
                        <button type="button" class="btn btn-danger" id="btnClose" data-toggle="tooltip"
                                data-placement="bottom" title="Đóng"  data-dismiss="modal">Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>`);
    });


}
