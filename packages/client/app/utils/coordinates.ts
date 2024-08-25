interface Coordinates {
	TLX: number;
	TLY: number;
	TRX: number;
	TRY: number;
	BLX: number;
	BLY: number;
	BRX: number;
	BRY: number;
}

export function getCoordinates(
	centerLat: number,
	centerLon: number,
	roundFactor = 6
): Coordinates {
	// Convert side length to radius for half the square's side
	const sideLength = 5;
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

	return {
		TLX: Math.round(topLeft.lat * 10 ** roundFactor),
		TLY: Math.round(topLeft.lon * 10 ** roundFactor),
		TRX: Math.round(topRight.lat * 10 ** roundFactor),
		TRY: Math.round(topRight.lon * 10 ** roundFactor),
		BLX: Math.round(bottomLeft.lat * 10 ** roundFactor),
		BLY: Math.round(bottomLeft.lon * 10 ** roundFactor),
		BRX: Math.round(bottomRight.lat * 10 ** roundFactor),
		BRY: Math.round(bottomRight.lon * 10 ** roundFactor),
	};
}
