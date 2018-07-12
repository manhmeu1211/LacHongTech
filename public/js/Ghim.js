$(document).ready(function () {
    function getBaocao() {
        let from = $('#daterange').data('daterangepicker').startDate._d;
        let to = $('#daterange').data('daterangepicker').endDate._d;
        to = moment(to).format('YYYY-MM-DD HH:mm:ss');
        from = moment(from).format('YYYY-MM-DD HH:mm:ss');
        $.post('api/baocao/baoCaoChiTiet', {TuNgay: from, DenNgay: to, ID: 0}, function (data) {
            let arr = data.map(baocao => {
                return ["", baocao.HangMuc, baocao.MoTa, baocao.LyDo, baocao.TenLoai, baocao.SoGhim, baocao.Name, baocao.Tien]
            })
            console.log(arr)
            example.clear().rows.add(arr).draw();

        });
    }
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").not(":nth-child(2)").each(function () {
        let title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });
    $('#daterange').daterangepicker({
        opens: 'center',
        locale: locale = {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "OK",
            "cancelLabel": "Hủy",
            "fromLabel": "Từ",
            "toLabel": "Đến",
            "customRangeLabel": "Chọn thời gian",
            "daysOfWeek": [
                "CN",
                "Hai",
                "Ba",
                "Tư",
                "Năm",
                "Sáu",
                "Bảy"
            ],
            "monthNames": [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12"
            ],
            "firstDay": 1
        },
        startDate: moment(),
        endDate: moment(),
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        getBaocao()
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
            {title: "Tên hạng mục"},
            {title: "Mô tả"},
            {title: "Lý do"},
            {title: "Loại ghim"},
            {title: "Số ghim"},
            {title: "User nhận"},
            {title: "Thành tiền"}
        ],
        columnDefs: [
            {
                orderable: false,
                "width": "5%",
                "targets": 0
            },
            {
                "width": "30%",
                "targets": 1
            },
            {
                "width": "30%",
                "targets": 2
            },{
                "width": "30%",
                "targets": 3
            },{
                "width": "30%",
                "targets": 4
            },
            {
                "width": "30%",
                "targets": 5
            },
            {
                "width": "30%",
                "targets": 6
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



    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnLoc').click(function (e) {
        getBaocao()
    })
});

