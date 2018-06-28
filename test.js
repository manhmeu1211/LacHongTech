function voban(ten, callback) {
    console.log(ten + ' có muốn dập không?');
    console.log(ten + " : Em có");
    callback(ten);
}

function dapnhunao(ten, cachdap) {
    console.log(ten + ' Kêu : AAAAAAAAA')
}


voban("Xúy", dapnhunao)