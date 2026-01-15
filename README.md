# SurveyCTO Radar Navigator Plugin

A field plug-in for SurveyCTO and ODK that guides enumerators to specific GPS targets. It features a "Radar" mode (directional arrow) for the last few meters and a "Route" mode (Google Maps) for navigating around obstacles like ponds or walls.

## Features
* **CSV Integration:** Loads target coordinates from a standard `.csv` file.
* **Offline Radar:** Shows distance and direction (bearing) without internet.
* **Route Button:** One-click redirection to Google Maps for turn-by-turn navigation.
* **Geofencing:** Auto-detects when the enumerator is within 10 meters.

## Installation
1. Download the `radar_plugin.zip` from the [Releases](link-to-releases) section.
2. Upload to your SurveyCTO Console > **Design** > **Field Plug-ins**.

## How to Prepare the Data
You must attach a CSV file named `respondents.csv` to your form's **media** section.

**CSV Format (`respondents.csv`):**
```csv
id,lat,lon,name
101,23.7956,90.4032,Karim Mia
102,23.8103,90.4125,Rahima Begum
