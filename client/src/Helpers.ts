export default function timeOut(seconds:number) {
    return new Promise(resolve=>setTimeout(resolve,seconds))
}