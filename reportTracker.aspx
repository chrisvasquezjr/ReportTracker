<%@ page language="VB" autoeventwireup="false" codefile="reportTracker.aspx.vb" inherits="outsolve_web.Report_Tracker_Default" masterpagefile="masterpage.master" %>

<ASP:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
    <link rel="stylesheet" href="css/style.css" />
    <title>Report Tracker</title>
</head>
<body>
    <form id="myForm" runat="server">
        <div class="ui-container">
            <div class="container">
                <section class="reporting-ui">
                    <div class="rt-container">
                        <header class="header">
                            <h1>Report tracker</h1>
                            <div class="pb-outsolve">
                                <div class="menu-bar">
                                    <i class="fa-solid fa-bars" style="color: #ffffff"></i>
                                </div>
                                <div class="pb-os" style="display: flex">
                                    <p>Powered by</p>
                                    <h3>out<span style="color: #96c11f">solve</span></h3>
                                </div>
                            </div>
                        </header>
                        <section class="main=body">
                            <div class="new-report" id="new-report">
                                <div class="calendar">
                                    <asp:TextBox ID="datepicker" runat="server" Text="2022" CssClass="datepicker specific-datepicker-year" Style="margin-top: 10px;"></asp:TextBox>
                                </div>
                                <p class="message">Message</p>
                            </div>
                        </section>
                    </div>
                    <div class="new-report-btn">
                        <span id="add-nr">
                            <i class="fa-solid fa-circle-plus fa-xl" style="color: #96c11f"></i>
                        </span>
                        <h2>Add new report</h2>
                    </div>
                </section>
            </div>
        </div>
    </form>

    <!-- Optional JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script src="./js/script.js"></script>
    <script>
        function ShowError(tag, message) {
            $(tag).addClass("error");
            $(tag).text(message);
            setTimeout(function () {
                $(tag).removeClass("error");
            }, 2000);
        }
        function ShowSuccess(tag, message) {
            $(tag).addClass("success");
            $(tag).text(message);
            setTimeout(function () {
                $(tag).removeClass("success");
            }, 2000);
        }
        function checkDateFormat(date) {
            var pattern = /^\d{2}\/\d{2}\/\d{4}$/;
            return pattern.test(date) ? true : false;
        }
        function checkStringSize(message) {
            return message.length < 50 ? true : false;
        }
        function changeDateFormat(date) {
            var dateParts = date.split("/");
            var month = parseInt(dateParts[0]) - 1; // Subtract 1 since JavaScript months are zero-based
            var day = dateParts[1];
            var year = dateParts[2];

            var date = new Date(year, month, day, 15, 24, 33, 500); // Set the time to 15:24:33.500

            var datetimeString = date.toISOString(); // Convert to ISO 8601 format (e.g., "2023-07-09T15:24:33.500Z")

            return datetimeString;
        }
        $(document).on("click", ".details .submit", function (e) {
            e.preventDefault();
            const url = "reportTracker.aspx/SaveCompanyData"; // Replace with your API endpoint URL

            const ActiveDiv = $(this).parent().parent();
            const message = $(document).find(".message")[0];
            const title = $(ActiveDiv).find("h3")[0].innerText;
            const dateReceived = $($(ActiveDiv).find(".datepicker1")[0]).val();
            const dueDate = $($(ActiveDiv).find(".datepicker2")[0]).val();
            const reportComplete = $($(ActiveDiv).find(".datepicker3")[0]).val();
            const submittedCertified = $($(ActiveDiv).find(".datepicker4")[0]).val();
            const turnaround = $($(ActiveDiv).find(".turnaround")[0]).val();
            const year = $("#datepicker").val();
            console.log(year)
            if (
                checkDateFormat(dateReceived) &&
                checkDateFormat(reportComplete) &&
                checkDateFormat(submittedCertified) &&
                checkDateFormat(dueDate) &&
                checkStringSize(turnaround)
            ) {

                const data = {
                    DateReceived: changeDateFormat(dateReceived),
                    ReportComplete: changeDateFormat(reportComplete),
                    SubmittedCertified: changeDateFormat(submittedCertified),
                    DueDate: changeDateFormat(dueDate),
                    Node: turnaround,
                    ProductType: title,
                    year
                };
                $.ajax({
                    url: url,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(data),
                    success: function (response) {
                        // Handle the success response from the server
                        ShowSuccess(message, "Data Submitted Successfully");
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        // Handle any errors
                        ShowError(message, error);
                    }
                });


            } else {
                ShowError(message, "Error in the fields");
            }
        });
    </script>
    <script>
        $(document).on("click", ".ui-datepicker-close", function () {
            const year = $("#datepicker").val();
            const url = "reportTracker.aspx/GetCompanyDataByYear"; // Replace with your API endpoint URL
            $.ajax({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ year }),
                success: function (data) {
                    const newData = JSON.parse(data.d)
                    if (newData.length > 0) {
                        $(".step-wizard").remove();
                        console.log(newData)

                        // Handle the success response from the server
                        populateReportList(newData);
                    } else {
                        $(".step-wizard").remove();
                    }

                },
                error: function (xhr, status, error) {
                    // Handle any errors
                    console.log(error)

                }
            });
        })
        function updateDates(data) {
            if (data.length > 0) {
                data.forEach((entry, index) => {
                    // Update DateReceived with progress bar
                    $(".datepicker1").trigger("change");

                    // Update DateReceived with progress bar
                    $(".datepicker2").trigger("change");

                    // Update DateReceived with progress bar
                    $(".datepicker3").trigger("change");

                    // Update DateReceived with progress bar
                    $(".datepicker4").trigger("change");

                })

            }
        }
        window.onload = () => {
            $("#datepicker").val("");
            const url = "reportTracker.aspx/GetCompanyData"; // Replace with your API endpoint URL

            $.ajax({
                url: url,
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    const newData = JSON.parse(data.d)
                    if (newData.length > 0) {
                        console.log(newData)

                        // Handle the success response from the server
                        populateReportList(newData);
                    }
                },
                error: function (xhr, status, error) {
                    // Handle any errors
                    alert("Error Occurred");
                }
            });
        }

        function populateReportList(data) {
            const newReportContainer = $("#new-report");
            data.forEach(function (item, index) {
                const div = `  
      <!--                    step wizard > details section start from here-->
                        <section class="step-wizard" id="step-wizard" data=${index}>
                            <div class="title">
                                <h3 id="header">${item.ProductType}</h3>
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
                                        <i class="fa-solid fa-angle-right fa-xl" id="hide"></i>
                                    </span>
                                    <h2>Details</h2>
                                </div>
                                <div class="form  hide" id="form">
    <!--                                left div starts here-->
                                    <div class="left">
                                        <div class="row">
                                            <span>1</span>
                                            <label>Data Received</label>
                                            <input type="text"  class="datepicker1" autocomplete="off" disabled  value=${item.DateReceived} />
                                        </div>
                                        <div class="row">
                                            <span>2</span>
                                            <label>Report Complete</label>
                                            <input type="text" class="datepicker3 datepicker" disabled value=${item.ReportComplete} />
                                        </div>
                                        <div class="row">
                                                <span>3</span>   
                                                <label>Submitted /Certified</label>
                                                <input type="text" class="datepicker4 datepicker" disabled value=${item.SubmittedCertified}/>
                                        </div>
                                    </div>
    <!--                                left div ends here-->
                                    <div class="right">
                                        <div class="row">
                                            <label>Due Date</label>
                                            <input type="text"  class="datepicker2" autocomplete="off"  disabled  value=${item.DueDate}/>
                                        </div>
                                        <div class="row textarea">
                                            <label>Note</label>
                                            <textarea id="text" class="turnaround" type="text" disabled autocomplete="off">${item.TurnAround}</textarea>
                                        </div>
                                    </div>
                                </div>
                    <button class="submit  hide">Submit</button>
                            </section>
    <!--                        Detail Section ends here-->
                        </section>
    <!--                        step wizard > details section ends here-->
                   `;

                $(newReportContainer).append(div);

            });
            updateDates(data);
        }


    </script>
</body>
</html>

</ASP:Content>
