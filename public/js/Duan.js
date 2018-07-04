$(document).ready(function () {
    initModal();
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").not(":nth-child(2)").each(function () {
        let title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });
    let example = $('#example').DataTable({
        "scrollY": "375px",
        "pagingType": "full_numbers",
        "lengthChange": false,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: [],
        "order": [],
        columns: [
            {title: ""},
            {title: "ID"},
            {title: "Tên Dự Án"},
            {title: "Ngày Tạo"},
            {title: "Chi tiết công việc"}
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
                "width": "30%",
                "targets": 2
            },
            {
                "width": "30%",
                "targets": 3,
                "render": function ( data, type, row ) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss');
                },
            },
            {
                "width": "30%",
                "targets": 4,
                "render": function ( data, type, row ) {
                    return `<div class="text-center">
                                <a href="work?id=${data}"> Click!</a>
                                 </div>`;
                },
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

    $.get('api/duan/getAll', data => {
        let arr = data.map(duan => {
            return ["", duan.ID, duan.TenDuAn, duan.NgayTao,duan.ID]
        })
        console.log(arr)
        example.clear().rows.add(arr).draw();
    });
    $('#example').on('dblclick', 'tr', function (e) {
        const id = example.row(this).data()[1];
        window.location.href=`/work?id=${id}`
    });

    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnAddDuan').click(function (e) {
        $('#AddEditEmployeePopup').modal();
    });
});
function initModal() {
    let now = moment().format('YYYY-MM-DD');
    $('#page-popup').html(`<div id="AddEditEmployeePopup" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
                <form id="frmAddCompany" class="form-horizontal" method="post" action="/api/duan/add">
                <input name="type" id="type" class="hidden" value="add">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title">Thêm mới dự án</h2>
                    </div>
                    <div class="modal-body" >
                        <div class="form-group col-xs-12">
                            <label for="txtTenDuAn" class="control-label" style="margin-top: 8px">Tên dự án<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i aria-hidden="true"></i>
                                <input name="TenDuAn" type="text" class="form-control" id="txtTenDuAn">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtNgayTao" class="control-label">Ngày Tạo<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-check-square" aria-hidden="true"></i>
                                <input name="NgayTao" type="date" value="${now}" class="form-control" id="txtNgayTao">
                            </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" id="btnSave" data-toggle="tooltip"
                                data-placement="bottom" title="Lưu lại">
                            Lưu lại
                        </button>
                        <button type="button" class="btn btn-danger" id="btnClose" data-toggle="tooltip"
                                data-placement="bottom" title="Đóng" data-dismiss="modal">Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>`);
}