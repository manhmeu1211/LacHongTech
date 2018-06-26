$(document).ready(function () {
    var arrLang = {
        'en': {
            'sua': 'Edit',
            'danhsachfileIVR': 'The list of File IVR',
            'stt': 'Serial',
            'fileIVR': 'File IVR',
            'capnhatfileIVR': 'Update File IVR',
            'dinhdangtenfile': 'Filename Format',
            'nghefilehientai': 'Listen to the current File IVR',
            'chonfile': 'Select File',
            'luulai': 'Save',
            'dong': 'Close',
            'ghichu': 'Note'
        },
        'vi': {
            'sua': 'Sửa',
            'danhsachfileIVR': 'Danh sách file IVR',
            'stt': 'STT',
            'fileIVR': 'File IVR',
            'capnhatfileIVR': 'Cập nhật file IVR',
            'dinhdangtenfile': 'Định dạng tên file',
            'nghefilehientai': 'Nghe file hiện tại',
            'chonfile': 'Chọn file',
            'luulai': 'Lưu lại',
            'dong': 'Đóng',
            'ghichu': 'Ghi chú'
        }
    }
    $("#chooseFile").change(function () {
        var strFileName = $("#chooseFile")[0].value;
        var fileName = strFileName.replace(/^.*[\\\/]/, '');
        $("#fileName").text(fileName);
    });
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

    var dataSet = [];
    loadData();

    function loadData() {
        $.get(`ListDauSo.aspx?idqllh=${$('#idqllh').val()}`, function (data) {
            let arr = data.map((item, i) => ["", i + 1, item.DauSo, $("#MaCT").val().toUpperCase() + "_" + item.DauSo + "_IVR_01.wav", item.GhiChu]);
            dataSet = arr;

            example.clear().draw();
            //let arr = data.map((item, i) => ["", i + 1, item.Value, item.ID]);
            example.rows.add(dataSet).draw();
            // Apply the search
            $('#header').prependTo('#thead1');
            $('#header th:nth-child(1)').removeClass('sorting_asc');
            $('#header th:nth-child(1)').removeClass('sorting_desc');
            $('#header th:nth-child(1)').addClass('sorting_disabled');
            $('[data-toggle="tooltip"]').tooltip();

        });
    }


    var vid = document.getElementById("audioIVR");

    // DataTable
    var example = $('#example').DataTable({
        "scrollY": "375px",
        "pagingType": "full_numbers",
        "lengthChange": true,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: dataSet,
        columns: [
            {title: ""},
            {title: (lang === 'vi') ? "STT" : "Serial"},
            {title: (lang === 'vi') ? "Đầu số" : "Phone"},
            {title: "File IVR"},
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
                "width": "20%",
                "className": 'text-center',
                "targets": 1
            }
            ,
            {
                orderable: false,
                "width": "20%",
                "className": 'text-center',
                "targets": 2
            },
            {
                orderable: false,
                "width": "35%",
                "className": 'text-center',
                "targets": 3
            },
            {
                orderable: false,
                "width": "20%",
                "className": 'text-center',
                "targets": 4
            }]
    });

    example.on('order.dt search.dt', function () {
        example.column(1, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // Apply the search
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();

    $("#example").on("dblclick", "tr", function () {
        $("#AddEditEmployeePopup").modal();
        $('#txtFullName').val(example.row(this).data()[3]);
        vid.src = "UPLOADS/" + $('#txtFullName').val();
    });

    $("#btnSave").click(function () {
        var input = document.getElementById('chooseFile');
        var filename = $('input[type=file]').val().split('\\').pop();
        var form = new FormData();
        form.append("LHFILE", input.files[0]);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "UpdateIVR.aspx?filename=" + $('#txtFullName').val(),
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (response) {
            if (alert(JSON.parse(response).status)) {
                (lang === 'vi') ? alert("Thành công!") : alert("Success!");
            }
            else
                (lang === 'vi') ? alert("Thất bại!") : alert("Failed!");


            if (JSON.parse(response).status)
                $("#formPopup").submit()
        });
    });

    $('#btnEditEmployee').click(function () {
        const selectedArr = example.rows('.selected').data();
        switch (selectedArr.length) {
            case 0:
                (lang === 'vi') ? alert("Vui lòng chọn file IVR cần cập nhật") : alert("Please select file IVR to update");
                break;
            case 1:
                $("#AddEditEmployeePopup").modal();
                $('#txtFullName').val(selectedArr[0][3]);
                vid.src = "UPLOADS/" + $('#txtFullName').val();
                break;
            default:
                (lang === 'vi') ? alert("Vui lòng chọn duy nhất 1 file IVR cần chỉnh sửa") : alert("Please select only one file IVR to update");
                break;
        }
    });
});