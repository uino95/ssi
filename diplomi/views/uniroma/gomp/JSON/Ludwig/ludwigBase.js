var besmart = besmart || {};

/**
* besmart.ludwig
*/
besmart.ludwig = {
    async: function (data, server, onSuccess, onError, onFailure) {
        $.ajax({
            type: 'POST',
            cache: false,
            url: server,
            data: data,
            dataType: 'json',
            success: function (result) {
                gomp.base.gompNormalize(result);
                if (result.success) {
                    onSuccess(result);
                } else {
                    if (onError) {
                        onError(result);
                    } else {
                        alert(result.message);
                    }
                }
            },
            error: function (xmlhttprequest, textstatus, errorthrown) {
                if (onFailure) {
                    onFailure(xmlhttprequest, textstatus, errorthrown);
                } else {
                    alert(errorthrown);
                }
            }
        });
    },
    parseValue: function (value, valueType, server, onSuccess, onError, onFailure) {
        besmart.ludwig.async({ value: value, valueType: valueType, command: "parseValue" }, server,
            function (result) { onSuccess(result.value); }, onError, onFailure);
    },
    parseValueForControl: function (input, valueType, valueTypeSpec, server, onSuccess) {
        input.fadeTo("fast", .2);
        besmart.ludwig.parseValue(input.val(), valueType, server, function (value) {
            switch (valueTypeSpec) {
            case "Date":
                input.val(value.ValueDateTime != null ?
                    value.ValueDateTime.toShortDateString() : "");
                break;
            default:
                input.val(value.ValueForInterface);
                break;
            }

            input.fadeTo("fast", 1);

            if (onSuccess !== undefined) {
                onSuccess(value);
            }
        });
    },
    bindControl: function (input, params) {
        if (params === undefined || params == null) params = {};
        if (params.server === undefined) params.server = "/JSON/Ludwig/LudwigBaseJSON.aspx";
        //Oggetto diverso dal controllo
        if (input.html === undefined) {
            //Verifico il tipo di oggetto
            if (input.env !== undefined) {
                //ace editor
                //input.session.removeAllListeners('change');

                input.setValue(params.dataSource[params.dataField] != null
                    ? params.dataSource[params.dataField] : "");
                input.session.setValue(params.dataSource[params.dataField] != null
                    ? params.dataSource[params.dataField] : "");

                console.log(params.dataSource);
                console.log("init: " + params.dataSource[params.dataField]);


                input.on("change", function () {
                    params.dataSource[params.dataField] = input.getSession().getValue();
                    console.log(params.dataSource[params.dataField]);
                });
            }
        } else {
            if (input.is("span")) {
                switch (params.dataType) {
                case "String":
                    input.text(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : "");
                    break;
                case "DateTime":
                    switch (params.dataFormat) {
                    case "Date":
                        input.text(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField].toShortDateString() : "");
                        break;
                    case "Time":
                        input.text(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField].toShortTimeString() : "");
                        break;
                        break;
                    default:
                    }
                    break;
                }
            }

            if (input.is("select")) {
                //Drop down
                switch (params.dataType) {
                case "SimpleObject":
                    {
                        input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField].UID : "");
                        input.off("change");
                        input.change(function () {
                            var itemSelected = input.select2('data');
                            console.log(itemSelected);
                            params.dataSource[params.dataField] = {
                                UID: itemSelected.id,
                                Denominazione: itemSelected.text
                            };
                        });
                    }
                    break;
                default:
                    input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : "");
                    input.off("change");
                    input.change(function () {
                        params.dataSource[params.dataField] = input.val();
                    });
                    break;
                }
            }

            if (input.is("input") || input.is("textarea")) {
                //Text box
                if (input.attr("type") === "text" || input.is("textarea")) {
                    switch (params.dataType) {
                    case "String":
                        input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : "");
                        input.off("change");
                        input.change(function () {
                            params.dataSource[params.dataField] = input.val();
                        });
                        break;
                    case "Number":
                        input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : "");
                        input.off("change");
                        input.change(function () {
                            var n = input.val();
                            if (n.indexOf(",") >= 0)
                                n = n.replace(/\./g, '').replace(',', '.');
                            if ($.isNumeric(n)) {
                                params.dataSource[params.dataField] = n;
                                input.val(n);
                            }
                            else {
                                input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : "");
                            }
                        });
                        break;

                    case "DateTime":
                        switch (params.dataFormat) {
                        case "Date":
                            input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField].toShortDateString() : "");
                            input.datepicker();
                            input.mask("99/99/9999");
                            input.off("change");
                            input.change(function () {
                                console.log("ludwigChange");
                                besmart.ludwig.parseValueForControl(input, "DateTime", "Date", params.server,
                                    function (value) { params.dataSource[params.dataField] = value.ValueDateTime; });
                            });

                            break;
                        case "Time":
                            input.val(params.dataSource[params.dataField] != null ? params.dataSource[params.dataField].toShortTimeString() : "");
                            input.off("change");
                            input.change(function () {
                                besmart.ludwig.parseValueForControl(input, "DateTime", "Time", params.server,
                                    function (value) { params.dataSource[params.dataField] = value.ValueDateTime; });
                            });
                            break;
                        default:
                        }
                        break;
                    }
                }
                //CheckBox
                if (input.attr("type") === "checkbox") {
                    switch (params.dataType) {
                    default:
                    {
                        var isChecked = params.dataSource[params.dataField] != null ? params.dataSource[params.dataField] : false;
                        input.prop("checked", isChecked);
                        input.off("change");
                        input.change(function () {
                            params.dataSource[params.dataField] = input.is(":checked");
                        });
                        break;
                    }
                    }
                }
            }
        }
    }
};