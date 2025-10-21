import geolib from 'geolib';

/**
 * Calculates the geometric midpoint of a list of coordinates, and also returns simple metrics
 * @param {number[][]} coordinates - A list of coordinates in the format [lat, lng].
 * @returns {{midpoint: number[], type: string, metrics: {avg_distance: number, max_distance: number, distance_variance: number}}}
 * @throws {Error} if `coordinates` is empty.
 */
const geometricMidpoint = (coordinates) => {
    if (!coordinates.length) {
        throw new Error("Coordinates array cannot be empty");
    }

    const totalLat = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const totalLng = coordinates.reduce((sum, coord) => sum + coord[1], 0);
    const midpoint = [totalLat / coordinates.length, totalLng / coordinates.length];

    const distances = coordinates.map(coord => geolib.getDistance(
        { latitude: midpoint[0], longitude: midpoint[1] },
        { latitude: coord[0], longitude: coord[1] }
    ) / 1000); // km

    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const maxDistance = Math.max(...distances);
    const distanceVariance = distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length;

    return {
        midpoint,
        type: "geometric",
        metrics: {
            avg_distance: avgDistance,
            max_distance: maxDistance,
            distance_variance: distanceVariance
        }
    };
};
export { geometricMidpoint };

