jQuery.fn.gompToolBar = function (params) {
    return this.each(function () {
        var container = $(this);

        //Parametri
        if (!params.buttons) params.buttons = [];
        if (!params.buttonHeight) {
            if (!params.subBar) {
                params.buttonHeight = "40px";
            } else {
                params.buttonHeight = "20px";
            }
        }

        createToolBar();

        function createToolBar() {
            container.html("");

            //Tool bar container
            var toolBarContainer = $("<div/>");
            toolBarContainer.addClass("toolBarContainer");
            toolBarContainer.css("margin-right", "0");
            container.append(toolBarContainer);

            //Tool bar div
            var toolBarDiv = $("<div/>");
            toolBarContainer.append(toolBarDiv);
            toolBarDiv.addClass("ToolBar");

            var table = $("<table/>");
            toolBarDiv.append(table);
            table.attr("cellpadding", "0");
            table.attr("cellspacing", "0");
            table.append(createFirstCell());

            $.each(params.buttons,
                function (key, value) {
                    switch (value.type) {
                        case "separator":
                            table.append(createSeparatorCell());
                            break;
                        case "custom":
                            table.append(createCustomButton(value));
                            break;
                        default:
                            table.append(createIconButton(value));
                            break;
                    }
                });
        }


        //Cella iniziale
        function createFirstCell() {
            var toolBarCell = $("<td/>");
            var neutralImage = $("<img src=\"/images/neutral.gif\"/>");
            toolBarCell.append(neutralImage);
            toolBarCell.css("width", "10px");
            toolBarCell.addClass("firstcell");
            return toolBarCell;
        }

        //Cella separatore
        function createSeparatorCell() {
            var toolBarCell = $("<td/>");
            toolBarCell.addClass("separator");
            toolBarCell.html("&nbsp;");
            return toolBarCell;
        }

        function createCustomButton(bParams) {
            if (!bParams.width) bParams.width = "80px";

            var toolBarCell = $("<td/>");
            if (bParams.key) {
                toolBarCell.attr("toolbar-key", bParams.key);
            }
            toolBarCell.css("cursor", "pointer");
            if (bParams.tooltip) {
                toolBarCell.attr("title", bParams.tooltip);
            }

            toolBarCell.click(function () {
                $("div[smart-sub-bar='true']", container).slideUp();
            });

            toolBarCell.mouseover(function () {
                $(this).addClass("hovercell");
                $(this).removeClass("normalcell");
            });
            toolBarCell.mouseout(function () {
                $(this).addClass("normalcell");
                $(this).removeClass("hovercell");
            });
            toolBarCell.css("width", bParams.width);

            var table = $("<table/>");
            toolBarCell.append(table);
            table.addClass("editingTable");
            table.css("width", "100%");

            //Icon tr
            var tr1 = $("<tr/>");
            table.append(tr1);

            //Icon td
            var td1 = $("<td/>");
            tr1.append(td1);
            td1.addClass("normalcell");
            td1.css("height", params.buttonHeight);

            if (bParams.tdOverride) {
                bParams.tdOverride(td1);
            }

            //Text tr
            var tr2 = $("<tr/>");
            table.append(tr2);

            //Icon td
            var td2 = $("<td/>");
            tr2.append(td2);
            var td2Span = $("<span/>");
            td2.append(td2Span);
            td2.addClass("buttonLabel");
            td2Span.text(bParams.name);

            return toolBarCell;
        }

        //Cella pulsante
        function createIconButton(bParams) {
            if (!bParams.width) bParams.width = "80px";

            var toolBarCell = $("<td/>");
            if (bParams.key) {
                toolBarCell.attr("toolbar-key", bParams.key);
            }
            toolBarCell.css("cursor", "pointer");
            if (bParams.tooltip) {
                toolBarCell.attr("title", bParams.tooltip);
            }

            toolBarCell.click(function () {
                $("div[smart-sub-bar='true']", container).slideUp();
            });

            //Sub bar
            if (bParams.click) {
                toolBarCell.click(function () { bParams.click(bParams.key); });
            } else {
                if (bParams.buttons) {
                    toolBarCell.click(function () {
                        if (!$("div[smart-sub-bar='true']", container).is(':visible')) {
                            var subBar = $("<div />");
                            subBar.attr("smart-sub-bar", "true");
                            subBar.hide();
                            container.append(subBar);
                            subBar.gompToolBar({ buttons: bParams.buttons, subBar: true });
                            subBar.slideDown();
                            $("i", toolBarCell).fadeTo("slow", 0.3);
                        } else {
                            $("i", toolBarCell).fadeTo("slow", 1);
                            $("div[smart-sub-bar='true']", container).slideUp();
                        }

                    });

                }
            }

            toolBarCell.mouseover(function () {
                $(this).addClass("hovercell");
                $(this).removeClass("normalcell");
            });
            toolBarCell.mouseout(function () {
                $(this).addClass("normalcell");
                $(this).removeClass("hovercell");
            });
            toolBarCell.css("width", bParams.width);

            var table = $("<table/>");
            toolBarCell.append(table);
            table.addClass("editingTable");
            table.css("width", "100%");

            //Icon tr
            var tr1 = $("<tr/>");
            table.append(tr1);

            //Icon td
            var td1 = $("<td/>");
            tr1.append(td1);
            td1.addClass("normalcell");
            td1.css("height", params.buttonHeight);

            if (bParams.awesome) {
                var awesome = $("<i/>");
                td1.append(awesome);
                awesome.attr("smart-role", "awesome");
                awesome.addClass(bParams.awesome);
                awesome.addClass("toolbarButton");
            } else {
                if (bParams.src) {
                    //Icon image
                    var image1 = $("<img/>");
                    td1.append(image1);
                    image1.attr("src", bParams.src);
                    image1.attr("alt", bParams.alt);
                }
            }

            if (bParams.tdOverride) {
                bParams.tdOverride(td1);
            }


            //Text tr
            var tr2 = $("<tr/>");
            table.append(tr2);

            //Icon td
            var td2 = $("<td/>");
            tr2.append(td2);
            var td2Span = $("<span/>");
            td2.append(td2Span);
            td2.addClass("buttonLabel");
            td2Span.text(bParams.name);

            return toolBarCell;
        }
    });
}