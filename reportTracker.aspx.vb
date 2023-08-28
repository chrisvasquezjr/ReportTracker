Imports System.Data.SqlClient
Imports System.Web.Services
Imports Newtonsoft.Json
Imports System.Data
Imports System.Text
Imports System.IO
Imports Ionic.Zip
Imports System.Collections.Generic
Imports System.Security.Permissions
Imports DevExpress.DashboardWeb
Imports DevExpress.DataAccess.ConnectionParameters
Imports outsolve_web.Database

Namespace outsolve_web
    Partial Class Report_Tracker_Default
        Inherits System.Web.UI.Page
        Private tmpWebUser As WebUser

        Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

            '----Login and Dash access check
            Dim username As String
            Dim password As String
            Dim tmpTracker As SessionTracker

            tmpTracker = Session("tracker")
            'Put user code to initialize the page here
            If Not Session("valid") Then
                If IsNothing(Request.Form.GetValues("username")) Then
                    Response.Redirect(System.Configuration.ConfigurationManager.AppSettings("LoginPage"))
                End If
                username = CStr(Request.Form.GetValues("username")(0))
                password = CStr(Request.Form.GetValues("password")(0))
                tmpWebUser = New WebUser(username, password)
                tmpWebUser.currSessionID = tmpTracker.SessionID
                'tmpWebUser.currSessionID = 0
                Session("user") = tmpWebUser
                Session("userType") = tmpWebUser.userType
                Session("everifyAccess") = Math.Abs(CInt(tmpWebUser.eVerifyAccess))
                If tmpWebUser.isValid() Then
                    Session("valid") = True
                    'log user logging in
                    tmpWebUser.LogValidLogin()

                Else
                    Session("valid") = False
                    'Log bad login
                    tmpWebUser.LogBadLogin()

                    Response.Redirect(System.Configuration.ConfigurationManager.AppSettings("DeniedPage"))
                End If

            End If

        End Sub


        <WebMethod>
        Public Shared Function SaveCompanyData(DateReceived, ReportComplete, SubmittedCertified, DueDate, Node, year, ProductType) As String

            Dim connectionString As String = "Server=DESKTOP-1PQOJ2A;Database=TrackerDb;User Id=dev_op;Password=dev_op; Trusted_Connection=False;TrustServerCertificate=True;MultipleActiveResultSets=true;" ' Replace with your actual connection string
            Using connection As New SqlConnection(connectionString)
                connection.Open()
                Dim query As String = "INSERT INTO CompanyPlanProduction (DateReceived, DueDate, SubmittedCertified, ReportComplete, TurnAround,Year) VALUES (@DateReceived, @DueDate, @SubmittedCertified, @ReportComplete, @TurnAround,@year)"
                Using command As New SqlCommand(query, connection)
                    command.Parameters.AddWithValue("@DateReceived", DateReceived)
                    command.Parameters.AddWithValue("@DueDate", DueDate)
                    command.Parameters.AddWithValue("@SubmittedCertified", SubmittedCertified)
                    command.Parameters.AddWithValue("@ReportComplete", ReportComplete)
                    command.Parameters.AddWithValue("@TurnAround", Node)
                    command.Parameters.AddWithValue("@Year", year)
                    command.Parameters.AddWithValue("@ProductType", ProductType)

                    command.ExecuteNonQuery()

                End Using
            End Using

            Dim responseObj As New With {
            .type = "Success",
            .Message = "Record Added Successfully",
            .Response = "Success"
        }

            Return JsonConvert.SerializeObject(responseObj)


            'Dim myDS As DataSet
            'Dim tmpWebuser As WebUser
            'Dim myDB As New Database
            'Dim myDA As SqlDataAdapter
            'Dim SQLStr As String
            'Dim i As Integer
            ''Dim myConn As SqlConnection
            ''tmpWebuser = Session("user")
            'SQLStr = "INSERT INTO CompanyPlanProduction (DateReceived, DueDate, SubmittedCertified, DateCompleted, Notes) VALUES (@DateReceived, @DueDate, @SubmittedCertified, @ReportComplete, @Notes)"
            'Dim connString As String = System.Configuration.ConfigurationManager.AppSettings("devDB")
            'Using connection As New SqlConnection(connString)
            '    connection.Open()
            '    Using command As New SqlCommand(SQLStr, connection)
            '        command.Parameters.AddWithValue("@DateReceived", DateReceived)
            '        command.Parameters.AddWithValue("@DueDate", DueDate)
            '        command.Parameters.AddWithValue("@SubmittedCertified", SubmittedCertified)
            '        command.Parameters.AddWithValue("@ReportComplete", ReportComplete)
            '        command.Parameters.AddWithValue("@Notes", Notes)
            '        command.ExecuteNonQuery()
            '        myDB.Execute(SQLStr)
            '        myDB.Close()
            '    End Using
            'End Using

            'Return ("Success")
        End Function


        Public Shared Function DateConverter(ByVal date1 As String) As String
            Dim newDate As String() = date1.Split(" "c)
            Dim changeFormat As String() = newDate(0).Split("/"c)
            Return date1
        End Function

        <WebMethod>
        Public Shared Function GetCompanyData() As String
            Dim connectionString As String = "Server=DESKTOP-1PQOJ2A;Database=TrackerDb;User Id=dev_op;Password=dev_op; Trusted_Connection=False;TrustServerCertificate=True;MultipleActiveResultSets=true;" ' Replace with your actual connection string

            Using connection As New SqlConnection(connectionString)
                connection.Open()
                Dim query As String = "SELECT Id,Year, DateReceived,TurnAround,ReportComplete,DueDate,SubmittedCertified FROM CompanyPlanProduction"

                Using command As New SqlCommand(query, connection)
                    Using reader As SqlDataReader = command.ExecuteReader()
                        Dim records As New List(Of Object)()
                        While reader.Read()
                            Dim record As New With {
                        .id = reader("Id"),
                        .Year = reader("Year"),
                        .DateReceived = DateConverter(reader("DateReceived")),
                        .ReportComplete = DateConverter(reader("ReportComplete")),
                        .Node = reader("Node"),
                        .DueDate = DateConverter(reader("DueDate")),
                        .SubmittedCertified = DateConverter(reader("SubmittedCertified")),
                        .ProductType = DateConverter(reader("SubmittedCertified"))
                    }
                            records.Add(record)
                        End While

                        Return JsonConvert.SerializeObject(records)
                    End Using
                End Using
            End Using
        End Function

        <WebMethod>
        Public Shared Function GetCompanyDataByYear(year As Integer) As String
            Dim connectionString As String = "Server=DESKTOP-1PQOJ2A;Database=TrackerDb;User Id=dev_op;Password=dev_op; Trusted_Connection=False;TrustServerCertificate=True;MultipleActiveResultSets=true;"

            ' Define the list to hold the records
            Dim records As New List(Of Object)()

            Using connection As New SqlConnection(connectionString)
                connection.Open()

                ' Use parameterized query to prevent SQL injection
                Dim query As String = "SELECT Id, Year, DateReceived, TurnAround, ReportComplete, DueDate, SubmittedCertified FROM CompanyPlanProduction WHERE Year = @year"

                Using command As New SqlCommand(query, connection)
                    ' Add parameter to the query
                    command.Parameters.AddWithValue("@year", year)

                    Using reader As SqlDataReader = command.ExecuteReader()
                        While reader.Read()
                            ' Create an anonymous type to hold the record data
                            Dim record = New With {
                            .id = reader("Id"),
                            .Year = reader("Year"),
                            .DateReceived = DateConverter(reader("DateReceived")),
                            .ReportComplete = DateConverter(reader("ReportComplete")),
                            .Node = reader("Node"),
                            .DueDate = DateConverter(reader("DueDate")),
                            .SubmittedCertified = DateConverter(reader("SubmittedCertified")),
                            .ProductType = DateConverter(reader("SubmittedCertified"))
                        }

                            ' Add the record to the list
                            records.Add(record)
                        End While
                    End Using
                End Using
            End Using

            ' Serialize the list of records to JSON
            Return JsonConvert.SerializeObject(records)
        End Function
    End Class
End Namespace
