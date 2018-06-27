function voban(ten, callback) {
    console.log(ten + ' có muốn dập không?');
    console.log("Em có");
    callback(ten);
}

function dapnhunao(cachdap) {
    console.log('Kêu : AAAAAAAAA')
}


voban("Xúy", dapnhunao)