let datestart = new Date();
datestart.setHours(17);
datestart.setMinutes(30);
datestart.setSeconds(0)
let dateEnd = new Date();
dateEnd.setDate(6);
dateEnd.setHours(13)
dateEnd.setMinutes(30);
dateEnd.setSeconds(0)

console.log(tinhGhim(dateEnd, datestart));

function tinhGhim(ngayhoanthanh, deadline) {
    let cout = 0;
    while (ngayhoanthanh - deadline > 0) {
        let minute = ngayhoanthanh.getHours() * 60 + ngayhoanthanh.getMinutes();
        if (ngayhoanthanh.getDay() === 0) {
            ngayhoanthanh.setHours(ngayhoanthanh.getHours() - 4);
            continue;
        } else if (ngayhoanthanh.getDay() === 6) {
            if (minute >= (8 * 60) && minute < (12 * 60)) {
                cout++;
            }
        } else {
            if (minute >= (13 * 60 + 30) && minute < (17 * 60 + 30)) {
                cout++;
            } else if (minute >= (8 * 60) && minute <= (12 * 60)) {
                cout++;
            }
        }
        ngayhoanthanh.setHours(ngayhoanthanh.getHours() - 4);
    }
    return cout;
}

