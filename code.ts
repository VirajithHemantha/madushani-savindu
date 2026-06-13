function doPost(e) {
  // Add CORS headers by returning JSONP or handling options (often done via Web Apps settings, but we handle standard JSON response)
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    // Parse the incoming JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      // Fallback if data is sent as form data rather than JSON
      data = e.parameter;
    }
    
    const type = data.type; // "RSVP" or "Wishes"
    
    if (!type) {
      throw new Error("Missing 'type' parameter. Must be 'RSVP' or 'Wishes'.");
    }

    let sheet = doc.getSheetByName(type);
    let headers = [];
    
    // Auto-generate sheet and headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(type);
      if (type === "RSVP") {
        headers = ["Timestamp", "Full Name", "Guests", "Dietary Notes"];
      } else if (type === "Wishes") {
        headers = ["Timestamp", "Name", "Message"];
      } else {
        headers = ["Timestamp", "Data"];
      }
      sheet.appendRow(headers);
      // Style the headers (Bold)
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1); // Freeze the header row
    } else {
      // Get existing headers
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Prepare the row data
    const rowData = [new Date()];
    
    if (type === "RSVP") {
      rowData.push(data.name || "");
      rowData.push(data.guests || "");
      rowData.push(data.dietaryNotes || "");
    } else if (type === "Wishes") {
      rowData.push(data.name || "");
      rowData.push(data.message || "");
    } else {
      rowData.push(JSON.stringify(data));
    }
    
    // Append the row
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'type': type }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Handle GET requests (optional, for testing)
function doGet(e) {
  return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Web app is running.' }))
      .setMimeType(ContentService.MimeType.JSON);
}
