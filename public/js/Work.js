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
            {title: "Hạng mục"},
            {title: "Phân hệ"},
            {title: "Mô Tả"},
            {title: "Ngày bắt đầu"},
            {title: "Deadline"},
            {title: "Status"},
            {title: "Người Yêu cầu"},
            {title: "Người thực hiện"},
            {title: "Tên dự án"}
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
            },
            {
                "width": "15%",
                "targets": 4
            }
            ,
            {
                "width": "15%",
                "targets": 5,
                "render": function (data, type, row) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')
                }
            },
            {
                "width": "15%",
                "targets": 6,
                "render": function (data, type, row) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')
                }
            },
            {
                "width": "15%",
                "targets": 7
            },
            {
                "width": "15%",
                "targets": 8
            },
            {
                "width": "15%",
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
    $.get(`api/work/getAll/${getUrlParameter('id')}`, data => {
        console.log(data)
        let arr = data.map(work => {
            return ["", work.ID, work.HangMuc, work.PhanHe, work.MoTa, work.NgayBatDau, work.Deadline, work.Status, work.NguoiYeuCau, work.NguoiThucHien, work.TenDuAn]
        })
        console.log(arr)
        example.clear().rows.add(arr).draw();
    });
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnAddHangMuc').click(function (e) {
        $('#titleModal').text("Thêm mới công việc");
        $('#type').val("add");
        $('#AddEditEmployeePopup').modal()
        $.get(`api/trangthai/getAll`, data => {
            console.log(data)
            let arr = data.map(trangthai => {
                return `<option>${trangthai.TenTrangThai}</option>`
            });
            $('#txtStatus').html( arr.join(" "))
        });
        $.get('api/user/getAll', data => {
            let arr = data.map(user => {
                return `<option>${user.Name}</option>`
            });
            $('#txtNguoiThucHien').html(arr.join(" "))
        });
        $.get('api/duan/getAll', data => {
            let arr = data.map(duan => {
                return `<option>${duan.TenDuAn}</option>`
            });
            $('#txtTenDuAn').html(arr.join(" "))
        });

    });

    $('#btnEditHangmuc').click(function (e) {
        $('#divTenDuAn').addClass('hidden').removeClass('form-group col-xs-12');
        $('#titleModal').text("Sửa công việc");
        $('#type').val("edit");
        $('#AddEditEmployeePopup').modal()
        $.get(`api/trangthai/getAll`, data => {
            console.log(data)
            let arr = data.map(trangthai => {
                return `<option>${trangthai.TenTrangThai}</option>`
            });
            $('#txtStatus').html( arr.join(" "))
        });
        $.get('api/user/getAll', data => {
            let arr = data.map(user => {
                return `<option>${user.Name}</option>`
            });
            $('#txtNguoiThucHien').html(arr.join(" "))
        });

        let data = example.rows('.selected').data();
        switch (data.length) {
            case 0:
                alert("Bạn chưa chọn?")
            case 1:
                const id = data[0][1];
                editwork(id);
                break;
            default:
                alert("Bạn chọn quá nhiều")
        }
    });

    function editwork(id) {
        $.get('api/work/gethangmuc/' + id, data => {
            console.log(data)
            if (data.Status) {
                const hangmuc = data.Work;
                $('#txtHangMuc').val(hangmuc.HangMuc);
                $('#txtPhanHe').val(hangmuc.PhanHe);
                $('#txtMoTa').val(hangmuc.MoTa);
                $('#txtNgayBatDau').val(hangmuc.NgayBatDau.format('YYYY-MM-DD'));
                $('#txtDeadLine').val(hangmuc.Deadline.format('YYYY-MM-DD'));
                $('#AddEditEmployeePopup').modal()
            } else {
                alert("Không có quyền sửa")
            }
        })
    }

    $('#btnDeleteHangmuc').click(function (e) {
        let data = example.rows('.selected').data();
        switch (data.length) {
            case 0:
                alert("Bạn chưa chọn?")
                break;
            case 1:
                let r = confirm("Bạn thực sự muốn xóa!");
                if (r) {
                    $.post('api/work/deleteWork', {
                        ID: data[0][1]
                    }, function (data) {
                        console.log(data)
                        alert(data.Message)
                        window.location.reload();
                    })
                }

                break;
            default:
                alert("Bạn chọn quá nhiều")
        }
        window.location.reload()

    })
});

function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function initModal() {
    let now = moment().format('YYYY-MM-DD');
    $('#page-popup').html(`<div id="AddEditEmployeePopup" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
                <form id="frmAddCompany" class="form-horizontal" method="post" action="api/work/addWork">
                <input name="type" id="type" class="hidden" value="add">
                <input name="mactOld" id="mactOld" class="hidden">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title"></h2>
                    </div>
                    <div class="modal-body" >
                        <div class="form-group col-xs-12">
                            <label for="txtHangMuc" class="control-label" style="margin-top: 8px">Hạng Mục<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                               <input name="HangMuc" type="text" class="form-control" id="txtHangMuc">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtPhanHe" class="control-label">Phân hệ<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <input name="PhanHe" type="text" class="form-control" id="txtPhanHe">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtMoTa" class="control-label">Mô Tả<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <input name="MoTa" type="text" class="form-control" id="txtMoTa">
                            </div>
                        </div>   
                        <div class="form-group col-xs-12">
                            <label for="txtNgayBatDau" class="control-label">Ngày bắt đầu<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <input name="NgayBatDau" type="date" value="${now}" class="form-control" id="txtNgayBatDau">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtDeadLine" class="control-label">DeadLine<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <input name="DeadLine" type="date" value="${now}" class="form-control" id="txtDeadLine">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtStatus" class="control-label">Status</label>
                            <div class="inner-addon left-addon">
                                <select name="Status" class="form-control" id="txtStatus" >
                                </select>
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtNguoiThucHien" class="control-label">Người Thực Hiện</label>
                            <div class="inner-addon left-addon">
                                <select name="NguoiThucHien" class="form-control" id="txtNguoiThucHien" >
                                </select>
                            </div>
                        </div>
                        <div class="form-group col-xs-12" id="divTenDuAn">
                            <label for="txtTenDuAn" class="control-label">Tên Dự Án</label>
                            <div class="inner-addon left-addon">
                                <select name="TenDuAn" class="form-control" id="txtTenDuAn" >
                                </select>
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