var currentCulture = currentCulture || "it-IT";

String.prototype.replaceAll = function (searchStr, replaceStr) {
    var output = "";
    var firstReplaceCompareCharacter = searchStr.charAt(0);
    var sourceLength = this.length;
    var replaceLengthMinusOne = searchStr.length - 1;
    for (var i = 0; i < sourceLength; i++) {
        var currentCharacter = this.charAt(i);
        var compareIndex = i;
        var replaceIndex = 0;
        var sourceCompareCharacter = currentCharacter;
        var replaceCompareCharacter = firstReplaceCompareCharacter;
        while (true) {
            if (sourceCompareCharacter != replaceCompareCharacter) {
                output += currentCharacter;
                break;
            }
            if (replaceIndex >= replaceLengthMinusOne) {
                i += replaceLengthMinusOne;
                output += replaceStr;
                //was a match
                break;
            }
            compareIndex++; replaceIndex++;
            if (i >= sourceLength) {
                // not a match
                break;
            }
            sourceCompareCharacter = this.charAt(compareIndex);
            replaceCompareCharacter = searchStr.charAt(replaceIndex);
        }
        replaceCompareCharacter += currentCharacter;
    }
    return output;
}

String.prototype.getFromJSONDate = function () {
    //console.log("Date: " + this);
    //console.log("Date: " + this.substr(6));
    return new Date(parseInt(this.substr(6)));
}

Date.prototype.toShortDateString = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    var output = "";

    switch (currentCulture) {
        case "it-IT":
            {
                if (day < 10) {
                    output += "0" + day.toString();
                } else {
                    output += day.toString();
                }

                output += "/";

                if (month < 10) {
                    output += "0" + month.toString();
                } else {
                    output += month.toString();
                }


                output += "/";
                output += year.toString();

                return output;

            }
            break;
    }
}



Date.prototype.toShortTimeString = function () {
    var hour = this.getHours();
    var min = this.getMinutes();
    var output = "";

    switch (currentCulture) {
        case "it-IT":
            {
                if (hour < 10) {
                    output += "0" + hour.toString();
                } else {
                    output += hour.toString();
                }

                output += ":";

                if (min < 10) {
                    output += "0" + min.toString();
                } else {
                    output += min.toString();
                }

                return output;
            }
            break;
    }
}

var gomp = gomp || {};


/**
* gomp base
*/
gomp.base = {
    getPalette: function () {
        var colors = [];
        colors.push({ name: "INDIANRED", value: "#CD5C5C", family: "RED" });
        colors.push({ name: "LIGHTCORAL", value: "#F08080", family: "RED" });
        colors.push({ name: "SALMON", value: "#FA8072", family: "RED" });
        colors.push({ name: "DARKSALMON", value: "#E9967A", family: "RED" });
        colors.push({ name: "LIGHTSALMON", value: "#FFA07A", family: "RED" });
        colors.push({ name: "CRIMSON", value: "#DC143C", family: "RED" });
        colors.push({ name: "RED", value: "#FF0000", family: "RED" });
        colors.push({ name: "FIREBRICK", value: "#B22222", family: "RED" });
        colors.push({ name: "DARKRED", value: "#8B0000", family: "RED" });

        colors.push({ name: "PINK", value: "#FFC0CB", family: "PINK" });
        colors.push({ name: "LIGHTPINK", value: "#FFB6C1", family: "PINK" });
        colors.push({ name: "HOTPINK", value: "#FF69B4", family: "PINK" });
        colors.push({ name: "DEEPPINK", value: "#FF1493", family: "PINK" });
        colors.push({ name: "MEDIUMVIOLETRED", value: "#C71585", family: "PINK" });
        colors.push({ name: "PALEVIOLETRED", value: "#DB7093", family: "PINK" });

        colors.push({ name: "LIGHTSALMON", value: "#FFA07A", family: "ORANGE" });
        colors.push({ name: "CORAL", value: "#FF7F50", family: "ORANGE" });
        colors.push({ name: "TOMATO", value: "#FF6347", family: "ORANGE" });
        colors.push({ name: "ORANGERED", value: "#FF4500", family: "ORANGE" });
        colors.push({ name: "DARKORANGE", value: "#FF8C00", family: "ORANGE" });
        colors.push({ name: "ORANGE", value: "#FFA500", family: "ORANGE" });

        colors.push({ name: "GOLD", value: "#FFD700", family: "GOLD" });
        colors.push({ name: "YELLOW", value: "#FFFF00", family: "GOLD" });
        colors.push({ name: "LIGHTYELLOW", value: "#FFFFE0", family: "GOLD" });
        colors.push({ name: "LEMONCHIFFON", value: "#FFFACD", family: "GOLD" });
        colors.push({ name: "LIGHTGOLDENRODYELLOW", value: "#FAFAD2", family: "GOLD" });
        colors.push({ name: "PAPAYAWHIP", value: "#FFEFD5", family: "GOLD" });
        colors.push({ name: "MOCCASIN", value: "#FFE4B5", family: "GOLD" });
        colors.push({ name: "PEACHPUFF", value: "#FFDAB9", family: "GOLD" });
        colors.push({ name: "PALEGOLDENROD", value: "#EEE8AA", family: "GOLD" });
        colors.push({ name: "KHAKI", value: "#F0E68C", family: "GOLD" });
        colors.push({ name: "DARKKHAKI", value: "#BDB76B", family: "GOLD" });

        colors.push({ name: "LAVENDER", value: "#E6E6FA", family: "PURPLE" });
        colors.push({ name: "THISTLE", value: "#D8BFD8", family: "PURPLE" });
        colors.push({ name: "PLUM", value: "#DDA0DD", family: "PURPLE" });
        colors.push({ name: "VIOLET", value: "#EE82EE", family: "PURPLE" });
        colors.push({ name: "ORCHID", value: "#DA70D6", family: "PURPLE" });
        colors.push({ name: "FUCHSIA", value: "#FF00FF", family: "PURPLE" });
        colors.push({ name: "MAGENTA", value: "#FF00FF", family: "PURPLE" });
        colors.push({ name: "MEDIUMORCHID", value: "#BA55D3", family: "PURPLE" });
        colors.push({ name: "MEDIUMPURPLE", value: "#9370DB", family: "PURPLE" });
        colors.push({ name: "REBECCAPURPLE", value: "#663399", family: "PURPLE" });
        colors.push({ name: "BLUEVIOLET", value: "#8A2BE2", family: "PURPLE" });
        colors.push({ name: "DARKVIOLET", value: "#9400D3", family: "PURPLE" });
        colors.push({ name: "DARKORCHID", value: "#9932CC", family: "PURPLE" });
        colors.push({ name: "DARKMAGENTA", value: "#8B008B", family: "PURPLE" });
        colors.push({ name: "PURPLE", value: "#800080", family: "PURPLE" });
        colors.push({ name: "INDIGO", value: "#4B0082", family: "PURPLE" });
        colors.push({ name: "SLATEBLUE", value: "#6A5ACD", family: "PURPLE" });
        colors.push({ name: "DARKSLATEBLUE", value: "#483D8B", family: "PURPLE" });
        colors.push({ name: "MEDIUMSLATEBLUE", value: "#7B68EE", family: "PURPLE" });

        colors.push({ name: "GREENYELLOW", value: "#ADFF2F", family: "GREEN" });
        colors.push({ name: "CHARTREUSE", value: "#7FFF00", family: "GREEN" });
        colors.push({ name: "LAWNGREEN", value: "#7CFC00", family: "GREEN" });
        colors.push({ name: "LIME", value: "#00FF00", family: "GREEN" });
        colors.push({ name: "LIMEGREEN", value: "#32CD32", family: "GREEN" });
        colors.push({ name: "PALEGREEN", value: "#98FB98", family: "GREEN" });
        colors.push({ name: "LIGHTGREEN", value: "#90EE90", family: "GREEN" });
        colors.push({ name: "MEDIUMSPRINGGREEN", value: "#00FA9A", family: "GREEN" });
        colors.push({ name: "SPRINGGREEN", value: "#00FF7F", family: "GREEN" });
        colors.push({ name: "MEDIUMSEAGREEN", value: "#3CB371", family: "GREEN" });
        colors.push({ name: "SEAGREEN", value: "#2E8B57", family: "GREEN" });
        colors.push({ name: "FORESTGREEN", value: "#228B22", family: "GREEN" });
        colors.push({ name: "GREEN", value: "#008000", family: "GREEN" });
        colors.push({ name: "DARKGREEN", value: "#006400", family: "GREEN" });
        colors.push({ name: "YELLOWGREEN", value: "#9ACD32", family: "GREEN" });
        colors.push({ name: "OLIVEDRAB", value: "#6B8E23", family: "GREEN" });
        colors.push({ name: "OLIVE", value: "#808000", family: "GREEN" });
        colors.push({ name: "DARKOLIVEGREEN", value: "#556B2F", family: "GREEN" });
        colors.push({ name: "MEDIUMAQUAMARINE", value: "#66CDAA", family: "GREEN" });
        colors.push({ name: "DARKSEAGREEN", value: "#8FBC8B", family: "GREEN" });
        colors.push({ name: "LIGHTSEAGREEN", value: "#20B2AA", family: "GREEN" });
        colors.push({ name: "DARKCYAN", value: "#008B8B", family: "GREEN" });
        colors.push({ name: "TEAL", value: "#008080", family: "GREEN" });

        colors.push({ name: "AQUA", value: "#00FFFF", family: "BLUE" });
        colors.push({ name: "CYAN", value: "#00FFFF", family: "BLUE" });
        colors.push({ name: "LIGHTCYAN", value: "#E0FFFF", family: "BLUE" });
        colors.push({ name: "PALETURQUOISE", value: "#AFEEEE", family: "BLUE" });
        colors.push({ name: "AQUAMARINE", value: "#7FFFD4", family: "BLUE" });
        colors.push({ name: "TURQUOISE", value: "#40E0D0", family: "BLUE" });
        colors.push({ name: "MEDIUMTURQUOISE", value: "#48D1CC", family: "BLUE" });
        colors.push({ name: "DARKTURQUOISE", value: "#00CED1", family: "BLUE" });
        colors.push({ name: "CADETBLUE", value: "#5F9EA0", family: "BLUE" });
        colors.push({ name: "STEELBLUE", value: "#4682B4", family: "BLUE" });
        colors.push({ name: "LIGHTSTEELBLUE", value: "#B0C4DE", family: "BLUE" });
        colors.push({ name: "POWDERBLUE", value: "#B0E0E6", family: "BLUE" });
        colors.push({ name: "LIGHTBLUE", value: "#ADD8E6", family: "BLUE" });
        colors.push({ name: "SKYBLUE", value: "#87CEEB", family: "BLUE" });
        colors.push({ name: "LIGHTSKYBLUE", value: "#87CEFA", family: "BLUE" });
        colors.push({ name: "DEEPSKYBLUE", value: "#00BFFF", family: "BLUE" });
        colors.push({ name: "DODGERBLUE", value: "#1E90FF", family: "BLUE" });
        colors.push({ name: "CORNFLOWERBLUE", value: "#6495ED", family: "BLUE" });
        colors.push({ name: "MEDIUMSLATEBLUE", value: "#7B68EE", family: "BLUE" });
        colors.push({ name: "ROYALBLUE", value: "#4169E1", family: "BLUE" });
        colors.push({ name: "BLUE", value: "#0000FF", family: "BLUE" });
        colors.push({ name: "MEDIUMBLUE", value: "#0000CD", family: "BLUE" });
        colors.push({ name: "DARKBLUE", value: "#00008B", family: "BLUE" });
        colors.push({ name: "NAVY", value: "#000080", family: "BLUE" });
        colors.push({ name: "MIDNIGHTBLUE", value: "#191970", family: "BLUE" });

        colors.push({ name: "CORNSILK", value: "#FFF8DC", family: "BROWN" });
        colors.push({ name: "BLANCHEDALMOND", value: "#FFEBCD", family: "BROWN" });
        colors.push({ name: "BISQUE", value: "#FFE4C4", family: "BROWN" });
        colors.push({ name: "NAVAJOWHITE", value: "#FFDEAD", family: "BROWN" });
        colors.push({ name: "WHEAT", value: "#F5DEB3", family: "BROWN" });
        colors.push({ name: "BURLYWOOD", value: "#DEB887", family: "BROWN" });
        colors.push({ name: "TAN", value: "#D2B48C", family: "BROWN" });
        colors.push({ name: "ROSYBROWN", value: "#BC8F8F", family: "BROWN" });
        colors.push({ name: "SANDYBROWN", value: "#F4A460", family: "BROWN" });
        colors.push({ name: "GOLDENROD", value: "#DAA520", family: "BROWN" });
        colors.push({ name: "DARKGOLDENROD", value: "#B8860B", family: "BROWN" });
        colors.push({ name: "PERU", value: "#CD853F", family: "BROWN" });
        colors.push({ name: "CHOCOLATE", value: "#D2691E", family: "BROWN" });
        colors.push({ name: "SADDLEBROWN", value: "#8B4513", family: "BROWN" });
        colors.push({ name: "SIENNA", value: "#A0522D", family: "BROWN" });
        colors.push({ name: "BROWN", value: "#A52A2A", family: "BROWN" });
        colors.push({ name: "MAROON", value: "#800000", family: "BROWN" });

        colors.push({ name: "WHITE", value: "#FFFFFF", family: "WHITE" });
        colors.push({ name: "SNOW", value: "#FFFAFA", family: "WHITE" });
        colors.push({ name: "HONEYDEW", value: "#F0FFF0", family: "WHITE" });
        colors.push({ name: "MINTCREAM", value: "#F5FFFA", family: "WHITE" });
        colors.push({ name: "AZURE", value: "#F0FFFF", family: "WHITE" });
        colors.push({ name: "ALICEBLUE", value: "#F0F8FF", family: "WHITE" });
        colors.push({ name: "GHOSTWHITE", value: "#F8F8FF", family: "WHITE" });
        colors.push({ name: "WHITESMOKE", value: "#F5F5F5", family: "WHITE" });
        colors.push({ name: "SEASHELL", value: "#FFF5EE", family: "WHITE" });
        colors.push({ name: "BEIGE", value: "#F5F5DC", family: "WHITE" });
        colors.push({ name: "OLDLACE", value: "#FDF5E6", family: "WHITE" });
        colors.push({ name: "FLORALWHITE", value: "#FFFAF0", family: "WHITE" });
        colors.push({ name: "IVORY", value: "#FFFFF0", family: "WHITE" });
        colors.push({ name: "ANTIQUEWHITE", value: "#FAEBD7", family: "WHITE" });
        colors.push({ name: "LINEN", value: "#FAF0E6", family: "WHITE" });
        colors.push({ name: "LAVENDERBLUSH", value: "#FFF0F5", family: "WHITE" });
        colors.push({ name: "MISTYROSE", value: "#FFE4E1", family: "WHITE" });

        colors.push({ name: "GAINSBORO", value: "#DCDCDC", family: "GRAY" });
        colors.push({ name: "LIGHTGRAY", value: "#D3D3D3", family: "GRAY" });
        colors.push({ name: "SILVER", value: "#C0C0C0", family: "GRAY" });
        colors.push({ name: "DARKGRAY", value: "#A9A9A9", family: "GRAY" });
        colors.push({ name: "GRAY", value: "#808080", family: "GRAY" });
        colors.push({ name: "DIMGRAY", value: "#696969", family: "GRAY" });
        colors.push({ name: "LIGHTSLATEGRAY", value: "#778899", family: "GRAY" });
        colors.push({ name: "SLATEGRAY", value: "#708090", family: "GRAY" });
        colors.push({ name: "DARKSLATEGRAY", value: "#2F4F4F", family: "GRAY" });
        colors.push({ name: "BLACK", value: "#000000", family: "GRAY" });

        return colors;

    },
    copyToClipboard: function (text) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();
    },
    firstOrDefault: function (value, condition) {
        var output;
        $.each(value,
            function (key, item) {
                if (condition(item) == true) {
                    output = item;
                    return false;
                }
            });
        return output;
    },
    where: function (value, condition) {
        var output = [];
        $.each(value,
            function (key, item) {
                if (condition(item) == true) {
                    output.push(item);
                }
            });

        return output;
    },
    firstIndexOf: function (value, condition) {
        var output;
        $.each(value,
            function (index, item) {
                if (condition(item) == true) {
                    output = index;
                    return false;
                }
            });
        return output;
    },
    removeByCondition: function (value, condition) {
        $.each(value,
            function (index, item) {
                if (condition(item) == true) {
                    value.splice(index, 1);
                    return false;
                }
            });
        return value;
    },
    merge: function (array1, array2) {
        var output = [];
        $.each(array1,
            function (index, item) {
                output.push(item);
            });
        $.each(array2,
            function (index, item) {
                output.push(item);
            });
        return output;
    },
    removeAll: function (value, condition) {
        return $.grep(value,
            function (e) {
                return !condition(e);
            });
    },
    gompNormalize: function (o) {
        if (o != null && typeof o == 'object') {
            $.each(o,
                function (key, value) {
                    var result = gomp.base.gompNormalize(value);
                    if (result != null) {
                        o[key] = result;
                    }
                });
        } else {
            if (typeof o == 'string') {
                if (o.indexOf("/Date(") == 0) {
                    o = new Date(parseInt(o.substr(6)));
                    return o;
                }
            }
        }

        return null;
    },
    gompNormalize2: function (o) {
        if (o != null && typeof o == 'object') {
            if (o["__ludwigType"] === undefined) {
                $.each(o,
                    function (key, value) {
                        var result = gomp.base.gompNormalize2(value);
                        if (result != null) {
                            o[key] = result;
                        }
                    });
            } else {
                switch (o["__ludwigType"]) {
                    case "DateTime":
                        var newDateTime = new Date(
                            o["year"],
                            o["month"] - 1,
                            o["day"],
                            o["hour"],
                            o["minute"],
                            o["second"],
                            o["millisecond"]);
                        o = newDateTime;
                        return o;
                        break;
                }
            }
        } else {
            if (typeof o == 'string') {
                if (o.indexOf("/Date(") == 0) {
                    o = new Date(parseInt(o.substr(6)));
                    return o;
                }
            }
        }

        return null;
    },
    stringify: function (object) {
        var replacer = function (key, value) {

            if (this[key] instanceof Date) {
                return {
                    "year": this[key].getFullYear(),
                    "month": this[key].getMonth() + 1,
                    "day": this[key].getDate(),
                    "hour": this[key].getHours(),
                    "minute": this[key].getMinutes(),
                    "second": this[key].getSeconds(),
                    "millisecond": this[key].getMilliseconds()
                };
            }

            return value;
        }

        return (JSON.stringify(object, replacer));

    },
    getDateMask: function () {
        switch (currentCulture) {
            case "it-IT":
                {
                    return "99/99/9999";
                }
                break;
        }

        return null;
    },

    getShortTimeMask: function () {
        switch (currentCulture) {
            case "it-IT":
                {
                    return "99:99";
                }
                break;
        }

        return null;
    },

    fromDateString: function (input) {
        switch (currentCulture) {
            case "it-IT":
                {
                    try {
                        var elements = input.match(/[0-9]+/g);
                        console.log(elements);
                        if (elements.length == 3) {
                            return new Date(elements[2], elements[1] - 1, elements[0]);
                        }
                        if (elements.length == 5) {
                            return new Date(elements[2], elements[1] - 1, elements[0], elements[3], elements[4], 0, 0);
                        }
                        if (elements.length == 6) {
                            return new Date(elements[2], elements[1] - 1, elements[0], elements[3], elements[4], elements[5]);
                        }
                    }
                    catch (err) {
                        console.log("Errore: " + err);
                        return null;
                    }

                }
                break;
        }

        return null;
    },

    //Html encode di stringa
    htmlEncode: function (text) {
        return $('<div/>').text(text).html();
    },

    htmlDecode: function (text) {
        return $('<div/>').html(text).text();
    },

    //Ottiene un nuovo GUID
    getNewGuid: function (resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        mData.push({ name: "method", value: "newguid" });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/BaseFunctions.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                if (resolve) resolve(result);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    },

    sum: function (array, element) {
        var output = 0;
        $.each(array,
            function (index, value) {
                output += element(value);

            });
        return output;
    },

    getNewDate: function (year, month, day, hour, minute, second) {
        if (!hour) hour = 0;
        if (!minute) hour = 0;
        if (!second) hour = 0;

        return new Date(year, month, day, hour, minute, second, 0);
    },


    //Ottiene la data corrente
    getDateNow: function (resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        mData.push({ name: "method", value: "datetime" });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/BaseFunctions.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                if (resolve) resolve(result);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    },
    //Ottiene le classi di laurea/concorso
    getClassi: function (resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        mData.push({ name: "command", value: "getClassi" });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/Vocs/JSONVocsService.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                var newResult = result.sort(function (a, b) {
                    var rowA = a.Sigla;
                    var rowB = b.Sigla;

                    if (rowA < rowB) {
                        return -1;
                    }
                    if (rowA > rowB) {
                        return 1;
                    }
                    return 0;
                });
                if (resolve) resolve(newResult);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    },
    //Ottiene le tipologie di manifesto
    getManifestoType: function (resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        mData.push({ name: "command", value: "getManifestoType" });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/Vocs/JSONVocsService.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                if (resolve) resolve(result);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    },
    //Ottiene le strutture didattiche
    getStruttureDidattiche: function (anno, resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        if (anno) {
            mData.push({ name: "anno", value: anno });
        }
        mData.push({ name: "command", value: "getActiveStruttureDidattiche" });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/Vocs/JSONVocsService.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                var newResult = result.sort(function (a, b) {
                    var rowA = a.denominazione;
                    var rowB = b.denominazione;

                    if (rowA < rowB) {
                        return -1;
                    }
                    if (rowA > rowB) {
                        return 1;
                    }
                    return 0;
                });
                if (resolve) resolve(newResult);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    },
    getEnumByNumber: function (enums, enumNumber) {
        return gomp.base.firstOrDefault(enums, function (item) { return item.Enum == enumNumber });
    },
    getEnum: function (enumName, resolve, reject) {
        //return new Promise(function (resolve, reject) {
        var mData = [];
        mData.push({ name: "method", value: "getEnum" });
        mData.push({ name: "enum", value: enumName });
        $.ajax({
            type: 'POST',
            cache: false,
            url: '/JSON/BaseFunctions.aspx',
            data: mData,
            dataType: 'json',
            success: function (result) {
                if (resolve) resolve(result);
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                console.log("error: " + errorthrown);
                if (reject) reject(new Error(errorthrown));
            }
        });
        //});
    }
};

gomp.base.insegnamenti =
    {
        getCfu: function (insegnamento) {
            var output = 0;
            output += gomp.base.sum(insegnamento.CreditiAmbitiSSDCollection,
                function (element) {
                    return element.Crediti;
                });
            $.each(insegnamento.Items,
                function (index, value) {
                    output += gomp.base.insegnamenti.getCfu(value);
                });

            return output;
        }
    };
