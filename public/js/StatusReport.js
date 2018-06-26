$(document).ready(function () {
    /// Setup - add a text input to each header cell
    $('#example thead tr:nth-child(1) th').not(":nth-child(1)").each(function () {
        var title = $('#example thead th').eq($(this).index()).text();
        $(this).html('<input type="text" style="width:100%" ' + title + '" />');
    });

    // DataTable
    let example = $('#example').DataTable({
        "scrollY": "380px",
        "pagingType": "full_numbers",
        "lengthChange": false,
        "select": true,
        "scrollCollapse": false,
        "pageLength": 20,
        data: [],
        columns: [
            {title: "STT"},
            {title: "Extension"},
            {title: "Họ tên"},
            {title: "Trạng thái"}
        ],
        columnDefs: [{
            orderable: false,
            "width": "5%",
            "className": 'text-center',
            "targets": 0
        },
            {
                "width": "15%",
                "targets": 1
            },
            {
                "width": "15%",
                "targets": 3
            }]
    });

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
        // $('input', $('#filter th:nth-child(' + (colIdx + 1) +')')).on('click', function(e) {
        //     e.stopPropagation();
        // });
    });
    // Apply the search
    $('#header').prependTo('#thead1');
    $('#header th:nth-child(1)').removeClass('sorting_asc');
    $('#header th:nth-child(1)').addClass('sorting_disabled');
    $('[data-toggle="tooltip"]').tooltip();

    //Add Event open popup
});
