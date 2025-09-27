import { useEffect, useState } from "react";
import { useLocation } from "../shared/LocationProvider";
import { Button, Form, Modal } from "react-bootstrap";
import { processFormDataChangeEvent } from "../helpers/Forms";
import { geoCode, reverseGeocode } from "../loaders/ApiLoader";
import type { ILocation } from "../models/LocationModel";
import { CountrySelect } from "../shared/CountrySelect";


export const LocationSlider = () => {
    interface ILocationForm {
        city?: string;
        state?: string;
        postal?: string;
        countryCode?: string;
    }

    const { currentLocation, setCurrentLocation } = useLocation();
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const [formData, setFormData] = useState<ILocationForm>({
        city: '',
        state: '',
        postal: '',
        countryCode: 'us'
    });

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        processFormDataChangeEvent<ILocationForm>(event, formData, setFormData);
    };

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const location = await geoCode(formData.countryCode!, formData.city, formData.state, formData.postal);
            if (location && location.lat && location.lon) {
                setCurrentLocation({
                    lat: location.lat!.toFixedNumber(2),
                    lon: location.lon!.toFixedNumber(2),
                    city: location.name,
                    state: location.state,
                    postalCode: formData.postal,
                    country: location.country,
                } as ILocation);
                handleClose();
            } else {
                alert("Location not found. Please try again.");
            }
        } catch (error) {
            console.error("Error occurred while searching for location:", error);
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        const location = await reverseGeocode(latitude, longitude);
                        console.log('reverse geocode location', location);

                        console.log('setting current location');
                        setCurrentLocation({
                            lat: location.lat!.toFixedNumber(2),
                            lon: location.lon!.toFixedNumber(2),
                            city: location.name,
                            state: location.state,
                            country: location.country
                        } as ILocation);
                    },
                    (error) => {
                        console.error("Error obtaining location:", error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 10000
                    });
            } else {
                setShowModal(true);
            };
        }

        fetchLocation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            Location Slider Component
            {currentLocation && (
                <div>
                    <p>Latitude: {currentLocation.lat}</p>
                    <p>Longitude: {currentLocation.lon}</p>
                    <p>City: {currentLocation.city}</p>
                    <p>State: {currentLocation.state}</p>
                    <p>Country: {currentLocation.country}</p>
                    <Button variant='outline-info' size="sm" onClick={() => setShowModal(true)}>Change Location</Button>
                </div>
            )}
            {showModal && (
                <Modal
                    show={showModal}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    className='white-container'
                >
                    <Modal.Body>
                        <Form onSubmit={handleSearch}>
                            <h4 className='ctext-center'>Please allow location services or search below</h4>
                            <Form.Group className="mb-3" controlId="countryCode">
                                <CountrySelect value={formData.countryCode!} onChange={(value) => setFormData({ ...formData, countryCode: value })} />
                            </Form.Group>
                            <hr />
                            <Form.Group className="mb-3" controlId="postal">
                                <Form.Control type="text" placeholder="Enter a postal code" name="postal" value={formData.postal} onChange={handleFormChange} />
                            </Form.Group>
                            <div className="ctext-center mb-2">- OR -</div>
                            <Form.Group className="mb-3" controlId="city">
                                <Form.Control type="text" placeholder="Enter a city name" name="city" value={formData.city} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="state">
                                <Form.Control type="text" placeholder="Enter a state name" name="state" value={formData.state} onChange={handleFormChange} />
                            </Form.Group>

                            <Button variant='outline-info' size="sm" className='cfull-width' type="submit">Search</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}