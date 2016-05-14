/**
 * Created by 奥 on 2015/12/30.
 */

if (typeof jQuery === 'undefined') {
    throw new Error("XA's JavaScript requires jQuery");
}


/*
 * 可在javascript字符串中如是写
 * HtmlFormat("<div>{$data['RankUserInfoList'][0]['OpenID']}</div>",{"data": { "RankUserInfoList": [{ "OpenID": "3243", "UserID": 3369 },{ "OpenID": "3998", "UserID": 4107}]}});
 * str:拼凑的字符串
 * jsonPackage:数据
 * elementId:可选参数:要追加/覆盖的元素ID
 * isOverride?覆盖:追加
 * */
function HtmlFormat(str, jsonPackage, elementId, isOverride) {
    //将该标识符替换为'jsonPackage.'
    var mySymbol = /\$/g;
    //用作去掉开头的'{@'和结尾的'}'
    var replaceReg = /(^{@)|(}$)/g;
    //获取'{@ }'包裹的参数用eval执行并返回值 可识别的字符:+-*/%.()<>=['"]?:!|&字母数字空格中文
    var matchArgsReg = /{@[\n\$\w\.,\[\]\+\-\*\/%=!&\|\(\)><\?:'";\u4E00-\u9FA5 ]+}/g;
    var argsList = str.match(matchArgsReg);
    if (argsList != null) {
        for (var i = 0; i < argsList.length; i++) {
            var argStr = argsList[i];
            var keyName = argStr.replace(replaceReg, '').replace(mySymbol, 'jsonPackage.');
            var keyVal = eval(keyName);
            str = str.replace(argStr, keyVal);
        }
    }
    //如果元素ID不为空,则在该ID内追加/覆盖替换后的字符串
    if (elementId != null) {
        //覆盖
        if (isOverride != null && isOverride) {
            document.getElementById(elementId).innerHTML = str;
        }
        //追加
        else {
            document.getElementById(elementId).innerHTML += str;
        }
    }
    //返回替换后的值
    return str;
}

function CheckIsJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//会将php的js_encode()自动parse
function AjaxFunc(url, data, successFun, errorFun) {
    $.ajax(
    {
        type: "POST",
        url: url,
        data: data,
        success: function(result) {
            var package;
            var isJson = CheckIsJson(result);
            if (successFun == null && isJson) {
                if (package.flag != null) {
                    SuccessFun(package);
                }
            } else {
                successFun(package);
            }
        },
        error: function(result) {
            if (errorFun != null)
                errorFun(result);
        },
    });

//千篇一律的successFun。。
    function SuccessFun(result) {
        if (result.flag) {
            alert('操作成功');
            if (result['url'] != null) {
                window.location.href = result.url;
            } else {
                window.location.reload();
            }
            return true;
        } else {
            alert(result.msg);
            return false;
        }
    }
}


function TicksToDays(ticks) {
    return (ticks / 24 / 60 / 60).toFixed(1);
}

function TicksToDaysMend(ticks) {
    var days = (ticks / 24 / 60 / 60).toFixed(1);
    return days < 0 ? 0 : days;
}


function PhpTickToDate(tick) {
    var date = new Date(tick * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}

function MD5Class() {
    var hexCase = 0;

    this.CalcMd5 = function(a) {
        if (a == "") return a;
        return rstr2hex(rstr_md5(str2rstr_utf8(a)))
    }

    function hex_hmac_md5(a, b) {
        return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
    }

    this.IsOK = function() {
        return this.CalcMd5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
    }

    function rstr_md5(a) {
        return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
    }

    function rstr_hmac_md5(c, f) {
        var e = rstr2binl(c);
        if (e.length > 16) {
            e = binl_md5(e, c.length * 8)
        }
        var a = Array(16), d = Array(16);
        for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828
        }
        var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
        return binl2rstr(binl_md5(d.concat(g), 512 + 128))
    }

    function rstr2hex(c) {
        try {
            hexCase
        } catch (g) {
            hexCase = 0
        }
        var f = hexCase ? "0123456789ABCDEF" : "0123456789abcdef";
        var b = "";
        var a;
        for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
        }
        return b
    }

    function str2rstr_utf8(c) {
        var b = "";
        var d = -1;
        var a, e;
        while (++d < c.length) {
            a = c.charCodeAt(d);
            e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
            if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
                a = 65536 + ((a & 1023) << 10) + (e & 1023);
                d++
            }
            if (a <= 127) {
                b += String.fromCharCode(a)
            } else {
                if (a <= 2047) {
                    b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
                } else {
                    if (a <= 65535) {
                        b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    } else {
                        if (a <= 2097151) {
                            b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                        }
                    }
                }
            }
        }
        return b
    }

    function rstr2binl(b) {
        var a = Array(b.length >> 2);
        for (var c = 0; c < a.length; c++) {
            a[c] = 0
        }
        for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
        }
        return a
    }

    function binl2rstr(b) {
        var a = "";
        for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
        }
        return a
    }

    function binl_md5(p, k) {
        p[k >> 5] |= 128 << ((k) % 32);
        p[(((k + 64) >>> 9) << 4) + 14] = k;
        var o = 1732584193;
        var n = -271733879;
        var m = -1732584194;
        var l = 271733878;
        for (var g = 0; g < p.length; g += 16) {
            var j = o;
            var h = n;
            var f = m;
            var e = l;
            o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
            l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
            m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
            n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
            o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
            l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
            m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
            n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
            o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
            l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
            m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
            n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
            o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
            l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
            m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
            n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
            o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
            l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
            m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
            n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
            o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
            l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
            m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
            n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
            o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
            l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
            m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
            n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
            o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
            l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
            m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
            n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
            o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
            l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
            m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
            n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
            o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
            l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
            m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
            n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
            o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
            l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
            m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
            n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
            o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
            l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
            m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
            n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
            o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
            l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
            m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
            n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
            o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
            l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
            m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
            n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
            o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
            l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
            m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
            n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
            o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
            l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
            m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
            n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
            o = safe_add(o, j);
            n = safe_add(n, h);
            m = safe_add(m, f);
            l = safe_add(l, e)
        }
        return Array(o, n, m, l)
    }

    function md5_cmn(h, e, d, c, g, f) {
        return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
    }

    function md5_ff(g, f, k, j, e, i, h) {
        return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
    }

    function md5_gg(g, f, k, j, e, i, h) {
        return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
    }

    function md5_hh(g, f, k, j, e, i, h) {
        return md5_cmn(f ^ k ^ j, g, f, e, i, h)
    }

    function md5_ii(g, f, k, j, e, i, h) {
        return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
    }

    function safe_add(a, d) {
        var c = (a & 65535) + (d & 65535);
        var b = (a >> 16) + (d >> 16) + (c >> 16);
        return (b << 16) | (c & 65535)
    }

    function bit_rol(a, b) {
        return (a << b) | (a >>> (32 - b))
    }
}

function CreateGUID() {
    return new MD5Class().CalcMd5(new Date().getMilliseconds() + 'salt' + Math.random());
}

function IsEmptyValue(str, msg) {
    if (str == null || str == '') {
        alert('请完善' + msg);
        return true;
    }
    return false;
}

function IsHandSlip(msg) {
    var ran = (Math.random() * 1000).toFixed(0);
    if (ran != prompt(msg + "\n为防止误操作,请键入" + ran + "以继续")) {
        alert('校验失败,取消提交');
        return true;
    }
    return false;
}


function Csv() {
    //format single column data
    function columnDataFormat(rowData, columnName) {
        if ($.isArray(columnName)) {
            var funcArgsCount = columnName.length;
            var columnNameStr;
            var func;
            switch (funcArgsCount) {
            case 2:
            {
                columnNameStr = columnName[0];
                func = columnName[1];
                return func(rowData[columnNameStr]);
                break;
            }
            case 3:
            {
                func = columnName[1];
                var arg = columnName[2];
                return func(rowData, arg);
                break;
            }
            default:
            {
                return rowData[columnName];
            }
            }
        }
        return rowData[columnName];
    }

//export csv string
    this.ExportCsvStr = function(data, headers, columns) {
        var columnsLength = columns.length;
        var csvStr = headers === "" ? "" : headers + "\n";
        for (var i in data) {
            for (var x = 0; x < columnsLength; x++) {
                csvStr += columnDataFormat(data[i], columns[x]) + (x === columnsLength - 1 ? "\n" : ",");
            }
        }
        return csvStr;
    }
    //export csv string&download csv
    this.DownloadCsv = function(data, headers, columns, csvName) {
        csvName = csvName == null ? 'DownLoad' : csvName;
        var aTag = document.createElement('a');
        aTag.href = "data:text/csv;charset=UTF-8,\ufeff" + encodeURIComponent(this.ExportCsvStr(data, headers, columns));
        aTag.innerHTML = csvName;
        aTag.download = csvName + ".csv";
        aTag.click();
    }
    this.Just4Test = function() {
        var headers = 'Name,Sex,Sql,C++,JavaScript,C#,Total';
        var testJson = [
            {
                "Name": "AlexXie",
                "Sex": 1,
                "Sql": 90,
                "C++": 80,
                "JavaScript": 90,
                "C#": 100
            },
            {
                "Name": "Lee",
                "Sex": 0,
                "Sql": 59,
                "C++": 0,
                "JavaScript": 59,
                "C#": -100
            }
        ];
        this.DownloadCsv(testJson, headers, [
            "Name",
            ["Sex", function(sex) { return sex ? "Male" : "Female" }],
            "Sql",
            "C++",
            "JavaScript",
            "C#",
            [
                "Total",
                function(rowData, passLine) {
                    var total = rowData["Sql"] + rowData["C++"] + rowData["JavaScript"] + rowData["C#"];
                    return total + (total >= passLine ? "-Passed" : "-Failed");
                }, 240
            ]
        ], "Report");
    }
}


function PageHandler(postUrl, callBackFunc, customPageSize) {
    var self = this;
    var url = postUrl;
    var func = callBackFunc;
    var pageSize = customPageSize == null ? 10 : customPageSize;
    self.pageIndex = 1;
    self.lastTimeResultCount = pageSize;
    self.CanNext = false;
    self.CanPrev = false;
    self.queryCondition = {};

    function canWeGo(currentPageIndex) {
        self.CanPrev = currentPageIndex - 1 > 0;
        self.CanNext = self.lastTimeResultCount === pageSize;
    }

    function go(postData) {
        //防止数据加载完前点击
        self.CanNext = false;
        self.CanPrev = false;
        self.queryCondition = postData == null ? self.queryCondition : postData;
        postData = self.queryCondition;
        postData["pageIndex"] = self.pageIndex;
        postData["pageSize"] = pageSize;
        $.ajax({
            url: url,
            data: postData,
            type: "POST",
            success: function(result) {
                self.lastTimeResultCount = result.data.length;
                canWeGo(self.pageIndex);
                if (result.msg != null) {
                    alert(result.msg);
                }
                func(result);
            },
            error: function(result) {
                console.log(result);
                alert(":(\nWhoops,looks like something went wrong");
            }
        });
    }

    this.FirstPage = function(postData) {
        self.pageIndex = 1;
        go(postData);
    }
    this.PrevPage = function(postData) {
        if (self.CanPrev) {
            self.pageIndex--;
            go(postData);
        }

    }
    this.NextPage = function(postData) {
        if (self.CanNext) {
            self.pageIndex++;
            go(postData);
        }
    }
}

function HtmlDecode(htmlEncodeStr) {
    var elem = document.createElement('textarea');
    elem.innerHTML = htmlEncodeStr;
    return elem.value;
}

function ObjDecodeToJson(htmlEncodeStr) {
    return JSON.parse(HtmlDecode(htmlEncodeStr));

}