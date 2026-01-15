var fieldPlugin = document.querySelector('.surveycto-field-plug-in');
var targetLat = 0;
var targetLon = 0;
var currentLat = 0;
var currentLon = 0;

function init() {
    if (!fieldPlugin) return;

    // 1. Get the Target ID from the form (e.g., "101")
    var targetID = fieldPlugin.getParameter('target_id');

    // 2. Read the CSV file attached to the form
    // Note: In SurveyCTO, 'respondents.csv' must be in the media folder
    fetch('respondents.csv')
        .then(response => response.text())
        .then(csvText => {
            findTargetInCSV(csvText, targetID);
        })
        .catch(err => {
            document.getElementById('target-name').innerText = "Error: CSV not found";
        });
}

// 3. Parse CSV to find the specific lat/lon for the ID
function findTargetInCSV(csv, id) {
    var lines = csv.split('\n');
    var found = false;

    // Simple loop through CSV lines
    for (var i = 1; i < lines.length; i++) {
        var cols = lines[i].split(',');
        if (cols[0] && cols[0].trim() == id) {
            targetLat = parseFloat(cols[1]);
            targetLon = parseFloat(cols[2]);
            var name = cols[3];
            
            document.getElementById('target-name').innerText = "Finding: " + name;
            found = true;
            
            // Start tracking user location
            getLocation();
            break;
        }
    }
    if (!found) document.getElementById('target-name').innerText = "ID " + id + " not found in CSV";
}

// 4. Get User's Current GPS
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateRadar, showError, {
            enableHighAccuracy: true
        });
    } else {
        alert("Geolocation is not supported by this device.");
    }
}

function updateRadar(position) {
    currentLat = position.coords.latitude;
    currentLon = position.coords.longitude;

    // A. Calculate Distance (Haversine Formula)
    var dist = getDistanceFromLatLonInKm(currentLat, currentLon, targetLat, targetLon) * 1000; // Convert to meters
    document.getElementById('distance').innerText = Math.round(dist) + " m";

    // B. Calculate Bearing (Direction)
    var bearing = getBearing(currentLat, currentLon, targetLat, targetLon);
    
    // C. Rotate the Arrow
    // Note: We need the device's compass heading to know which way is "North"
    // For simplicity, this assumes the top of phone is North. 
    // A full compass requires 'deviceorientation' event which is complex on Android.
    // Instead, we rotate the arrow relative to True North.
    document.getElementById('arrow').style.transform = "rotate(" + bearing + "deg)";
    
    // Auto-save: If very close (< 10m), save "Arrived"
    if(dist < 10) {
        fieldPlugin.setResult("Arrived at target");
        document.getElementById('distance').style.color = "cyan";
    }
}

// 5. Open External Google Maps (The "Pond" Solution)
function openGoogleMaps() {
    // This URL forces Google Maps to open in "Walking" mode to the target
    var url = "https://www.google.com/maps/dir/?api=1&destination=" + targetLat + "," + targetLon + "&travelmode=walking";
    window.open(url, '_blank');
}

// --- MATH HELPER FUNCTIONS ---

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function getBearing(startLat, startLng, destLat, destLng){
  startLat = deg2rad(startLat);
  startLng = deg2rad(startLng);
  destLat = deg2rad(destLat);
  destLng = deg2rad(destLng);

  y = Math.sin(destLng - startLng) * Math.cos(destLat);
  x = Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  brng = Math.atan2(y, x);
  brng = rad2deg(brng);
  return (brng + 360) % 360;
}

function deg2rad(deg) { return deg * (Math.PI/180); }
function rad2deg(rad) { return rad * (180/Math.PI); }
function showError(error) { console.log("GPS Error: " + error.message); }

// Start
document.addEventListener("DOMContentLoaded", function(event) { init(); });