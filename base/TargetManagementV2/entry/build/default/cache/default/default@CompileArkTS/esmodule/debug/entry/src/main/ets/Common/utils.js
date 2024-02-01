class Utils {
    // 时间戳转化为当前时间
    formatNowdate(date) {
        function add0(m) {
            return m < 10 ? '0' + m : m;
        }
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return (y +
            '-' +
            add0(m) +
            '-' +
            add0(d) +
            ' ' +
            add0(h) +
            ':' +
            add0(mm) +
            ':' +
            add0(s));
    }
    getNow() {
        return this.formatNowdate(new Date());
    }
}
const utils = new Utils();
export default utils;
//# sourceMappingURL=utils.js.map