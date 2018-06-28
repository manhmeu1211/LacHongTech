$(document).ready(function () {
    String.prototype.toHHMMSS = function () {
        let sec_num = parseInt(this, 10); // don't forget the second param
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (!+hours) {
            hours = 0;
        }
        if (!+minutes) {
            minutes = 0
        }
        if (!+seconds) {
            seconds = 0;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }
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
            {title: "STT"},
            {title: "Số điện thoại"},
            {title: "Thời gian gọi"},
            {title: "Trạng thái"},
            {title: "Phím "},
            {title: "Duration"},
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
                "targets": 4
            },
            {
                "width": "15%",
                "targets": 5
            },
            {
                "width": "15%",
                "targets": 6
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
    // $.post(`report`, {
    //     start: `${moment().format('YYYY-MM-DD')}T00:00:00`,
    //     end: `${moment().format('YYYY-MM-DD')}T23:59:59`
    // }, function (results) {
    //     console.log(results)
    //let arr = results.map((item, i) => ["", i + 1, item.Destination, moment(item.TimeCall).format("DD-MM-YYYY HH:mm:ss"), item.Status, item.Press, String(item.Duration).toHHMMSS()]);
    // example.clear().rows.add(arr).draw();
    let arr =[["", 1,"di","ho", "he","hi", "hu"]];
    example.clear().rows.add(arr).draw();
    //     $('#loadSpin').css("visibility", "hidden");
    // });

    $('#daterange').daterangepicker({
        opens: 'center',
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Lọc báo cáo",
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
        $('#loadSpin').css("visibility", "visible");
        console.log("A new date selection was made: " + start.format('YYYY-MM-DDTHH:mm:ss') + ' to ' + end.format('YYYY-MM-DDTHH:mm:ss'));
        $.post(`report`, {
            start: start.format('YYYY-MM-DDTHH:mm:ss'),
            end: end.format('YYYY-MM-DDTHH:mm:ss')
        }, function (results) {
            let arr = results.map((item, i) => ["", i + 1, item.Destination, moment(item.TimeCall).format("DD-MM-YYYY HH:mm:ss"), item.Status, item.Press, String(item.Duration).toHHMMSS()]);
            example.clear().rows.add(arr).draw();
            $('#loadSpin').css("visibility", "hidden");
        });
    });
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btLoc').click(function (e) {
        e.preventDefault();
        let from = $('#daterange').data('daterangepicker').startDate._d;
        let to = $('#daterange').data('daterangepicker').endDate._d;
        to = moment(to).format('YYYY-MM-DD HH:mm:ss');
        from = moment(from).format('YYYY-MM-DD HH:mm:ss');
        $.post(`report`, {start: from, end: to}, function (results) {
            let arr = results.map((item, i) => ["", i + 1, item.Destination, moment(item.TimeCall).format("DD-MM-YYYY HH:mm:ss"), item.Status, item.Press, String(item.Duration).toHHMMSS()]);
            example.clear().rows.add(arr).draw();
            $('#loadSpin').css("visibility", "hidden");
        });
    })
});