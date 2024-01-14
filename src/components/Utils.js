

export default function sleep(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}