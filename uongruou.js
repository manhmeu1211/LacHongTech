function gapnhau(met, callback) {
    console.log(met);

    callback(met);
}

function funcCallback() {
    console.log('Uống rượu chay');
}

gapnhau('Đông và Hoàng gặp nhau sau đó : ', funcCallback);




function voban(ten , callback) {
    console.log(ten + 'có muốn dập không?')
    console.log('Có')
    callback(ten)
}

function dapnhunao(cachdap, callback){
    console.log(cachdap);

}