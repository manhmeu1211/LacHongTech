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
            {title: "Tên"},
            {title: "Địa chỉ"},
            {title: "Mail"},
            {title: "Tên đăng nhập"},
            {title: "IsAdmin"},
            {title: "Ngày sinh"},
            {title: "SĐT"},
            {title: "Giới tính"},
            {title: "Thêm dự án"},
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
                "width": "10%",
                "targets": 2
            },
            {
                "width": "10%",
                "targets": 3
            },
            {
                "width": "10%",
                "targets": 4
            },
            {
                "width": "10%",
                "targets": 5
            },
            {
                "width": "10%",
                "targets": 6
            },
            {
                "width": "10%",
                "targets": 7,
                "render": function ( data, type, row ) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')}
            },
            {
                "width": "10%",
                "targets": 8
            },
            {
                "width": "10%",
                "targets": 9
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

    $.get('api/user/getAll', data => {
        let arr = data.map(user => {
            return ["", user.ID, user.Name, user.DiaChi, user.Mail, user.Username, user.IsAdmin, user.NgaySinh, user.SoDienThoai, user.GioiTinh, user.ThemDuAn]
        })
        console.log(arr)
        example.clear().rows.add(arr).draw();
    });
    //let arr = results.map((item, i) => ["", i + 1, item.Destination, moment(item.TimeCall).format("DD-MM-YYYY HH:mm:ss"), item.Status, item.Press, String(item.Duration).toHHMMSS()]);
    // example.clear().rows.add(arr).draw();
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnAddUer').click(function (e) {
        $('#AddEditEmployeePopup').modal();
    });
    $('#btnEditUser').click(function (e) {
       $('#AddEditEmployeePopup').modal()
    });

});
function initModal() {
    let now = moment().format('YYYY-MM-DD');
    $('#page-popup').html(`<div id="AddEditEmployeePopup" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
                <form id="frmAddCompany" class="form-horizontal" method="post" action="router/company">
                <input name="type" id="type" class="hidden" value="add">
                <input name="mactOld" id="mactOld" class="hidden">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title">Thêm mới công ty</h2>
                    </div>
                    <div class="modal-body" >
                        <div class="form-group col-xs-12">
                            <label for="txtTenCt" class="control-label" style="margin-top: 8px">Tên<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <input name="tenct" type="text" class="form-control" id="txtTenCt" placeholder="Tên công ty">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtMact" class="control-label">ID<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-sign-in" aria-hidden="true"></i>
                                <input name="mact" type="text" class="form-control" id="txtMact" placeholder="Mã công ty">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtSLNV" class="control-label"><span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-key" aria-hidden="true"></i>
                                <input max="10000" min="1" name="soluongnv" type="number" class="form-control" id="txtSLNV" placeholder="Số lượng nhân viên">
                                
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtTHSD" class="control-label">Thời hạn sử dụng <span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-check-square" aria-hidden="true"></i>
                                <input name="thoihansd" type="date" value="${now}" class="form-control" id="txtTHSD"
                                       placeholder="Thời hạn sử dụng">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtEmail" class="control-label">Email</label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-envelope-open" aria-hidden="true"></i>
                                <input name="email" type="email" class="form-control" id="txtEmail" placeholder="Email">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtServerToda" class="control-label">Server Toda<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-key" aria-hidden="true"></i>
                                <input name="serverToda" type="text" class="form-control" id="txtServerToda" placeholder="Ví dụ: 10.100.1.22">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtMatKhauToda" class="control-label">Mật khẩu Toda<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-key" aria-hidden="true"></i>
                                <input name="passToda" type="text" class="form-control" id="txtMatKhauToda" placeholder="Ví dụ: lhabc11">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtPrefix" class="control-label">Prefix<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-key" aria-hidden="true"></i>
                                <input name="prefix" type="number" class="form-control" id="txtPrefix" placeholder="Ví dụ: 100">
                            </div>
                        </div>
                     
                        <div class="form-group col-xs-12">
                            <input name="cbDanhBaKhachHang" id="cbDanhBaKhachHang"  type="checkbox" style="display: inline;margin-top: 8px" value="true" >
                            <label for="cbDanhBaKhachHang" class="control-label">Danh bạ khách hàng</label>
                        </div>
                        <div class="form-group col-xs-12">
                            <input name="cbCapNhatFileIVR" id="cbCapNhatFileIVR"  type="checkbox" style="display: inline;margin-top: 8px" value="true" >
                            <label for="cbCapNhatFileIVR" class="control-label">Cập nhập file IVR</label>
                        </div>
                        <div class="form-group col-xs-12 text-center" style="margin-top: 16px">
                            <label id="lbErr" class="label label-danger "></label>
                        </div>
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