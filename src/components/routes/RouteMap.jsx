import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { PROTECTION_LEVELS } from '../../utils/constants';
import { Shield, Maximize2, Minimize2, Fish, AlertCircle } from 'lucide-react';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component to handle map centering and bounds
const MapBounds = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points && points.length > 0) {
            // Filter out any null/undefined points
            const validPoints = points.filter(p => p && p[0] !== undefined && p[1] !== undefined);
            if (validPoints.length > 0) {
                const bounds = L.latLngBounds(validPoints);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
            }
        }
    }, [map, points]);

    return null;
};

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            if (onMapClick) {
                onMapClick([e.latlng.lng, e.latlng.lat]);
            }
        },
    });
    return null;
};

// Custom Shield Icon for Markers
const createShieldIcon = (color) => {
    const iconMarkup = renderToStaticMarkup(
        <div className={`p-1 rounded-full border-2 bg-white shadow-md`} style={{ borderColor: color, color: color }}>
            <Shield size={16} fill={color} fillOpacity={0.2} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-shield-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

const RouteMap = ({ startPoint, endPoint, waypoints = [], path = [], zones = [], onMapClick }) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Convert [lng, lat] to [lat, lng] for Leaflet
    const startPos = startPoint?.coordinates && startPoint.coordinates[0] !== undefined ? [startPoint.coordinates[1], startPoint.coordinates[0]] : null;
    const endPos = endPoint?.coordinates && endPoint.coordinates[0] !== undefined ? [endPoint.coordinates[1], endPoint.coordinates[0]] : null;

    const waypointPositions = waypoints.map(wp =>
        [wp.coordinates[1], wp.coordinates[0]]
    );

    // If we have a full path (array of [lng, lat]), convert it
    const polylinePath = path.length > 0
        ? path.map(coord => [coord[1], coord[0]])
        : (startPos && endPos ? [startPos, ...waypointPositions, endPos] : []);

    const getZoneStyle = (level) => {
        const config = PROTECTION_LEVELS.find(p => p.value === level);
        switch (config?.color) {
            case 'red':
                return { fillColor: '#ef4444', color: '#b91c1c' };
            case 'orange':
                return { fillColor: '#f97316', color: '#c2410c' };
            case 'yellow':
                return { fillColor: '#eab308', color: '#a16207' };
            default:
                return { fillColor: '#3b82f6', color: '#1d4ed8' };
        }
    };

    // All points to determine bounds
    const allPoints = polylinePath.length > 0 ? polylinePath : waypointPositions;

    // Default center (Oceanic view or first point)
    const defaultCenter = startPos || endPos || [0, 0];

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    const ZonePopupContent = ({ zone }) => (
        <div className="p-1 min-w-[180px]">
            <h4 className="font-bold text-ocean-900 flex items-center gap-1 border-b pb-1 mb-2">
                <Shield size={14} />
                {zone.name}
            </h4>
            <p className="text-xs text-gray-600 capitalize mb-1">
                {zone.zoneType.replace(/_/g, ' ')}
            </p>
            <p className="text-xs mb-1">
                <span className="font-semibold text-gray-700">Protection:</span>{' '}
                {PROTECTION_LEVELS.find(p => p.value === zone.protectionLevel)?.label}
            </p>

            <div className="flex items-center gap-2 mt-2 mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${zone.riskLevel > 7 ? 'bg-red-100 text-red-700' :
                    zone.riskLevel > 4 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                    <AlertCircle size={10} />
                    Risk: {zone.riskLevel}/10
                </span>
                {zone.speedLimit && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        {zone.speedLimit} kn Limit
                    </span>
                )}
            </div>

            {zone.marineSpecies && zone.marineSpecies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                        <Fish size={10} /> Protected Species
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {zone.marineSpecies.map((s, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {zone.description && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-600 italic line-clamp-3">
                        {zone.description}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className={`relative rounded-lg overflow-hidden shadow-inner border border-gray-200 transition-all duration-500 ease-in-out ${isFullscreen ? 'fixed inset-0 z-[9999] h-screen w-screen' : 'h-[400px] w-full'}`}>
            {/* Fullscreen Toggle Button */}
            <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-[1000] p-2 bg-white hover:bg-gray-50 rounded-lg shadow-md border border-gray-200 text-ocean-600 transition-transform active:scale-95"
                title={isFullscreen ? 'Exit Fullscreen' : 'View Large Map'}
            >
                {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
            <MapContainer
                center={defaultCenter}
                zoom={3}
                className="h-full w-full"
            >
                {/* Esri World Ocean Base Layer (Bathymetry/Depths) */}
                <TileLayer
                    url="https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
                />

                {/* OpenSeaMap Overlay (Nautical markers, buoys, beacons) */}
                <TileLayer
                    url="https://tile.openseamap.org/seamap/{z}/{x}/{y}.png"
                    attribution='Map data &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                />

                <MapEvents onMapClick={onMapClick} />

                {/* Marine Protected Zones */}
                {zones.map((zone) => {
                    if (!zone.geometry?.coordinates?.[0]) return null;
                    const positions = zone.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
                    const style = getZoneStyle(zone.protectionLevel);

                    // Calculate a simple centroid for the marker
                    const latSum = positions.reduce((sum, p) => sum + p[0], 0);
                    const lngSum = positions.reduce((sum, p) => sum + p[1], 0);
                    const centroid = [latSum / positions.length, lngSum / positions.length];

                    return (
                        <React.Fragment key={zone._id}>
                            <Polygon
                                positions={positions}
                                pathOptions={{
                                    fillColor: style.fillColor,
                                    fillOpacity: 0.2,
                                    color: style.color,
                                    weight: 1,
                                    dashArray: '5, 5',
                                }}
                            >
                                <Popup>
                                    <ZonePopupContent zone={zone} />
                                </Popup>
                            </Polygon>

                            <Marker
                                position={centroid}
                                icon={createShieldIcon(style.color)}
                            >
                                <Popup>
                                    <ZonePopupContent zone={zone} />
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {startPos && (
                    <Marker position={startPos}>
                        <Popup>
                            <strong>Start:</strong> {startPoint.name || 'Starting Point'}
                        </Popup>
                    </Marker>
                )}

                {endPos && (
                    <Marker position={endPos}>
                        <Popup>
                            <strong>Destination:</strong> {endPoint.name || 'End Point'}
                        </Popup>
                    </Marker>
                )}

                {waypointPositions.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                        <Popup>Waypoint {idx + 1}</Popup>
                    </Marker>
                ))}

                {polylinePath.length > 1 && (
                    <Polyline
                        positions={polylinePath}
                        color="#0097a7"
                        weight={4}
                        opacity={0.7}
                    />
                )}

                <MapBounds points={allPoints} />
            </MapContainer>
        </div>
    );
};

export default RouteMap;
