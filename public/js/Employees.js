var example = null;
var check = false
var checkGoiRa = 1;
var checkNotification = 0;

$(document).ready(function () {

    var arrLang = {
        'en': {
            'them': 'Add',
            'sua': 'Edit',
            'xoa': 'Delete',
            'themmoinhanvien': 'Add Employee',
            'hovaten': 'Fullname',
            'tendangnhap': 'Username',
            'matkhau': 'Password',
            'xacnhanmatkhau': 'Confirm Password',
            'email': 'Email',
            'phongban': 'Department',
            'somayle': 'Extension',
            'chucvu': 'Position',
            'ghichu': 'Note',
            'luulai': 'Save',
            'dong': 'Close',
            'chigoinoibo': 'Internal call only',
            'chophepnhanthongbao': 'Show icon on/off status'
        },
        'vi': {
            'them': 'Thêm',
            'sua': 'Sửa',
            'xoa': 'Xóa',
            'themmoinhanvien': 'Thêm mới nhân viên',
            'hovaten': 'Họ và tên',
            'tendangnhap': 'Tên đăng nhập',
            'matkhau': 'Mật khẩu',
            'xacnhanmatkhau': 'Xác nhận mật khẩu',
            'email': 'Email',
            'phongban': 'Phòng ban',
            'somayle': 'Số máy lẻ',
            'chucvu': 'Chức vụ',
            'ghichu': 'Ghi chú',
            'luulai': 'Lưu lại',
            'dong': 'Đóng',
            'chigoinoibo': 'Chỉ gọi nội bộ',
            'chophepnhanthongbao': 'Hiện icon on/off trên thanh trạng thái'
        }
    }

    var lang = localStorage.language;
    $('.lang').each(function (index, element) {
        $(this).attr('value', arrLang[lang][$(this).attr('key')])
        $(this).text(arrLang[lang][$(this).attr('key')])
    })

    $('.langtitle').each(function (index, element) {
        $(this).attr('title', arrLang[lang][$(this).attr('key')])
    })

    $('.langinput').each(function (index, element) {
        $(this).attr('placeholder', arrLang[lang][$(this).attr('key')])
    })

    $('.langrequired').each(function (index, element) {
        $(this).append(`<span class="require"> (*)</span>`);
    })


    /// Setup - add a text input to each header cell
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").not(":nth-child(2)").each(function () {
        var title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });

    var dataSet = [];
    loadData(dataSet);

    // DataTable
    example = $('#example').DataTable({
        "scrollY": "375px",
        "pagingType": "full_numbers",
        "lengthChange": false,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: dataSet,
        columns: [
            {title: ""},
            {title: (lang === 'vi') ? "STT" : "Serial"},
            {title: (lang === 'vi') ? "Họ tên" : "Fullname"},
            {title: (lang === 'vi') ? "Tên đăng nhập" : "Username"},
            {title: (lang === 'vi') ? "Số máy lẻ" : "Extension"},
            {title: (lang === 'vi') ? "Phòng ban" : "Department"},
            {title: (lang === 'vi') ? "Chức vụ" : "Position"},
            {title: (lang === 'vi') ? "Ghi chú" : "Note"}
        ],
        columnDefs: [{
            orderable: false,
            "width": "5%",
            "className": 'select-checkbox',
            "targets": 0
        },
            {
                orderable: false,
                "width": "5%",
                "className": 'text-center',
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
                "width": "10%",
                "targets": 4
            }, {
                "width": "15%",
                "targets": 5
            }]
    });

    example.on('order.dt search.dt', function () {
        example.column(1, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // Apply the search
    example.columns().eq(0).each(function (colIdx) {
        $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('keyup change', function () {
            example
                .column(colIdx)
                .search(this.value)
                .draw();
            $('#header th:nth-child(1)').removeClass('sorting_asc');
            $('#header th:nth-child(1)').removeClass('sorting_desc');
            $('#header th:nth-child(1)').addClass('sorting_disabled');

        });

        // Apply the search
        $('#header').prependTo('#thead1');
        $('#header th:nth-child(1)').removeClass('sorting_asc');
        $('#header th:nth-child(1)').removeClass('sorting_desc');
        $('#header th:nth-child(1)').addClass('sorting_disabled');
        $('[data-toggle="tooltip"]').tooltip();

        $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('click', function (e) {
            e.stopPropagation();
        });
    });


    $("#example").on("dblclick", "tr", function () {
        $('#type').text("edit");
        (lang === 'vi') ? $('#title').text("Chỉnh sửa nhân viên") : $('#title').text("Edit Employee");
        editNhanVien(example.row(this).data()[4]);
    });

    //Add Event open popup
    $("#btnAddEmployee").click(function () {
        $('#type').text("add");
        check = true;
        $("#cbResetPass").prop('checked', true);
        $("#cbGoiRa").prop('checked', false);
        checkGoiRa = 1;
        $("#cbNotification").prop('checked', true);
        checkNotification = 1;
        $('#divCbReset').addClass('hidden');
        $('#divPass').removeClass('hidden');
        $('#divRepass').removeClass('hidden');
        (lang === 'vi') ? $('#title').text("Thêm mới nhân viên") : $('#title').text("Add Employee");
        $("#AddEditEmployeePopup").modal();

        $("#txtFullName").val("");
        $("#txtUsername").val("");
        $("#txtPassword").val("");
        $("#txtPasswordConfirm").val("");
        $("#txaNote").val("");
        $("#txtChucVu").val("");
        $('#txtEmail').val("");
        //Lấy phòng ban
        $.post("/ListPhongBan.aspx",
            {
                idqllh: $('#idqllh').val()
            },
            function (data, status) {
                $("#cboDepartment").html('');
                (lang === 'vi') ? $("#cboDepartment").html('<option value="0" hidden selected>Chọn phòng ban</option>')
                    : $("#cboDepartment").html('<option value="0" hidden selected>Select department</option>');
                for (let i = 0; i < data.length; i++) {
                    $("#cboDepartment").append(`<option value="${data[i].ID}">${data[i].Value}</option>`);
                }
            });

        //Lấy Ext.
        $.post("/ListExt.aspx",
            {
                idqllh: $('#idqllh').val()
            },
            function (data) {
                $("#cboDialNumber").html('');
                (lang === 'vi') ? $("#cboDialNumber").html('<option value="" hidden selected>Chọn số máy lẻ</option>')
                    : $("#cboDialNumber").html('<option value="" hidden selected>Select Extension</option>');
                for (let i = 0; i < data.length; i++) {
                    $("#cboDialNumber").append(`<option value="${data[i].Codec}">${data[i].ext}</option>`);
                }
            });
    });

    $("#btnSave").click(function () {
        debugger;
        if ($("#txtFullName").val() === "")
            (lang === 'vi') ? alert("Họ và tên không được để trống") : alert("Fullname is required");
        else if ($("#txtUsername").val() === "")
            (lang === 'vi') ? alert("Tên đăng nhập không được để trống") : alert("Username is required");
        else if (check === true && ($("#txtPassword").val() !== $("#txtPasswordConfirm").val()))
            (lang === 'vi') ? alert("Xác nhận mật khẩu không trùng khớp") : alert("Confirm password does not match");
        else if (check === true && $("#txtPassword").val() === "")
            (lang === 'vi') ? alert("Mật khẩu không được để trống") : alert("Password is required");
        else if (!validateEmail($('#txtEmail').val()))
            (lang === 'vi') ? alert("Địa chỉ email không hợp lệ") : alert("Email address is not valid");
        else if ($('#cboDialNumber option').filter(':selected').text() === "")
            (lang === 'vi') ? alert("Vui lòng chọn số máy lẻ") : alert("Please select an extension");
        else {
            if (($("#type").text() == 'add') || ($("#type").text() == 'edit' && $("#SoMayCu").val() === $('#cboDialNumber option').filter(':selected').text()))
            //Lấy Ext.
            {
                $.post("/ThemNhanVien.aspx",
                    {
                        Type: $('#type').text(),
                        HoTen: $("#txtFullName").val(),
                        Username: $("#txtUsername").val(),
                        Password: $("#txtPassword").val(),
                        SoMayLe: $('#cboDialNumber option').filter(':selected').text(),
                        IDPhongBan: $('#cboDepartment option').filter(':selected').val(),
                        GhiChu: $("#txaNote").val(),
                        ChucVu: $("#txtChucVu").val(),
                        IDQLLH: $('#idqllh').val(),
                        Email: $('#txtEmail').val(),
                        MaCT: $("#MaCT").val(),
                        GoiRa: checkGoiRa,
                        Notification: checkNotification,
                        Codec: $('#cboDialNumber option').filter(':selected').val()
                    },
                    function (data, status) {
                        if (data.result == 1) {
                            if ($("#type").text() == 'add') {
                                (lang === 'vi') ? alert("Thêm nhân viên thành công!") : alert("Add Employee Success!");
                            }
                            else
                                (lang === 'vi') ? alert("Sửa nhân viên thành công!") : alert("Edit Employee Success!");

                            $("#formPopup").submit();
                        }
                        else if (data.result == -1)
                            (lang === 'vi') ? alert("Số nhân viên đã vượt quá số lượng cho phép! Vui lòng xóa bớt nhân viên!")
                                : alert("Number of employees exceeded the allowed number! Please remove employees!");

                        else if (data.result == -2)
                            (lang === 'vi') ? alert("Số máy lẻ đã được cung cấp! Vui lòng thử lại!")
                                : alert("The Extension was issued! Please try again!");
                        else
                            (lang === 'vi') ? alert("Có lỗi xảy ra. Vui lòng thử lại!")
                                : alert("An error occurred. Please try again!");
                    });
            }
            else {
                (lang === 'vi') ? alert("Số máy lẻ đã bị thay đổi. Không thể sửa nhân viên có số máy lẻ là " + $("#SoMayCu").val())
                    : alert("Extension has been changed. Unable to edit employee with extension " + $("#SoMayCu").val());
            }
        }
    });

    $("#cbResetPass").prop('checked', false);
    $('#cbResetPass').change(function () {
        if (this.checked) {
            check = true;
            $('#divPass').removeClass('hidden');
            $('#divRepass').removeClass('hidden');
            $("#txtPassword").val("");
        } else {
            check = false;
            $('#divPass').addClass('hidden');
            $('#divRepass').addClass('hidden');
            $("#txtPassword").val("");
        }
    });

    $('#cbGoiRa').change(function () {
        if (this.checked) {
            checkGoiRa = 0;
        } else {
            checkGoiRa = 1;
        }
    });

    $('#cbNotification').change(function () {
        if (this.checked) {
            checkNotification = 1;
        } else {
            checkNotification = 0;
        }
    });


    $('#btnEditEmployee').click(function () {
        $('#type').text("edit");
        (lang === 'vi') ? $('#title').text("Chỉnh sửa nhân viên") : $('#title').text("Edit Employee");
        const selectedArr = example.rows('.selected').data();
        switch (selectedArr.length) {
            case 0:
                (lang === 'vi') ? alert("Vui lòng chọn nhân viên cần chỉnh sửa") : alert("Please select employee to edit");
                break;
            case 1:
                const ext = selectedArr[0][4];
                editNhanVien(ext);
                break;
            default:
                (lang === 'vi') ? alert("Vui lòng chọn duy nhất 1 nhân viên cần chỉnh sửa") : alert("Please select only one employee to edit");
                break;
        }
    });

    $('#btnDeleteEmployee').click(function () {
        const selectedArr = example.rows('.selected').data();
        if (selectedArr.length === 0)
            (lang === 'vi') ? alert("Vui lòng chọn nhân viên cần xóa") : alert("Please select employee to delete");
        else {
            var r = (lang === 'vi') ? confirm("Bạn có chắc chắn muốn xóa?") : confirm("Are you sure delete this employee?");
            if (r == true) {
                let dsext = [];

                for (let i = 0; i < selectedArr.length; i++) {
                    dsext.push(selectedArr[i][4]);
                }

                $.get(`XoaNhanVien.aspx?dsext=${JSON.stringify(dsext)}&idqllh=${$('#idqllh').val()}`, function (res) {
                    if (res.result == 1)
                        (lang === 'vi') ? alert("Xóa thành công!") : alert("Successfully Deleted!");
                    else
                        (lang === 'vi') ? alert("Xóa thất bại!") : alert("Delete Failed!");
                    loadData();
                });
            }
        }
    });

    function loadData(dataSet) {
        $.post("/employeeList.aspx",
            {
                idqllh: $('#idqllh').val()
            },
            function (data, status) {
                example.clear().draw();
                //let arr = data.map((item, i) => ["", i + 1, item.Value, item.ID]);
                example.rows.add(data).draw();
                // Apply the search
                $('#header').prependTo('#thead1');
                $('#header th:nth-child(1)').removeClass('sorting_asc');
                $('#header th:nth-child(1)').removeClass('sorting_desc');
                $('#header th:nth-child(1)').addClass('sorting_disabled');
                $('[data-toggle="tooltip"]').tooltip();
            });
    }

    function editNhanVien(ext) {
        $('#SoMayCu').val(ext)
        check = false;
        $("#cbResetPass").prop('checked', false);
        $('#divCbReset').removeClass('hidden');
        $('#divPass').addClass('hidden');
        $('#divRepass').addClass('hidden');
        $.get(`LayThongTinNhanVien.aspx?ext=${ext}&idqllh=${$('#idqllh').val()}`, function (data) {
            if (data == null)
                (lang === 'vi') ? alert("Có lỗi xảy ra vui lòng thử lại!") : alert("An error occurred. Please try again!");
            else {
                $("#AddEditEmployeePopup").modal();
                $("#txtFullName").val(data.HoTen);
                $("#txtUsername").val(data.Username);
                $("#txtPassword").val("");
                $("#txtPasswordConfirm").val("");
                $("#txaNote").val(data.GhiChu);
                $("#txtChucVu").val(data.ChucVu);
                $('#txtEmail').val(data.Email);

                if (data.ChoPhepGoiRa === 1) {
                    $("#cbGoiRa").prop('checked', false);
                    checkGoiRa = 1;
                }
                else {
                    $("#cbGoiRa").prop('checked', true);
                    checkGoiRa = 0;
                }

                if (data.ChoPhepNotification === 1) {
                    $("#cbNotification").prop('checked', true);
                    checkNotification = 1;
                }
                else {
                    $("#cbNotification").prop('checked', false);
                    checkNotification = 0;
                }


                //Lấy phòng ban
                $.post("/ListPhongBan.aspx",
                    {
                        idqllh: $('#idqllh').val()
                    },
                    function (res, status) {
                        $("#cboDepartment").html('');
                        //$("#cboDepartment").html('<option value="" hidden selected>Chọn phòng ban</option>');
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].ID == data.IDPhongBan)
                                $("#cboDepartment").append(`<option value="${res[i].ID}" selected>${res[i].Value}</option>`);
                            else
                                $("#cboDepartment").append(`<option value="${res[i].ID}">${res[i].Value}</option>`);
                        }
                    });

                $("#cboDialNumber").html('');
                //$("#cboDialNumber").html('<option value="" hidden selected>Chọn số máy lẻ</option>');
                $("#cboDialNumber").append(`<option value="${data.Codec}" >${data.SomayLe}</option>`);
            }
        });
    }

    function validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});

