jQuery.fn.smartBinding = function (params) {
    if (!params.verbose) params.verbose = false;

    function getValueInFormat(value, format) {
        if (format) {
            switch (format) {
                case "datetime":
                    return value != null ? value.toShortDateString() : "";
                    break;
            }
        } else {
            return value;
        }

        return value;
    }

    function setValueInFormat(value, format) {
        if (format) {
            switch (format) {
                case "datetime":
                    return gomp.base.fromDateString(value);
                    break;
            }
        }
        return value;
    }

    function getValue(data, fieldName) {
        var fieldElements = fieldName.split(".");
        if (fieldElements.length > 1) {
            var newFieldData = data[fieldElements[0]];
            var newFieldName = "";
            for (var i = 1; i < fieldElements.length; i++) {
                if (newFieldName != "") {
                    newFieldName += ".";
                }
                newFieldName += fieldElements[i];
            }
            return getValue(newFieldData, newFieldName);
        } else {
            return data[fieldName];
        }
    }

    function setValue(data, fieldName, value) {
        var fieldElements = fieldName.split(".");
        if (fieldElements.length > 1) {
            var newFieldData = data[fieldElements[0]];
            var newFieldName = "";
            for (var i = 1; i < fieldElements.length; i++) {
                if (newFieldName != "") {
                    newFieldName += ".";
                }
                newFieldName += fieldElements[i];
            }
            setValue(newFieldData, newFieldName, value);
        } else {
            data[fieldName] = value;
        }
    }

    function bindToElement(element) {
        if (element.attr("smart-binding-field")) {
            var value = getValue(params.data, element.attr("smart-binding-field"));

            if (element.is("span")) {
                element.text(getValueInFormat(value, element.attr("smart-binding-format")));
            }

            if (element.is("select")) {
                element.val(value);
                element.select2();
                element.change(function () {
                    setValue(params.data, element.attr("smart-binding-field"), $(this).val());
                    if (params.verbose == true) {
                        console.log(params.data);
                    }
                });
            }

            if (element.is("textarea")) {
                element.val(value);
                element.change(function () {
                    setValue(params.data, element.attr("smart-binding-field"), $(this).val());
                    if (params.verbose == true) {
                        console.log(params.data);
                    }
                });
            }

            if (element.is("input")) {
                if (element.attr("type") == "text") {
                    element.val(getValueInFormat(value, element.attr("smart-binding-format")));
                    if (element.attr("smart-picker") == "true") {
                        element.mask("99/99/9999");
                        element.datepicker();
                    }
                    if (element.attr("smart-aa") == "true") {
                        element.mask("9999/9999");
                    }
                    if (element.attr("smart-hour") == "true") {
                        element.mask("99:99");
                    }
                    if (element.attr("smart-picker-hour") == "true") {
                        element.mask("99/99/9999 99:99");
                        element.datepicker();
                    }
                    element.change(function () {
                        setValue(params.data, element.attr("smart-binding-field"), setValueInFormat($(this).val(), element.attr("smart-binding-format")));
                        if (params.verbose == true) {
                            console.log(params.data);
                        }
                    });
                }

                if (element.attr("type") == "checkbox") {
                    element.prop("checked", value);
                    element.change(function () {
                        setValue(params.data, element.attr("smart-binding-field"), $(this).is(":checked"));
                        if (params.verbose == true) {
                            console.log(params.data);
                        }
                    });
                }

            }
        }
    }

    $.each($("span", $(this)),
        function () {
            bindToElement($(this));
        });

    $.each($("input", $(this)),
        function () {
            bindToElement($(this));
        });

    $.each($("select", $(this)),
        function () {
            bindToElement($(this));
        });

    $.each($("textarea", $(this)),
        function () {
            bindToElement($(this));
        });
}

function sortSelectOptions(selector, skip_first) {
    var options = (skip_first) ? $('option:not(:first)', selector) : $('option', selector);
    var arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value, s: $(o).prop('selected') }; }).get();
    arr.sort(function (o1, o2) {
        var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();
        if ($.isNumeric(t1)) {
            t1 = parseInt(t1, 10);
        }

        if ($.isNumeric(t2)) {
            t2 = parseInt(t2, 10);
        }

        return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
    });
    options.each(function (i, o) {
        //console.log(o);
        o.value = arr[i].v;
        $(o).text(arr[i].t);
        if (arr[i].s) {
            $(o).attr('selected', 'selected').prop('selected', true);
        } else {
            $(o).removeAttr('selected');
            $(o).prop('selected', false);
        }
    });
}

//Tabella generica
jQuery.fn.genericTable = function (params) {
    var container = $(this);
    //Oggetto tabella
    var table = $("<table/>");
    if (!params.className) params.className = "gradienttable";
    if (!params.oddTrClassName) params.oddTrClassName = "";
    if (!params.oddEvenTrClassName) params.oddEvenTrClassName = "";
    if (!params.newTrClassName) params.newTrClassName = "newrow";
    if (!params.addButtonImage) params.addButtonImage = "fa fa-plus-circle fa-2x";
    if (params.tableOverride) {
        params.tableOverride(table);
    }
    if (!params.triggerFiltersOnInputChange) params.triggerFiltersOnInputChange = false;
    if (params.showFilters != false) params.showFilters = true;
    if (params.enableHeaderSort === undefined) params.enableHeaderSort = true;
    if (params.moveUpLabel === undefined) params.moveUpLabel = "sposta su";
    if (params.moveDownLabel === undefined) params.moveUpLabel = "sposta giù";
    if (params.editLabel === undefined) params.editLabel = "modifica";

    //console.log(params.enableHeaderSort);

    table.attr("class", params.className);

    if (params.columns) {
        var trH = $("<tr/>");
        $.each(params.columns,
            function (index, value) {
                var th = $("<th smart-role=\"column-header\" order-mode=\"none\" header-number=\"" + index + "\" />");
                th.attr("style", value.style + "; cursor: pointer; ");
                th.html("<div style=\"display: block; white-space: nowrap;\">" + gomp.base.htmlEncode(value.text) + "&nbsp;<i></i></div>");

                if (value.checkbox) {
                    th.css("text-align", "center");
                    var tdCheck = $("<input type='checkbox' />");
                    th.append(tdCheck);
                    tdCheck.change(function () {
                        if ($(this).is(":checked")) {
                            $("input[type='checkbox']", "td[column-number=\"" + index + "\"]", "tr:visible", table)
                                .prop("checked", true);

                        } else {
                            $("input[type='checkbox']", "td[column-number=\"" + index + "\"]", "tr:visible", table)
                                .prop("checked", false);
                        }
                        $("input[type='checkbox']", "td[column-number=\"" + index + "\"]", "tr:visible", table)
                            .trigger("change");
                    });
                }

                th.click(function () {
                    if (!params.enableHeaderSort) return;
                    if (value.checkbox) return;

                    var f = 1;

                    if ($(this).attr("order-mode") == "ascending") {
                        f = -1;
                        $(this).attr("order-mode", "descending");
                        $("i", $(this)).attr("class", "fa fa-arrow-down");
                        $("i", $(this)).attr("aria-hidden", "true");
                        ////<i class="fa fa-arrow-down" aria-hidden="true"></i>
                    } else {
                        f = 1;
                        $(this).attr("order-mode", "ascending");
                        $("i", $(this)).attr("class", "fa fa-arrow-up");
                        $("i", $(this)).attr("aria-hidden", "true");
                    }

                    var rows = $("tr[smart-role='dataRow']", table).toArray();
                    var newRows = rows.sort(function (a, b) {
                        var rowA =
                            $("td[column-number='" + index + "']", a).attr("sortText") !== undefined ?
                                $("td[column-number='" + index + "']", a).attr("sortText") :
                                $("td[column-number='" + index + "']", a).attr("searchText");
                        if ($.isNumeric(rowA)) {
                            rowA = parseInt(rowA, 10);
                        }



                        var rowB = $("td[column-number='" + index + "']", b).attr("sortText") !== undefined ?
                            $("td[column-number='" + index + "']", b).attr("sortText") :
                            $("td[column-number='" + index + "']", b).attr("searchText");
                        if ($.isNumeric(rowB)) {
                            rowB = parseInt(rowB, 10);
                        }

                        console.log(rowA + " <> " + rowB);

                        if (rowA < rowB) {
                            return -1 * f;
                        }
                        if (rowA > rowB) {
                            return 1 * f;
                        }
                        return 0;
                    });

                    table.append(newRows);
                    processOddEven();
                    recomputeNewRow();
                });
                if (params.headerDelegate) {
                    params.headerDelegate(value, index, th);
                }
                trH.append(th);
            });
        table.append(trH);

        //Filtri
        var trF = $("<tr/>");
        $.each(params.columns,
            function (index, value) {
                var th = $("<td/>");
                th.attr("style", value.style);
                if (!value.deleteButton) {
                    var filter = $("<select style=\"width: 100%\" smart-role=\"columnFilter\" filter-number=\"" +
                        index +
                        "\"/>");
                    filter.append($("<option value=\"*\" smart-role=\"noFilter\">*</option>"));
                    th.append(filter);


                    if (value.checkbox) {
                        filter.hide();
                    } else {
                        filter.select2(
                            {
                                allowClear: true
                            });
                    }
                }
                trF.append(th);
            });
        table.append(trF);

        if (params.showFilters == false) {
            trF.hide();
        }
        $.each(params.data,
            function (index, row) {
                addRow(index, row);
            });

        sortFilters();

        //Riga di aggiunta
        if (params.newRow) {
            var newRow = $("<tr smart-role=\"newrow\"/>");
            newRow.attr("class", params.newTrClassName);
            var tdText = $("<td/>");
            tdText.attr("colspan", params.columns.length - 1);

            //Verifica se la funzione ha restituito una stringa...
            var innerHtml = params.newRow(params.data, tdText);

            if (innerHtml != "") {
                //Aggiunge il testo alla cella
                tdText.html(innerHtml);
            }

            //Funzione per gestire il contenuto di cella
            if (params.newRowCellDelegate) {
                params.newRowCellDelegate(table, tdText, params.data);
            }

            var tdAdd = $("<td style=\"cursor: pointer; text-align: center;\" smart-role=\"addButton\"><i class=\"" +
                params.addButtonImage + "\" title=\"Aggiungi\"/></td>");

            newRow.append(tdText);
            newRow.append(tdAdd);
            table.append(newRow);
        }
    }

    function sortFilters() {
        //filters
        var filterDrops = $("select[smart-role='columnFilter']", table).each(function () {
            sortSelectOptions($(this), false);
        });
    }

    function addRowForFilter(index, row) {
        $.each(params.columns,
            function (index, value) {
                if (value.cellText) {
                    var theText = value.cellText(row);
                    //Agiunge il testo al filter
                    var fOption = $("<option/>");
                    fOption.text(theText);
                    var filterDrop = $("select[smart-role='columnFilter'][filter-number='" + index + "']", table);

                    if ($("option", filterDrop).filter(function () {
                        return ($(this).text() == theText);

                    }).length == 0) {
                        //console.log("Add: " + fOption.text());
                        filterDrop
                            .append(fOption);
                    }
                }
            });
    }

    function addRow(index, row) {
        var tr = $("<tr smart-role='dataRow'/>");
        var rowIndex = index;

        if (params.dataRowKey) {
            tr.attr("row-key", params.dataRowKey(row));
        }

        if (params.rowOverride) {
            params.rowOverride(tr, row);
        }

        if (params.onRowClick) {
            tr.click(function (event) { params.onRowClick(row, event); });
        }

        $.each(params.columns,
            function (index, value) {
                var td = $("<td column-number=\"" + index + "\"/>");

                if (value.cellText) {
                    td.attr("searchText", value.cellText(row));
                    //Agiunge il testo al filter
                    var fOption = $("<option/>");
                    fOption.text(td.attr("searchText"));
                    var filterDrop = $("select[smart-role='columnFilter'][filter-number='" + index + "']", table);

                    if ($("option", filterDrop).filter(function () {
                        return ($(this).text() == td.attr("searchText"));

                    }).length == 0) {
                        filterDrop
                            .append(fOption);
                    }
                }

                if (value.cellContent) {
                    //Verifica se la funzione ha restituito una stringa...
                    var innerHtml = value.cellContent(row, td, rowIndex);

                    if (innerHtml != "") {
                        //Aggiunge il testo alla cella
                        td.html(innerHtml);
                    }
                    //Altrimenti usa l'oggetto td
                }

                if (value.deleteButton) {
                    td.css("text-align", "center");
                    td.css("cursor", "pointer");
                    td.html("<i class=\"fa fa-times fa-2x\" title=\"Elimina\" smart-role=\"delete\">");
                    td.click(function () {
                        if (value.deleteDelegate) {
                            if (value.deleteDelegate(row, params)) {
                                tr.remove();
                                rebuildFilters();
                            } else {
                                alert("Operazione non consentita");
                            }
                        } else {
                            alert("Operazione non consentita");
                        }
                        processOddEven();
                    });
                }

                if (value.editButton) {
                    td.append("<i class=\"fa fa-pencil-square-o fa-2x\" aria-hidden=\"true\"></i>");
                    td.css("cursor", "pointer");
                    td.attr("title", params.editLabel);
                    td.css("text-align", "center");
                    td.click(function () {
                        value.editHandler(rowIndex, row);
                    });
                }

                if (value.moveButton) {
                    if (value.moveMode === "up") {
                        if (rowIndex > 0) {
                            td.append("<i class=\"fa fa fa-arrow-up fa-2x\" aria-hidden=\"true\"></i>");
                            td.css("cursor", "pointer");
                            td.attr("title", params.moveUpLabel);
                            td.css("text-align", "center");
                            td.click(function () {
                                var tmp = params.data[rowIndex];
                                params.data[rowIndex] = params.data[rowIndex - 1];
                                params.data[rowIndex - 1] = tmp;
                                params.updatedRow = rowIndex - 1;
                                container.html("");
                                container.genericTable(params);
                            });
                        }
                    }

                    if (value.moveMode === "down") {
                        if (rowIndex < params.data.length - 1) {
                            td.append("<i class=\"fa fa fa-arrow-down fa-2x\" aria-hidden=\"true\"></i>");
                            td.attr("title", params.moveDownLabel);
                            td.css("cursor", "pointer");
                            td.click(function () {
                                var tmp = params.data[rowIndex];
                                params.data[rowIndex] = params.data[rowIndex + 1];
                                params.data[rowIndex + 1] = tmp;
                                params.updatedRow = rowIndex + 1;
                                container.html("");
                                container.genericTable(params);
                            });
                            td.css("text-align", "center");
                        }
                    }

                }

                if (value.checkbox) {
                    td.css("text-align", "center");
                    var tdCheck = $("<input type='checkbox' />");
                    td.append(tdCheck);
                    if (value.checkInit) {
                        value.checkInit(row, tdCheck);
                    }
                    tdCheck.change(function () {
                        if (value.checkDelegate) {
                            value.checkDelegate(row, $(this).is(":checked"));
                        }
                    });
                }
                tr.append(td);
            });
        if (params.triggerFiltersOnInputChange == true) {
            $("input", tr).change(function () {
                rebuildFilters();
                recomputeData($(this));
            });
            $("textarea", tr).change(function () {
                rebuildFilters();
                recomputeData($(this));
            });

        }
        table.append(tr);
        if (params.updatedRow !== undefined && params.updatedRow == index) {
            tr.fadeTo("fast", .2).fadeTo("fase", 1);
        }
    }

    function recomputeData(element) {
        var tr = element.closest("tr");
        var td = element.closest("td");

        var columnNumber = td.attr("column-number");
        var rowKey = tr.attr("row-key");
        var row = gomp.base.firstOrDefault(params.data,
            function (item) {
                return (params.dataRowKey(item) == rowKey);
            });
        td.attr("searchText", params.columns[columnNumber].cellText(row));
    }

    $(this).append(table);
    processOddEven();

    function processOddEven() {
        $("tr[smart-role='dataRow']").each(function (index) {
            var tr = $(this);
            if ((index % 2) > 0) {
                tr.attr("class", params.oddTrClassName);
            } else {
                tr.attr("class", params.oddEvenTrClassName);
            }
        });
    }

    function rebuildFilters() {
        $("option[smart-role!='noFilter']", "select[smart-role='columnFilter']", table).remove();
        $.each(params.data,
            function (index, row) {
                addRowForFilter(index, row);
            });
        sortFilters();
    }

    function recomputeFilters() {
        $("tr[smart-role='dataRow']", table).show();
        $("select[smart-role='columnFilter']", table).each(function (index) {
            var drop = $(this);
            var dropIndex = drop.attr("filter-number");
            if (drop.val() != "*") {
                var rowFilter = $("tr[smart-role='dataRow']", table).filter(function () {
                    var cellText = $("td[column-number='" + dropIndex + "']", $(this)).attr("searchText");
                    return cellText != drop.val();
                });
                rowFilter.hide();
            }
        });
        processOddEven();
        sortFilters();
    }

    function recomputeNewRow() {

        var newRow = $("tr[smart-role='newrow']", table);
        if (newRow.length == 1) {

            table.append(newRow);
        }
    }

    function recomputeDelegates() {
        $("td", table).click(function () {
            if ($("input", $(this)).length == 1) {
                $("input", $(this)).first().focus();
                $("textarea", $(this)).first().focus();
            }
        });

        if (params.after) {
            params.after(table);
        }
    }

    recomputeDelegates();

    $("select[smart-role='columnFilter']", table).change(function () {
        recomputeFilters();
    });

    if (params.postProcessDelegate) {
        params.postProcessDelegate(table);
    }

    $("td[smart-role='addButton']", table).click(function () {
        if (params.newRowDelegate) {
            var callBack = params.newRowDelegate(params.data);
            if (callBack) {
                if (callBack.then) {
                    //async call
                    callBack.then(function (result) {
                        if (result) {
                            addRow($("td[smart-role='dataRow']").length, result);
                            processOddEven();
                            recomputeNewRow();
                            recomputeDelegates();
                        }
                    });
                } else {
                    console.log("sync");
                    addRow($("td[smart-role='dataRow']").length, callBack);
                    processOddEven();
                    recomputeNewRow();
                    recomputeDelegates();
                }
            }
        }
    });


}

//Drop down di GOMP
jQuery.fn.dropDown = function (params, method) {
    return this.each(function () {
        if (!method) {
            $(this).data("params", params);

            if (!params.placeholder) params.placeholder = "Cerca";
            if (!params.minimumInputLength) params.minimumInputLength = 3;
            if (!params.formatNoMatches) params.formatNoMatches = function (term) { return "nessun risultato"; };
            if (!params.formatSearching) params.formatSearching = function (term) { return "ricerca in corso..."; };
            if (!params.formatInputTooShort)
                params.formatInputTooShort = function (term, minLength) { return "inserire almeno 3 caratteri"; };
            if (!params.allowClear) params.allowClear = true;
            if (!params.delay) params.delay = 250;
            if (!params.resultsFunction)
                params.resultsFunction = function (data, page) {
                    $.each(data,
                        function (index, value) {
                            value.id = value.uid;
                        });

                    return {
                        results: data
                    };
                };

            $(this).select2({
                placeholder: params.placeholder,
                minimumInputLength: params.minimumInputLength,
                formatNoMatches: params.formatNoMatches,
                formatSearching: params.formatSearching,
                formatInputTooShort: params.formatInputTooShort,
                ajax: {
                    type: 'POST',
                    url: params.url,
                    dataType: 'json',
                    data: params.dataFunction,
                    results: params.resultsFunction
                },
                allowClear: params.allowClear,
                formatResult: params.formatResultFunction,
                delay: params.delay,
                escapeMarkup: function (m) { return m; },
                formatSelection: params.formatSelectionFunction,
                initSelection: function (element, callback) {
                    if (params.selectedValue) {
                        if (!params.selectedValue.id && params.selectedValue.uid) {
                            params.selectedValue.id = params.selectedValue.uid;
                        }
                        if (!params.selectedValue.id && params.selectedValue.UID) {
                            params.selectedValue.id = params.selectedValue.UID;
                        }
                        callback(params.selectedValue);
                    }
                }
            }).on("change", params.changeFunction);

            if (params.selectedValue) {
                $(this).select2('val', params.selectedValue);
            }
        } else {
            console.log($(this).data("params"));
            switch (method) {
                case "clear":
                    $(this).select2('val', "");
                    break;
                case "select":
                    {
                        $(this).select2('destroy');
                        var newParams = $(this).data("params");
                        newParams.selectedValue = params.selectedValue;
                        $(this).dropDown(newParams);
                    }
                    break;
            }
        }
    });

}

jQuery.fn.smartDialog = function (params) {
    return this.each(function () {
        var container = $(this);
        container.hide();

        if (!params) params = {};
        if (!params.top) params.top = "50px;";
        if (!params.left) params.left = "50px;";
        if (!params.right) params.right = "50px;";
        if (!params.bottom) params.bottom = "50px;";
        $(".modalsmartdivback").remove();

        function show() {
            //Background
            var backGround = $("<div/>");
            backGround.addClass("modalsmartdivback");

            $("body").append(backGround);

            container.show();
            container.addClass("modalsmartdiv");
            container.attr("style", "top: " + params.top + "; bottom: " + params.bottom + "; left: " + params.left + "; right: " + params.right);

            //Remove degli elementi generati dall'estensione
            $("div[smart-role='smartDialogTop']", container).remove();
            if ($("div[smart-role='smartDialogScroller']", container).length > 0) {
                $("div[smart-role='smartDialogScroller']", container).children().appendTo(container);
            }
            $("div[smart-role='smartDialogScroller']", container).remove();

            //Crea il vero div scroller
            var scroller = $("<div/>");
            scroller.attr("smart-role", "smartDialogScroller");
            scroller.addClass("modalsmartInner");
            //scroller.attr("style", "top: " + params.top + "; bottom: " + params.bottom + "; left: " + params.left + "; right: " + params.right);            
            container.children().appendTo(scroller);
            container.append(scroller);

            //top
            var smartDialogTop = $("<div/>");
            smartDialogTop.attr("smart-role", "smartDialogTop");
            smartDialogTop.addClass("top");
            container.prepend(smartDialogTop);

            //h1
            var h1 = $("<h1/>");
            smartDialogTop.append(h1);
            h1.text(params.title);

            var closeButton = $("<i class=\"fa fa-times fa-3x\" aria-hidden=\"true\"></i>");
            smartDialogTop.append(closeButton);
            closeButton.addClass("close");
            closeButton.click(function () {

                if (params.closeCallBack) {
                    if (params.closeCallBack()) {
                        container.hide();
                        $(".modalsmartdivback").remove();
                    }
                } else {
                    container.hide();
                    $(".modalsmartdivback").remove();
                }
            });

            //scroller.css("top", smartDialogTop.height() + 10 + "px");
            var paracadute = smartDialogTop.height() === 0 ? 49 : smartDialogTop.height();
            scroller.css("top", paracadute + 10 + "px");
        }


        if (params) {
            if (params.method) {
                switch (params.method) {
                    case "show":
                        show();
                        break;
                    case "close":
                        container.hide();
                        break;
                }
            }
        }
    });
}

//Tabella generica
jQuery.fn.dynamicList = function (params) {
    //Contenitore
    var div = $("<div/>");
    $(this).append(div);
    if (!params.className) params.className = "";
    if (!params.separator) params.separator = "<span>, </span>";
    div.attr("class", params.className);

    if (params.overrideDiv) {
        params.overrideDiv(params);
    }

    $.each(params.data,
        function (index, value) {
            if (index > 0) {
                div.append($(params.separator));
            }
            addElement(index, value);
        });

    if (params.newRowDelegate) {
        var span = $("<span/>");
        div.append(span);
        span.attr("smart-role", "newRowSpan");

        params.newRowDelegate(span);

        div.append(span);
    }

    function addElement(index, value) {
        var span = $("<span/>");
        div.append(span);
        span.attr("smart-role", "dataspan");
        if (params.spanKey) {
            span.attr("smart-span-key", params.spanKey(index, value));
        }
        if (params.element) {
            params.element(index, value, span);
        }

        if (params.enableDelete || params.deleteDelegate) {
            var deleteSpan = $("<span/>");
            span.append(deleteSpan);
            deleteSpan.append(" <i class=\"fa fa-times\" aria-hidden=\"true\"></i>");
            deleteSpan.css("cursor", "pointer");
            deleteSpan.click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                if (params.deleteDelegate) {
                    if (params.deleteDelegate(index, value, params)) {
                        span.remove();
                    } else {
                        alert("Operazione non consentita");
                    }
                } else {
                    alert("Operazione non consentita");
                }

            });
        }
    }
}