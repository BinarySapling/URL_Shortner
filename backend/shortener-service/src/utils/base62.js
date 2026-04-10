

const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


export const encode = (num) =>{
    let n = BigInt(num)
    const base = BigInt(62)
    let res = '';

    if(n===0n) return CHARSET[0]
 
    while(n>0){
        res = CHARSET[Number(n%base)]+res;

        n = n/base;
    }

    return res;
}