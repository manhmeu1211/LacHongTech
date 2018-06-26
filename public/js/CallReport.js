$(document).ready(function () {
    String.prototype.toHHMMSS = function () {
        let sec_num = parseInt(this, 10); // don't forget the second param
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

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
    const ip = document.location.hostname;
    let arrLang = {
        'en': {
            'baocaocuocgoi': 'Call Report',
            'tungaydenngay': 'From - To',
            'songuon': 'Source',
            'sodich': 'Destination',
            'thoigiandamthoai': 'Talk time',
            'xembaocao': 'View Report',
            'stt': 'Serial',
            'ngay': 'Date',
            'batdau': 'Time',
            'trangthai': 'Status',
            'tacvu': 'Action',
            'ngheghiam': 'Listen',
            'taixuong': 'Download'
        },
        'vi': {
            'baocaocuocgoi': 'Báo cáo cuộc gọi',
            'tungaydenngay': 'Từ ngày - Đến ngày',
            'songuon': 'Số nguồn',
            'sodich': 'Số đích',
            'thoigiandamthoai': 'Thời gian đàm thoại',
            'xembaocao': 'Xem báo cáo',
            'stt': 'STT',
            'ngay': 'Ngày',
            'batdau': 'Bắt đầu',
            'trangthai': 'Trạng thái',
            'tacvu': 'Tác vụ',
            'ngheghiam': 'Nghe ghi âm',
            'taixuong': 'Tải xuống'
        }
    }

    var lang = localStorage.language;
    $('.lang').each(function (index, element) {
        $(this).attr('value', arrLang[lang][$(this).attr('key')])
        $(this).text(arrLang[lang][$(this).attr('key')])
    })

    $('.langtitle').each(function (index, element) {
        $(this).attr('title', arrLang[lang][$(this).attr('alt')])
    })

    $.fn.dataTable.ext.errMode = 'none';

    $('#example').on('error.dt', function (e, settings, techNote, message) {
        console.log('An error has been reported by DataTables: ', message);
    });
    // const userLang = navigator.language || navigator.userLanguage;
    /// Setup - add a text input to each header cell
    $('#example thead tr th').not(":nth-child(1)").each(function () {
        var title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });

    let example, excelTable;
    setDataDataTable([]);
    $('[data-toggle="tooltip"]').tooltip();

    // Apply the search

    let locale = {}
    switch (lang) {
        case 'vi':
            locale = {
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
            }
            break;

        case 'en': {
            locale = {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "applyLabel": "Apply",
                "cancelLabel": "Cancel",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "daysOfWeek": [
                    "Su",
                    "Mo",
                    "Tu",
                    "We",
                    "Th",
                    "Fr",
                    "Sa"
                ],
                "monthNames": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "firstDay": 1
            }
        }
            break;
        default:
            locale = {
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
            }

    }
    $('#daterange').daterangepicker({
        opens: 'center',
        locale,
        startDate: moment(),
        endDate: moment(),
    }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
    $('#btXemBaoCao').click(function (e) {
        $('#loadSpin').css("visibility", "visible");
        let from = $('#daterange').data('daterangepicker').startDate._d;
        let to = $('#daterange').data('daterangepicker').endDate._d;
        to = moment(to).format('YYYY-MM-DD HH:mm:ss');
        from = moment(from).format('YYYY-MM-DD HH:mm:ss');
        let mact = localStorage.getItem('mact');
        let songuon = $('#songuon').val();
        let sodich = $('#sodich').val();
        let giay = $('#tgdamthoai').val();
        console.log(mact, sodich, songuon, giay);
        $.post('/router/callreport', {from, to, mact, songuon, sodich, giay}, function (data) {
            let callHistory = data.call;
            let prefix = data.prefix.Prefix;
            console.log(prefix);
            let datasource = callHistory.map((item, i) => [i + 1, moment(item.calldate).format("DD-MM-YYYY"), moment(item.calldate).format("HH:mm:ss"), item.src.indexOf(prefix) === 0 ? item.src.substring(prefix.length) : item.src, item.dst.indexOf(prefix) === 0 ? item.dst.substring(prefix.length) : item.dst, item.disposition, String(item.billsec).toHHMMSS(), item.uniqueid]);
            example.clear().rows.add(datasource).draw();
            $('#loadSpin').css("visibility", "hidden");
        });
    });

    function setDataDataTable(data) {

        example = $('#example').DataTable({
            "scrollY": "30vh",
            "pagingType": "full_numbers",
            "lengthChange": false,
            "select": true,
            "scrollCollapse": false,
            "pageLength": 10,
            data,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'excel', 'csv',
            ],
            "order": [],
            columns: [
                {title: (lang === 'vi') ? "STT" : "Serial"},
                {title: (lang === 'vi') ? "Ngày" : "Date"},
                {title: (lang === 'vi') ? "Bắt đầu" : "Time"},
                {title: (lang === 'vi') ? "Số nguồn" : "Source"},
                {title: (lang === 'vi') ? "Số đích" : "Destination"},
                {title: (lang === 'vi') ? "Trạng thái" : "Status"},
                {title: (lang === 'vi') ? "Thời gian đàm thoại" : "Talk time"},
                {
                    title: (lang === 'vi') ? "Tác vụ" : "Action",
                    render: (data, type, row, meta) => {
                        if (row[6] !== '00:00:00')
                            return `<div class="text-center">
                                <img onclick="playmusic('${data}')" class="langtitle" key="ngheghiam" alt="ngheghiam"'  title="${arrLang[lang].ngheghiam}" src="images/cdr_sound.png" height="16" width="16">
                                <a href="http://${ip}/recording/download.php?uniqueid=${data}"> <img class="langtitle" key="taixuong" alt="taixuong" title="${arrLang[lang].taixuong}" src="images/cdr_download.png" height="16" width="16"></a>
                                </div>`;
                        else
                            return "";
                    }
                }
            ],

            columnDefs: [
                {className: "text-center", "targets": [1, 2, 3, 4, 6]},
                {
                    "orderable": false,
                    "width": "5%",
                    "className": 'text-center',
                    "targets": 0,
                },
                {
                    "width": "10%",
                    "targets": 1
                },
                {
                    "width": "10%",
                    "targets": 2
                },
                {
                    "width": "20%",
                    "targets": 3
                },
                {
                    "width": "15%",
                    "targets": 4
                },
                {
                    "width": "10%",
                    "targets": 5,
                }, {
                    "width": "15%",
                    "targets": 6
                }
            ]
        });

        // Apply the search
        example.columns().eq(0).each(function (colIdx) {
            $('input', $('#filter th:nth-child(' + (colIdx + 1) + ')')).on('keyup change', function () {
                example
                    .column(colIdx)
                    .search(this.value)
                    .draw();
            });
        });
        $('#header th:nth-child(1)').removeClass('sorting_disabled');
        $('#header th:nth-child(1)').removeClass('sorting_asc');
        example.on('order.dt search.dt', function () {
            example.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        // Apply the search
        $('#header').prependTo('#thead1');


    }

    $('#btXemBaoCao').click();
});


function playmusic(uniqueid) {
    const ip = document.location.hostname;
    console.log(uniqueid);
    let html = `<div class="sweet-overlay" tabindex="-1" style="opacity: 1.09; display: block;"></div>
    <div class="sweet-alert showSweetAlert visible" data-custom-class="" data-has-cancel-button="false"
         data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="false" data-animation="pop"
         data-timer="null" style="display: block; margin-top: -106px;">
        <div class="sa-icon sa-error" style="display: none;">
      <span class="sa-x-mark">
        <span class="sa-line sa-left"></span>
        <span class="sa-line sa-right"></span>
      </span>
        </div>
        <div class="sa-icon sa-warning" style="display: none;">
            <span class="sa-body"></span>
            <span class="sa-dot"></span>
        </div>
        <div class="sa-icon sa-info" style="display: none;"></div>
        <div class="sa-icon sa-success" style="display: none;">
            <span class="sa-line sa-tip"></span>
            <span class="sa-line sa-long"></span>

            <div class="sa-placeholder"></div>
            <div class="sa-fix"></div>
        </div>
        <div class="sa-icon sa-custom" style="display: none;"></div>
        <audio id="audio" style="width: 90%" controls autoplay>
            <source src="http://${ip}/recording/download.php?uniqueid=${uniqueid}" type="audio/wav">
            Your browser dose not Support the audio Tag
        </audio>
        <p style="display: block;"></p>
        <fieldset>
            <input type="text" tabindex="3" placeholder="">
            <div class="sa-input-error"></div>
        </fieldset>
        <div class="sa-error-container">
            <div class="icon">!</div>
            <p>Not valid!</p>
        </div>
        <div class="sa-button-container">
            <button class="cancel" tabindex="2" style="display: none; box-shadow: none;">Cancel</button>
            <div class="sa-confirm-button-container">
                <button onclick="dismissDialog()" class="confirm" tabindex="1"
                        style="display: inline-block; background-color: rgb(140, 212, 245); box-shadow: rgba(140, 212, 245, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;">
                    OK
                </button>
                <div class="la-ball-fall">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>`;
    $('#music-player').html(html);
}

function dismissDialog() {
    $('#music-player').html('');
}

