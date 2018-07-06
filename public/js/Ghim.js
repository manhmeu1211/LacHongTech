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
            {title: "Tên hạng mục"},
            {title: "Lý do"},
            {title: "Số ghim"},
            {title: "Ngày tạo"},
            {title: "User tạo"},
            {title: "User nhận"},
            {title: "Loại ghim"},
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
                "targets": 3
            },{
                "width": "30%",
                "targets": 4
            },{
                "width": "30%",
                "targets": 5
            },
            {
                "width": "30%",
                "targets": 6,
                "render": function ( data, type, row ) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss');
                }
            },
            {
                "width": "30%",
                "targets": 7
            },
            {
                "width": "30%",
                "targets": 8
            },
            {
                "width": "30%",
                "targets": 9
            }
        ]
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
