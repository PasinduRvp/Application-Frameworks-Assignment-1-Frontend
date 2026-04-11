import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRouteById, clearCurrentRoute } from '../redux/slices/routeSlice';
import { fetchMarineZones } from '../redux/slices/marineZoneSlice';
import RouteDetails from '../components/routes/RouteDetails';
import Loader from '../components/common/Loader';
import { ArrowLeft } from 'lucide-react';

const RouteDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentRoute, loading: routeLoading, error: routeError } = useSelector((state) => state.routes);
    const { zones, loading: zonesLoading } = useSelector((state) => state.marineZones);

    const loading = routeLoading || zonesLoading;
    const error = routeError;

    useEffect(() => {
        dispatch(fetchRouteById(id));
        dispatch(fetchMarineZones({}));
        return () => {
            dispatch(clearCurrentRoute());
        };
    }, [dispatch, id]);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error.message || 'Error loading route details'}</p>
                <button
                    onClick={() => navigate('/routes')}
                    className="text-ocean-600 hover:underline"
                >
                    Back to Routes
                </button>
            </div>
        );
    }

    if (!currentRoute) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Route not found</p>
                <button
                    onClick={() => navigate('/routes')}
                    className="text-ocean-600 hover:underline"
                >
                    Back to Routes
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/routes')}
                className="flex items-center text-gray-600 hover:text-ocean-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Routes
            </button>

            <RouteDetails route={currentRoute} zones={zones} />
        </div>
    );
};

export default RouteDetailsPage;
