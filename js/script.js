$(document).ready(function () {
    // All the variables are declared here
    const addNewReport = $("#add-nr");
    const newReportContainer = $("#new-report");

    // This is for generating Date Picker Calendar
    $("#datepicker").datepicker({
        changeYear: true,
        showButtonPanel: true,
        dateFormat: "yy",
        beforeShow: function (input, inst) {
            if ($(input).hasClass("specific-datepicker-year")) {
                // Apply custom class to hide the calendar
                inst.dpDiv.addClass("custom-datepicker");
            }
        },
        onClose: function (dateText, inst) {
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker("setDate", new Date(year, 1));
            inst.dpDiv.removeClass("custom-datepicker");
        },
    });
    //$("#datepicker").datepicker("widget").addClass("custom-datepicker");
    $(".date-picker-year").focus(function () {
        $(".ui-datepicker-month").hide();
    });

    const compareDates = (d1, d2) => {
        let date1 = new Date(d1).getTime();
        let date2 = new Date(d2).getTime();

        if (date1 <= date2) {
            return true;
        } else {
            return false;
        }
    };

    //    This is to show the Menu bar
    $(".menu-bar").click(function () {
        $("body").addClass("show-nav");
    });

    //    This is to hide the Menu bar
    $(".menu-close .close").click(function () {
        $("body").removeClass("show-nav");
    });

    // Generate New Report while clicking on the button starts here
    $(addNewReport).on("click", function () {
        // New div starts here
        var div = $(`  
      <!--                    step wizard > details section start from here-->
                        <section class="step-wizard" id="step-wizard">
                            <div class="title">
                                <h3>CA Pay</h3>
                                <span><i class="fa-solid fa-pen fa-xl" id="title-edit"></i></span>
                            </div>
                            <div class="progressbar" id="progressbar">
                                <div class="progress" id="progress"></div>
                                <div class="progress-step active" data-title="Not Started" id="Not"></div >
                                <div class="progress-step" data-title="Data Received" id="Data"></div>
                                <div class="progress-step" data-title="Report Complete" id="Report"></div>
                                <div class="progress-step " data-title="Submitted /Certified" id="Submitted"></div>
                            </div>
    <!--                        Detail Section starts here-->
                            <section class="details">
                                <div class="heading">
                                    <span class="details-toggle" id="details-toggle">
                                        <i class="fa-sharp fa-solid fa-angle-down fa-xl" id="show"></i>
                                    </span>
                                    <h2>Details</h2>
                                </div>
                                <div class="form" id="form">
    <!--                                left div starts here-->
                                    <div class="left">
                                        <div class="row">
                                            <span>1</span>
                                            <label>Data Received</label>
                                            <input type="text"  class="datepicker1" autocomplete="off" />
                                        </div>
                                        <div class="row">
                                            <span>2</span>
                                            <label>Report Complete</label>
                                            <input type="text" class="datepicker3 datepicker"/>
                                        </div>
                                        <div class="row">
                                                <span>3</span>   
                                                <label>Submitted /Certified</label>
                                                <input type="text" class="datepicker4 datepicker"/>
                                        </div>
                                    </div>
    <!--                                left div ends here-->
                                    <div class="right">
                                        <div class="row">
                                            <label>Due Date</label>
                                            <input type="text"  class="datepicker2" autocomplete="off"/>
                                        </div>
                                        <div class="row textarea">
                                            <label>Note</label>
                                            <textarea id="text" class="turnaround" type="text"  autocomplete="off"></textarea>
                                        </div>
                                    </div>
                                </div>
                    <button class="submit">Submit</button>
                            </section>
    <!--                        Detail Section ends here-->
                        </section>
    <!--                        step wizard > details section ends here-->
                   `);
        // New div ends here

        $(newReportContainer).append(div);
    });
    // Generate New Report while clicking on the button ends here

    // Details Toggle hide starts from here
    $(document).on("click", "#hide", function () {
        const form = $(this).parent().parent().parent().find("#form")[0];
        const button = $(this).parent().parent().parent().find(".submit")[0];
        const detailsToggle = $(this).parent();
        const icon = $(
            '<i class="fa-sharp fa-solid fa-angle-down fa-xl" id="show"></i>'
        );
        $(form).removeClass("hide");
        $(button).removeClass("hide");
        $(detailsToggle).html(icon);
    });
    // Details Toggle hide ends here

    // Details Toggle show starts from here
    $(document).on("click", "#show", function () {
        const form = $(this).parent().parent().parent().find("#form")[0];
        const button = $(this).parent().parent().parent().find(".submit")[0];
        const detailsToggle = $(this).parent();
        const icon = $('<i class="fa-solid fa-angle-right fa-xl" id="hide"></i>');
        $(form).addClass("hide");
        $(button).addClass("hide");
        $(detailsToggle).html(icon);
    });
    // Details Toggle show ends here

    // Title edit starts here
    $(document).on("click", "#title-edit", function () {
        const currentTitle = $(this).parent().parent().find("h3").html();
        const title = $(this).parent().parent().find("h3")[0];
        const editIcon = $(this).parent();
        const icon = $('<i class="fa-solid fa-play fa-xl" id="title-submit"></i>');
        $(title).html(
            `<input type="text" id="title" value="${currentTitle}" style="width:150px; height:30px; padding:10px;"/>`
        );
        $(editIcon).html(icon);
    });
    // Title edit ends here

    // Title submit starts here
    $(document).on("click", "#title-submit", function () {
        const title = $($(this).parent().parent().find("input")[0]).val();
        const titleHeading = $(this).parent().parent().find("h3")[0];
        const editIcon = $(this).parent();
        const icon = $('<i class="fa-solid fa-pen fa-xl" id="title-edit"></i>');
        title != ""
            ? $(titleHeading).html(title)
            : $(titleHeading).html("Untitled Report");
        $(editIcon).html(icon);
    });
    // Title submit ends here

    // Generating calendar for all date fields
    $(document).on("focus", ".row input.datepicker", function () {
        datepick();
    });
    // OnChange in form input trigger action starts here
    $(document).on("change", ".row input.datepicker", function () {
        const label = $(this).parent().find("label").html().trim();
        const id = label.split(" ")[0];
        const value = $(this).val();
        const progressNode = $(this).parent().parent().parent().parent().parent();
        const nodeForActive = $(progressNode).find(`#${id.trim()}`);
        const form = $(this).parent().parent().parent();
        const date1 = $(form).find(".datepicker1").val();
        const date2 = $(form).find(".datepicker2").val();
        if (compareDates(date1, date2) || date2 == "" || date1 == "") {
            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("active") : null;
            } else {
                $(nodeForActive).removeClass("active");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.active")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        $(progress).css("width", width);
                    }
                });
            });
        } else {
            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("error") : null;
            } else {
                $(nodeForActive).removeClass("error");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.error")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        if (progress.hasClass("error")) {
                            $(progress).css("width", width);
                        } else {
                            $(progress).addClass("error");
                            $(progress).css("width", width);
                        }
                    }
                });
            });
        }
    });

    // OnChange in form input trigger action ends here

    // Generating calendar for all date fields
    $(document).on("focus", ".row input.datepicker1", function () {
        datepick();
    });
    $(document).on("change", ".row input.datepicker1", function () {
        const label = $(this).parent().find("label").html().trim();
        const id = label.split(" ")[0];
        const value = $(this).val();
        const progressNode = $(this).parent().parent().parent().parent().parent();
        const nodeForActive = $(progressNode).find(`#${id.trim()}`);
        const form = $(this).parent().parent().parent();
        const date1 = $(form).find(".datepicker1").val();
        const date2 = $(form).find(".datepicker2").val();
        if (compareDates(date1, date2) || date2 == "") {
            const activeNodes = $(progressNode).find(".error").toArray();
            activeNodes.map((node1, index1) => {
                $(node1).removeClass("error");
                $(node1).addClass("active");
            });

            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("active") : null;
            } else {
                $(nodeForActive).removeClass("active");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.active")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        $(progress).css("width", width);
                    }
                });
            });
        } else {
            //changing progressbar main div to error
            $(progressNode).find(".progressbar").addClass("error");
            //changing all nodes to error node
            const activeNodes = $(progressNode).find(".active").toArray();
            activeNodes.map((node1, index1) => {
                $(node1).addClass("error");
                $(node1).removeClass("active");
            });

            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("error") : null;
            } else {
                $(nodeForActive).removeClass("error");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.error")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        $(progress).css("width", width);
                    }
                });
            });
        }
    });

    // Generating calendar for all date fields
    $(document).on("focus", ".row input.datepicker2", function () {
        datepick();
    });

    $(document).on("change", ".row input.datepicker2", function () {
        const label = $(this).parent().find("label").html().trim();
        const id = label.split(" ")[0];
        const value = $(this).val();
        const progressNode = $(this).parent().parent().parent().parent().parent();
        const nodeForActive = $(progressNode).find(`#${id.trim()}`);
        const form = $(this).parent().parent().parent();
        const date1 = $(form).find(".datepicker1").val();
        const date2 = $(form).find(".datepicker2").val();
        if (compareDates(date1, date2) || date2 == "") {
            const activeNodes = $(progressNode).find(".error").toArray();
            activeNodes.map((node1, index1) => {
                $(node1).removeClass("error");
                $(node1).addClass("active");
            });

            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("active") : null;
            } else {
                $(nodeForActive).removeClass("active");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.active")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        $(progress).css("width", width);
                    }
                });
            });
        }
        // For error nodes
        else {
            //changing progressbar main div to error
            $(progressNode).find(".progressbar").addClass("error");
            //changing progress-step div to error
            const activeNodes = $(progressNode).find(".active").toArray();
            activeNodes.map((node1, index1) => {
                $(node1).addClass("error");
                $(node1).removeClass("active");
            });
            if (value.length > 0) {
                nodeForActive.length > 0 ? $(nodeForActive).addClass("error") : null;
            } else {
                $(nodeForActive).removeClass("error");
            }
            const progressAllNodes = $(progressNode).find(".progress-step").toArray();
            const progressActive = $(progressNode)
                .find(".progress-step.error")
                .toArray();
            progressAllNodes.map((node1, index1) => {
                progressActive.map((node, index) => {
                    var string1 = $(progressAllNodes[index]).attr("id");
                    var string2 = $(progressActive[index]).attr("id");

                    if (string1.localeCompare(string2) === 0) {
                        const width = ((index + 1 - 1) / (4 - 1)) * 100 - 1.5 + "%";
                        const progress = $(progressNode).find("#progress");
                        $(progress).addClass("error");
                        $(progress).css("width", width);
                    }
                });
            });
        }
    });

    function datepick() {
        $(".datepicker1").each(function () {
            $(this).datepicker({
                onSelect: function (dateText, inst) {

                    $(this).trigger("change");
                }
            });
        });
        $(".datepicker2").each(function () {
            $(this).datepicker();
        });
        $(".datepicker").each(function () {
            $(this).datepicker();
        });

    }
    datepick();

});