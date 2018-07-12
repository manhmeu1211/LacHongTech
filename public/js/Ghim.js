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



    $.get('api/user/getAll', data => {
        let arr = data.map(user => {
            return `<option>${user.Name}</option>`
        });
        $('#txtNguoiThucHien').html(arr.join(" "))
    });

    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnLoc').click(function (e) {
        document.getElementById("TuNgay").addEventListener("change", function() {
            let input = this.value;
            let tungay = new Date(input);
        });
        document.getElementById("DenNgay").addEventListener("change", function() {
            let input = this.value;
            let denngay = new Date(input);
        });

        $.get('api/baocao/baoCaoChiTiet' + tungay,denngay,id, data => {
            let arr = data.map(baocao => {
                return ["", baocao.HangMuc, baocao.MoTa, baocao.LyDo, baocao.TenLoai, baocao.SoGhim, baocao.Name, baocao.Tien]
            })
            console.log(arr)
            example.clear().rows.add(arr).draw();
        });
    })
});

