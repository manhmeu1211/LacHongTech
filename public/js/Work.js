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
            {title: "Hạng mục"},
            {title: "Phân hệ"},
            {title: "Mô Tả"},
            {title: "Ngày bắt đầu"},
            {title: "Deadline"},
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
                "width": "15%",
                "targets": 2
            },
            {
                "width": "15%",
                "targets": 3
            },
            {
                "width": "15%",
                "targets": 4
            }
            ,
            {
                "width": "15%",
                "targets": 5,
                "render": function ( data, type, row ) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')}
            },
            {
                "width": "15%",
                "targets": 6,
                "render": function ( data, type, row ) {
                    return moment(data).format('DD-MM-YYYY HH:mm:ss')}
            },
            {
                "width": "15%",
                "targets": 7
            },
            {
                "width": "15%",
                "targets": 8
            },
            {
                "width": "15%",
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
    $.get(`api/work/getAll/${getUrlParameter('id')}`, data => {
        console.log(data)
        let arr = data.map(work => {
            return ["", work.ID, work.HangMuc, work.PhanHe, work.MoTa, work.NgayBatDau, work.Deadline, work.Status, work.NguoiYeuCau, work.NguoiThucHien, work.TenDuAn]
        })
        console.log(arr)
        example.clear().rows.add(arr).draw();
    });
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();
    $('#btnAddHangMuc').click(function (e) {
        $('#AddEditEmployeePopup').modal();
        let arr = ["dungva", "he", "ha", "hu"];
        let options = arr.map(i => {
            if (i === "dungva")
                return `<option selected>${i}</option>`
            else return `<option >${i}</option>`
        })
        $('#txtTenCt').html(options.join(" "))
    });
    $('#example').on('dblclick', 'tr', function (e) {
        const mact = example.row(this).data();
        console.log(mact);
    });

});
function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
function initModal() {
    let now = moment().format('YYYY-MM-DD');
    $('#page-popup').html(`<div id="AddEditEmployeePopup" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
                <form id="frmAddCompany" class="form-horizontal" method="post" action="router/company">
                <input name="type" id="type" class="hidden" value="add">
                <input name="mactOld" id="mactOld" class="hidden">
                    <div class="modal-header" style="border-bottom: 0px">
                        <button type="button" class="close" data-dismiss="modal"></button>
                        <h2 id="titleModal" class="modal-title">Thêm mới công ty</h2>
                    </div>
                    <div class="modal-body" >
                        <div class="form-group col-xs-12">
                            <label for="txtTenCt" class="control-label" style="margin-top: 8px">Tên công ty <span
                                    class="require">(*)</span></label>
                            <div class="inner-addon left-addon">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <select name="tenct" class="form-control" id="txtTenCt">
                                        
                                </select>
                            </div>
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" id="btnSave" data-toggle="tooltip"
                                data-placement="bottom" title="Lưu lại">
                            Lưu lại
                        </button>
                        <button type="button" class="btn btn-danger" id="btnClose" data-toggle="tooltip"
                                data-placement="bottom" title="Đóng" data-dismiss="modal">Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>`);
}