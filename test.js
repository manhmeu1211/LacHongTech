function voban(ten, callback) {
    console.log(ten + ' có muốn dập không?');
    console.log(ten + " : Em có");

    callback(ten);
}
voban("Xúy", (dapnhunao)=>{
    console.log("Kêu : AAAAA")
})

function denNhaThu() {
    console.log("Đông: Thu ơi!!!!!!")
    console.log("Thu: Ơi!");
    thuTiepNhan("khongdaudit").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err)
    })
}

function thuTiepNhan(trangthai) {
    return new Promise(function (resolve, reject) {
        if (trangthai === "khongdaudit") {
            console.log("Vẫn đang ỉa");
            setTimeout(( ) => {
                resolve("Thu: Thu không đau đít. Ok Thu ra tiếp Đông");
            }, 2000)
        } else {
            console.log("Vẫn đang ỉa");
            setTimeout(() => {
                reject("Thu: Thu đau đít quá k tiếp đâu :( !");
            }, 2000)
        }
    })
}



denNhaThu();

