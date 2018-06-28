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
            {title: "Hạng mục"},
            {title: "Phân hệ"},
            {title: "Mô Tả"},
            {title: "Ngày bắt đầu"},
            {title: "Deadline"},
            {title: "Ngày hoàn thành"},
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
                "width": "40%",
                "targets": 2
            },
            {
                "width": "40%",
                "targets": 3
            },
            {
                "width": "40%",
                "targets": 4
            },
            {
                "width": "40%",
                "targets": 5
            },
            {
                "width": "40%",
                "targets": 6
            },
            {
                "width": "40%",
                "targets": 7
            },
            {
                "width": "40%",
                "targets": 8
            },
            {
                "width": "40%",
                "targets": 9
            },
            {
                "width": "40%",
                "targets": 10
            },
            {
                "width": "40%",
                "targets": 11
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
    $.get('api/work/getAll', data => {
        let arr = data.map(work => {
            return ["", work.ID, work.Hangmuc, work.Phanhe, work.Mota, work.Ngaybatdau, work.Deadline, work.Ngayhoanthanh, work.Status, work.Ngươiyeucau, work.Ngươithuchien, work.IdDuaAn]
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