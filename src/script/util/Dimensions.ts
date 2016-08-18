export class Dimensions {

    /* http://help.dottoro.com/ljnvjiow.php */

    public static scrollX(): number {
        return window.pageXOffset || document.body.scrollLeft || 0;
    }

    public static scrollY(): number {
        return window.pageYOffset || document.body.scrollTop || 0;
    }

    /* http://stackoverflow.com/a/9410162 */

    public static viewportWidth(): number {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    }

    public static viewportHeight(): number {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    }
}
