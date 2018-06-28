$(document).ready(function () {
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
                "targets": 7
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
    example.on('order.dt search.dt', function () {
        example.column(1, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
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
});