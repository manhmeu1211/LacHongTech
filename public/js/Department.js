$(document).ready(function () {
    var arrLang = {
        'en': {
            'them': 'Add',
            'sua': 'Edit',
            'xoa': 'Delete',
            'danhsachphongban': 'The list of departments',
            'stt': 'Serial',
            'phongban': 'Department',
            'themmoiphongban': 'Add Department',
            'tenphongban': 'Department Name',
            'luulai': 'Save',
            'dong': 'Close'
        },
        'vi': {
            'them': 'Thêm',
            'sua': 'Sửa',
            'xoa': 'Xóa',
            'danhsachphongban': 'Danh sách phòng ban',
            'stt': 'STT',
            'phongban': 'Phòng ban',
            'themmoiphongban': 'Thêm mới phòng ban',
            'tenphongban': 'Tên phòng ban',
            'luulai': 'Lưu lại',
            'dong': 'Đóng'
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


    $("checkBoxCl").removeClass('sorting_asc');
    $("checkBoxCl").addClass('sorting_disabled');
    /// Setup - add a text input to each header cell
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").not(":nth-child(2)").each(function () {
        var title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });

    // DataTable
    var example = $('#example').DataTable({
        "scrollY": "375px",
        "pagingType": "full_numbers",
        "lengthChange": false,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: [],
        columns: [
            {title: ""},
            {title: (lang === 'vi') ? "STT" : "Serial"},
            {title: (lang === 'vi') ? "Phòng ban" : "Department"},
            {title: ""}
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
                "width": "0%",
                "visible": false,
                "targets": 3
            }]
    });

    // Apply the search
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();

    // Apply the search
    example.columns().eq(0).each(function (colIdx) {
        $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('keyup change', function () {
            example
                .column(colIdx)
                .search(this.value)
                .draw();
            $('#header th:nth-child(1)').removeClass('sorting_asc');
            $('#header th:nth-child(1)').addClass('sorting_disabled');
        });
        $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('click', function (e) {
            e.stopPropagation();
        });
    });

    example.on('order.dt search.dt', function () {
        example.column(1, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    loadData();

    $("#example").on("dblclick", "tr", function () {
        $('#type').text("edit");
        (lang === 'vi') ? $('#title').text("Chỉnh sửa phòng ban") : $('#title').text("Edit Department");
        $("#AddEditEmployeePopup").modal();
        $('#idPhongBan').text(example.row(this).data()[3]);
        $('#txtFullName').val(example.row(this).data()[2]);
    });

    //Add Event open popup
    $("#btnAddEmployee").click(function () {
        $("#txtFullName").val("");
        (lang === 'vi') ? $('#title').text("Thêm mới phòng ban") : $('#title').text("Add Department");
        $('#idPhongBan').text("0");
        $("#AddEditEmployeePopup").modal();
    });

    $("#btnSave").click(function () {
        if ($("#txtFullName").val() == "")
            (lang === 'vi') ? alert("Tên phòng ban không được để trống!") : alert("Department Name is required!");
        else {
            $.post("/ThemPhongBan.aspx",
                {
                    idqllh: $('#idqllh').val(),
                    idphongban: $('#idPhongBan').text(),
                    tenphongban: $("#txtFullName").val()
                },
                function (res, status) {
                    if (res.data == 0)
                        (lang === 'vi') ? alert("Thất bại!") : alert("Failed!");
                    else
                        (lang === 'vi') ? alert("Thành công!") : alert("Success!");
                    $("#formPopup").submit();
                });
        }
    });

    $('#btnEditEmployee').click(function () {
        $('#type').text("edit");
        (lang === 'vi') ? $('#title').text("Chỉnh sửa phòng ban") : $('#title').text("Edit Department");
        const selectedArr = example.rows('.selected').data();
        switch (selectedArr.length) {
            case 0:
                (lang === 'vi') ? alert("Vui lòng chọn phòng ban cần chỉnh sửa") : alert("Please select department to edit");
                break;
            case 1:
                $("#AddEditEmployeePopup").modal();
                $('#idPhongBan').text(selectedArr[0][3]);
                $('#txtFullName').val(selectedArr[0][2]);
                break;
            default:
                (lang === 'vi') ? alert("Vui lòng chọn duy nhất 1 phòng ban cần chỉnh sửa") : alert('Please select only one department to edit');
                break;
        }
    });

    $('#btnDeleteEmployee').click(function () {
        const selectedArr = example.rows('.selected').data();
        if (selectedArr.length === 0)
            (lang === 'vi') ? alert("Vui lòng chọn phòng ban cần xóa") : alert("Please select department to delete");
        else {
            var r = (lang === 'vi') ? confirm("Bạn có chắc chắn muốn xóa?") : confirm("Are you sure delete this department?");
            if (r == true) {
                let dsid = [];

                for (let i = 0; i < selectedArr.length; i++) {
                    dsid.push(selectedArr[i][3]);
                }
                $.get(`XoaPhongBan.aspx?dsid=${JSON.stringify(dsid)}`, function (res) {
                    if (res.result != 1)
                        (lang === 'vi') ? alert("Xóa thất bại!") : alert("Delete Failed!");
                    else
                        (lang === 'vi') ? alert("Xóa thành công!") : alert("Successfully Deleted!");
                    loadData();
                });
            }
        }
    });

    function loadData() {
        $.post("/ListPhongBan.aspx",
            {
                idqllh: $('#idqllh').val()
            },
            function (data, status) {
                example.clear().draw();
                let arr = data.map((item, i) => ["", i + 1, item.Value, item.ID]);
                example.rows.add(arr).draw();

                // Apply the search
                $('#header').prependTo('#thead1');
                $('#header th:nth-child(1)').removeClass('sorting_asc');
                $('#header th:nth-child(1)').removeClass('sorting_desc');
                $('#header th:nth-child(1)').addClass('sorting_disabled');
                $('[data-toggle="tooltip"]').tooltip();
            });
    }
});