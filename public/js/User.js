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
                "render": function (data, type, row) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')
                }
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
            return ["", user.ID, user.Name, user.DiaChi, user.Mail, user.Username, user.IsAdmin ? "Có" : "Không", user.NgaySinh, user.SoDienThoai, user.GioiTinh ? "Nũ" : "Nam", user.ThemDuAn ? "Có" : "Không"]
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
    $('#example tbody').on('dblclick', 'tr', function () {
        let id = example.row(this).data()[1];
        $('#type').val("edit");

        $('#titleModal').text("Sửa nhân viên");
        editUser(id)
        $('#AddEditEmployeePopup').modal();
    });
    $('#btnAddUer').click(function (e) {
        // console.log("addd")
        $('#titleModal').text("Thêm mới nhân viên");
        $('#type').val("add");
        $('#AddEditEmployeePopup').modal();
    });
    $('#btnEditUser').click(function (e) {
        $('#divUser').addClass('hidden').removeClass('form-group col-xs-12');
        $('#divPass').addClass('hidden').removeClass('form-group col-xs-12');
        $('#type').val("edit");
        $('#titleModal').text("Sửa nhân viên");

        let data = example.rows('.selected').data();
        switch (data.length) {
            case 0:
                alert("Bạn chưa chọn?")
            case 1:
                const id = data[0][1];
                editUser(id);
                break;
            default:
                alert("Bạn chọn quá nhiều")
        }

    });

    $('#btnDeleteUser').click(function (e) {
        let data = example.rows('.selected').data();
        switch (data.length) {
            case 0:
                alert("Bạn chưa chọn?")
                break;
            case 1:
                let r = confirm("Bạn thực sự muốn xóa!");
                if (r) {
                    $.post('api/user/deleteUser', {
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

    function editUser(id) {
        $.get('api/user/get/' + id, data => {
            //lay dc thong tin user ve
            console.log(data)
            if (data.Status) {
                const user = data.User;
                // set thu 1 cai name
                $('#txtName').val(user.Name);
                $('#idUser').val(user.ID);
                $('#txtNgaySinh').val(moment(user.NgaySinh).format('YYYY-MM-DD'))
                $('#txtMail').val(user.Mail)
                $('#txtPhone').val(user.SoDienThoai)
                $('#txtAddress').val(user.DiaChi)
                $('#IsAdmin').prop('checked', true);
                if (user.GioiTinh === 'Nam') {
                    $('#txtGioiTinhNam').prop('checked', true);
                }
                else {
                    $('#txtGioiTinhNu').prop('checked', true);
                }
                $('#AddEditEmployeePopup').modal()

            } else {
                alert("Không có quyền sửa")
            }
        })
    }
})


function initModal() {
    let now = moment().format('YYYY-MM-DD');
    $('#page-popup').html(
        `<div id="AddEditEmployeePopup" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
                <form id="frmAddCompany" class="form-horizontal" method="post" action="api/user/addUser">
                <input name="type" id="type" class="hidden" value="add">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title">Thêm mới nhân viên</h2>
                    </div>
                    <input name ="ID" class = "hidden" type ="text" id ="idUser">
                    <div class="modal-body" >
                        <div class="form-group col-xs-12">
                            <label for="txtName" class="control-label" style="margin-top: 8px">Tên<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <input name="Name" type="text" class="form-control" id="txtName" placeholder="Tên nhân viên">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtAddress" class="control-label">Địa chỉ<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-sign-in" aria-hidden="true"></i>
                                <input name="Diachi" type="text" class="form-control" id="txtAddress" placeholder="Địa chỉ">
                            </div>
                        </div> 
                        <div class="form-group col-xs-12">
                            <label for="txtPhone" class="control-label">Số điện thoại<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-sign-in" aria-hidden="true"></i>
                                <input name="SoDienThoai" type="text" class="form-control" id="txtPhone" placeholder="Số điện thoại">
                            </div>
                        </div>
                       
                        <div class="form-group col-xs-12">
                            <label for="txtNgaySinh" class="control-label">Ngày sinh<span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-check-square" aria-hidden="true"></i>
                                <input name="NgaySinh" type="date" value="${now}" class="form-control" id="txtNgaySinh"
                                       placeholder="Ngày sinh">
                            </div>
                        </div>
                        <div class="form-group col-xs-12" id="divUser">
                            <label for="txtUsername" class="control-label">Tên đăng nhập</label>
                            <div class="inner-addon left-addon">
                                <i aria-hidden="true"></i>
                                <input name="Username" type="text" class="form-control" id="txtUsername" placeholder="Username">
                            </div>
                        </div>
                        <div class="form-group col-xs-12" id="divPass">
                            <label for="txtPass" class="control-label">Mật khẩu<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-key" aria-hidden="true"></i>
                                <input name="Password" type="password" class="form-control" id="txtPass" >
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtMail" class="control-label">Email<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i  aria-hidden="true"></i>
                                <input name="Mail" type="email" class="form-control" id="txtMail" placeholder="abcxyz@gmail.com">
                            </div>
                        </div>
                        <div class="form-group col-xs-12">
                            <label for="txtGioiTinh" class="control-label">Giới tính<span class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i  aria-hidden="true"></i>
                                <input name="GioiTinh" type="radio" id="txtGioiTinhNam" value="True">
                                <label>Nam</label>
                                <input name="GioiTinh" type="radio" id="txtGioiTinhNu" value="False">
                                <label>Nữ</label>
                            </div>
                        </div>
                     
                        <div class="form-group col-xs-12">
                            <input name="IsAdmin" id="IsAdmin"  type="checkbox" style="display: inline;margin-top: 8px" value="true" >
                            <label for="IsAdmin" class="control-label">Is Admin</label>
                        </div>
                        <div class="form-group col-xs-12">
                            <input name="ThemDuAn" id="ThemDuAn"  type="checkbox" style="display: inline;margin-top: 8px" value="true" >
                            <label for="ThemDuAn" class="control-label">Thêm dự án</label>
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
    </div>`
    );
};


