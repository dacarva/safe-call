"use client"; // This marks the component as a Client Component

import { useEffect, useState } from "react";

interface Coordinates {
	lat: number;
	lon: number;
}

interface SquareCorners {
  topLeft: Coordinates;
  topRight: Coordinates;
  bottomLeft: Coordinates;
  bottomRight: Coordinates;
}

function getSquareCorners(
	centerLat: number,
	centerLon: number,
	sideLength = 5
): SquareCorners {

	// Convert side length to radius for half the square's side
	const halfSideKm = sideLength / 2;

	// 1 degree of latitude in kilometers
	const latKm = 111.32;

	// 1 degree of longitude in kilometers varies with latitude
	const lonKm = Math.cos(centerLat * (Math.PI / 180)) * latKm;

	// Offset in degrees
	const latOffset = halfSideKm / latKm;
	const lonOffset = halfSideKm / lonKm;

	// Calculate the coordinates for the corners
	const topLeft = {
		lat: centerLat + latOffset,
		lon: centerLon - lonOffset,
	};

	const topRight = {
		lat: centerLat + latOffset,
		lon: centerLon + lonOffset,
	};

	const bottomLeft = {
		lat: centerLat - latOffset,
		lon: centerLon - lonOffset,
	};

	const bottomRight = {
		lat: centerLat - latOffset,
		lon: centerLon + lonOffset,
	};

	return { topLeft, topRight, bottomLeft, bottomRight };
}

export function createReportMessage(
	coordinates: SquareCorners,
	report: string
): string {
	return JSON.stringify({
		coordinates,
		report,
	});
}

export default function Home() {
	const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
					const corners = getSquareCorners(
						position.coords.latitude,
						position.coords.longitude
					);
					console.log("🚀 ~ useEffect ~ corners:", corners);
          const report = createReportMessage(corners, "This is a report");
          console.log("🚀 ~ useEffect ~ report:", report)
				},
				(error) => {
					console.error("Error getting location", error);
				}
			);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div>
				<h1>User Location</h1>
				<p>Latitude: {location.latitude}</p>
				<p>Longitude: {location.longitude}</p>
			</div>
		</main>
	);
}
