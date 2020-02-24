$(document).ready(function() {
    $("#datatable").DataTable(), $("#datatable-buttons").DataTable({
        lengthChange: !1,
        buttons: ["copy", 
		
		{
			extend : 'excel',
			exportOptions: {
                    columns: 'th:not(:last-child)'
            }	
			
		}
		
		, "colvis"]
    }).buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)")
});